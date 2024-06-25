import Sidebar from "@/components/sidebar";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="h-100 mb-4">
      <Sidebar />
      <div className="ml-12 md:pl-[320px] mr-12">{children}</div>
    </div>
  );
};

export default layout;
