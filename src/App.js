import React from "react";
import { Route, Routes } from "react-router-dom";
import { Main, Details } from "./pages";

export const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Main />} />
      <Route path="/details/:factoryId/:monthNumber" element={<Details />} />
    </Routes>
  );
};
