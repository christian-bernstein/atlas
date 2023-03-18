import styled from "styled-components";

export const FormikInput = styled.span`
  font-size: 14px;
  line-height: 20px;
  color: rgb(201, 209, 217);
  vertical-align: middle;
  background-color: rgb(13, 17, 23);
  border: 1px solid rgb(48, 54, 61);
  border-radius: 6px;
  outline: none;
  box-shadow: transparent 0 0;
  -webkit-box-align: stretch;
  align-items: stretch;
  min-height: 32px;
  width: 100%;
  display: flex;
  
  &.error {
    border: 1px solid rgb(218, 54, 51);
  }
  
  &:focus-within {
    border-color: rgb(88, 166, 255);
    outline: none;
    box-shadow: rgb(88, 166, 255) 0 0 0 1px inset;
  }
      
  .input {
    padding-left: 12px;
    padding-right: 12px;
    cursor: text;
    border: 0;
    font-size: inherit;
    font-family: inherit;
    background-color: transparent;
    appearance: none;
    color: inherit;
    width: 100%; 
        
    &:focus {
      outline: 0;
    }
  }
`;
