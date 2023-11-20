import React from "react";
import styled from "styled-components";
import cx from "classnames";

const RecordCardWrapper = styled.div`
  display: flex;
  width: 100%;
  padding: 8px;
  border-radius: 6px;
  margin-bottom: 6px;
  cursor: pointer;
  &:hover {
    .rightContent {
      .titleText {
        color: #2196f3 !important;
      }
    }
    background-color: #fafafa !important;
    &.blackCardBg {
      background-color: #333 !important;
      .rightContent {
        .titleText {
          color: #fff !important;
        }
      }
    }
  }

  &.blackCardBg {
    .emptyText {
      color: #fff;
    }
    .rightContent {
      .titleText {
        color: #fff;
      }
      .abstractText {
        color: #bdbdbd;
      }
    }
  }

  .nodeCircle {
    position: absolute;
    z-index: 2;
    top: 0;
    width: 16px;
    height: 16px;
    border-radius: 50%;
    border: 4px solid #008eff;
    &.top,
    &.bottom {
      left: -7px;
    }
    &.left {
      left: 133px;
    }
    &.right {
      right: 133px;
    }
    &.alternate {
      left: calc(50% - 7px);
    }
  }

  .emptyText {
    font-size: 13px;
    color: #333;
  }
  .coverImage {
    border-radius: 6px;
    margin-right: 12px;
    object-fit: cover;
    &.contain {
      object-fit: contain !important;
    }
  }
  .rightContent {
    flex: 1;
    .titleText,
    .abstractText {
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-box-orient: vertical;
    }
    .titleText {
      font-size: 14px;
      font-weight: bold;
      color: #333;
      -webkit-line-clamp: 3;
      margin-bottom: 4px;
      &.noAbstract {
        margin-bottom: 0 !important;
      }
    }
    .abstractText {
      font-size: 13px;
      color: #757575;
      -webkit-line-clamp: 8;
    }
  }

  &.isReverseDirection {
    flex-direction: row-reverse;
    .coverImage {
      margin-left: 12px;
      margin-right: 0;
    }
    .rightContent {
      text-align: right;
    }
  }
`;

export default function RecordCard(props) {
  const {
    timeLineViewConfig,
    data,
    nodeDisplayColor,
    onClick,
    isReverseDirection,
  } = props;
  const { coverUrl, title, abstract } = data;
  const { cardBgColor, pageBgColor, position, fillType } = timeLineViewConfig;
  const pageDisplayColor =
    pageBgColor === "gray" ? "#f3f4f6" : pageBgColor || "#fff";

  const getCardBgColor = () => {
    switch (cardBgColor) {
      case "gray":
        return "#f3f4f6";
      case "black":
        return "#262626";
      case "transparent":
        return pageDisplayColor;
      default:
        return cardBgColor;
    }
  };

  return (
    <RecordCardWrapper
      style={{ backgroundColor: getCardBgColor() }}
      className={cx({
        blackCardBg: getCardBgColor() === "black" || cardBgColor === "black",
        isReverseDirection,
      })}
      onClick={onClick}
    >
      <div
        className={`nodeCircle ${position}`}
        style={{
          backgroundColor: pageDisplayColor,
          borderColor: nodeDisplayColor,
        }}
      ></div>
      {!coverUrl && !title && !abstract ? (
        <div className="emptyText">{"无内容"}</div>
      ) : (
        <React.Fragment>
          {coverUrl && (
            <img
              src={
                coverUrl.indexOf("imageView2") > -1
                  ? coverUrl.replace(
                      /imageView2\/\d\/w\/\d+\/h\/\d+(\/q\/\d+)?/,
                      "imageView2/2/w/64"
                    )
                  : `${coverUrl}&imageView2/2/w/64`
              }
              width={64}
              height={64}
              className={`coverImage ${fillType}`}
            />
          )}
          <div className="rightContent">
            {title && (
              <div
                className={cx("titleText", { noAbstract: !abstract })}
                title={title}
              >
                {title}
              </div>
            )}
            {abstract && (
              <div className="abstractText">
                {abstract.replace(/<[^>]+>/g, "")}
              </div>
            )}
          </div>
        </React.Fragment>
      )}
    </RecordCardWrapper>
  );
}
