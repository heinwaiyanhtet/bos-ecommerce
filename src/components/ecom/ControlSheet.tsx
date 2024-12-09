"use client";

import React, { useEffect, useState } from "react";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "../ui/button";
import { useAppProvider } from "@/app/Provider/AppProvider";

type controls = {
  buttonName: any;
  title: any;
  desc?: any;
  children: React.ReactNode;
  closeRef?: any;
  type?: any;
};

const ControlSheet = ({
  buttonName,
  title,
  desc,
  children,
  closeRef,
  type,
}: controls) => {
  const [open, setOpen] = useState(false);
  const { orderRecord, wishlistData } = useAppProvider();

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setOpen(!open);
      }}
    >
      <SheetTrigger className=" relative" asChild>
        {title == "Filter Products" ? (
          <Button size={"default"} className="  !m-0 !p-0" variant={"outline"}>
            {buttonName}
          </Button>
        ) : (
          <Button size={"sm"} variant={"ghost"} className="!p-0 !m-0 relative">
            {type == "cart" &&
              orderRecord?.reduce((pv: any, cv: any) => pv + cv.quantity, 0) >
                0 && (
                <span
                  style={{ zIndex: 1500 }}
                  className=" absolute top-0 text-[8px] bg-stone-900 rounded-full right-1.5 h-4 w-4  text-stone-200 !p-0 flex justify-center items-center"
                >
                  {orderRecord?.reduce(
                    (pv: any, cv: any) => pv + cv?.quantity,
                    0
                  )}
                </span>
              )}

            {type == "wishlist" && wishlistData?.length > 0 && (
              <span
                style={{ zIndex: 1500 }}
                className=" absolute top-0 text-[8px] bg-stone-900 rounded-full right-1.5 h-4 w-4  text-stone-200 !p-0 flex justify-center items-center"
              >
                {wishlistData?.length}
              </span>
            )}
            {buttonName}
          </Button>
        )}
      </SheetTrigger>
      <SheetContent className=" w-full lg:w-1/2 space-y-2">
        <SheetHeader>
          <SheetTitle className=" text-start font-serif font-bold !pb-0">
            {title}
          </SheetTitle>
          <SheetDescription className="!mt-0 text-start">
            {desc}
          </SheetDescription>
        </SheetHeader>
        <div className=" my-5"></div>
        {children}
        <SheetFooter className={" !justify-between hidden items-center"}>
          <SheetClose ref={closeRef} asChild>
            <Button className="hidden" variant="link">
              Cancel
            </Button>
          </SheetClose>
          <SheetClose asChild>
            <Button className="hidden" size="sm">
              Save changes
            </Button>
          </SheetClose>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
};

export default ControlSheet;
