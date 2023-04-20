import React, {PropsWithChildren, useRef} from "react";
import {ControlledMenu, MenuItem, useClick, useMenuState} from "@szhsin/react-menu";
import {IconButton} from "./IconButton";
import {MoreVertRounded} from "@mui/icons-material";
import styled from "styled-components";

// <MenuItem style={{
//     backgroundColor: "transparent",
//     padding: "0",
//     margin: "0",
//     border: "0",
//     width: "100%"
// }}>
//     <span children={
//         <>Test</>
//     }/>
// </MenuItem>

export type MenuProps = PropsWithChildren<{
    opener?: React.ReactNode
}>;

const StyledMenu = styled.div`
  .szh-menu__item {
    padding: 0 !important;
    
    &:hover {
      background-color: initial;
    }
  }
  
  .szh-menu__divider {
    margin-top: 2px;
    background-color: #30363d;
    margin-bottom: 2px;
  }
`;

export const Menu: React.FC<MenuProps> = props => {
    const urgencyButtonRef = useRef<null | HTMLSpanElement>(null);
    const [menuState, toggleMenu] = useMenuState({ transition: true });
    const anchorProps = useClick(menuState.state, toggleMenu);

    return (
        <>
            <span {...anchorProps} ref={urgencyButtonRef} children={
                props.opener ?? (
                    <IconButton size={"small"} children={
                        <MoreVertRounded/>
                    }/>
                )
            }/>

            <ControlledMenu
                portal={{
                    target: urgencyButtonRef.current,
                    stablePosition: true
                }}
                {...menuState}
                anchorRef={urgencyButtonRef}
                onClose={() => toggleMenu(false)}
                key={"top"}
                menuStyle={{
                    // width: urgencyButtonRef.current?.offsetWidth ?? "auto",
                    minWidth: urgencyButtonRef.current?.offsetWidth ?? "auto",
                    borderRadius: "12px",
                    backgroundColor: "rgb(22, 27, 34)",
                    // boxShadow: "rgb(48, 54, 61) 0px 0px 0px 1px, rgba(1, 4, 9, 0.85) 0px 16px 32px",
                    boxShadow: "rgba(1, 4, 9, 0.85) 0px 16px 32px",
                    // border: "none",
                    border: "1px solid rgb(48, 54, 61)",
                    padding: "8px"
                }}
                arrowStyle={{
                    borderLeftColor: "rgb(48, 54, 61)",
                    borderTopColor: "rgb(48, 54, 61)",
                    backgroundColor: "rgb(22, 27, 34)"
                }}
                direction={"bottom"}
                align={"center"}
                theming={"dark"}
                transition={true}
                position={"anchor"}
                viewScroll={"auto"}
                arrow={true}
                offsetY={6}
                children={
                    <StyledMenu children={props.children}/>
                }
            />
        </>
    );
}
