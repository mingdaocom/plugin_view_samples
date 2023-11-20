import { get, isEmpty, isNumber } from "lodash";

export function safeParse(dataStr, type) {
  try {
    return JSON.parse(dataStr);
  } catch (err) {
    console.log(err);
    return type === "array" ? [] : {};
  }
}
export function safeNumber(dataStr) {
  const result = Number(dataStr);
  return isNumber(result) && !isNaN(result) ? result : undefined;
}

export function parseEnv(env) {
  return {
    positionId: get(env, "positionId.0"),
    loadNum: safeNumber(get(env, "loadNum")) || 100,
    titleId: get(env, "titleId.0"),
    summaryId: get(env, "summaryId.0"),
    coverId: get(env, "coverId.0"),
    tagColorId: get(env, "tagColorId.0"),
    showControlIds: get(env, "showControlIds"),
    showControlName: get(env, "showControlName"),
    tagType: get(env, "tagType.0"),
  };
}

export function parseRecord(record = {}, mapViewConfig) {
  return {
    position: safeParse(record[mapViewConfig.positionId]),
    title: record[mapViewConfig.titleId],
    summary: record[mapViewConfig.summaryId],
    cover: record[mapViewConfig.coverId],
    record,
  };
}

export function calculatePoleCenter(coordinates) {
  if (coordinates.length === 0) {
    return;
  }

  var minLatitude = 90;
  var maxLatitude = -90;
  var minLongitude = 180;
  var maxLongitude = -180;

  for (var i = 0; i < coordinates.length; i++) {
    var latitude = coordinates[i][0];
    var longitude = coordinates[i][1];

    if (latitude < minLatitude) {
      minLatitude = latitude;
    }
    if (latitude > maxLatitude) {
      maxLatitude = latitude;
    }
    if (longitude < minLongitude) {
      minLongitude = longitude;
    }
    if (longitude > maxLongitude) {
      maxLongitude = longitude;
    }
  }

  var centerLatitude = (minLatitude + maxLatitude) / 2;
  var centerLongitude = (minLongitude + maxLongitude) / 2;

  return [centerLatitude, centerLongitude];
}

export function calculateZoomLevel(
  coordinates,
  mapWidth,
  mapHeight,
  paddingPercentage = 10
) {
  if (coordinates.length < 2) {
    return 0;
  }

  var maxLat = -90;
  var minLat = 90;
  var maxLng = -180;
  var minLng = 180;

  for (var i = 0; i < coordinates.length; i++) {
    var lat = coordinates[i][0];
    var lng = coordinates[i][1];

    if (lat > maxLat) {
      maxLat = lat;
    }
    if (lat < minLat) {
      minLat = lat;
    }
    if (lng > maxLng) {
      maxLng = lng;
    }
    if (lng < minLng) {
      minLng = lng;
    }
  }

  var latRange = maxLat - minLat;
  var lngRange = maxLng - minLng;

  var zoomLat = Math.log2(
    mapHeight / (latRange * (1 + paddingPercentage / 100))
  );
  var zoomLng = Math.log2(
    mapWidth / (lngRange * (1 + paddingPercentage / 100))
  );

  var zoomLevel = Math.floor(Math.min(zoomLat, zoomLng));

  return zoomLevel;
}
