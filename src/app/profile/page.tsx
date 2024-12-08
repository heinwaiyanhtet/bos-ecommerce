"use client";
import { useRouter } from "next/navigation";
import React, { useEffect } from "react";

const ProfilePageEcom = () => {
  const router = useRouter();
  useEffect(() => {
    router.push("/profile/information");
  }, []);
  return <div></div>;
};

export default ProfilePageEcom;
