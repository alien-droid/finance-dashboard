import Header from "@/components/Header";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <Header></Header>
      <main className="px-3 lg:px-14">{children}</main>
    </>
  );
};

export default layout;
