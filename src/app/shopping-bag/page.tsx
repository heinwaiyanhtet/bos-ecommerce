"use client";
import { Container } from "@/components/ecom";
import React, { use, useEffect, useState } from "react";
import { LucideChevronRight, Minus, PlusIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAppProvider } from "../Provider/AppProvider";
import Image from "next/image";
import OrderSummary from "@/components/ecom/OrderSummary";
import { useRouter } from "next/navigation";
import SweetAlert2 from "react-sweetalert2";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWR from "swr";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
} from "@/components/ui/carousel";
import Autoplay from "embla-carousel-autoplay";
import Terms from "@/components/ecom/Terms";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { AiFillSafetyCertificate } from "react-icons/ai";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

const ShoppingBag = () => {
  const {
    cartItems,
    setCartItems,
    handleLogin,
    orderRecord,
    setOrderRecord,
    removeFromCart,
  } = useAppProvider();

  const router = useRouter();

  const [isClient, setIsClient] = useState(false);
  useEffect(() => {
    setIsClient(true);
  }, []);

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  const handleClick = () => {
    if (isClient) {
      if (localStorage.getItem("userId")) {
        router.push("/checkout");
      } else {
        setSwalProps({
          ...swalProps,
          show: true,
        });
      }
    }
  };

  const totalCost = orderRecord.reduce(
    (pv: any, cv: any) => pv + cv.quantity * cv.priceAfterDiscount,
    0
  );

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, isLoading, error } = useSWR(
    `${Backend_URL}/landscape-banners`,
    getData
  );

  return (
    <Container className=" space-y-3 py-12">
      {/* <p className=" text-sm my-[15px]">Shopping Bag </p> */}

      <div className=" flex flex-col gap-4">
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
                onClick={() => router.push("/shopping-bag")}
                className=" cursor-pointer !text-stone-500"
              >
                Shopping Bag
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>
      <div className=" flex lg:flex-row flex-col justify-between items-start gap-8">
        <div className=" lg:basis-8/12">
          <p className=" text-xl lg:text-3xl mb-10 capitalize font-semibold">
            Shopping Bag
          </p>

          <div className=" grid grid-cols-12 grid-rows-2 lg:gap-4">
            {orderRecord?.map((data: any, index: number) => (
              <div key={index} className=" col-span-full ">
                <div>
                  <div className=" grid grid-cols-6 lg:grid-cols-12 gap-4">
                    <div className=" row-span-2 col-span-2">
                      <div className=" border rounded-xl border-gold-400">
                        <Image
                          src={data?.photo}
                          width={300}
                          className="  h-[200px] w-full rounded-xl object-cover object-top duration-300"
                          height={300}
                          alt=""
                        />
                      </div>
                    </div>

                    <div className=" row-span-1 lg:row-span-2 col-span-4">
                      <div className="">
                        <div className="">
                          <p className=" mb-2 lg:text-xl font-serif text-sm line-clamp-1">
                            {data?.name}
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
                            {data.productBrand}
                          </Badge>

                          <Badge className=" opacity-90 font-normal text-nowrap text-white bg-stone-400 rounded-full ">
                            {data.productFitting}
                          </Badge>

                          <Badge className=" opacity-90 font-normal text-white text-nowrap bg-stone-400 rounded-full ">
                            {data.productSizing}
                          </Badge>

                          <div className=" flex gap-2">
                            <div
                              style={{
                                backgroundImage: `url(${data.photo})`,
                              }}
                              className=" size-6 bg-red-900 border border-gold-400 rounded-full bg-cover bg-center"
                            ></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className=" row-span-1 col-span-2 lg:col-span-3">
                      <div className=" flex gap-3 text-end flex-col items-end">
                        <p className="text-neutral-500 text-xs">Quantity</p>
                        <div className=" rounded-md mb-3 flex items-center">
                          <Button
                            className="rounded-full size-5 hover:text-gold-400 hover:border-gold-400 p-0 bg-transparent active:scale-90 duration-300 hover:bg-transparent border-2 border-stone-700 text-lg text-stone-700 d-flex justify-items-center"
                            onClick={() => {
                              if (data?.quantity > 1) {
                                setOrderRecord(
                                  orderRecord.map((item: any) => {
                                    if (item.itemId === data.itemId) {
                                      return {
                                        ...item,
                                        quantity: item.quantity - 1,
                                      };
                                    }
                                    return item;
                                  })
                                );
                              } else {
                                removeFromCart(data?.itemId);
                              }
                            }}
                          >
                            <Minus size={16} />
                          </Button>

                          <p className=" text-center w-[2rem]">
                            {data.quantity}
                          </p>

                          <Button
                            className="rounded-full hover:border-gold-400 hover:text-gold-400 size-5 p-0 bg-transparent active:scale-90 duration-300 hover:bg-transparent border-2 border-stone-700 text-lg text-stone-700 d-flex justify-items-center"
                            onClick={() => {
                              if (data?.availableQuantity > data?.quantity) {
                                const newOrderRecord = orderRecord.map(
                                  (item: any) => {
                                    if (item.itemId === data.itemId) {
                                      return {
                                        ...item,
                                        quantity: item.quantity + 1,
                                      };
                                    }
                                    return item;
                                  }
                                );
                                setOrderRecord(
                                  newOrderRecord.filter(
                                    (item: any) => item.quantity !== 0
                                  )
                                );
                              } else {
                                toast.warning("No More item!", {
                                  duration: 2000,
                                });
                              }
                            }}
                          >
                            <PlusIcon size={16} />
                          </Button>
                        </div>
                      </div>
                    </div>

                    <div className=" row-span-1 col-span-2 lg:col-span-3 text-end">
                      <p className="text-neutral-500 mb-3 text-xs">Price</p>

                      {(data.discount as number) > 0 ? (
                        <div className=" space-y-1 mb-2 text-xs lg:text-sm">
                          <Badge className=" text-black font-normal h-4 text-xs bg-neutral-300">
                            {data.discount}%
                          </Badge>

                          <div className="items-center">
                            <p className=" py-2 line-through">
                              {new Intl.NumberFormat("ja-JP").format(
                                data.quantity * data.salePrice
                              )}{" "}
                              MMK
                            </p>
                            <p className="text-xs lg:text-sm">
                              {new Intl.NumberFormat("ja-JP").format(
                                data?.quantity * data.priceAfterDiscount
                              )}
                              MMK
                            </p>
                          </div>
                        </div>
                      ) : (
                        <p className=" mb-2 text-xs lg:text-base">
                          {new Intl.NumberFormat("ja-JP").format(
                            data?.quantity * data.salePrice
                          )}{" "}
                          MMK
                        </p>
                      )}
                    </div>

                    <div className=" row-span-1 col-span-6">
                      <div className=" flex gap-3 w-full justify-end items-center">
                        <Button
                          className=" text-start underline justify-start p-0 lg:text-xs text-[11px] text-stone-400"
                          variant={"link"}
                          onClick={() => {
                            removeFromCart(data.itemId);
                          }}
                        >
                          Remove
                        </Button>

                        <Button
                          className=" bg-gold-400 hover:bg-[#e2be6a] rounded-full text-xs "
                          size={"sm"}
                          onClick={() =>
                            router.push(`/products/wishlist/${data?.productId}`)
                          }
                        >
                          See More
                        </Button>
                      </div>
                    </div>
                  </div>
                  <hr className=" my-5" />
                </div>
              </div>
            ))}
          </div>
          <div className=" hidden lg:block">
            <Terms />
          </div>
        </div>

        <div className=" h-auto w-full lg:basis-4/12">
          <div className="lg:top-0 mb-3 lg:mb-0 lg:sticky">
            <OrderSummary
              disabled={orderRecord.length == 0}
              buttonName="Proceed to checkout"
              cost={totalCost}
              run={handleClick}
            />
          </div>
          <div className=" block lg:hidden">
            <Terms />
          </div>
        </div>
      </div>

      <div className=" grid grid-cols-12 my-12 gap-4">
        <div className=" col-span-full">
          <Carousel
            plugins={[
              Autoplay({
                delay: 1500,
              }),
            ]}
            className="w-full"
          >
            <CarouselContent>
              {error || isLoading ? (
                <CarouselItem className=" h-[400px] lg:h-[600px] flex justify-center items-center lg:w-[1260px]  bg-neutral-600"></CarouselItem>
              ) : (
                <>
                  {data?.data.map(({ id, desktopImage, mobileImage }: any) => (
                    <CarouselItem
                      key={id}
                      className=" h-full w-full flex justify-center items-center "
                    >
                      <Image
                        src={desktopImage}
                        className=" hidden lg:block w-full object-contain h-[500px]"
                        alt="banner photo"
                        width={800}
                        height={800}
                      />
                      <Image
                        src={mobileImage}
                        className=" lg:hidden block w-full object-contain h-full"
                        alt="banner photo"
                        width={800}
                        height={800}
                      />
                    </CarouselItem>
                  ))}
                </>
              )}
            </CarouselContent>
          </Carousel>
        </div>
      </div>

      {isClient && (
        <SweetAlert2
          customClass={{
            popup: "w-auto",
          }}
          {...swalProps}
        >
          <div className=" pointer-events-none space-y-3 text-center">
            <p className=" pointer-events-none font-medium">
              Proceed To Checkout
            </p>

            <p className=" pointer-events-none text-black/50 text-sm">
              Please Login To Continue.
            </p>

            <div className=" pointer-events-none flex gap-3 justify-center items-center">
              <Button
                onClick={(e) => {
                  e.stopPropagation();
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                }}
                size={"sm"}
                className="  pointer-events-auto"
                variant={"outline"}
              >
                Cancel
              </Button>
              <Button
                onClick={(e) => {
                  handleLogin();
                  e.stopPropagation();
                  setSwalProps({
                    ...swalProps,
                    show: false,
                  });
                }}
                size={"sm"}
                className="  pointer-events-auto"
              >
                Sign In
              </Button>
            </div>
          </div>
        </SweetAlert2>
      )}
    </Container>
  );
};

export default ShoppingBag;
