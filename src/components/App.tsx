import React from "react";
import { Outlet } from "react-router-dom";
import { NavBar } from ".";

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="w-full p-4">
        <div className="mb-8">
          <NavBar></NavBar>
        </div>

        <Outlet></Outlet>
      </div>
    );
  }
}
