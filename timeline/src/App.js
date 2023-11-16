import React, { useEffect, useState, useCallback, useRef } from "react";
import { useSetState } from "react-use";
import { env, config, api, utils, md_emitter } from "mdye";
import styled from "styled-components";
import cx from "classnames";
import { parseEnv, formatTime } from "./utils";
import TimeNode from "./components/TimeNode.jsx";
import moment from "moment";
import { omit } from "lodash";

const Con = styled.div`
  height: 100vh;
  display: flex;
  flex-direction: column;
  overflow: auto;
  padding: 36px 40px 0 40px;
  &.isAlternate {
    padding: 36px 24px 0 24px;
  }

  .timeLineContainer {
    flex: 1;
    position: relative;
    .timeLine {
      position: absolute;
      z-index: 1;
      top: 0;
      height: 100%;
      width: 2px;
      background-color: #ccc;
      opacity: 0.6;

      &.top,
      &.bottom {
        left: 0;
      }
      &.left {
        left: 140px;
      }
      &.right {
        right: 140px;
      }
      &.alternate {
        left: 50%;
      }
    }
  }
`;

const ErrorContent = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 14px;
  color: #777;
`;

const { getFilterRows } = api;

export default function App() {
  const { appId, worksheetId, viewId, controls } = config;
  const timeLineViewConfig = parseEnv(env);
  const { dateTimeId, precision, pageBgColor, position, sort } =
    timeLineViewConfig;
  const error = dateTimeId ? undefined : "请先在视图配置中配置好“时间”对应字段";
  const pageDisplayColor =
    pageBgColor === "gray" ? "#f3f4f6" : pageBgColor || "#fff";
  const [records, setRecords] = useState([]);
  const [timeLineList, setTimeLineList] = useState([]);
  const [fetchState, setFetchState] = useSetState({
    loading: true,
    pageIndex: 1,
    noMore: false,
  });
  const [filters, setFilters] = useState(config.filters || {});
  const cache = useRef({});

  const getTimeLineData = (data) => {
    const timeArr = [];
    const destData = [];
    data.forEach((item) => {
      const time = formatTime(precision, item[dateTimeId]);
      if (timeArr.indexOf(time) === -1) {
        destData.push({ time, list: [item] });
        timeArr.push(time);
      } else {
        destData[timeArr.indexOf(time)].list.push(item);
      }
    });
    return destData.sort((a, b) =>
      sort === "asc" ? moment(a.time).diff(b.time) : moment(b.time).diff(a.time)
    );
  };

  const updateRecords = (newRecords) => {
    cache.current.records = newRecords;
    setRecords(newRecords);
    setTimeLineList(getTimeLineData(newRecords));
  };

  const fetchRows = () => {
    if (!fetchState.loading) {
      return;
    }
    getFilterRows({
      worksheetId,
      viewId,
      pageIndex: fetchState.pageIndex,
      pageSize: 50,
      ...filters,
    }).then((res) => {
      if (res) {
        setFetchState({ loading: false, noMore: res.data.length < 50 });
        updateRecords(
          fetchState.pageIndex > 1 ? records.concat(res.data) : res.data
        );
      }
    });
  };

  useEffect(() => {
    fetchRows();
  }, [fetchState.pageIndex, filters]);

  const handleFiltersUpdate = useCallback((newFilers) => {
    setFilters(newFilers);
    setFetchState({ loading: true });
  }, []);

  const handleAddRecord = useCallback((value) => {
    updateRecords(
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

  const onScrollEnd = () => {
    if (!fetchState.loading && !fetchState.noMore) {
      setFetchState({ loading: true, pageIndex: fetchState.pageIndex + 1 });
    }
  };

  if (error) {
    return (
      <ErrorContent>
        <div>{error}</div>
      </ErrorContent>
    );
  }
  return (
    <Con
      style={{ backgroundColor: pageDisplayColor }}
      className={cx({ isAlternate: position === "alternate" })}
      onScroll={(e) => {
        if (
          e.target &&
          e.target.scrollHeight - e.target.offsetHeight - e.target.scrollTop <
            30
        ) {
          //滚动到底部
          onScrollEnd();
        }
      }}
    >
      <div className="timeLineContainer">
        <div className={`timeLine ${position}`}></div>
        {timeLineList.map((node, index) => {
          return (
            <TimeNode
              key={index}
              isOddIndex={index % 2 !== 0}
              nodeItem={node}
              timeLineViewConfig={timeLineViewConfig}
              controls={controls}
              onClick={(recordId) => {
                utils
                  .openRecordInfo({
                    appId,
                    viewId,
                    worksheetId,
                    recordId,
                  })
                  .then((res) => {
                    if (res.action === "update") {
                      const newRow = res.value;
                      const newRecords = records.map((r) =>
                        r.rowid === newRow.rowid ? newRow : r
                      );
                      updateRecords(newRecords);
                    }
                  });
              }}
            />
          );
        })}
      </div>
    </Con>
  );
}
