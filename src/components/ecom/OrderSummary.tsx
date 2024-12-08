"use client";
import React, { useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Tag, Ticket } from "lucide-react";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import { useRouter } from "next/navigation";

const OrderSummary = ({
  cost,
  run,
  buttonName,
  disabled,
}: {
  cost: number;
  run: () => void;
  buttonName: string;
  disabled: boolean;
}) => {
  const {
    couponCode,
    setCouponCode,
    inputValue,
    setInputValue,
    validCoupon,
    setValidCoupon,
    couponDiscount,
    setCouponDiscount,
    error,
    setError,
    totalCost,
    orderRecord,
  } = useAppProvider();

  const getData = (url: string) => getFetchForEcom(url);

  const { data: couponData, error: fetchError } = useSWR(
    couponCode !== "" ? `${Backend_URL}/coupon/${couponCode}` : null,
    getData
  );

  useEffect(() => {
    if (fetchError) {
      setError("Invalid Coupon");
      setValidCoupon(false);
      setCouponDiscount(0);
    }
  }, [fetchError]);

  useEffect(() => {
    if (couponData) {
      setValidCoupon(true);
      setCouponDiscount(couponData.discount);
      setError("");
    } else {
      if (couponData) setError("Invalid coupon code.");
      setValidCoupon(false);
      setCouponDiscount(0);
    }
  }, [couponData]);
  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (inputValue !== "") {
      setCouponCode(inputValue);
    }
  };

  const router = useRouter();

  return (
    <div className=" p-5  w-full border-gold-400 border rounded-xl">
      {buttonName !== "Place Order" && (
        <>
          <p className="text-2xl font-bold font-serif mb-3">Discount Coupon</p>

          <div className=" mb-6">
            <form onSubmit={handleApplyCoupon}>
              <div className="flex border border-gold-400 rounded-md items-center px-3">
                <Input
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  className="w-full border-none h-9 bg-transparent rounded-none focus:outline-none p-0 focus:border-0 focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
                  placeholder="Coupon Code"
                  disabled={validCoupon}
                />

                <Button
                  size={"sm"}
                  className="h-6 text-xs bg-gold-400"
                  disabled={validCoupon || inputValue === ""}
                >
                  Apply
                </Button>
              </div>

              {validCoupon && (
                <Button
                  size={"sm"}
                  variant={"link"}
                  onClick={() => {
                    setInputValue("");
                    setCouponCode("");
                    router.refresh();
                  }}
                  className=" w-full text-end justify-end"
                >
                  Remove
                </Button>
              )}
            </form>

            {error && <p className="text-red-500 mt-2.5 text-sm">{error}</p>}
          </div>
        </>
      )}

      <p className="text-2xl font-bold font-serif mb-3">Order Summary</p>

      <div className="flex justify-between mb-3">
        <p>Total</p>
        <p>
          {new Intl.NumberFormat("ja-JP").format(
            orderRecord.reduce((pv: number, cv: any) => {
              return pv + cv.priceAfterDiscount * cv.quantity;
            }, 0)
          )}
        </p>
      </div>

      <div className="text-sm space-y-4">
        {/* {orderRecord?.length === 0 ? (
          <div className="flex justify-between">
            <p>Price</p>
            <p>0</p>
          </div>
        ) : (
          orderRecord?.map(
            (
              { name, priceAfterDiscount, productSizing, quantity }: any,
              index: number
            ) => (
              <div key={index} className="flex justify-between">
                <p>
                  {name} ({productSizing}) x {quantity}
                </p>
                <p>
                  {new Intl.NumberFormat("ja-JP").format(
                    quantity * priceAfterDiscount
                  )}
                </p>
              </div>
            )
          )
        )} */}

        <div className="flex justify-between">
          <p>Applied Coupon</p>
          <i>{validCoupon ? couponCode : "-"}</i>
        </div>

        <div className="flex justify-between">
          <p>Coupon Discount</p>
          <p>{validCoupon ? `${couponDiscount}%` : "-"}</p>
        </div>

        <hr className="border-1.5" />

        <div className="flex justify-between">
          <p>Subtotal</p>
          <p>{new Intl.NumberFormat("ja-JP").format(totalCost)}</p>
        </div>

        <div className="flex justify-between">
          <p>Delivery</p>
          <p>Free</p>
        </div>

        <hr className="border-1.5" />

        <Button
          disabled={disabled}
          onClick={() => run()}
          className=" bg-gold-400 hover:bg-[#e2be6a] rounded-full w-full "
        >
          {buttonName}
        </Button>
      </div>
    </div>
  );
};

export default OrderSummary;
