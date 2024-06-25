import React from "react";
import MenuOptions from "./menu-options";
import { sidebarOpt } from "@/lib/constants";

const Sidebar = async () => {
  return (
    <>
      {/* For Desktop */}
      <MenuOptions
        defaultOpen={true}
        sidebarOpt={sidebarOpt}
      />
      {/* For Mobile */}
      <MenuOptions sidebarOpt={sidebarOpt} />
    </>
  );
};

export default Sidebar;
