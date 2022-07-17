import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<div>Home page</div>}></Route>
        <Route path="/catalog" element={<div>Catalog page</div>}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
