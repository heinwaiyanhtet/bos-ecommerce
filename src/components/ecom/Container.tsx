import React from "react";

type container = {
  children: React.ReactNode;
  className?: string;
};

const Container = ({ children, className }: container) => {
  return (
    <div
      className={`mx-auto h-full overflow-x-hidden max-w-[414px] px-2 lg:px-0 lg:max-w-[1280px] ${
        className || ""
      }`}
    >
      {children}
    </div>
  );
};

export default Container;
