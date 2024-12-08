"use client";

import React from "react";
import Container from "./Container";
import { LucideFacebook, Mail, Phone } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAppProvider } from "@/app/Provider/AppProvider";
import { SiFacebook, SiTiktok, SiViber } from "react-icons/si";
import Image from "next/image";
import logo from "../../../public/logo.png";
import { AiFillFacebook } from "react-icons/ai";
import {
  FaFacebook,
  FaFacebookMessenger,
  FaTiktok,
  FaViber,
} from "react-icons/fa";

const Footer = () => {
  const router = useRouter();
  const {
    searchInputValue,
    setSearchInputValue,
    handleLogin,
    setSwalProps,

    wishlistData,
    setWishlistData,
  } = useAppProvider();

  return (
    <footer className="bg-primary">
      <Container>
        <div className=" grid lg:grid-cols-5 py-12  grid-cols-1 gap-10 lg:py-12">
          <div className=" lg:col-span-2 col-span-full flex flex-col gap-3 ">
            <div
              onClick={() => {
                setSearchInputValue("");
                router.push("/");
              }}
              className="lg:text-xl flex items-center justify-start cursor-pointer gap-5 font-semibold -mb-3"
            >
              <Image className=" w-20" src={logo} alt="logo" />

              <div className=" flex flex-col gap-2 text-secondary cursor-pointer lg:-ms-0 -ms-[30px] justify-center items-start">
                <p className=" font-medium mb-0 pb-0 lg:leading-6 lg:text-xl text-[16px] uppercase font-serif">
                  Boss Nation
                </p>
                <p className=" font-medium lg:tracking-wide uppercase -mt-[5.5px] text-[10px] lg:text-xs font-serif">
                  Authentic Fashion
                </p>
              </div>
            </div>
            <p className=" text-xs text-stone-400">
              Thank you for choosing Boss Nation Authentic Fashion where style.
              Be Authentic Shop With Us, Since established in 2022.
            </p>
            <div className=" space-x-2">
              <a
                className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gold-400 hover:text-stone-700 duration-300 hover:-translate-y-1 hover:scale-110 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="https://www.facebook.com/boss.nation.clothing.shop"
                target="_blank"
              >
                <FaFacebook className=" size-4" />
              </a>
              <a
                className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gold-400 hover:text-stone-700 duration-300 hover:-translate-y-1 hover:scale-110 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="https://www.messenger.com/t/103855709234630"
                target="_blank"
              >
                <FaFacebookMessenger className=" size-4" />
              </a>
              <a
                className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gold-400 hover:text-stone-700 duration-300 hover:-translate-y-1 hover:scale-110 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="https://www.tiktok.com/@boss.nation0?lang=en"
                target="_blank"
              >
                <FaTiktok className=" size-4" />
              </a>
              <a
                className="size-8 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-full border border-transparent text-gray-500 hover:bg-gold-400 hover:text-stone-700 duration-300 hover:-translate-y-1 hover:scale-110 focus:outline-none focus:bg-gray-50 disabled:opacity-50 disabled:pointer-events-none dark:text-neutral-400 dark:hover:bg-neutral-700 dark:focus:bg-neutral-700"
                href="https://invite.viber.com/?g2=AQAr3pdeu90u3k9M%2FQ%2BlMW9UYGgkdtZuAEpIwxSsQ7%2FpwBBU%2B5qaIDmkU2urII8w"
                target="_blank"
              >
                <FaViber className=" size-4" />
              </a>
            </div>
          </div>

          <div className=" col-span-full lg:col-span-3 justify-end lg:flex grid grid-cols-2 gap-10">
            <div className=" space-y-3">
              <p className=" text-[16px] text-white">Customer care</p>
              <ul className=" space-y-3 cursor-pointer text-[16px] lg:text-sm capitalize">
                <li
                  className=" text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                  onClick={() => router.push("/contact-us")}
                >
                  contact us
                </li>
                <li
                  className=" text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                  onClick={() => router.push("/about-us")}
                >
                  about us
                </li>
                <li
                  className=" text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                  onClick={() => handleLogin()}
                >
                  Log in
                </li>
                <li
                  className=" text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                  onClick={() => handleLogin()}
                >
                  Register
                </li>
              </ul>
            </div>

            <div className=" space-y-3">
              <p className="  text-[16px] text-white">Shop with us</p>
              <ul className=" space-y-3 text-[16px] lg:text-sm capitalize">
                <li
                  onClick={() => {
                    router.push("/shop/new-in?page=1");
                    setSearchInputValue("");
                  }}
                  className="text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                >
                  New in
                </li>
                <li
                  onClick={() => {
                    router.push("/shop/men?page=1");
                    setSearchInputValue("");
                  }}
                  className="text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                >
                  Men
                </li>
                <li
                  onClick={() => {
                    router.push("/shop/women?page=1");
                    setSearchInputValue("");
                  }}
                  className="text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                >
                  Women
                </li>
                <li
                  onClick={() => {
                    router.push("/shop/unisex?page=1");
                    setSearchInputValue("");
                  }}
                  className="text-stone-400 text-sm font-serif cursor-pointer hover:underline duration-300"
                >
                  Unisex
                </li>
              </ul>
            </div>

            <div className=" col-span-full">
              <p className="  text-[16px] mb-4 text-white">Contact Us</p>
              <div className=" flex  items-center gap-3 mb-5">
                <div className=" size-10 p-1 text-black rounded-full bg-gold-400 flex justify-center items-center">
                  <Mail />
                </div>
                <div className=" text-sm font-serif text-gold-400">
                  <p>Email Account</p>
                  <a className=" block" href="mailto:bossnation134@gmail.com">
                    bossnation134@gmail.com
                  </a>
                </div>
              </div>
              <div className=" flex  items-center gap-3">
                <div className=" size-10 p-1 text-black rounded-full bg-gold-400 flex justify-center items-center">
                  <Phone />
                </div>
                <div className=" text-sm font-serif text-gold-400">
                  <p>Phone Number</p>
                  <a className=" block" href="tel:+95943179753">
                    +95 94 317 9753
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>

        <hr className=" border-3 border-gold-400" />

        <p className=" text-[16px] text-stone-400 text-center font-serif py-5">
          Copyright © 2024 BossNation | All Rights Reserved
        </p>
      </Container>
    </footer>
  );
};

export default Footer;
