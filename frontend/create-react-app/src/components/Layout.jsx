import React from "react";

const Layout = ({ children }) => {
  return (
    <div className="min-h-screen w-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x bg-[length:200%_200%]">
      {children}
    </div>
  );
};

export default Layout;
