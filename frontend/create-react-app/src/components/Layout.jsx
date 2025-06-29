import React from "react";

const Layout = ({ children }) => {
  return (
     <div className="min-h-screen bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 animate-gradient-x bg-[length:200%_200%] px-4 sm:px-6 lg:px-8 overflow-x-hidden">
    
      {children}
    </div>
  );
};

export default Layout;
