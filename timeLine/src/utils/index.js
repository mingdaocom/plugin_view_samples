import { get } from "lodash";
import moment from "moment";

export function safeParse(dataStr, type) {
  try {
    return JSON.parse(dataStr);
  } catch (err) {
    console.log(err);
    return type === "array" ? [] : {};
  }
}

export function parseEnv(env) {
  return {
    dateTimeId: get(env, "dateTimeId.0"),
    precision: get(env, "precision.0"),
    titleId: get(env, "titleId.0"),
    abstractId: get(env, "abstractId.0"),
    coverId: get(env, "coverId.0"),
    fillType: get(env, "fillType.0"),
    position: get(env, "position.0"),
    cardBgColor: get(env, "cardBgColor.0"),
    pageBgColor: get(env, "pageBgColor.0"),
    nodeColor: get(env, "nodeColor.0"),
    optionFieldId: get(env, "optionFieldId.0"),
    timeColor: get(env, "timeColor"),
    sort: get(env, "sort.0"),
  };
}

export function formatTime(precision, time) {
  switch (precision) {
    case "year":
      return moment(time).format("YYYY");
    case "month":
      return moment(time).format("YYYY-MM");
    case "day":
      return moment(time).format("YYYY-MM-DD");
    case "hour":
      return moment(time).format("YYYY-MM-DD HH:00");
    case "minute":
      return moment(time).format("YYYY-MM-DD HH:mm");
    case "second":
      return moment(time).format("YYYY-MM-DD HH:mm:ss");
    default:
      return "";
  }
}

export function getNodeColor(nodeColor, colorControl, record = {}) {
  switch (nodeColor) {
    case "blue":
      return "#008eff";
    case "red":
      return "#f44336";
    case "yellow":
      return "#ffad36";
    case "green":
      return "#3fc534";
    case "custom":
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
        return activeOption.color;
      } catch (err) {
        return "#999";
      }
    default:
      return "#008eff";
  }
}
