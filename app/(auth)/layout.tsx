import React from "react";
import { Logo } from "./_components/Logo";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="flex flex-col justify-center items-center space-y-6 h-full">
      <Logo />
      <div className="p-5 flex gap-3 flex-col items-center rounded-md">
        {children}
      </div>
    </div>
  );
};

export default layout;
