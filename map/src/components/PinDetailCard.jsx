import React from "react";
import styled from "styled-components";
import { utils } from "mdye";
import { string, shape, arrayOf, bool } from "prop-types";

const Con = styled.div`
  position: absolute;
  z-index: 99;
  left: -135px;
  bottom: 40px;
  flex-direction: row;
  width: 300px;
  border-radius: 3px;
  background-color: #fff;
  box-shadow: rgba(0, 0, 0, 0.12) 0px 1px 4px 0px,
    rgba(0, 0, 0, 0.12) 0px 0px 2px 0px;
  display: none;
  color: #333;
  overflow: hidden;
  .cover {
    width: 95px;
    flex-shrink: 0;
    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }
  .info {
    overflow: hidden;
    padding: 6px 0;
    font-size: 13px;
  }
  .title {
    padding: 0 10px;
    font-size: 14px;
    font-weight: bold;
    word-break: break-all;
    white-space: normal;
  }
  .summary {
    margin: 4px 10px;
    max-height: 59px;
    overflow: hidden;
    color: #757575;
    text-overflow: ellipsis;
    white-space: break-spaces;
    word-break: break-all;
    display: -webkit-box;
    -webkit-line-clamp: 3 !important;
    -webkit-box-orient: vertical;
  }
  .controls {
    padding: 0 10px;
    .controlItem {
      display: flex;
      align-items: center;
      margin-top: 2px;
      .controlName {
        color: #9e9e9e;
        margin-right: 4px;
        max-width: 80px;
      }
      .controlValue {
        flex: 1;
      }
    }
  }
`;

export default function PinDetailCard(props) {
  const { title, summary, coverUrl, showControlName, showControlsData } = props;
  return (
    <Con className="pinDetail">
      {coverUrl && (
        <div className="cover">
          <img
            src={
              coverUrl.indexOf("imageView2") > -1
                ? coverUrl.replace(
                    /imageView2\/\d\/w\/\d+\/h\/\d+(\/q\/\d+)?/,
                    "imageView2/1/w/200/h/140"
                  )
                : `${coverUrl}&imageView2/1/w/200/h/140`
            }
          />
        </div>
      )}
      <div className="info">
        <div className="title ellipsis" title={title}>
          {title}
        </div>
        {summary && <div className="summary">{summary}</div>}
        <div className="controls">
          {showControlsData.map((item, i) => (
            <div key={i} className="controlItem">
              {showControlName && (
                <span className="controlName ellipsis" title={title}>
                  {item.controlName}
                </span>
              )}
              <span className="controlValue ellipsis" title={title}>
                {item.value}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Con>
  );
}

PinDetailCard.propTypes = {
  title: string,
  summary: string,
  coverUrl: string,
  showControlName: bool,
  showControlsData: arrayOf(shape({})),
};
