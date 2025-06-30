import React from "react";

const Layout = ({ children }) => {
  return (
     <div className="min-h-screen w-full overflow-hidden">

    <main className="max-w-full">
      {children}</main>
    </div>
  );
};

export default Layout;
