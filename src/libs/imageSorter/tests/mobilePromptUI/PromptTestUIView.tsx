import React, {useState} from "react";
import styled from "styled-components";
import {PromptShard} from "./PromptShard";
import {PromptShardPreview} from "./PromptShardPreview";

export const StyledPromptTestUIView = styled.div`
  position: absolute;
  width: 100vw;
  height: 100vh;
  overflow: hidden;
  background-color: #111112;
  
`;

export type PromptTestUIViewState = {
    shards: Array<PromptShard>
}

export const PromptTestUIView: React.FC = props => {
    const [state, setState] = useState<PromptTestUIViewState>({
        shards: [
            { display: "test" },
            { display: "beach" },
            { display: "sunny sunday afternoon" },
            { display: "forest" },
            { display: "blue sky" },
        ]
    });

    return (
        <StyledPromptTestUIView>
            <div style={{
                display: "flex",
                flexWrap: "wrap",
                width: "100%",
                alignItems: "center",
                gap: "8px",
                padding: "1rem"
            }} children={ state.shards.map(shard => (
                <PromptShardPreview for={shard}/>
            )) }/>
        </StyledPromptTestUIView>
    );
}
