import React from "react";
import {ImageHubBranding} from "./ImageHubBranding";
import {Searchbar} from "./Searchbar";
import {Navbar} from "./Navbar";

export const AppHeader: React.FC = props => {

    return (
        <div style={{
            display: "grid",
            alignItems: "center",
            width: "100%",
            gap: "1rem",
            gridTemplateColumns: "repeat(3, 1fr)"
        }}>
            <ImageHubBranding/>

            <Searchbar/>

            <Navbar/>
        </div>
    );
}
