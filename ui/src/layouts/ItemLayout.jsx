import React from "react";
import { Outlet } from "react-router-dom";
import { ItemNavbar } from "../components";

const ItemLayout = () => {
  return (
    <div>
      {/* <ItemNavbar /> */}
      <Outlet />
    </div>
  );
};

export default ItemLayout;
