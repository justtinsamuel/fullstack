import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components";

const MainLayout = () => {
    return(
        <div>
            <NavBar></NavBar>
            <Outlet></Outlet>
        </div>
    )
}

export default MainLayout;