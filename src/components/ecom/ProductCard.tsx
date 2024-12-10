"use client";
import React, { useEffect, useRef, useState } from "react";
import { Button } from "../ui/button";
import { usePathname, useRouter } from "next/navigation";
import { LucideHeart } from "lucide-react";
import { Badge } from "../ui/badge";
import Image from "next/image";
import { useAppProvider } from "@/app/Provider/AppProvider";
import useSWRMutation from "swr/mutation";
import { Backend_URL } from "@/lib/fetch";
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
import useSWR from "swr";
import { AiFillSafetyCertificate } from "react-icons/ai";
import { FaGoogle } from "react-icons/fa";

const ProductCard = ({
  id,
  name,
  productBrand,
  salePrice,
  medias,
  discountPrice,
  productCode,
  productVariants,
  productCategory,
}: {
  id: number;
  name: string;
  salePrice: number;
  productBrand: string;
  medias: any;
  discountPrice?: number;
  productCode: any;
  productVariants: any;
  productCategory?: string;
}) => {
  const router = useRouter();
  const app = usePathname();

  const handleClick = () => {
    let pathSegment = "";

    if (app.includes("categories")) {
      const cleanPath = app.split("?")[0];
      const parts = cleanPath.split("/");

      // Ensure there's a valid part to use

      pathSegment = parts[2];
    } else if (app.includes("brands")) {
      const match = app.match(/\/brands\/(.*?)(\/|$)/);

      // Ensure match is found and valid
      if (match && match[1]) {
        pathSegment = match[1];
      }
    } else if (app.includes("new-in") || app === "/") {
      pathSegment = "new-in";
    } else if (app.includes("women")) {
      pathSegment = "women";
    } else if (app.includes("men")) {
      pathSegment = "men";
    } else if (app.includes("unisex")) {
      pathSegment = "unisex";
    } else if (app.includes("products-filter")) {
      pathSegment = "filter-products";
    } else if (app.includes("search")) {
      pathSegment = "filter-products";
    }
    router.push(`/products/${pathSegment}/${id}`);
  };

  const { handleLogin, getSession } = useAppProvider();

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const postData = async (url: string, { arg }: { arg: any }) => {
    try {
      const token = isClient && (await getSession());
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "POST",
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

      return data;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const { data, trigger: add } = useSWRMutation(
    `${Backend_URL}/wishlist`,
    postData
  );

  const alertRef = useRef<HTMLButtonElement | null>(null);

  const addToWishList = async () => {
    if (isClient) {
      if (localStorage.getItem("userId")) {
        const data = {
          productId: id,
          salePrice: salePrice,
        };
        const res = await add(data);
      } else {
        alertRef.current?.click();
      }
    }
  };

  const getWishlistData = async (url: string) => {
    const token = isClient && (await getSession());

    if (!token) {
      throw new Error("No access token found");
    }

    const options: RequestInit = {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Accept: "multipart/form-data",
        Authorization: `Bearer ${token}`,
      },
    };

    const response = await fetch(url, options);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "An error occurred");
    }

    return data;
  };

  const {
    data: wishlistData,
    error: wishlistError,
    mutate,
  } = useSWR(`${Backend_URL}/wishlist`, getWishlistData);

  const [deleteId, setDeleteId] = useState<number | null>(null);

  const deleteData = async (url: string) => {
    try {
      const token = typeof window !== "undefined" && (await getSession());
      
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
    <div
      onClick={() => handleClick()}
      key={id}
      className=" cursor-pointer group duration-300 border-2 border-transparent hover:border-gold-400 hover:bg-gold-400/5 rounded-xl"
    >
      <div className=" relative ">
        <div className=" absolute top-3 flex items-center gap-3 left-3 text-sm font-serif  text-stone-900 opacity-0 group-hover:opacity-100">
          <span>Color </span>
          <div className=" flex gap-1">
            {productVariants
              .filter(
                (item: any, index: any, array: any) =>
                  index ===
                  array.findIndex((i: any) => i.colorCode === item.colorCode)
              )
              ?.map((el: any, index: number) => (
                <div
                  key={index}
                  style={{
                    backgroundImage: `url(${el?.mediaUrl})`,
                    backgroundSize: "200%",
                    backgroundPosition: "center",
                  }}
                  className=" size-5 bg-no-repeat border border-gold-400 rounded-full"
                ></div>
              ))}
          </div>
        </div>

        <Image
          src={medias[0]?.url}
          width={500}
          height={500}
          className=" h-[300px] lg:h-[500px] rounded-xl object-cover object-top duration-300 group-hover:scale-90 border border-transparent group-hover:border-stone-300 group-hover:translate-y-5 group-hover:shadow-2xl  group-active:scale-95"
          alt=""
        />
        <div className=" absolute top-3 right-3 bg-white duration-200 group-hover:bg-gold-400 flex items-center justify-center size-10 shadow-sm  rounded-full">
          <Button
            onClick={async (e) => {
              e.stopPropagation();
              if (
                wishlistData?.data
                  .flatMap((el: any) => el.wishlistRecords)
                  .map((el: any) => el?.productId)
                  .includes(id)
              ) {
                await setDeleteId(
                  wishlistData?.data
                    .flatMap((el: any) => el.wishlistRecords)
                    .find((el: any) => el?.productId == id)?.id
                );
                const res = await deleteItem();
                if (res) {
                  mutate();
                }
                return;
              } else {
                await addToWishList();
              }
            }}
            variant={"outline"}
            className=" h-6 w-6 p-0.5 !bg-transparent !border-none rounded-full"
            size={"sm"}
          >
            {wishlistData?.data
              .flatMap((el: any) => el.wishlistRecords)
              .map((el: any) => el?.productId)
              .includes(id) ? (
              <LucideHeart className="  fill-gold-400 stroke-gold-400 group-hover:fill-white group-hover:stroke-white" />
            ) : (
              <LucideHeart className="stroke-gold-400 group-hover:size-3 group-hover:fill-white duration-200 group-hover:animate-ping" />
            )}
          </Button>
        </div>

        <div className=" absolute w-full bottom-3">
          <div className=" w-[90%] mx-auto flex justify-between">
            <Badge className=" opacity-90 font-normal text-black bg-gold-400  rounded-full ">
              {productBrand}
            </Badge>
            {(discountPrice as number) > 0 && (
              <Badge className=" bg-red-500">{discountPrice}% OFF</Badge>
            )}
          </div>
        </div>
        {!productVariants && (
          <div className=" absolute capitalize top-2 left-0">
            <Badge
              variant={"destructive"}
              className=" opacity-90 text-[12px] rounded-none"
            >
              out of stock
            </Badge>
          </div>
        )}
      </div>

      <div className=" flex flex-col gap-1 p-[15px]">
        <div>
          <p className=" lg:text-xl font-serif text-sm mb-1 line-clamp-1">
            {name}
          </p>
          <div className=" flex gap-2 text-sm items-center">
            <AiFillSafetyCertificate className="  fill-gold-400 stroke-gold-400 size-3 lg:size-6" />
            <span className=" font-mono text-[11px] lg:text-base">
              {" "}
              {productCode}{" "}
            </span>
          </div>
        </div>

        {(discountPrice as number) > 0 ? (
          <div className=" space-y-[5px] text-stone-500 text-xs lg:text-base">
            <div className="lg:flex gap-2 items-center ">
              <p className=" line-through">
                {new Intl.NumberFormat("ja-JP").format(salePrice)}
              </p>
              <p className="">
                {new Intl.NumberFormat("ja-JP").format(
                  salePrice * (1 - (discountPrice as number) / 100)
                )}
                MMK
              </p>
            </div>
          </div>
        ) : (
          <p className=" text-stone-500 text-xs lg:text-base">
            {new Intl.NumberFormat("ja-JP").format(salePrice)} MMK
          </p>
        )}
      </div>

      <div onClick={(e) => e.stopPropagation()}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className=" hidden"
              onClick={(e) => e.stopPropagation()}
              ref={alertRef}
              variant="outline"
            >
              Add to wishlist
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=" flex justify-center">
                <Image width={300} height={300} src={"/svg2.svg"} alt="" />
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className=" mt-4 text-stone-800 text-lg text-center font-bold font-serif">
                  Your wishlist wants you to sign in first
                </p>
                <p className=" text-center"> Google got your back!</p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className=" mt-6 flex  !justify-center">
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button
                onClick={() => {
                  handleLogin();
                }}
                className=" bg-gold-400 hover:bg-[#e2be6a]  !py-4 rounded-full "
              >
                <FaGoogle className=" me-1" /> Login with Google
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default ProductCard;
