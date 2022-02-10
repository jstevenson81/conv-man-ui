import React from "react";
import { Outlet } from "react-router-dom";
import ConvManNavBar from "./common/nav/ConvManNavBar";

export default class App extends React.Component {
  render(): React.ReactNode {
    return (
      <div className="w-full p-4">
        <div className="mb-8">
          <ConvManNavBar></ConvManNavBar>
        </div>
        <div>
          <Outlet></Outlet>
        </div>
      </div>
    );
  }
}
