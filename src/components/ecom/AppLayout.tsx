"use client";

import React from "react";
import Navbar from "./Navbar";
import CallToAction from "./CallToAction";
import Footer from "./Footer";
import SweetAlert2 from "react-sweetalert2";
import { useAppProvider } from "@/app/Provider/AppProvider";

const AppLayout = ({ children }: any) => {
  const { searchInputValue, swalProps, setSwalProps } = useAppProvider();

  return (
    <div className=" flex flex-col min-h-screen !w-screen overflow-x-hidden justify-between ">
      <div className="">
        <Navbar />
        <div className=" h-[80px]"></div>
        {children}
      </div>

      <div className=" w-screen mt-auto">
        <Footer />
      </div>

      {typeof window !== "undefined" && (
        <SweetAlert2
          timer={1500}
          position="bottom-end"
          icon="success"
          iconColor="black"
          customClass={{
            popup: "colored-toast",
          }}
          toast={true}
          {...swalProps}
          didClose={() =>
            setSwalProps({
              ...swalProps,
              show: false,
            })
          }
        >
          <p className=" capitalize">{swalProps.type} Successfully</p>
        </SweetAlert2>
      )}
    </div>
  );
};

export default AppLayout;
