import styled from "styled-components";
import {Color} from "../base/logic/style/Color";

export const ColoredCircle = styled.span<{
    c: Color | string
}>`
  background-color: ${props => {
    if (typeof props.c === "string") return props.c;
    else return props.c.css()
  }};
  width: 14px;
  height: 14px;
  border-radius: 8px;
  flex-shrink: 0;
`;
