"use client";
import { Container } from "@/components/ecom";
import AppLayout from "@/components/ecom/AppLayout";
import { Button } from "@/components/ui/button";

import { usePathname, useRouter } from "next/navigation";
import React from "react";
import { useAppProvider } from "../Provider/AppProvider";
import { PersonIcon } from "@radix-ui/react-icons";
import {
  CreditCard,
  List,
  LocateIcon,
  LogOut,
  LucideShoppingCart,
  MapPin,
  ShoppingCart,
} from "lucide-react";

const Layout = ({ children }: any) => {
  const pathName = usePathname();
  const { handleLogin, setWishlistData } = useAppProvider();
  const router = useRouter();

  return (
    <AppLayout>
      <Container className=" h-full">
        <div className=" grid grid-cols-12 gap-6 py-12 h-full">
          <div className=" col-span-full border-e lg:col-span-3 pe-8">
            <p className=" text-lg font-bold mb-6 ps-4 text-stone-600 font-serif">
              Account
            </p>

            <div className=" flex lg:flex-col items-center overflow-auto lg:justify-normal lg:items-start lg:gap-1.5">
              <Button
                variant={"ghost"}
                onClick={() => router.push("/profile/information")}
                className={` ${
                  pathName.includes("information") && " !bg-stone-100"
                } cursor-pointer font-serif w-full justify-start !text-start lg:text-base text-xs rounded hover:bg-stone-100 text-stone-800 `}
              >
                <PersonIcon width={20} height={20} className=" me-2" /> Personal
                info
              </Button>

              <Button
                variant={"ghost"}
                onClick={() => router.push("/profile/orders")}
                className={` ${
                  pathName.includes("orders") && " !bg-stone-100"
                } cursor-pointer font-serif w-full justify-start !text-start lg:text-base text-xs rounded hover:bg-stone-100 text-stone-800 `}
              >
                <LucideShoppingCart className=" me-2" /> Orders
              </Button>

              <Button
                variant={"ghost"}
                onClick={() => router.push("/profile/address")}
                className={` ${
                  pathName.includes("address") && " !bg-stone-100"
                } cursor-pointer font-serif w-full justify-start !text-start lg:text-base text-xs rounded over:bg-stone-100 text-stone-800 `}
              >
                <MapPin className=" me-2" /> Address
              </Button>
              <Button
                variant={"ghost"}
                onClick={() => router.push("/profile/payment")}
                className={` ${
                  pathName.includes("payment") && " !bg-stone-100"
                } cursor-pointer font-serif w-full justify-start !text-start lg:text-base text-xs rounded over:bg-stone-100 text-stone-800 `}
              >
                <CreditCard className=" me-2 " /> Payment
              </Button>

              <div className=" border-t w-full my-4 border-stone-400"></div>

              <Button
                variant={"ghost"}
                onClick={() => router.push("/profile/terms-and-conditions")}
                className={` ${
                  pathName.endsWith("terms-and-conditions") && " !bg-stone-100"
                } 
                } cursor-pointer font-serif w-full justify-start !text-start lg:text-base text-xs rounded over:bg-stone-100 text-stone-800 `}
              >
                <List className=" me-2" /> Terms & Conditions
              </Button>

              <div className=" border-t w-full my-4 border-stone-400"></div>
              <Button
                variant={"ghost"}
                onClick={() => {
                  typeof window !== "undefined" &&
                    localStorage.removeItem("accessToken");
                  localStorage.removeItem("userId");
                  router.push("/");
                  setWishlistData([]);
                }}
                className={` 
                } cursor-pointer font-serif w-full justify-start !text-start lg:text-base text-xs rounded over:bg-stone-100 text-stone-800 `}
              >
                <LogOut className=" me-2" /> Logout
              </Button>
            </div>
          </div>
          <div className=" col-span-full lg:col-span-9 ">{children}</div>
        </div>
      </Container>
    </AppLayout>
  );
};

export default Layout;
