"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import { Container } from "@/components/ecom";
import OrderComponent from "@/components/ecom/OrderComponent";
import { Button } from "@/components/ui/button";
import { Backend_URL } from "@/lib/fetch";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const UserOrdersPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { handleLogin } = useAppProvider();
  const router = useRouter();

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const [token, setToken] = useState<string | null>("");

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        setSwalProps({
          show: true,
          showConfirmButton: false,
        });
      } else {
        setToken(localStorage.getItem("accessToken"));
      }
    }
  }, [isClient]);

  const getData = async (url: string) => {
    try {
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const { data, isLoading, mutate } = useSWR(
    token !== "" ? `${Backend_URL}/orders/ecommerce` : null,
    getData,
    {
      errorRetryInterval: 500,
    }
  );

  const alertRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        alertRef.current?.click();
      }
    }
  }, [isClient]);

  return (
    <div className=" lg:ps-8">
      <p className=" text-lg font-bold mb-6 text-stone-600 font-serif">
        Order History
      </p>

      <Tabs className=" !bg-transparent" defaultValue="orders">
        <TabsList className=" !bg-transparent">
          <TabsTrigger className=" !bg-transparent" value="orders">
            Orders
          </TabsTrigger>
          <TabsTrigger value="open">Open Orders</TabsTrigger>
          <TabsTrigger value="cancel">Cancelled Orders</TabsTrigger>
        </TabsList>

        {!isLoading && (
          <>
            <TabsContent value="orders">
              <div>
                {data?.map((data: any, index: any) => (
                  <OrderComponent key={index} data={data} refetch={mutate} />
                ))}
              </div>
            </TabsContent>
            <TabsContent value="open">
              <div>
                {data
                  ?.filter((data: any) => data.orderStatus !== "CANCELED")
                  .map((data: any, index: any) => (
                    <OrderComponent key={index} data={data} refetch={mutate} />
                  ))}
              </div>
            </TabsContent>

            <TabsContent value="cancel">
              <div>
                {data
                  ?.filter((data: any) => data.orderStatus === "CANCELED")
                  .map((data: any, index: any) => (
                    <OrderComponent key={index} data={data} refetch={mutate} />
                  ))}
              </div>
            </TabsContent>
          </>
        )}
      </Tabs>

      <div onClick={(e) => e.stopPropagation()}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className=" hidden"
              onClick={(e) => e.stopPropagation()}
              ref={alertRef}
              variant="outline"
            >
              Sign In To Continue
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className=" w-[400px] flex justify-center items-center flex-col py-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign In To Continue!</AlertDialogTitle>
              <AlertDialogDescription>
                You need to sign in to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push("/")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  handleLogin();
                  e.stopPropagation();
                }}
              >
                Log in
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserOrdersPage;
