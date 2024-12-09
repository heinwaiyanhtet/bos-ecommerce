"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import { BreadCrumbComponent, Container } from "@/components/ecom";
import HotDealAlert from "@/components/ecom/HotDealAlert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Backend_URL, getFetch, getFetchForEcom } from "@/lib/fetch";
import { DashIcon } from "@radix-ui/react-icons";
import {
  Heart,
  LucideArrowLeft,
  LucideArrowRight,
  LucideHeart,
  Minus,
  PlusIcon,
  X,
} from "lucide-react";
import Image from "next/image";
import React, { useEffect, useRef, useState } from "react";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { type CarouselApi } from "@/components/ui/carousel";
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
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import CommentSection from "./CommentSection";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "../ui/breadcrumb";
import { useRouter } from "next/navigation";
import LightGallery from "lightgallery";
// import LightGallery from "lightgallery.js";
import lgZoom from "lightgallery/plugins/zoom";
import lgVideo from "lightgallery/plugins/video";
import { AiFillSafetyCertificate } from "react-icons/ai";
import Autoplay from "embla-carousel-autoplay";
import { toast } from "sonner";
import { FaGoogle } from "react-icons/fa";

type orderItem = {
  itemId: number;
  name: string;
  variantId: number;
  colorCode: string;
  photo: string;
  priceAfterDiscount?: number;
  quantity: number;
  discount?: number;
  salePrice: number;
  productSizing: string;
  amountSaved?: number;
  ids: any;
  availableQuantity: number;
  availableIds: number[];
  productId: number;
  productBrand: string;
  productFitting: string;
  productCode: string;
};

