import { RouterProvider } from "react-router-dom";
import "./App.css";
import routers from "./router";
import { NavBar } from "./components";

function App() {
  return (
    <>
      <RouterProvider router={routers} />
    </>
  );
}

export default App;
