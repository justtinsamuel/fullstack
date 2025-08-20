import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from "../components";

const MainLayout = () => {
    return(
        <div>
            <h3>To Do Apps</h3>
            <NavBar></NavBar>
            <Outlet></Outlet>
        </div>
    )
}

export default MainLayout;