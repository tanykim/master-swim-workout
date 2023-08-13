import React from "react";
import { Routes, Route } from "react-router-dom";
import Layout from "./Layout";
import Intervals from "./Intervals";
import Create from "./Create";
import Welcome from "./Welcome";
import NoMatch from "./NoMatch";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Welcome />} />
        <Route path="create" element={<Create />} />
        <Route path="intervals" element={<Intervals />} />
        <Route path="*" element={<NoMatch />} />
      </Route>
    </Routes>
  );
}

export default App;
