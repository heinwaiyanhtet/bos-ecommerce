"use client";

import { auth, provider } from "@/lib/firebase";
import { setTokens } from "@/lib/lib";
import axios from "axios";
import { signInWithPopup } from "firebase/auth";
import { useRouter } from "next/navigation";
import React, { createContext, useContext, useEffect, useState } from "react";
import useSWR from "swr";
import jwt, { JwtPayload } from "jsonwebtoken";
import { Backend_URL } from "@/lib/fetch";

const Provider = createContext<any | undefined>(undefined);

type cartItem = {
  name: string;
  colorCode: string;
  photo: string;
  priceAfterDiscount?: number;
  quantity: number;
  discount?: number;
  salePrice?: number;
  productSizing: string;
};

const fetcher = async (url: string, idToken: string) => {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ idToken }),
  });

  if (!response.ok) {
    throw new Error("Failed to authenticate");
  }

  return response.json();
};

const useAuthLogin = (idToken: string | null) => {
  const { data, error } = useSWR(
    idToken ? [`${Backend_URL}/auth/EcommerceLogin`, idToken] : null,
    ([url, token]) => fetcher(url, token)
  );

  return { data, error };
};

export const AppProvider = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();
  const [searchInputValue, setSearchInputValue] = useState("");
  const [isClient, setIsClient] = useState(false);
  const [cartItems, setCartItems] = useState<any[]>([]);
  const [orderRecord, setOrderRecord] = useState<cartItem[]>([]);
  const [idToken, setIdToken] = useState<string | null>(null);

  const [couponCode, setCouponCode] = useState("");
  const [inputValue, setInputValue] = useState("");
  const [validCoupon, setValidCoupon] = useState(false);
  const [couponDiscount, setCouponDiscount] = useState(0);
  const [addedCartIds, setAddedCartIds] = useState<number[]>([]);
  const [error, setError] = useState("");
  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
    type: "",
  });
  const [wishlistData, setWishlistData] = useState<any[]>([]);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      const savedCartItems = localStorage.getItem("cartItems");
      const orderRecordItems = localStorage.getItem("orderRecord");
      const addedCartIds = localStorage.getItem("addedCartIds");

      try {
        setCartItems(savedCartItems ? JSON.parse(savedCartItems) : []);
        setOrderRecord(orderRecordItems ? JSON.parse(orderRecordItems) : []);
        setAddedCartIds(addedCartIds ? JSON.parse(addedCartIds) : []);
      } catch (error) {
        console.error("Failed to parse cartItems from localStorage:", error);
      }
    }
  }, [isClient]);

  // Update localStorage whenever cartItems change
  useEffect(() => {
    if (isClient) {
      localStorage.setItem("cartItems", JSON.stringify(cartItems));
      localStorage.setItem("orderRecord", JSON.stringify(orderRecord));
      localStorage.setItem("addedCartIds", JSON.stringify(addedCartIds));
    }
  }, [cartItems, isClient, orderRecord, addedCartIds]);

  const totalCost =
    orderRecord.reduce((pv: number, cv: any) => {
      return pv + cv.priceAfterDiscount * cv.quantity;
    }, 0) *
    (1 - couponDiscount / 100);

  const handleLogin = async () => {
    try {
      const result = await signInWithPopup(auth, provider);

      const idToken = await result.user.getIdToken(true);
      const refreshToken = result.user.refreshToken;

      localStorage.setItem("refreshToken", refreshToken);

      setIdToken(idToken);

      setSwalProps({
        show: true,
        showConfirmButton: false,
        type: "login",
      });
      typeof window !== "undefined" && window.location.reload();
    } catch (error) {
      console.error("Error during login:", error);
    }
  };

  const { data } = useAuthLogin(idToken);

  useEffect(() => {
    if (data) {
      if (typeof window !== "undefined") {
        localStorage.setItem("userId", data.user.id);
        localStorage.setItem("email", data.user.email);
        localStorage.setItem("name", data.user.name);
        localStorage.setItem("accessToken", data.accessToken);
        localStorage.setItem("refreshToken", data.refreshToken);
      }

      const { accessToken, refreshToken } = data;

      setTokens(data);
    }

    if (error) {
      console.error("Error during API call:", error);
    }
  }, [data, error]);

  const removeFromCart = (id: string | string[]) => {
    setOrderRecord(orderRecord.filter((el: any) => el.itemId !== id));
  };

  const getRefreshToken = () => {
    return localStorage.getItem("refreshToken");
  };

  const clearTokens = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
  };

  const refreshAccessToken = async () => {
    console.log("Refreshing access token directly with Firebase");

    const refreshToken = getRefreshToken(); // Function to retrieve the refresh token

    if (!refreshToken) {
      console.error("No refresh token available");
      clearTokens();
      return null;
    }

    try {
      const response = await axios.post(
        `https://securetoken.googleapis.com/v1/token?key=AIzaSyCdZK_dWvof4UIRC1BHLbYLk9PoGLMabI0`,
        new URLSearchParams({
          grant_type: "refresh_token",
          refresh_token: refreshToken,
        }).toString(),
        {
          headers: {
            "Content-Type": "application/x-www-form-urlencoded",
          },
        }
      );

      console.log("response", response);

      const { access_token, refresh_token, expires_in } = response.data;

      console.log("New access token:", access_token);

      localStorage.setItem("accessToken", access_token);
      localStorage.setItem("refreshToken", refresh_token);

      return access_token;
    } catch (error) {
      console.error("Error refreshing access token:", error);
      clearTokens();
      return null;
    }
  };

  const decodeToken = (token: string) => {
    try {
      return jwt.decode(token) as JwtPayload;
    } catch {
      return null;
    }
  };

  const isJwtPayload = (token: any) => {
    return typeof token === "object" && token !== null && "exp" in token;
  };

  const isAccessTokenExpired = (token: string) => {
    const decoded = decodeToken(token);

    console.log("decode token", decoded);

    if (!decoded || !isJwtPayload(decoded) || !decoded.exp) return true;

    console.log("true for expired");
    console.log(decoded.exp * 1000 < Date.now());
    return decoded.exp * 1000 < Date.now();
  };

  const getSession = async () => {
    let accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      accessToken = await refreshAccessToken();
    }

    if (accessToken && isAccessTokenExpired(accessToken)) {
      console.log("Access token expired, refreshing...");

      accessToken = await refreshAccessToken();
    }

    if (accessToken) {
      return accessToken;
    }

    return null;
  };

  return (
    <Provider.Provider
      value={{
        searchInputValue,
        setSearchInputValue,
        cartItems,
        setCartItems,
        totalCost,
        isClient,
        handleLogin,
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
        orderRecord,
        setOrderRecord,
        removeFromCart,
        addedCartIds,
        setAddedCartIds,
        swalProps,
        setSwalProps,
        wishlistData,
        setWishlistData,
        getSession,
      }}
    >
      {children}
    </Provider.Provider>
  );
};

export const useAppProvider = () => {
  const context = useContext(Provider);
  if (!context) {
    throw new Error("useAppProvider must be used within an AppProvider");
  }

  return context;
};
