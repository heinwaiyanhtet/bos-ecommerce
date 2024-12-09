"use client";
import React, { useRef, useState, useEffect } from "react";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import {
  Search,
  Heart,
  ShoppingCart,
  User,
  Bell,
  LogOut,
  LogIn,
  LucideShoppingBag,
  LucideHeart,
  LucideUser,
  LucideUser2,
  LucideSearch,
  X,
} from "lucide-react";
import Container from "./Container";
import Avatar from "react-avatar";
import { useRouter } from "next/navigation";
import ControlSheet from "./ControlSheet";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { HamburgerMenuIcon } from "@radix-ui/react-icons";
import Cart from "./Cart";
import Wishlist from "./Wishlist";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import logo from "../../../public/logo.png";
import Image from "next/image";
import NavSearchForm from "./NavSearchForm";
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
import SearchProducts from "./SearchProducts";
import { SiGoogle } from "react-icons/si";
import { FaGoogle } from "react-icons/fa";

const Navbar = () => {
  const router = useRouter();
  const closeRef = useRef<HTMLButtonElement | null>(null);
  const closeWishListRef = useRef<HTMLButtonElement | null>(null);

  const {
    searchInputValue,
    setSearchInputValue,
    wishlistData,
    setWishlistData,
    setSwalProps,
    handleLogin,
    orderRecord,
    getSession,
  } = useAppProvider();

  const [debouncedValue, setDebouncedValue] = useState(searchInputValue);
  const [open, setOpen] = useState(false);
  const [showSuggestions, setShowSuggestions] = useState(false);

  useEffect(() => {
    const handler = setTimeout(() => {
      setSearchInputValue(debouncedValue);
    }, 800); // delay in milliseconds

    return () => {
      clearTimeout(handler);
    };
  }, [debouncedValue, setSearchInputValue]);

  const handleOnFocus = (e: any) => {
    if (e.target.value) {
      setShowSuggestions(true);
    } else {
      setShowSuggestions(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setDebouncedValue(e.target.value);
  };

  const searchRef = useRef<HTMLInputElement | null>(null);

  const getSuggestData = async (url: string) => {
    return getFetchForEcom(url);
  };

  const [showSearch, setShowSearch] = useState<boolean>(false);

  const btn = useRef<HTMLButtonElement | null>(null);

  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);

  const getData = async (url: string) => {
    try {
      const token = isClient && (await getSession());

      console.log("token from navbar", token);

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

      console.log("response from navbar", response);

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

  useEffect(() => {
    setIsClient(true);
  }, []);

  const { data: userData } = useSWR(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    getData
  );

  useEffect(() => {
    if (isClient) setUserId(localStorage.getItem("userId"));
  }, [isClient]);

  const {
    data: wishlistDataSWR,
    error: wishlistError,
    mutate,
  } = useSWR(userId !== null ? `${Backend_URL}/wishlist` : null, getData);

  useEffect(() => {
    if (wishlistDataSWR) {
      setWishlistData(wishlistDataSWR.data);
    }
  }, [wishlistDataSWR]);

  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (isClient) {
      setIsLoggedIn(localStorage.getItem("accessToken") !== null);
    }
  }, [isClient, userId]);

  return (
    <header className=" h-[80px] z-[50] border-b-2 border-gold-400 cursor-pointer overflow-hidden select-none fixed flex justify-center items-center bg-secondary min-w-full">
      <Container className="flex justify-center w-full overflow-hidden flex-col h-full">
        <div className="grid grid-cols-2 w-full lg:grid-cols-3 items-center gap-3">
          <div
            onClick={() => {
              setSearchInputValue("");
              router.push("/");
            }}
            className="lg:text-xl flex items-center justify-start cursor-pointer font-semibold"
          >
            <Image
              className="h-[70px] w-auto cursor-pointer object-left object-contain"
              src={logo}
              alt="logo"
            />

            <div className=" hidden lg:flex flex-col gap-2 cursor-pointer lg:-ms-0 -ms-[30px] justify-center items-start">
              <p className=" font-medium mb-0 pb-0 lg:leading-6 lg:text-xl text-[16px] uppercase font-serif">
                Boss Nation
              </p>
              <p className=" font-medium lg:tracking-wide uppercase -mt-[5.5px] text-[10px] lg:text-xs font-serif">
                Authentic Fashion
              </p>
            </div>
          </div>

          {/* nav links */}
          <div className="hidden lg:flex justify-around">
            <p
              onClick={() => {
                setSearchInputValue("");
                router.push("/shop/new-in?page=1");
              }}
              className="text-sm cursor-pointer  font-serif"
            >
              New In
            </p>

            <p
              onClick={() => {
                setSearchInputValue("");
                router.push("/shop/men?page=1");
              }}
              className="text-sm cursor-pointer  font-serif"
            >
              Men
            </p>

            <p
              onClick={() => {
                setSearchInputValue("");
                router.push("/shop/women?page=1");
              }}
              className="text-sm cursor-pointer  font-serif"
            >
              Women
            </p>

            <p
              onClick={() => {
                setSearchInputValue("");
                router.push("/shop/unisex?page=1");
              }}
              className="text-sm cursor-pointer  font-serif"
            >
              Unisex
            </p>
          </div>

          {/* controls */}

          <div className="flex justify-end items-center">
            <div
              className=" cursor-pointer"
              onClick={() => {
                btn.current?.click();
                setShowSearch(true);
              }}
            >
              <span className=" active:scale-75   hover:bg-stone-100 duration-300 border border-transparent hover:border-gold-400 size-12 flex justify-center items-center rounded-full">
                <LucideSearch className=" stroke-gold-400" />
              </span>
            </div>

            <ControlSheet
              closeRef={closeRef}
              buttonName={
                <>
                  <span className=" active:scale-75 hover:bg-stone-100 duration-300 border border-transparent hover:border-gold-400 size-12 flex justify-center items-center rounded-full">
                    {wishlistData?.length > 0 ? (
                      <LucideHeart className=" fill-gold-400 stroke-gold-400" />
                    ) : (
                      <LucideHeart className=" stroke-gold-400" />
                    )}
                  </span>
                </>
              }
              type={"wishlist"}
              title={
                <span className=" mt-2 flex items-center gap-2">
                  <LucideHeart className=" fill-gold-400 stroke-gold-400" />{" "}
                  <span>Your Wishlist</span>
                  <span className=" bg-stone-300 px-5 size-4 text-sm rounded-full flex justify-center items-center">
                    {wishlistData?.length}
                  </span>
                </span>
              }
              // desc={"Wishlist: Your Dream Items at a Glance"}
            >
              <Wishlist
                wishlistData={wishlistData}
                mutate={mutate}
                closeRef={closeRef}
              />
            </ControlSheet>

            <ControlSheet
              buttonName={
                <>
                  <span className=" active:scale-75 hover:bg-stone-100 duration-300 border border-transparent hover:border-gold-400 size-12 flex justify-center items-center rounded-full">
                    <LucideShoppingBag className=" stroke-gold-400" />
                  </span>
                </>
              }
              title={
                <>
                  <span className="my-2 flex items-center gap-2">
                    <LucideShoppingBag className="  stroke-gold-400" />{" "}
                    <span>Your Cart Items</span>
                  </span>
                </>
              }
              closeRef={closeRef}
              type={"cart"}
              // desc="Your shopping cart is just a few clicks away from becoming yours!"
            >
              <Cart closeRef={closeRef} />
            </ControlSheet>

            <div className="hidden lg:block">
              <ControlSheet
                buttonName={
                  <>
                    <span className=" active:scale-75  hover:bg-stone-100 duration-300 border border-transparent hover:border-gold-400 size-12 flex justify-center items-center rounded-full">
                      {isLoggedIn ? (
                        <Avatar
                          name={userData?.name}
                          size="40"
                          color="#c4a358"
                          round={true}
                        />
                      ) : (
                        <LucideUser2 className=" stroke-gold-400" />
                      )}
                    </span>
                  </>
                }
                title={
                  !isLoggedIn
                    ? "Just one click away..."
                    : `Hi, ${userData?.name}`
                }
                desc={
                  !isLoggedIn
                    ? "Sign in with Google and let's get shopping!"
                    : ""
                }
                closeRef={closeRef}
              >
                {!isLoggedIn ? (
                  <div className=" flex flex-col items-center h-[60%] justify-center gap-4">
                    <Image
                      src={"/svg1.svg"}
                      alt="svg1"
                      width={400}
                      height={400}
                    />
                    <Button
                      onClick={() => {
                        handleLogin();
                        closeRef.current?.click();
                      }}
                      className=" bg-gold-400 hover:bg-[#e2be6a] !py-4 rounded-full w-full "
                    >
                      <FaGoogle className=" me-1" /> Login with Google
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 pt-6">
                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        router.push("/profile/information");
                        closeRef.current?.click();
                      }}
                      className="text-sm flex items-center gap-1.5 leading-3 font-medium cursor-pointer uppercase"
                    >
                      <span>
                        <User />
                      </span>
                      My Account
                    </p>

                    <hr className="border-1.5 border-input" />

                    <p
                      onClick={() => {
                        setSearchInputValue("");
                        closeRef.current?.click();

                        router.push("/profile/orders");
                      }}
                      className="text-sm flex items-center gap-1.5 leading-3 font-medium cursor-pointer uppercase"
                    >
                      <span>
                        <Bell />
                      </span>
                      Orders
                    </p>

                    <hr className="border-1.5 border-input" />

                    <p
                      onClick={() => {
                        setSwalProps({
                          show: true,
                          showConfirmButton: false,
                          type: "logout",
                        });

                        typeof window !== "undefined" &&
                          localStorage.removeItem("accessToken");
                        localStorage.removeItem("refreshToken");
                        localStorage.removeItem("userId");
                        router.push("/");
                        setWishlistData([]);
                      }}
                      className="text-sm flex items-center gap-1.5 leading-3 font-medium cursor-pointer uppercase"
                    >
                      <span>
                        <LogOut />
                      </span>
                      Log out
                    </p>

                    <hr className="border-1.5 border-input" />
                  </div>
                )}
              </ControlSheet>
            </div>

            <div className="block ms-2.5 lg:hidden">
              <ControlSheet
                buttonName={
                  <span className="text-gold-400">
                    <HamburgerMenuIcon width={24} height={24} />
                  </span>
                }
                title="Menu"
              >
                <div className="space-y-3">
                  <p
                    onClick={() => {
                      setSearchInputValue("");
                      router.push("/shop/new-in?page=1");
                    }}
                    className="text-sm cursor-pointer uppercase"
                  >
                    New In
                  </p>

                  <hr className="border-1.5 border-input" />

                  <p
                    onClick={() => {
                      setSearchInputValue("");
                      router.push("/shop/men?page=1");
                    }}
                    className="text-sm cursor-pointer uppercase"
                  >
                    Men
                  </p>
                  <hr className="border-1.5 border-input" />
                  <p
                    onClick={() => {
                      setSearchInputValue("");
                      router.push("/shop/women?page=1");
                    }}
                    className="text-sm cursor-pointer uppercase"
                  >
                    Women
                  </p>

                  <hr className="border-1.5 border-input" />

                  <p
                    onClick={() => {
                      setSearchInputValue("");
                      router.push("/shop/unisex?page=1");
                    }}
                    className="text-sm cursor-pointer uppercase"
                  >
                    Unisex
                  </p>
                  <hr className="border-1.5 border-input" />

                  <p
                    onClick={() => {
                      setSearchInputValue("");
                      router.push("/profile/information");
                    }}
                    className="text-sm cursor-pointer uppercase"
                  >
                    Profile
                  </p>
                </div>
              </ControlSheet>
            </div>
          </div>
        </div>
      </Container>

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button className="hidden" ref={btn} variant="outline">
            Show Dialog
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              <span className=" flex justify-between items-center">
                <span className=" font-serif">Search Products</span>
                <span
                  onClick={() => closeRef?.current?.click()}
                  className=" active:scale-95 cursor-pointer"
                >
                  <X />
                </span>
              </span>
            </AlertDialogTitle>
            <AlertDialogDescription className=" h-[600px] !text-primary">
              {showSearch && <SearchProducts closeRef={closeRef} />}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              ref={closeRef}
              className=" hidden"
            ></AlertDialogCancel>
            <AlertDialogAction className=" hidden">Continue</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </header>
  );
};

export default Navbar;
