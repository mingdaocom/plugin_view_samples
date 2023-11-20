import React from "react";
import styled from "styled-components";

const Con = styled.div`
  position: absolute;
  right: 20px;
  bottom: 20px;
  background: #fff;
  padding: 6px 10px;
  border-radius: 4px;
  box-shadow: 0 1px 4px rgba(0, 0, 0, 0.2);
`;

export default function Status(props) {
  return <Con>status</Con>;
}
