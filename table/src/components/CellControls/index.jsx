import React from 'react';
import Options from './Options';

export default function CellControls(props) {
  const { control, value } = props;

  if ([9, 10, 11].includes(control.type)) {
    return <Options {...props} />;
  }

  return value;
}
