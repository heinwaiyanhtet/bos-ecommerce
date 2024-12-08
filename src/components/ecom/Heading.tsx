import React from "react";

const Heading = ({
  header,
  desc,
  className,
}: {
  header: string;
  desc: string;
  className?: string | undefined;
}) => {
  return (
    <div className={`capitalize flex flex-col gap-[10px] ${className}`}>
      <p className=" text-xl lg:text-4xl font-bold font-serif ">{header}</p>
      <p className="  font-normal text-stone-500 text-sm">{desc}</p>
    </div>
  );
};

export default Heading;
