import React, {
  useEffect,
  useState,
  useLayoutEffect,
  useRef,
  useCallback,
} from "react";
import { env, config, api, utils, md_emitter } from "mdye";
import { Amap, config as AmapReactConfig } from "@amap/amap-react";
import styled from "styled-components";
import PinMarker from "./components/PinMarker";
import {
  calculatePoleCenter,
  calculateZoomLevel,
  parseEnv,
  parseRecord,
} from "./utils";
import { isEmpty, omit } from "lodash";
const { getFilterRows } = api;

AmapReactConfig.version = "2.0";
AmapReactConfig.key = env.amap_key;
AmapReactConfig.plugins = ["AMap.ToolBar", "AMap.MoveAnimation"];

const Con = styled.div`
  position: relative;
  height: 100vh;
  display: flex;
`;

const Abnormal = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #777;
`;

function getError(mapViewConfig, env) {
  if (!mapViewConfig.positionId) {
    return "请先在视图配置中配置好“地点”对应字段";
  } else if (!env.amap_key) {
    return `请在环境参数中以JSON的格式配置好高德地图key ${JSON.stringify({
      amap_key: "xxxxxxxxxxx",
    })}<br/>(开发中的插件在视图配置里配置，已发布的插件在插件中心中配置)`;
  } else {
    return;
  }
}

export default function App() {
  const { appId, worksheetId, viewId, controls } = config;
  const mapViewConfig = parseEnv(env);
  const { loadNum } = mapViewConfig;
  const logRef = useRef();
  const conRef = useRef();
  const cache = useRef({});
  const [error, setError] = useState(getError(mapViewConfig, env));
  const [records, setRecords] = useState([]);
  const [markers, setMarkers] = useState([]);
  const [filters, setFilters] = useState(config.filters || {});
  const [zoom, setZoom] = useState(5);
  const [center, setCenter] = useState();
  function updateByRecords(newRecords) {
    if (conRef.current) {
      const size = {
        width: conRef.current.clientWidth,
        height: conRef.current.clientHeight,
      };
      const parsedData = newRecords
        .map((r) => parseRecord(r, mapViewConfig))
        .filter((d) => !isEmpty(d.position));
      const coordinates = parsedData.map((c) => [c.position.y, c.position.x]);
      let newZoom =
        calculateZoomLevel(coordinates, size.width, size.height) || 7;
      if (newZoom < 5) {
        newZoom = 5;
      } else if (newZoom > 19) {
        newZoom = 19;
      }
      const newCenter = calculatePoleCenter(coordinates);
      setRecords(newRecords);
      cache.current.records = newRecords;
      setMarkers(parsedData);
      setZoom(Math.floor(newZoom));
      setCenter(newCenter ? newCenter.reverse() : undefined);
    }
  }
  async function loadRecords() {
    const res = await getFilterRows({
      worksheetId,
      viewId,
      pageIndex: 1,
      pageSize: loadNum,
      ...filters,
    });
    updateByRecords(res.data);
  }
  const handleFiltersUpdate = useCallback((newFilers) => {
    setFilters(newFilers);
  }, []);
  const handleAddRecord = useCallback((value) => {
    updateByRecords(
      cache.current.records.concat(omit(value, ["allowedit", "allowdelete"]))
    );
  }, []);
  useEffect(() => {
    md_emitter.addListener("filters-update", handleFiltersUpdate);
    md_emitter.addListener("new-record", handleAddRecord);
    return () => {
      md_emitter.removeListener("filters-update", handleFiltersUpdate);
      md_emitter.removeListener("new-record", handleAddRecord);
    };
  }, []);
  useEffect(() => {
    loadRecords();
  }, [filters]);
  useLayoutEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = 10000;
    }
  });
  if (error) {
    return (
      <Abnormal>
        <div className="tip" dangerouslySetInnerHTML={{ __html: error }}></div>
      </Abnormal>
    );
  }
  return (
    <Con ref={conRef}>
      {
        <Amap zoom={zoom} center={center}>
          {markers.map((marker, i) => {
            return (
              <PinMarker
                key={i}
                marker={marker}
                controls={controls}
                mapViewConfig={mapViewConfig}
                onClick={() => {
                  utils
                    .openRecordInfo({
                      appId,
                      viewId,
                      worksheetId,
                      recordId: marker.record.rowid,
                    })
                    .then((res) => {
                      if (res.action === "update") {
                        const newRow = res.value;
                        updateByRecords(
                          records.map((r) =>
                            r.rowid === newRow.rowid ? newRow : r
                          )
                        );
                      }
                    });
                }}
              />
            );
          })}
        </Amap>
      }
      {/* <Status /> */}
    </Con>
  );
}
