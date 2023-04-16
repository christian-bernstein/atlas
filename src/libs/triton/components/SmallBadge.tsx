import {Color} from "../../base/logic/style/Color";
import styled from "styled-components";

export type SmallBadgeProps = {
    color?: Color,
    text: string,
    highlightOnHover?: boolean,
}

const StyledSmallBadge = styled.span<{
    backgroundColor: Color,
    finalizedColor: Color,
    borderColor: Color,
    highlightOnHover: boolean
}>`
      overflow: hidden;
      padding: 0;
      background-color: transparent;
      border-radius: 100px;
      line-height: 18px;
      height: auto;
      border: none;
      position: relative;
      max-width: 100%;
      width: fit-content;
  
      .label {
        -webkit-box-align: center;
        align-items: center;
        border-width: 1px;
        border-radius: 999px;
        border-style: solid;
        display: inline-flex;
        font-weight: 600;
        font-size: 12px;
        line-height: 1;
        white-space: nowrap;
        height: 20px;
        padding: 0 7px;
        background-color: ${props => props.backgroundColor.withAlpha(.15).css()};
        color: ${props => props.finalizedColor.css()};
        border-color: ${props => props.borderColor.withAlpha(.4).css()};
        max-width: calc(350px - 6.5em);
        position: relative;
        cursor: pointer;

        &:hover {
          ${props => props.highlightOnHover ? "background-color: rgb(48, 54, 61);" : ""}
        }
      }
`;

export function SmallBadge(props: SmallBadgeProps) {
    const color = props.color ?? Color.ofHex("#8b949e")
    const borderColor = props.color ?? Color.ofHex("#30363d");
    const backgroundColor = props.color ?? Color.ofHex("#161b22");
    const highlightOnHover = props.color !== undefined && (props.highlightOnHover ?? true);

    return (
        <StyledSmallBadge
            finalizedColor={color}
            borderColor={borderColor}
            backgroundColor={backgroundColor}
            highlightOnHover={highlightOnHover}
            children={
                <span className={"label"}>
                    <span className={"text"} children={props.text}/>
                </span>
            }
        />
    );
}
