"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const SearchPage = () => {
  const router = useRouter();
  useEffect(() => {
    router.back();
  }, []);
  return;
};

export default SearchPage;