const ProductDetail = ({
  id,
  pathSegment,
}: {
  id: string;
  pathSegment: string;
}) => {
  const [selectedColor, setSelectedColor] = useState<string>("");
  const [images, setImages] = useState<string[]>([]);
  const [availableSizes, setAvailableSizes] = useState<any[]>([]);
  const [selectedSize, setSelectedSize] = useState<string>("");
  const [quantity, setQuantity] = useState<number>(1);
  const [totalAvailable, setTotalAvailable] = useState<number>(0);
  const [onlyLeft, setOnlyLeft] = useState<string>("");
  const [variantId, setVariantId] = useState<number | undefined>();
  const [imageToShow, setImagesToShow] = useState<any[]>([]);
  const [toastText, setToastText] = useState("");
  const btn = useRef<HTMLButtonElement | null>(null);

  const { orderRecord, setOrderRecord, handleLogin, getSession } =
    useAppProvider();

  const getData = (url: string) => getFetchForEcom(url);

  const {
    data: productData,
    isLoading,
    error,
  } = useSWR(`${Backend_URL}/ecommerce-products/${id}`, getData);

  const getWishlistData = async (url: string) => {
    const token = await getSession();

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

  const { data: wishlistData, mutate } = useSWR(
    `${Backend_URL}/wishlist`,
    getWishlistData
  );

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  const addToCart = async () => {
    const dataToDisplay = productData?.productVariants.find(
      (el: any) => el.id === variantId
    );
    const availableIds = productData?.productVariants
      .filter(
        (el: any) =>
          el.productSizing == selectedSize && el.colorCode == selectedColor
      )
      .map((el: any) => el.id);

    if (dataToDisplay) {
      const existsInOrder = orderRecord
        ?.map((el: any) => el.variantId)
        .includes(variantId);

      if (!existsInOrder) {
        const records: orderItem[] = dataToDisplay
          ? [
              {
                itemId: Date.now(),
                productId: productData?.id as number,
                name: productData?.name as string,
                quantity: quantity,
                salePrice: productData?.salePrice as number,
                colorCode: dataToDisplay.colorCode,
                productSizing: dataToDisplay.productSizing,
                variantId: dataToDisplay.id,
                photo: dataToDisplay.mediaUrl,
                discount: productData?.discountPrice,
                priceAfterDiscount:
                  productData?.salePrice *
                  (1 - (productData?.discountPrice as number) / 100),
                amountSaved:
                  productData?.salePrice -
                  productData?.salePrice *
                    (1 - (productData?.discountPrice as number) / 100),
                ids: [dataToDisplay.id],
                availableQuantity: totalAvailable,
                availableIds: availableIds,
                productBrand: productData?.productBrand,
                productFitting: productData?.productFitting,
                productCode: productData?.productCode,
              },
            ]
          : [];

        setOrderRecord([...orderRecord, ...records]);
        await setToastText(`${productData?.name} is added to cart`);
        btn.current?.click();
      }
    }
  };

  useEffect(() => {
    if (productData) {
      const initialVariant = productData?.productVariants[0];
      setSelectedColor(initialVariant?.colorCode);

      const initialSize = productData?.productVariants?.find(
        (variant: any) => variant.colorCode === initialVariant.colorCode
      )?.productSizing as string;

      setSelectedSize(initialSize);

      setImagesToShow(productData.mediaUrls.map((el: any) => el?.url));

      const sizes = new Set(
        productData?.productVariants
          ?.filter(
            (variant: any) => variant.colorCode === initialVariant.colorCode
          )
          ?.map((variant: any) => variant?.productSizing as string)
      );

      const sizesArray = Array.from(sizes);

      setAvailableSizes(sizesArray);

      setVariantId(initialVariant?.id);
    }
  }, [productData]);

  useEffect(() => {
    if (productData)
      setTotalAvailable(
        productData?.productVariants?.filter(
          (variant: any) =>
            variant.colorCode === selectedColor &&
            variant.productSizing === selectedSize
        ).length
      );
  }, [selectedColor, selectedSize]);

  const handleColorChange = (colorCode: string) => {
    setSelectedColor(colorCode);

    const filteredSizes = new Set<string>(
      productData?.productVariants
        .filter((variant: any) => variant.colorCode === colorCode)
        .map((variant: any) => variant?.productSizing as string)
    );

    const sizesArray = Array.from(filteredSizes);

    setAvailableSizes(sizesArray);

    setSelectedSize(sizesArray[0] || "");
    setQuantity(1);
    setOnlyLeft("");
  };

  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const alertRef = useRef<HTMLButtonElement | null>(null);

  const postData = async (url: string, { arg }: { arg: any }) => {
    const token = isClient && getSession();

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
  };

  const {
    data: addWishListData,
    trigger: addWishList,
    error: addError,
  } = useSWRMutation(`${Backend_URL}/wishlist`, postData);

  const addToWishList = async () => {
    if (isClient) {
      if (localStorage.getItem("userId")) {
        const data = {
          productId: productData?.id,
          salePrice: productData?.salePrice,
        };
        const res = await addWishList(data);
        res;
      } else {
        alertRef.current && alertRef.current.click();
      }
    }
  };

  const [deleteId, setDeleteId] = useState<number | null>(null);

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

      // Check if the response has JSON content
      const contentType = response.headers.get("content-type");
      let data;
      if (contentType && contentType.includes("application/json")) {
        data = await response.json();
      } else {
        // If it's not JSON, treat it as text
        data = await response.text();
      }

      // Check if response was successful
      if (!response.ok) {
        const errorMessage = data.message || data || "An error occurred";
        throw new Error(errorMessage);
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

  const { data: dealData, isLoading: isDealLoading } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle?sortCategory=${
      productData?.productCategory?.id
    }?limit=${12}`,
    getData
  );

  const router = useRouter();

  const galleryRef = useRef<HTMLDivElement>(null);
  const galleryRef2 = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (galleryRef.current) {
      const galleryInstance = new (LightGallery as any)(galleryRef.current, {
        mode: "lg-fade",
        plugins: [lgZoom, lgVideo],
        pager: false,
        thumbnail: false,
        galleryId: "nature",
        elementClassNames: "gallery",
        mobileSettings: {
          controls: false,
          showCloseIcon: true,
          download: false,
          rotate: false,
        },
      });

      return () => {
        galleryInstance.destroy();
      };
    }
  }, [imageToShow]);

  useEffect(() => {
    if (galleryRef2.current) {
      const galleryInstance2 = new (LightGallery as any)(galleryRef2.current, {
        mode: "lg-fade",
        plugins: [lgZoom, lgVideo],
        pager: false,
        thumbnail: false,
        galleryId: "nature",
        elementClassNames: "gallery",
        mobileSettings: {
          controls: false,
          showCloseIcon: true,
          download: false,
          rotate: false,
        },
      });

      return () => {
        galleryInstance2.destroy();
      };
    }
  }, [imageToShow]);

  const [api, setApi] = React.useState<CarouselApi>();
  const [current, setCurrent] = React.useState(0);
  const [count, setCount] = React.useState(0);

  React.useEffect(() => {
    if (!api) {
      return;
    }

    setCount(api.scrollSnapList().length);
    setCurrent(api.selectedScrollSnap() + 1);

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap() + 1);
    });
  }, [api]);

  const next = useRef<HTMLButtonElement | null>(null);
  const previous = useRef<HTMLButtonElement | null>(null);

  const scrollToSlide = (index: number) => {
    api && api.scrollTo(index);
  };

  return (
    <>
      {isLoading ? (
        // skeleton loader
        <Container>
          <div className="space-y-5">
            {/* Error Message */}
            {addError && (
              <p className="text-red-500 text-sm">{addError.message}</p>
            )}

            <div className="grid lg:grid-cols-12 pt-12 gap-5">
              <div className=" col-span-6">
                <div className=" grid grid-cols-6 gap-5">
                  <div className="col-span-1">
                    {isLoading ? (
                      <div className="space-y-3">
                        {[...Array(3)].map((_, index) => (
                          <div
                            key={index}
                            className="aspect-square w-full h-[100px] bg-neutral-200 animate-pulse rounded-xl"
                          ></div>
                        ))}
                      </div>
                    ) : (
                      imageToShow?.length > 0 && (
                        <div
                          style={{ position: "sticky", top: "0" }}
                          className="flex flex-col items-center justify-center gap-3"
                        >
                          {imageToShow.map((el, index) => (
                            <Image
                              src={el}
                              key={index}
                              onClick={() => scrollToSlide(index)}
                              alt=""
                              className="aspect-square object-cover object-top w-full border border-gold-400 rounded-xl"
                              width={300}
                              height={300}
                            />
                          ))}
                        </div>
                      )
                    )}
                  </div>

                  {/* Main Carousel */}
                  <div className="lg:col-span-5 h-[600px]">
                    <div className="relative group border overflow-hidden border-gold-400 rounded-xl">
                      {isLoading ? (
                        <div className="w-full h-[600px] bg-neutral-200 animate-pulse"></div>
                      ) : (
                        <Carousel
                          setApi={setApi}
                          plugins={[Autoplay({ delay: 4000 })]}
                          className="w-full h-[600px]"
                        >
                          <CarouselContent>
                            {imageToShow.map((el, index) => (
                              <CarouselItem
                                key={index}
                                className="rounded-xl w-full flex h-[600px] justify-center items-center"
                              >
                                <Image
                                  src={el}
                                  className="w-full rounded-xl h-[600px] object-cover object-top"
                                  alt="banner photo"
                                  width={800}
                                  height={800}
                                />
                              </CarouselItem>
                            ))}
                          </CarouselContent>
                        </Carousel>
                      )}

                      {/* Carousel Controls */}
                      {!isLoading && (
                        <div className="bg-white/90 translate-y-full group-hover:translate-y-0 duration-300 absolute bottom-0 w-full p-5 flex gap-2">
                          <Button
                            className="rounded-full size-10 p-0 bg-transparent hover:bg-[#c4a35820] border-2 border-gold-400 text-lg text-gold-400"
                            onClick={() =>
                              previous.current && previous.current.click()
                            }
                          >
                            <LucideArrowLeft className="size-5" />
                          </Button>
                          <div className="py-2 text-center text-gold-400 text-sm">
                            Slide {current} of {imageToShow.length}
                          </div>
                          <Button
                            className="rounded-full size-10 p-0 bg-transparent hover:bg-[#c4a35820] border-2 border-gold-400 text-lg text-gold-400"
                            onClick={() => next.current && next.current.click()}
                          >
                            <LucideArrowRight className="size-5" />
                          </Button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
              {/* Sidebar Images */}

              {/* Product Details */}
              <div className="lg:col-span-6">
                <div className="flex flex-col gap-3 mb-5 h-[600px]">
                  {/* Breadcrumb */}
                  <div className="flex justify-between mb-2.5">
                    {isLoading ? (
                      <div className="w-24 h-5 bg-neutral-200 animate-pulse rounded"></div>
                    ) : (
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbPage
                              onClick={() => router.push("/")}
                              className="text-xs cursor-pointer"
                            >
                              Home
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator>/</BreadcrumbSeparator>
                          <BreadcrumbItem>
                            <BreadcrumbPage
                              onClick={() => router.back()}
                              className="capitalize text-xs cursor-pointer"
                            >
                              {decodeURIComponent(pathSegment)}
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                        </BreadcrumbList>
                      </Breadcrumb>
                    )}
                  </div>

                  {/* Product Title */}
                  <div className="h-8 w-1/2 bg-neutral-200 animate-pulse rounded"></div>

                  {/* Price Section */}
                  <div className="flex flex-col mb-5 gap-[9px]">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-neutral-200 animate-pulse rounded"></div>
                      <div className="h-4 w-32 bg-neutral-200 animate-pulse rounded"></div>
                    </div>
                  </div>

                  <div className="flex flex-col mb-5 gap-[9px]">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-neutral-200 animate-pulse rounded"></div>
                      <div className=" flex justify-start gap-3">
                        <div className=" size-6 bg-neutral-200 animate-pulse rounded-full"></div>
                        <div className=" size-6 bg-neutral-200 animate-pulse rounded-full"></div>
                        <div className=" size-6 bg-neutral-200 animate-pulse rounded-full"></div>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col mb-5 gap-[9px]">
                    <div className="space-y-2">
                      <div className="h-4 w-24 bg-neutral-200 animate-pulse rounded"></div>
                      <div className=" grid grid-cols-3 w-[60%] gap-3">
                        <div className="h-6  col-span-1 bg-neutral-200 animate-pulse rounded"></div>
                        <div className="h-6  col-span-1 bg-neutral-200 animate-pulse rounded"></div>
                        <div className="h-6  col-span-1 bg-neutral-200 animate-pulse rounded"></div>
                        <div className="h-6  col-span-1 bg-neutral-200 animate-pulse rounded"></div>
                        <div className="h-6  col-span-1 bg-neutral-200 animate-pulse rounded"></div>
                        <div className="h-6  col-span-1 bg-neutral-200 animate-pulse rounded"></div>
                      </div>
                    </div>
                  </div>

                  {/* Quantity & Add to Cart */}
                  <div className="mt-auto">
                    <p className="text-neutral-500 mb-2 mt-5 text-xs">
                      Quantity
                    </p>
                    <div className="rounded-md mb-3 flex items-center">
                      <Button
                        className="rounded-full size-7 p-0 bg-transparent hover:text-gold-400 hover:border-gold-400 border-2 border-stone-700 text-lg text-stone-700"
                        onClick={() => {
                          if (quantity !== 1) setQuantity(quantity - 1);
                        }}
                      >
                        <Minus size={16} />
                      </Button>
                      <p className="text-center w-[2rem]">{quantity}</p>
                      <Button
                        className="rounded-full size-7 p-0 bg-transparent hover:border-gold-400 hover:text-gold-400 border-2 border-stone-700 text-lg text-stone-700"
                        onClick={() => setQuantity(quantity + 1)}
                      >
                        <PlusIcon size={16} />
                      </Button>
                    </div>
                    <Button
                      size={"lg"}
                      onClick={addToCart}
                      disabled={productData?.productVariants.length < 1}
                      className=" lg:w-[40%] w-full !h-[52px]"
                    >
                      Add to cart
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      ) : (
        <>
          <div className=" px-2 mt-12 lg:px-4 flex lg:flex-row flex-col lg:max-w-[1280px] min-w-[414px] mx-auto justify-center gap-2 lg:gap-4">
            <div className=" basis-full lg:basis-5/12 lg:mb-0 mb-4 ">
              <div className=" top-[130px] sticky">
                <div className=" grid grid-cols-6 gap-2 lg:gap-4">
                  <div className=" col-span-1 lg:col-span-1">
                    {imageToShow?.length > 0 && (
                      <div
                        style={{ position: "sticky", top: "0" }}
                        className=" flex flex-col  items-center justify-center gap-2 lg:gap-4"
                        ref={galleryRef}
                      >
                        {imageToShow.map((el, index) => (
                          <a
                            href={el}
                            key={index}
                            data-lg-size="1600-2400"
                            className="gallery__item w-screen lg:w-auto h-full lg:h-auto"
                          >
                            <Image
                              src={el}
                              alt=""
                              className=" aspect-square object-cover object-top !w-full border border-gold-400 rounded-xl "
                              width={300}
                              height={300}
                            />
                          </a>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="lg:col-span-5 col-span-5">
                    <div className="relative group border duration-300 overflow-hidden border-gold-400 rounded-xl">
                      <Carousel
                        setApi={setApi}
                        plugins={[
                          Autoplay({
                            delay: 4000,
                          }),
                        ]}
                        className="w-full h-[600px]"
                      >
                        <CarouselContent>
                          {error || isLoading ? (
                            <CarouselItem className=" flex justify-center items-center  bg-neutral-200 animate-pulse"></CarouselItem>
                          ) : (
                            <div ref={galleryRef2}>
                              {imageToShow.map((el: any, index: number) => (
                                <a
                                  href={el}
                                  key={index}
                                  data-lg-size="1600-2400"
                                  className="gallery__item w-screen lg:w-auto h-full lg:h-auto"
                                >
                                  <CarouselItem
                                    key={index}
                                    className=" rounded-xl w-full h-[600px] justify-center items-center "
                                  >
                                    <Image
                                      src={el}
                                      alt=""
                                      className="img-responsive object-contain object-top !w-full h-full lg:h-auto"
                                      width={800}
                                      height={800}
                                    />
                                  </CarouselItem>
                                </a>
                              ))}
                            </div>
                          )}
                        </CarouselContent>

                        <div className=" hidden">
                          <CarouselNext ref={next} />
                          <CarouselPrevious ref={previous} />
                        </div>
                      </Carousel>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className=" basis-full lg:basis-7/12">
              <div className=" flex flex-col mb-5">
                <div
                  style={{ alignContent: "baseline" }}
                  className="flex justify-between mb-2.5 "
                >
                  <div className=" flex justify-between items-center">
                    <div className="space-y-2">
                      <Breadcrumb>
                        <BreadcrumbList>
                          <BreadcrumbItem>
                            <BreadcrumbPage
                              onClick={() => router.push("/")}
                              className=" text-xs cursor-pointer"
                            >
                              Home
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                          <BreadcrumbSeparator>/</BreadcrumbSeparator>
                          <BreadcrumbItem>
                            <BreadcrumbPage
                              onClick={() => {
                                router.back();
                              }}
                              className=" capitalize text-xs cursor-pointer"
                            >
                              {pathSegment == "filter-products" ||
                              pathSegment == "wishlist"
                                ? `${productData?.productCategory.name}`
                                : decodeURIComponent(pathSegment)}
                            </BreadcrumbPage>
                          </BreadcrumbItem>
                          {/* <BreadcrumbSeparator>/</BreadcrumbSeparator>

                            <BreadcrumbItem>
                              <BreadcrumbPage className=" capitalize  text-xs cursor-pointer">
                                {productData?.name}
                              </BreadcrumbPage>
                            </BreadcrumbItem> */}
                        </BreadcrumbList>
                      </Breadcrumb>
                    </div>
                  </div>
                </div>

                <div className=" mb-2.5 space-y-1.5">
                  <p className="lg:text-3xl font-serif text-lg font-bold">
                    {productData?.name}
                  </p>

                  <div className="flex gap-3 flex-col lg:flex-row justify-end lg:justify-between items-start text-sm lg:items-center">
                    <div className=" flex gap-2 items-center">
                      <AiFillSafetyCertificate className="  fill-gold-400 stroke-gold-400 size-6" />
                      <a
                        target="_blank"
                        href={`https://google.com/search?q=${productData?.productCode}`}
                        className=" group font-mono text-stone-500 cursor-pointer"
                      >
                        Product Code{" "}
                        <span className="group-hover:underline ">
                          {" "}
                          {productData?.productCode}
                        </span>
                      </a>
                    </div>

                    <div className=" flex gap-2">
                      <Badge className=" opacity-90 font-normal text-white bg-stone-400 rounded-full ">
                        {productData?.productBrand}
                      </Badge>
                      <Badge className=" opacity-90 font-normal text-white bg-stone-400 rounded-full ">
                        {productData?.productFitting}
                      </Badge>
                    </div>
                  </div>

                  {productData?.productVariants.length < 1 && (
                    <Badge variant={"destructive"}>Out Of Stock</Badge>
                  )}
                </div>

                <div className=" flex flex-col mb-5 gap-[9px]">
                  {(productData?.discountPrice as number) > 0 ? (
                    <div className=" space-y-1.5 text-base lg:font-semibold ">
                      <Badge className=" text-black bg-neutral-300">
                        {productData.discountPrice}%
                      </Badge>

                      <div className="lg:flex gap-2 space-y-1 items-center">
                        <p className=" line-through opacity-80">
                          Price is
                          {new Intl.NumberFormat("ja-JP").format(
                            productData.salePrice
                          )}{" "}
                          MMK
                        </p>

                        <p className="text-base !mt-0 ">
                          {new Intl.NumberFormat("ja-JP").format(
                            productData.salePrice *
                              (1 - (productData.discountPrice as number) / 100)
                          )}{" "}
                          MMK
                        </p>
                      </div>
                    </div>
                  ) : (
                    <p className="text-base">
                      Price is{" "}
                      {new Intl.NumberFormat("ja-JP").format(
                        productData?.salePrice
                      )}{" "}
                      MMK
                    </p>
                  )}
                </div>

                <div className=" mb-3">
                  {productData?.productVariants?.length > 0 && (
                    <>
                      <div className=" mb-3.5">
                        <p className="text-neutral-500 mb-2 text-xs ">
                          Available Colors
                        </p>
                        <div className="flex gap-3">
                          {productData?.productVariants
                            .filter(
                              (variant: any, index: any, self: any) =>
                                index ===
                                self.findIndex(
                                  (v: any) => v.colorCode === variant.colorCode
                                )
                            )
                            .map(
                              (
                                {
                                  mediaUrl,
                                  colorCode,
                                  id,
                                }: {
                                  mediaUrl: string;
                                  colorCode: string;
                                  id: number;
                                },
                                index: number
                              ) => (
                                <div
                                  key={index}
                                  onClick={() => {
                                    handleColorChange(colorCode);
                                    setVariantId(id);
                                    // setImagesToShow([mediaUrl]);
                                    setTotalAvailable(1);
                                  }}
                                  className={`cursor-pointer rounded-full p-1 ${
                                    colorCode === selectedColor
                                      ? "border border-gold-400"
                                      : " border border-transparent"
                                  }`}
                                >
                                  <div
                                    style={{
                                      backgroundImage: `url(${mediaUrl})`,
                                    }}
                                    className="lg:w-6  lg:h-6 size-6 bg-stone-700 rounded-full bg-cover bg-center"
                                  ></div>
                                </div>
                              )
                            )}
                        </div>
                      </div>
                      <div className=" mb-2.5 size-selector-group w-[60%]">
                        <div className="space-y-3">
                          <p className="text-neutral-500 mb-2 text-xs  ">
                            Select Size
                          </p>
                          <ToggleGroup
                            value={selectedSize}
                            defaultValue={selectedSize}
                            onValueChange={(e) => {
                              setSelectedSize(e);
                              setOnlyLeft("");
                              setVariantId(
                                productData?.productVariants.find(
                                  (el: any) => el.productSizing == e
                                )?.id
                              );
                              setQuantity(1);
                            }}
                            size="sm"
                            type="single"
                          >
                            {availableSizes?.map((el: any, index: any) => (
                              <ToggleGroupItem
                                variant={"default"}
                                disabled={availableSizes.length === 1}
                                key={index}
                                value={el}
                              >
                                {el}
                              </ToggleGroupItem>
                            ))}
                          </ToggleGroup>
                        </div>
                      </div>
                    </>
                  )}
                </div>

                <div className=" sticky top-[130px] border border-gold-400 p-5 rounded-xl z-40 bg-white">
                  <div className=" mt-auto">
                    <div>
                      <p className="text-neutral-500 mb-2 text-xs">Quantity</p>
                      <div className=" rounded-md mb-3 flex items-center">
                        <Button
                          className="rounded-full size-7 hover:text-gold-400 hover:border-gold-400 p-0 bg-transparent active:scale-90 duration-300 hover:bg-transparent border-2 border-stone-700 text-lg text-stone-700 d-flex justify-items-center"
                          onClick={() => {
                            if (quantity !== 1) {
                              setOnlyLeft("");
                              setQuantity(quantity - 1);
                            }
                          }}
                        >
                          <Minus size={16} />
                        </Button>

                        <p className=" text-center w-[2rem]">{quantity}</p>

                        <Button
                          className="rounded-full hover:border-gold-400 hover:text-gold-400 size-7 p-0 bg-transparent active:scale-90 duration-300 hover:bg-transparent border-2 border-stone-700 text-lg text-stone-700 d-flex justify-items-center"
                          onClick={() => {
                            if (selectedSize == "") {
                              setOnlyLeft(`Select Size First!`);
                              return;
                            }

                            if (quantity == totalAvailable) {
                              setOnlyLeft(
                                ` Only ${totalAvailable} stock is available.`
                              );

                              setSwalProps({
                                show: true,
                                showConfirmButton: false,
                              });
                            } else {
                              setQuantity(quantity + 1);
                            }
                          }}
                        >
                          <PlusIcon size={16} />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className=" flex items-center mt-auto justify-start pt-2 gap-2">
                    <Button
                      size={"lg"}
                      onClick={addToCart}
                      disabled={productData?.productVariants.length < 1}
                      className=" lg:w-[40%] w-full !h-[52px]"
                    >
                      Add to cart
                    </Button>

                    <Button
                      onClick={async (e) => {
                        e.stopPropagation();

                        if (
                          wishlistData?.data
                            .flatMap((el: any) => el.wishlistRecords)
                            .map((el: any) => el?.productId)
                            .includes(productData?.id)
                        ) {
                          await setDeleteId(
                            wishlistData?.data
                              .flatMap((el: any) => el.wishlistRecords)
                              .find(
                                (el: any) => el?.productId == productData?.id
                              )?.id
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
                      variant={"ghost"}
                      className=" h-[52px] !bg-transparent "
                    >
                      {wishlistData?.data
                        .flatMap((el: any) => el.wishlistRecords)
                        .map((el: any) => el?.productId)
                        .includes(productData?.id) ? (
                        <>
                          <LucideHeart className=" fill-gold-400 stroke-gold-400" />

                          <span className={`ms-2 text-gold-400`}>
                            Added to wishlist
                          </span>
                        </>
                      ) : (
                        <>
                          <LucideHeart className=" " />
                          <span className={`ms-2`}>Add to wishlist</span>
                        </>
                      )}
                    </Button>
                  </div>
                </div>

                <div className=" mt-24 col-span-full">
                  <p className="text-2xl font-semibold">Product Description</p>
                  <p className=" font-normal leading-6 text-start text-stone-600  text-xs">
                    {productData?.description}
                  </p>

                  <CommentSection
                    isUser={isClient ? !!localStorage.getItem("userId") : false}
                    postData={postData}
                    productId={productData?.id}
                    deleteData={deleteData}
                    handleLogin={handleLogin}
                    customerId={
                      isClient
                        ? Number(localStorage.getItem("userId"))
                        : undefined
                    }
                    getSession={getSession}
                  />
                </div>
              </div>
            </div>
          </div>

          <Container>
            <div className=" basis-full">
              {isClient && onlyLeft && (
                <SweetAlert2
                  timer={1500}
                  position="bottom-end"
                  iconColor="black"
                  icon="warning"
                  customClass={{
                    popup: "colored-toast",
                  }}
                  toast={true}
                  didClose={() => {
                    setSwalProps({
                      ...swalProps,
                      show: false,
                    });
                  }}
                  {...swalProps}
                >
                  <p className=" text-xs">{onlyLeft}.</p>
                </SweetAlert2>
              )}

              <Button
                className=" hidden"
                ref={btn}
                onClick={() =>
                  toast.success(`${toastText}`, {
                    duration: 2000,
                    icon: "👏",
                  })
                }
              >
                Click
              </Button>

              <hr className=" my-24" />
              <HotDealAlert data={dealData} isLoading={isDealLoading} />
            </div>
          </Container>

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
        </>
      )}
    </>
  );
};

export default ProductDetail;
