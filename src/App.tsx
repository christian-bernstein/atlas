import React from 'react';
import './App.css';
import {AtlasMain} from "./libs/atlas/AtlasMain";
import {InDevAtlasAPI} from "./libs/atlas/api/InDevAtlasAPI";

function App() {
  return (
    <div className="App">
      <AtlasMain api={new InDevAtlasAPI()}/>
    </div>
  );
}

export default App;
