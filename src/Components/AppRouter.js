import React, { useContext, useState } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login/Login";
import Register from "./Register/Register";
import CreateSalon from "./CreateSalon/CreateSalon";
import Catalog from "./Catalog/Catalog";
import Details from "./Details/Details";
import { Edit } from "./Edit/Edit";
import { Home } from "./Home/Home";
import Header from "./Header/Header";
import Spinner from "./Spinner/Spinner";
import { LoadingContext } from "../contexts/LoadingContext";
import { AuthProvider } from "../contexts/AuthContext";

function AppRouter() {
  const { isLoading } = useContext(LoadingContext);
  return (
    <AuthProvider>
      <BrowserRouter>
        <Header />
        {isLoading ? <Spinner /> : ""}

        <Routes>
          <Route path="/" element={<Home />}></Route>
          <Route path="/catalog" element={<Catalog />}></Route>
          <Route path="/login" element={<Login />}></Route>
          <Route path="/register" element={<Register />}></Route>
          <Route path="/create-salon" element={<CreateSalon />}></Route>
          <Route path="/:salonId/salon-details" element={<Details />}></Route>
          <Route path="/:salonId/salon-edit" element={<Edit />}></Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default AppRouter;
