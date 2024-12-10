"use client";
import {
  CarFront,
  Check,
  MapPin,
  Package,
  ShirtIcon,
  User2,
  X,
} from "lucide-react";
import React, { useEffect, useState } from "react";
import Container from "./Container";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import useSWRMutation from "swr/mutation";
import { Backend_URL } from "@/lib/fetch";

interface OrderData {
  orderStatus: string;
  cancelReason: string;
}

const OrderComponent = ({ data, refetch }: any) => {
  const [active, setActive] = useState(1);
  const [isClient, setIsClient] = useState(false);
  const [orderId, setOrderId] = useState<number | null>(null);
  const [cancelReason, setCancelReason] = useState("");

  const [show, isShow] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

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
  } = useSWRMutation(
    orderId !== null ? `${Backend_URL}/orders/ecommerce/${orderId}` : null,
    patchOrder
  );

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

  const handleCancelOrder = async () => {
    await setOrderId(data?.id);
    const orderData: OrderData = {
      orderStatus: "CANCELED",
      cancelReason: cancelReason,
    };
    const res = await editOrder(orderData);
    if (res) {
      refetch();
    }
  };

  const router = useRouter();

  return (
    <>
      {data?.orderStatus == "CANCELED" ? (
        <div className=" bg-stone-50 rounded-xl mb-6 border border-gold-400 p-5">
          <div className=" grid grid-cols-12 gap-4 mb-3 ">
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500">Status</p>
              <p className=" font-serif text-stone-900">{data?.orderStatus}</p>
            </div>
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500">Order Id</p>
              <p className=" font-serif text-stone-900">{data?.orderCode}</p>
            </div>
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500">Order Date</p>
              <p className=" font-serif text-stone-900">{data?.date}</p>
            </div>
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500 lg:text-end">
                Total (Kyat)
              </p>
              <p className=" font-serif text-stone-900 lg:text-end">
                {new Intl.NumberFormat("ja-JP").format(data?.total)}
              </p>
            </div>
          </div>

          <div className=" bg-white rounded-xl p-5">
            <div className=" lg:col-span-4 col-span-full flex gap-3">
              <MapPin className=" w-5 h-5 stroke-primary" />
              <p>
                {data?.customerAddress?.addressDetail},
                {data?.customerAddress?.street}, {data?.customerAddress?.city},
                {data?.customerAddress?.township}
              </p>
            </div>

            <div className=" flex my-4 items-center gap-3">
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
          <div className=" grid grid-cols-12 gap-4 mb-3 ">
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500">Status</p>
              <p className=" font-serif text-stone-900">{data?.orderStatus}</p>
            </div>
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500">Order Id</p>
              <p className=" font-serif text-stone-900">{data?.orderCode}</p>
            </div>
            <div className=" col-span-6 lg:col-span-3 flex flex-col">
              <p className=" font-serif text-stone-500">Order Date</p>
              <p className=" font-serif text-stone-900">{data?.date}</p>
            </div>
            <div className=" col-span-6 lg:col-span-3 flex flex-col ">
              <p className=" font-serif text-stone-500 lg:text-end">
                Total (Kyat)
              </p>
              <p className=" font-serif text-stone-900 lg:text-end">
                {new Intl.NumberFormat("ja-JP").format(data?.total)}
              </p>
            </div>
          </div>

          <div className=" bg-white rounded-xl p-5">
            <div className=" mb-4 border-b py-4 border-primary grid gap-4 grid-cols-5">
              <div className=" lg:col-span-4  col-span-full flex gap-3">
                <MapPin className=" w-5 h-5 stroke-primary" />
                <p>
                  {data?.customerAddress?.addressDetail},
                  {data?.customerAddress?.street}, {data?.customerAddress?.city}
                  ,{data?.customerAddress?.township}
                </p>
              </div>

              <div className=" col-span-full lg:col-span-1">
                <Button
                  onClick={() => router.push(`/order/${data?.id}`)}
                  className=" bg-gold-400 hover:bg-[#e2be6a]  col-span-1 lg:w-auto w-full rounded-full"
                >
                  View Detail
                </Button>
              </div>

              {show && (
                <div className=" flex col-span-full justify-between mt-3 items-center">
                  <div className=" flex flex-col gap-2">
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
                </div>
              )}
            </div>
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
          </div>
        </div>
      )}
    </>
  );
};

export default OrderComponent;
