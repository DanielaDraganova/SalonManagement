import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import CreateSalon from "./CreateSalon/CreateSalon";
import Catalog from "./Catalog/Catalog";
import Details from "./Details/Details";
import { Edit } from "./Edit/Edit";

function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/home" element={<div>Home page</div>}></Route>
        <Route path="/catalog" element={<Catalog />}></Route>
        <Route path="/login" element={<Login />}></Route>
        <Route path="/register" element={<Register />}></Route>
        <Route path="/create-salon" element={<CreateSalon />}></Route>
        <Route path="/:salonId/salon-details" element={<Details />}></Route>
        <Route path="/:salonId/salon-edit" element={<Edit />}></Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRouter;
