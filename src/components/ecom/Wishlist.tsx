"use client";

import React, { useEffect, useState } from "react";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Backend_URL } from "@/lib/fetch";
import Image from "next/image";
import { Trash, Trash2, X } from "lucide-react";
import { Badge } from "../ui/badge";
import useSWRMutation from "swr/mutation";
import { AiFillSafetyCertificate } from "react-icons/ai";
import svg1 from "@/public/svg1.svg";
import { getSession } from "next-auth/react";

const WishList = ({ closeRef, wishlistData, mutate }: any) => {
  const router = useRouter();

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const getData = async (url: string) => {
    try {
      const token = typeof window !== "undefined" && getSession();
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

  const getFetch = (url: string) => {
    return getData(url);
  };

  const deleteData = async (url: string) => {
    try {
      const token = typeof window !== "undefined" && getSession();
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "DELETE",
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

  const { trigger: deleteItem } = useSWRMutation(
    deleteId !== null ? `${Backend_URL}/wishlist/${deleteId}` : null,
    deleteData
  );

  return (
    <div className=" space-y-3 bg-white pt-4 z-50 overflow-auto h-[90%] relative">
      {wishlistData?.flatMap((el: any) => el.wishlistRecords).length == 0 ? (
        <div className=" flex justify-center items-center flex-col gap-3 h-[80%]">
          <Image src="/svg5.svg" alt="Icon" width={300} height={300} />
          <p className=" text-stone-800 text-lg">
            Your wishlist is missing something
          </p>
          <p className=" text-stone-500 text-sm">
            Like, all the clothes! Let&apos;s change that!
          </p>
        </div>
      ) : (
        <div className=" h-[90%] overflow-auto  flex flex-col gap-4">
          {wishlistData
            ?.flatMap((el: any) => el.wishlistRecords)
            .map((data: any, index: number) => (
              <div
                key={index}
                className=" border-b group cursor-pointer last:border-b-0 pb-4 grid grid-cols-3 "
                onClick={() => {
                  router.push(`/products/wishlist/${data?.productId}`);
                  closeRef.current.click();
                }}
              >
                <div className=" col-span-1">
                  <div className=" border rounded-xl border-gold-400">
                    <Image
                      src={data?.image?.url}
                      width={500}
                      height={500}
                      className=" h-[170px] lg:h-[200px] rounded-xl object-cover object-top duration-300"
                      alt=""
                    />
                  </div>
                </div>

                <div className=" col-span-2">
                  <div className=" flex flex-col gap-1 p-[15px]">
                    <div>
                      <p className=" lg:text-xl font-serif text-sm mb-1 line-clamp-1">
                        {data.productName}
                      </p>
                      <div className=" flex gap-2 text-sm items-center">
                        <AiFillSafetyCertificate className="  fill-gold-400 stroke-gold-400 size-3 lg:size-6" />
                        <span className=" font-mono text-[11px] my-3 lg:text-base">
                          {" "}
                          {data.productCode}{" "}
                        </span>
                      </div>
                    </div>

                    {(data.discountPrice as number) > 0 ? (
                      <div className=" space-y-[5px] text-stone-500 text-xs lg:text-base">
                        <div className="lg:flex gap-2 items-center ">
                          <p className=" line-through">
                            {new Intl.NumberFormat("ja-JP").format(
                              data.pricing
                            )}
                          </p>
                          <p className="">
                            {new Intl.NumberFormat("ja-JP").format(
                              data.pricing *
                                (1 - (data.discountPrice as number) / 100)
                            )}
                            MMK
                          </p>
                        </div>
                      </div>
                    ) : (
                      <p className=" text-stone-500 text-xs lg:text-base">
                        {new Intl.NumberFormat("ja-JP").format(data.pricing)}{" "}
                        MMK
                      </p>
                    )}

                    <div className=" flex gap-3 mt-3 items-center">
                      <Button
                        onClick={async (e) => {
                          e.stopPropagation();
                          await setDeleteId(data?.id);
                          const res = await deleteItem();
                          if (res) {
                            mutate();
                          }
                        }}
                        className=" text-start underline justify-start p-0 lg:text-xs text-[11px] text-stone-400"
                        variant={"link"}
                      >
                        Remove
                      </Button>

                      <Button
                        className=" bg-gold-400 hover:bg-[#e2be6a] rounded-full text-xs "
                        size={"sm"}
                      >
                        See More
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      )}

      <div className=" bg-white absolute bottom-0 w-full">
        <div className=" space-y-1">
          <Button
            onClick={() => closeRef.current && closeRef.current.click()}
            className=" w-full rounded-full bg-gold-400 hover:bg-[#e2be6a] text-center"
          >
            Continue Shopping
          </Button>
        </div>
      </div>
    </div>
  );
};

export default WishList;
