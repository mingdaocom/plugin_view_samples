import React, { useEffect, useState, useLayoutEffect, useRef } from 'react';
import { env, config, api, utils } from 'mdye';
import { Table, Flex, Spin, Pagination } from 'antd';
import _ from 'lodash';

const pageSize = 10;
const subPageSize = 5;

export default function () {
  const { appId, worksheetId, viewId, controls } = config;
  const { showFields } = env;
  const subField = env.subField && env.subField[0];
  const lineHeight = env.lineHeight && env.lineHeight[0];
  const subFieldcontrol = _.find(controls, { controlId: subField }) || {};
  const [loading, setLoading] = useState(true);
  const [recordInfo, setRecordInfo] = useState(null);
  const [subSheetInfoLoading, setSubSheetInfoLoading] = useState(false);
  const [subSheetInfoControls, setSubSheetInfoControls] = useState([]);
  const [pageIndex, setPageIndex] = useState(1);
  const [relationRows, setRelationRows] = useState({});

  async function loadRecords() {
    setLoading(true);
    const result = await api.getFilterRows({ worksheetId, viewId, pageSize, pageIndex });
    setRecordInfo(result);
    setLoading(false);
    result.data.forEach(item => {
      if (item[subField]) {
        loadRelationRows({
          controlId: subField,
          rowId: item.rowid
        });
      }
    });
  }

  async function loadRelationRows({ controlId, rowId, pageIndex = 1 }) {
    const result = await api.getRowRelationRows({
      worksheetId,
      controlId,
      rowId,
      pageIndex,
      pageSize: subPageSize,
    });
    setRelationRows((data) => {
      const prevRes = relationRows[rowId] || [];
      const res = prevRes.filter(n => !n.rowid.includes('more')).concat(result.data);
      return {
        ...data,
        [`pageIndex-${rowId}`]: pageIndex,
        [rowId]: result.data.length < subPageSize ? res : res.concat({ rowid: `more-${rowId}` })
      }
    });
  }

  useEffect(() => {
    if (subFieldcontrol.dataSource) {
      setSubSheetInfoLoading(true);
      api.getWorksheetInfo({
        worksheetId: subFieldcontrol.dataSource,
        getTemplate: true
      }).then(data => {
        setSubSheetInfoControls(data.template.controls);
        setSubSheetInfoLoading(false);
      });
    }
  }, []);

  useEffect(() => {
    loadRecords();
  }, [pageIndex]);

  if (subSheetInfoLoading || (loading && !recordInfo)) {
    return (
      <Flex justify="center" align="center" style={{ height: '100%' }}>
        <Spin />
      </Flex>
    );
  }

  const handleLoadMoreRelationRows = rowId => {
    const index = relationRows[`pageIndex-${rowId}`];
    loadRelationRows({
      controlId: subField,
      rowId,
      pageIndex: index + 1
    });
  }

  const handleClickRow = row => {
    if (row.isSub) {
      return;
    }
    utils.openRecordInfo({
      appId,
      worksheetId,
      viewId,
      recordId: row.rowid
    });
  }

  const columns = showFields.concat(subField).map(id => {
    const control = _.find(controls, { controlId: id });
    if (control) {
      const baseConfig = {
        width: lineHeight === '1' ? 100 : undefined,
        ellipsis: lineHeight === '0',
      };
      if (control.controlId === subField) {
        return {
          title: subFieldcontrol.controlName,
          children: subFieldcontrol.showControls.map((id, index) => {
            const control = _.find(subSheetInfoControls, { controlId: id });
            return {
              title: control.controlName,
              type: control.type,
              dataIndex: control.controlId,
              key: control.controlId,
              ...baseConfig,
              render: (value, row) => {
                if (row.isSub && row.key.includes('more') && subFieldcontrol.showControls.length <= index + 1) {
                  return (
                    <Flex justify="flex-end">
                      <div className="view-more" onClick={() => handleLoadMoreRelationRows(row.key.replace('more-', ''))}>查看更多></div>
                    </Flex>
                  );
                }
                return value;
              },
              onCell: (row) => {
                if (row.isSub && row.key.includes('more')) {
                  if (subFieldcontrol.showControls.length <= index + 1) {
                    return { colSpan: subFieldcontrol.showControls.length };
                  } else {
                    return { rowSpan: 0 };
                  }
                }
                if (relationRows[row.rowid]) {
                  return { rowSpan: 0 };
                }
              }
            }
          })
        }
      } else {
        return {
          title: control.controlName,
          type: control.type,
          dataIndex: control.controlId,
          ...baseConfig,
          onCell: (row, index) => {
            const value = row[control.controlId];
            if (row.isSub && value === undefined) {
              return { rowSpan: 0 }
            }
            const currentRelationRows = relationRows[row.rowid];
            if (currentRelationRows && currentRelationRows.length) {
              return { rowSpan: 1 + currentRelationRows.length }
            }
          }
        }
      }
    } else {
      return false;
    }
  }).filter(_ => _);

  const dataSource = _.flatten(recordInfo.data.map((data, index) => {
    const record = { key: index, rowid: data.rowid };
    const currentRelationRows = relationRows[data.rowid];
    for (const key of showFields) {
      record[key] = data[key];
    }
    if (currentRelationRows && currentRelationRows.length) {
      const { showControls } = subFieldcontrol;
      const res = currentRelationRows.map(data => {
        const record = { key: data.rowid };
        for (const key of showControls) {
          record[key] = data[key];
        }
        record.isSub = 'true';
        return record;
      });
      return [record, ...res];
    }
    return record;
  }));

  return (
    <div>
      <Table
        bordered={true}
        size="small"
        loading={loading}
        dataSource={dataSource}
        columns={columns}
        onRow={(row) => {
          return {
            onClick: () => handleClickRow(row)
          }
        }}
        pagination={false}
      />
      <Flex justify="flex-end" style={{ marginTop: 10 }}>
        <Pagination
          size="small"
          total={recordInfo.count}
          onChange={index => {
            setRelationRows({});
            setPageIndex(index);
          }}
        />
      </Flex>
    </div>
  );
}
