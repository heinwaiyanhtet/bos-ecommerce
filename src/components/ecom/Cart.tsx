"use client";

import React from "react";
import CartItem from "./CartItem";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import Image from "next/image";

const Cart = ({ closeRef }: any) => {
  const { cartItems, orderRecord } = useAppProvider();

  const totalCost = orderRecord.reduce(
    (pv: any, cv: any) => pv + cv.quantity * cv.priceAfterDiscount,
    0
  );

  const router = useRouter();

  return (
    <div className=" space-y-3 bg-white pt-4 z-50 overflow-auto h-[90%] relative">
      {orderRecord.length == 0 ? (
        <div className=" flex justify-center items-center flex-col gap-3 h-[80%]">
          <Image src="/svg6.svg" alt="Icon" width={300} height={300} />
          <p className=" text-stone-800 text-lg">
            Your cart&apos;s feeling empty
          </p>
          <p className=" text-stone-500 text-sm">
            Let&apos;s add some bold new outfits!
          </p>
        </div>
      ) : (
        <div className=" h-[75%] overflow-auto space-y-3">
          {orderRecord.map((data: any, index: number) => (
            <CartItem data={data} key={index} />
          ))}
        </div>
      )}

      <div className=" bg-white absolute bottom-3 w-full">
        <div className=" flex items-center bg-white pt-4 justify-between">
          <p>Total</p>
          <p>MMK {new Intl.NumberFormat("ja-JP").format(totalCost)}</p>
        </div>

        <hr className=" my-3" />

        <div className=" space-y-1">
          <Button
            onClick={() => closeRef.current && closeRef.current.click()}
            className=" underline w-full text-center text-stone-500"
            variant={"link"}
          >
            Continue Shopping
          </Button>

          <Button
            onClick={() => {
              router.push("/shopping-bag");
              closeRef.current && closeRef.current.click();
              console.log("object");
            }}
            disabled={orderRecord.length == 0}
            className=" bg-gold-400 hover:bg-[#e2be6a] rounded-full w-full "
          >
            Shopping Bag
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Cart;
