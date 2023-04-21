import React, {PropsWithChildren, useRef} from "react";
import {ControlledMenu, ControlledMenuProps, MenuItem, useClick, useMenuState} from "@szhsin/react-menu";
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
    opener?: React.ReactNode,
    menuProps?: ControlledMenuProps
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
                {...props.menuProps}
                portal={{
                    target: urgencyButtonRef.current,
                    stablePosition: true
                }}
                {...menuState}
                anchorRef={urgencyButtonRef}
                onClose={() => toggleMenu(false)}
                key={"top"}
                menuStyle={{
                    // boxShadow: "rgb(48, 54, 61) 0px 0px 0px 1px, rgba(1, 4, 9, 0.85) 0px 16px 32px",
                    // width: urgencyButtonRef.current?.offsetWidth ?? "auto",
                    // border: "none",
                    backgroundColor: "rgb(22, 27, 34)",
                    borderRadius: "12px",
                    boxShadow: "rgba(1, 4, 9, 0.85) 0px 16px 32px",
                    minWidth: urgencyButtonRef.current?.offsetWidth ?? "auto",
                    padding: "8px",
                    border: "1px solid rgb(48, 54, 61)"
                }}
                arrowStyle={{
                    borderLeftColor: "rgb(48, 54, 61)",
                    borderTopColor: "rgb(48, 54, 61)",
                    backgroundColor: "rgb(22, 27, 34)"
                }}
                // direction={"bottom"}
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
