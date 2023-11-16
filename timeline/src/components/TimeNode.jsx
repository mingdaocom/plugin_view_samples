import React from "react";
import styled from "styled-components";
import { find } from "lodash";
import cx from "classnames";
import { getNodeColor } from "../utils";
import RecordCard from "./RecordCard.jsx";

const NodeWrapper = styled.div`
  padding-bottom: 24px;
  position: relative;
  display: flex;
  .timeText {
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 10px;
  }

  &.top,
  &.bottom {
    flex-direction: column;
    padding-left: 16px;
  }
  &.bottom {
    flex-direction: column-reverse;
    .cardContent {
      margin-top: -8px;
    }
  }
  &.left {
    .timeText {
      width: 140px;
      padding-right: 16px;
      text-align: right;
    }
    .cardContent {
      flex: 1;
      padding-left: 16px;
      margin-top: -8px;
    }
  }
  &.right {
    flex-direction: row-reverse;
    .timeText {
      width: 140px;
      padding-left: 16px;
    }
    .cardContent {
      flex: 1;
      padding-right: 16px;
      margin-top: -8px;
    }
  }
  &.alternate {
    .timeText {
      width: 50%;
      text-align: right;
      padding-right: 16px;
    }
    .cardContent {
      flex: 1;
      padding-left: 16px;
      margin-top: -8px;
    }
    &.isOddIndex {
      flex-direction: row-reverse;
      .timeText {
        text-align: left;
        padding-left: 16px;
        padding-right: 0;
      }
      .cardContent {
        padding-right: 16px;
        padding-left: 0;
      }
    }
  }
`;

export default function TimeNode(props) {
  const { nodeItem, timeLineViewConfig, controls, onClick, isOddIndex } = props;
  const {
    coverId,
    titleId,
    abstractId,
    pageBgColor,
    nodeColor,
    optionFieldId,
    timeColor,
    position,
  } = timeLineViewConfig;

  const getTimeTextColor = (record) => {
    if (timeColor) {
      const colorControl = find(controls, (c) => c.controlId === optionFieldId);
      return getNodeColor(nodeColor, colorControl, record);
    } else {
      return pageBgColor === "black" ? "#fff" : "#757575";
    }
  };

  return (
    <NodeWrapper className={cx(`${position}`, { isOddIndex })}>
      <div
        className="timeText"
        style={{ color: getTimeTextColor(nodeItem.list[0]) }}
      >
        {nodeItem.time}
      </div>
      <div className="cardContent">
        {nodeItem.list.map((item, i) => {
          let coverUrl;
          try {
            coverUrl = JSON.parse(item[coverId])[0].previewUrl;
          } catch (err) {}
          const title = item[titleId];
          const abstract = item[abstractId];
          return (
            <RecordCard
              key={i}
              nodeDisplayColor={getNodeColor(
                nodeColor,
                find(controls, (c) => c.controlId === optionFieldId),
                nodeItem.list[0]
              )}
              data={{ coverUrl, title, abstract }}
              onClick={() => onClick(item.rowid)}
              timeLineViewConfig={timeLineViewConfig}
              isReverseDirection={
                position === "right" || (position === "alternate" && isOddIndex)
              }
            />
          );
        })}
      </div>
    </NodeWrapper>
  );
}
