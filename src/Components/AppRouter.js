import React, { Component } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import CreateSalon from "./CreateSalon/CreateSalon";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<div>Home page</div>}></Route>
        <Route path="/catalog" element={<div>Catalog page</div>}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/create-salon" element={<CreateSalon />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
