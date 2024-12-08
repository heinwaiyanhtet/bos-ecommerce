"use client";

import { Container } from "@/components/ecom";
import OrderComponent from "@/components/ecom/OrderComponent";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import React, { useEffect, useState } from "react";
import useSWR from "swr";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
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
import {
  CarFront,
  Check,
  LucideChevronRight,
  MapPin,
  Package,
  ShirtIcon,
  X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import FormInput from "@/components/FormInput.components";
import { Textarea } from "@/components/ui/textarea";
import useSWRMutation from "swr/mutation";
import { toast } from "sonner";

interface OrderData {
  orderStatus: string;
  cancelReason: string;
}

const Order = ({ params }: any) => {

  const {
  
    getSession,
    
  } = useAppProvider();

  const [isClient, setIsClient] = useState(false);

  const [active, setActive] = useState(1);

  const [userId, setUserId] = useState<string | null>(null);

  const [text, setText] = useState("");

  useEffect(() => {
    if (isClient) setUserId(localStorage.getItem("userId"));
  }, [isClient]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getData = async (url: string) => {
    try {
      const token = isClient && getSession();
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

  const { data, isLoading, error, mutate } = useSWR(
    userId !== null ? `${Backend_URL}/orders/ecommerce/${params.id}` : null,
    getData,
    {
      refreshInterval: 4000,
      errorRetryCount: 0,
      errorRetryInterval: 1000000,
    }
  );

  const patchOrder = async (url: string, { arg }: { arg: OrderData }) => {
    try {
      const token =
        typeof window !== "undefined"
          ? localStorage.getItem("accessToken")
          : null;
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Accept: "multipart/form-data",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(arg),
      };

      const response = await fetch(url, options);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "An error occurred");
      }

      return data; // Return the parsed JSON data
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const {
    data: editOrderData,
    error: editOrderError,
    trigger: editOrder,
  } = useSWRMutation(`${Backend_URL}/orders/ecommerce/${data?.id}`, patchOrder);

  useEffect(() => {
    if (data) {
      if (data.orderStatus == "ORDERED") {
        setActive(1);
        return;
      }
      if (data.orderStatus == "CONFIRMED") {
        setActive(2);
        return;
      }
      if (data.orderStatus == "DELIVERED") {
        setActive(3);
        return;
      }
      if (data.orderStatus == "COMPLETED") {
        setActive(4);
        return;
      }
    }
  }, [data]);

  const router = useRouter();

  const btn = React.useRef<HTMLButtonElement | null>(null);

  console.log(data);

  return (
    <>
      {!isLoading && (
        <div className=" pt-10">
          {!userId ? (
            <div className=" flex justify-center items-center">
              <p className=" text-xl ">You are not authorized!</p>
            </div>
          ) : (
            <Container>
              <div className=" mb-4 flex flex-col gap-4">
                <Breadcrumb>
                  <BreadcrumbList>
                    <BreadcrumbItem>
                      <BreadcrumbPage
                        onClick={() => router.push("/")}
                        className=" cursor-pointer !text-stone-500"
                      >
                        Home
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator>
                      <LucideChevronRight />
                    </BreadcrumbSeparator>

                    <BreadcrumbItem>
                      <BreadcrumbPage
                        onClick={() => router.push("/profile/orders")}
                        className=" cursor-pointer !text-stone-500"
                      >
                        Order
                      </BreadcrumbPage>
                    </BreadcrumbItem>

                    <BreadcrumbSeparator>
                      <LucideChevronRight />
                    </BreadcrumbSeparator>

                    <BreadcrumbItem>
                      <BreadcrumbPage className=" cursor-pointer !text-stone-500">
                        Order Detail
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>

              {(!error || !isLoading) && (
                <>
                  {data?.orderStatus == "CANCELED" ? (
                    <div className=" bg-stone-50 rounded-xl mb-6 border border-gold-400 p-5">
                      <div className=" flex items-center mb-3 justify-between">
                        <div className=" flex flex-col">
                          <p className=" font-serif text-stone-500">Status</p>
                          <p className=" font-serif text-stone-900">
                            {data?.orderStatus}
                          </p>
                        </div>
                        <div className=" flex flex-col">
                          <p className=" font-serif text-stone-500">Order Id</p>
                          <p className=" font-serif text-stone-900">
                            {data?.orderCode}
                          </p>
                        </div>
                        <div className=" flex flex-col">
                          <p className=" font-serif text-stone-500">
                            Order Date
                          </p>
                          <p className=" font-serif text-stone-900">
                            {data?.date}
                          </p>
                        </div>
                        <div className=" flex flex-col">
                          <p className=" font-serif text-stone-500">
                            Total (Kyat)
                          </p>
                          <p className=" font-serif text-stone-900  text-end">
                            {new Intl.NumberFormat("ja-JP").format(data?.total)}
                          </p>
                        </div>
                      </div>

                      <div className=" bg-white rounded-xl p-5">
                        <div className=" mb-4 border-b py-4 border-primary grid grid-cols-5">
                          <div className=" col-span-4 flex gap-3">
                            <MapPin className=" w-5 h-5 stroke-primary" />
                            <p>
                              {data?.customerAddress?.addressDetail},
                              {data?.customerAddress?.street},{" "}
                              {data?.customerAddress?.city},
                              {data?.customerAddress?.township}
                            </p>
                          </div>
                        </div>
                        <div className=" flex mb-4  items-center gap-3">
                          <div className=" flex flex-col justify-center items-center text-center gap-1.5 ">
                            <div
                              className={`border-dashed  ${
                                active > 0 && "bg-primary"
                              } duration-200 circle p-1.5 border-2 rounded-full border-primary inline-block`}
                            >
                              <ShirtIcon className=" lg:w-5 lg:h-5 stroke-white h-3 w-3" />
                            </div>
                            <p className=" text-xs font-normal lg:text-sm capitalize">
                              {active > 0 ? "Processing" : "Processed"}
                            </p>
                          </div>

                          <div className=" border w-12  h-0 mb-2.5 border-dashed border-primary"></div>

                          <div className=" flex flex-col justify-center items-center gap-1.5">
                            <div
                              className={`border-dashed  ${
                                true && " bg-primary"
                              } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                            >
                              <X
                                className={` lg:w-5 lg:h-5 ${
                                  false ? " stroke-black" : "stroke-white"
                                } h-3 w-3`}
                              />
                            </div>
                            <p className=" font-normal text-xs lg:text-sm capitalize">
                              Order Cancelled
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className=" bg-stone-50 rounded-xl mb-6 border border-gold-400 p-5">
                      <div className=" grid grid-cols-12 gap-4">
                        <div className=" lg:col-span-3 col-span-6 flex flex-col">
                          <p className=" font-serif text-stone-500">Status</p>
                          <p className=" font-serif text-stone-900">
                            {data?.orderStatus}
                          </p>
                        </div>
                        <div className=" lg:col-span-3 col-span-6 flex flex-col">
                          <p className=" font-serif text-stone-500">Order Id</p>
                          <p className=" font-serif text-stone-900">
                            {data?.orderCode}
                          </p>
                        </div>
                        <div className=" lg:col-span-3 col-span-6 flex flex-col">
                          <p className=" font-serif text-stone-500">
                            Order Date
                          </p>
                          <p className=" font-serif text-stone-900">
                            {data?.date}
                          </p>
                        </div>
                        <div className=" lg:col-span-3 col-span-6 flex flex-col">
                          <p className=" font-serif lg:text-end text-stone-500">
                            Total (Kyat)
                          </p>
                          <p className=" font-serif text-stone-900 lg:text-end">
                            {new Intl.NumberFormat("ja-JP").format(data?.total)}
                          </p>
                        </div>
                      </div>

                      <div className=" bg-white rounded-xl mb-6 p-5">
                        <div className=" mb-6 border-b pb-4 border-primary grid gap-4 grid-cols-5">
                          <div className="  col-span-full ">
                            <div className=" grid grid-cols-12 gap-4">
                              <div className="lg:col-span-4 col-span-full flex flex-col gap-2">
                                <p className=" text-xl font-bold font-serif text-stone-600">
                                  Shipping address
                                </p>
                                <p>
                                  {data?.customerAddress?.addressDetail},
                                  {data?.customerAddress?.street},{" "}
                                  {data?.customerAddress?.city},
                                  {data?.customerAddress?.township}
                                </p>
                              </div>
                              <div className="lg:col-span-4 col-span-full flex flex-col gap-2">
                                <p className=" text-xl font-bold font-serif text-stone-600">
                                  Contact Information
                                </p>
                                <p>{data?.ecommerceUser?.phone}</p>
                              </div>
                              <div className="lg:col-span-4 col-span-full flex flex-col gap-2">
                                <p className=" text-xl font-bold font-serif text-stone-600">
                                  Payment Info
                                </p>
                                <p>Cash on Delivery</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        {data?.orderStatus == "ORDERED" && (
                          <div className=" col-span-full flex justify-between">
                            <p className=" font-serif">
                              Are you changing your mind?
                            </p>
                            <Button
                              onClick={() => btn?.current?.click()}
                              variant={"outline"}
                            >
                              Cancel Order
                            </Button>
                          </div>
                        )}
                      </div>

                      <div className="  bg-white rounded-xl py-3 lg:p-5">
                        <div className=" flex  mb-5 items-center lg:gap-3">
                          <div className=" flex flex-col justify-center items-center text-center gap-1.5 ">
                            <div
                              className={`border-dashed  ${
                                active > 0 && "bg-primary"
                              } duration-200 circle p-1.5 border-2 rounded-full border-primary inline-block`}
                            >
                              <ShirtIcon className=" lg:w-5 lg:h-5 stroke-white h-3 w-3" />
                            </div>
                            <p className=" text-[12px] font-normal lg:text-sm capitalize">
                              {active > 0 ? "Processing" : "Processed"}
                            </p>
                          </div>

                          <div className=" border w-12 h-0 mb-2.5 border-dashed border-primary"></div>

                          <div className=" flex flex-col justify-center items-center gap-1.5">
                            <div
                              className={`border-dashed  ${
                                active > 1 && " bg-primary"
                              } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                            >
                              <Package
                                className={` lg:w-5 lg:h-5 ${
                                  active < 2 ? " stroke-black" : "stroke-white"
                                } h-3 w-3`}
                              />
                            </div>
                            <p className=" font-normal text-[12px] lg:text-sm capitalize">
                              Packed
                            </p>
                          </div>

                          <div className=" border w-12  h-0 mb-2.5 border-dashed border-primary"></div>

                          <div className=" flex flex-col justify-center items-center gap-1.5">
                            <div
                              className={`border-dashed  ${
                                active > 2 && "bg-primary"
                              } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                            >
                              <CarFront
                                className={` lg:w-5 lg:h-5 ${
                                  active < 3 ? " stroke-black" : "stroke-white"
                                } h-3 w-3`}
                              />
                            </div>
                            <p className=" font-normal text-[12px] lg:text-sm capitalize">
                              Delivery
                            </p>
                          </div>

                          <div className=" border w-12  h-0 mb-2.5 border-dashed border-primary"></div>

                          <div className=" flex flex-col justify-center items-center gap-1.5">
                            <div
                              className={`border-dashed  ${
                                active > 3 && "bg-primary"
                              } duration-200 circle p-1.5 border-2  rounded-full border-primary inline-block`}
                            >
                              <Check
                                className={` lg:w-5 lg:h-5 ${
                                  active < 4 ? " stroke-black" : "stroke-white"
                                } h-3 w-3`}
                              />
                            </div>
                            <p className=" font-normal text-[12px] lg:text-sm capitalize">
                              Complete
                            </p>
                          </div>
                        </div>

                        <div className=" grid grid-cols-12 grid-rows-2 lg:gap-4">
                          {data?.orderRecords?.map(
                            (data: any, index: number) => (
                              <div key={index} className=" col-span-full ">
                                <div>
                                  <div className=" grid grid-cols-6 lg:grid-cols-12 gap-4">
                                    <div className=" row-span-2 col-span-3">
                                      <div className=" border rounded-xl border-gold-400">
                                        <Image
                                          src={data?.image?.url}
                                          width={300}
                                          className="  h-[200px] w-full rounded-xl object-cover object-top duration-300"
                                          height={300}
                                          alt=""
                                        />
                                      </div>
                                    </div>

                                    <div className=" row-span-1 lg:row-span-2 col-span-3">
                                      <div className="">
                                        <div className="">
                                          <p className=" mb-2 lg:text-xl font-serif text-sm line-clamp-1">
                                            {data?.productName}
                                          </p>
                                        </div>
                                        <div className=" flex  gap-2 text-sm items-center">
                                          <AiFillSafetyCertificate className="  fill-gold-400 stroke-gold-400 size-3 lg:size-6" />
                                          <span className=" font-mono text-[11px] lg:text-base">
                                            {data?.productCode}{" "}
                                          </span>
                                        </div>

                                        <div className=" flex mt-3 flex-wrap items-start gap-1">
                                          <Badge className=" opacity-90 font-normal text-white bg-stone-400 rounded-full ">
                                            {data.categoryName}
                                          </Badge>

                                          <Badge className=" opacity-90 font-normal text-nowrap text-white bg-stone-400 rounded-full ">
                                            {data.fittingName}
                                          </Badge>

                                          <Badge className=" opacity-90 font-normal text-white text-nowrap bg-stone-400 rounded-full ">
                                            {data.sizingName}
                                          </Badge>
                                        </div>
                                      </div>
                                    </div>

                                    <div className=" row-span-1 col-span-2 lg:col-span-3">
                                      <p className="text-neutral-500 mb-3 text-xs">
                                        Price
                                      </p>

                                      <p className=" mb-2 text-xs lg:text-base">
                                        {new Intl.NumberFormat("ja-JP").format(
                                          data?.price
                                        )}{" "}
                                        MMK
                                      </p>
                                    </div>
                                  </div>
                                  <hr className=" my-5" />
                                </div>
                              </div>
                            )
                          )}
                        </div>
                      </div>
                    </div>
                  )}
                </>
              )}
            </Container>
          )}

          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button ref={btn} className=" hidden" variant="outline"></Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>
                  <span className=" mb-4 flex justify-between items-center">
                    <span className=" font-serif text-xl">Cancel Order</span>
                  </span>
                </AlertDialogTitle>
                <AlertDialogDescription className=" text-primary">
                  <Textarea
                    placeholder="Reason for cancellation"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                    rows={8}
                    className=" mb-6 shadow w-full focus-visible:ring-gold-400"
                  />
                  <div className=" flex col-span-full justify-end gap-3 items-center">
                    <Button
                      type="button"
                      onClick={() => {
                        btn.current?.click();
                      }}
                      variant={"link"}
                    >
                      Close
                    </Button>
                    <Button
                      onClick={async () => {
                        if (text.length === 0) {
                          toast("Please provide a reason for cancellation");
                          return;
                        }
                        if (text.length > 0) {
                          try {
                            await editOrder({
                              orderStatus: "CANCELED",
                              cancelReason: text,
                            });
                            toast("Order Cancelled");
                            btn.current?.click();
                            setText("");
                          } catch (error) {
                            toast("Error Cancelling Order");
                          }
                        }
                      }}
                      className=" bg-gold-400 hover:bg-[#e2be6a]  col-span-1 rounded-full"
                      variant={"default"}
                    >
                      Cancel Now
                    </Button>
                  </div>
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel ref={btn} className=" hidden">
                  Close
                </AlertDialogCancel>
                <AlertDialogAction className=" hidden">
                  Continue
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </>
  );
};

export default Order;
