"use client";

import {
  Banner,
  BreadCrumbComponent,
  Container,
  Heading,
  ProductCategories,
  Products,
} from "@/components/ecom";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ErrorComponent from "@/components/ErrorComponent";
import AppLayout from "@/components/ecom/AppLayout";
import { useRouter } from "next/navigation";
import { useAppProvider } from "./Provider/AppProvider";
import { useEffect, useRef } from "react";
import BrandSection from "@/components/ecom/BrandSection";
import SweetAlert2 from "react-sweetalert2";
import BrandBox from "@/components/ecom/BrandBox";
import Image from "next/image";

export default function Home() {
  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const router = useRouter();

  const { data, error, isLoading } = useSWR(
    `${Backend_URL}/ecommerce-Products/riddle?sortBrand=2&limit=${4}`,
    getData
  );

  return (
    <main className=" min-h-screen  max-w-screen !overflow-x-hidden">
      <AppLayout>
        <Banner />
        <BrandBox />
        {error ? (
          <ErrorComponent refetch={() => {}} />
        ) : (
          <>
            <section className=" bg-secondary py-24">
              <Container className=" mb-5">
                <Heading
                  className="lg:mb-10 mb-5"
                  header={" What Everyone's Loving"}
                  desc="Shop Our Best-Selling Styles - Tried, True, and Loved by Many."
                />
                <Products isLoading={isLoading} data={data?.data} />
              </Container>

              {!isLoading && (
                <div className=" flex flex-col justify-center items-center">
                  <p className=" text-xs lg:text-base mb-3 text-center">
                    Discover the latest arrivals from Boss Nation <br /> and
                    find your next favorite item.
                  </p>
                  <Button
                    className=" bg-gold-400 hover:bg-[#e2be6a] hover:text-white text-white rounded-full "
                    size={"lg"}
                    variant={"outline"}
                    onClick={() => router.push("/shop/new-in?page=1")}
                  >
                    Shop New Arrivals
                  </Button>
                </div>
              )}
            </section>

            <div className=" py-24 ">
              <Container>
                <div className=" flex flex-col justify-between items-center gap-3">
                  <h1 className=" text-2xl lg:text-6xl font-bold font-serif">
                    About{" "}
                    <span className=" font-bold text-gold-400 uppercase">
                      Boss Nation
                    </span>
                  </h1>
                  <p className=" text-stone-500 text-sm lg:text-base text-center mb-5">
                    The best authentic fashion shop in Yangon.
                  </p>
                  <Image
                    className=" w-40"
                    src={"/logo.png"}
                    width={40}
                    height={40}
                    alt="logo"
                  />
                  <p className=" lg:w-[550px] mb-10 lg:mb-20  text-sm lg:text-base text-center ">
                    Welcome to Boss Nation Authentic Fashion, your trusted
                    destination for authentic branded clothing products. Since
                    established in 2022, we have built a reputation based on
                    customer trust, variety of choices, and exceptional
                    services.
                  </p>
                </div>
                <div className="lg:max-w-[900px] px-4 mx-auto mb-10 lg:mb-20  ">
                  <div className="grid gap-6 grid-cols-1 sm:gap-12 lg:grid-cols-3 lg:gap-8">
                    <div className=" text-center">
                      <h4 className="text-lg font-serif sm:text-xl font-bold text-gray-800">
                        Accuracy rate
                      </h4>
                      <p className="mt-2 sm:mt-3 text-4xl sm:text-6xl font-bold">
                        99.95%
                      </p>
                      <p className="mt-1 text-gold-400 ">
                        in fulfilling orders
                      </p>
                    </div>

                    <div className=" text-center">
                      <h4 className="text-lg font-serif sm:text-xl font-bold text-gray-800">
                        Available Products
                      </h4>
                      <p className="mt-2 sm:mt-3 text-4xl sm:text-6xl font-bold">
                        200+
                      </p>
                      <p className="mt-1 text-gold-400 ">
                        from worldwide Brands
                      </p>
                    </div>

                    <div className="text-center">
                      <h4 className="text-lg font-serif sm:text-xl font-bold text-gray-800">
                        Happy customer
                      </h4>
                      <p className="mt-2 sm:mt-3 text-4xl sm:text-6xl font-bold">
                        85%
                      </p>
                      <p className="mt-1 text-gold-400 ">this year alone</p>
                    </div>
                  </div>
                </div>

                <p className=" mx-auto text-center lg:w-[750px] text-xs lg:text-base border-gold-400 p-7 lg:mb-10 mb-5 ">
                  At Boss Nation, we are committed to offering 100% genuine
                  items, carefully curated for fashion-forward individuals who
                  value sophistication and authenticity. Our journey began with
                  a simple goal: to provide access to premium branded apparel at
                  competitive prices, and our dedication to this vision has
                  earned us the loyalty and confidence of our growing customer
                  community.
                </p>

                <p className=" lg:w-[600px] text-center text-xs lg:text-base bg-[#ffeec5] mx-auto rounded-xl border-2 border-gold-400 p-7 lg:mb-10 mb-5 shadow">
                  We pride ourselves on transparency, ensuring that every
                  product we sell meets the highest standards of authenticity
                  and style. Our customers are at the heart of everything we do,
                  and their support has been the foundation of our success.
                  Whether you are looking for BOSS items or other signature
                  brands, we are here to help you elevate your wardrobe with
                  ease.
                </p>
              </Container>
              <Container className=" lg:w-[50%] grid-cols-12">
                <p className=" py-3 text-base font-normal text-center font-serif">
                  Thank you for choosing Boss Nation Authentic Fashion <br />{" "}
                  where trust meets style. Be Authentic; Shop With Us.
                </p>
              </Container>
            </div>

            <ProductCategories />
          </>
        )}
      </AppLayout>
    </main>
  );
}
