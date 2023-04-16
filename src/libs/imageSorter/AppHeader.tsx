import React from "react";
import {ImageHubBranding} from "./ImageHubBranding";
import {Searchbar} from "./Searchbar";

export const AppHeader: React.FC = props => {

    return (
        <div style={{
            display: "grid",
            alignItems: "center",
            width: "100%",
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            <ImageHubBranding/>

            <Searchbar/>
        </div>
    );
}
