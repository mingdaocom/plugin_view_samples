import React, { useState } from "react";
import styled from "styled-components";
import { Marker } from "@amap/amap-react";
import PinDetailCard from "./PinDetailCard";
import pin from "../assets/pin.svg";
import { arrayOf, func, number, shape, string } from "prop-types";
import { find, identity, isFunction } from "lodash";
import { TinyColor } from "@ctrl/tinycolor";
import { safeParse } from "../utils";

const Con = styled(Marker)`
  display: flex;
  flex-direction: row;
  align-items: center;
  position: relative;
  .pinIcon {
    height: 34px;
  }
  .content {
    position: absolute;
    left: 100%;
    margin-left: 6px;
    white-space: nowrap;
    background: #fff;
    border-radius: 4px;
    padding: 6px 10px;
    font-size: 13px;
    color: #333;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
    .text {
      display: inline-block;
      overflow: hidden;
      text-overflow: ellipsis;
      vertical-align: top;
      white-space: nowrap;
      max-width: 200px;
    }
    .ellipsis {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      vertical-align: top;
    }
    &::before {
      content: " ";
      position: absolute;
      display: block;
      right: 0px;
      bottom: 30px;
      height: 10px;
      width: calc(100% + 40px);
    }
    &:hover {
      .pinDetail {
        display: inline-flex;
      }
    }
  }
`;

function getTagColor(tagType, colorControl, record = {}) {
  if (tagType === "dark") {
    return {
      color: "#fff",
      bgColor: "#333",
    };
  } else if (tagType === "custom") {
    try {
      let activeKey = safeParse(record[colorControl.controlId])[0];
      if (
        activeKey &&
        typeof activeKey === "string" &&
        activeKey.startsWith("other")
      ) {
        activeKey = "other";
      }
      const activeOption = colorControl.options.find(
        (c) => c.key === activeKey
      );
      return {
        bgColor: activeOption.color,
        color: new TinyColor(activeOption.color).isLight() ? "#333" : "#fff",
      };
    } catch (err) {
      return {
        color: "#333",
        bgColor: "#fff",
      };
    }
  } else {
    return {
      color: "#333",
      bgColor: "#fff",
    };
  }
}

export default function MarkerCard(props) {
  const { marker, controls, mapViewConfig = {}, onClick } = props;
  const { position, title, summary, cover, record } = marker;
  const { titleId, tagType, tagColorId, showControlIds, showControlName } =
    mapViewConfig;
  const [active, setActive] = useState(false);
  const color = getTagColor(
    tagType,
    find(controls, (c) => c.controlId === tagColorId),
    record
  );
  let coverUrl;
  try {
    coverUrl = JSON.parse(cover)[0].previewUrl;
  } catch (err) {}
  return (
    <Con
      position={[position.x, position.y]}
      onClick={onClick}
      zIndex={active ? 99 : 12}
      onMouseOver={() => {
        setActive(true);
      }}
      onMouseOut={() => {
        setActive(false);
      }}
    >
      <img className="pinIcon" src={pin} alt="" />
      {titleId && (
        <div
          className="content"
          style={{
            backgroundColor: color.bgColor,
            color: color.color,
          }}
        >
          <PinDetailCard
            position={[position.x, position.y]}
            title={title}
            summary={summary}
            coverUrl={coverUrl}
            showControlName={showControlName}
            showControlsData={controls
              .filter((c) => _.includes(showControlIds || [], c.controlId))
              .map((c) => ({
                controlName: c.controlName,
                value: isFunction(utils.renderText)
                  ? utils.renderText({
                      ...c,
                      value: marker.record[c.controlId],
                    })
                  : "",
              }))
              .filter((c) => identity(c.value))}
          />
          <span className="text">{title}</span>
        </div>
      )}
    </Con>
  );
}

MarkerCard.propTypes = {
  position: arrayOf(number),
  mapViewConfig: shape({}),
  marker: shape({}),
  controls: arrayOf(shape({})),
  onClick: func,
};
