import React from 'react';
import { Space, Tag } from 'antd';
import _ from 'lodash';

function getSelectedOptions(options, value) {
  if (!value || value === '[]') {
    return [];
  }
  let selectedKeys = [];
  try {
    selectedKeys = JSON.parse(value);
    return selectedKeys
      .map(key =>
        _.find(options, option => {
          if (key.indexOf('other') > -1 || key.indexOf('add_') > -1) {
            return key.indexOf(option.key) > -1;
          }
          return key === option.key;
        }),
      )
      .filter(_.identity);
  } catch (err) {
    console.log(err);
    return [];
  }
}

export default function Options(props) {
  const { control, value } = props;
  const selectedOptions = value ? getSelectedOptions(control.options, value) : [];

  return (
    selectedOptions.map(item => (
      <Tag key={item.key} color={item.color}>{item.value}</Tag>
    ))
  );
}
