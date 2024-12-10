"use client";

import { BreadCrumbComponent, Container, Heading } from "@/components/ecom";
import React, { useEffect, useRef, useState } from "react";
import { useAppProvider } from "../Provider/AppProvider";
import OrderSummary from "@/components/ecom/OrderSummary";
import FormInput from "@/components/FormInput.components";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronRight, LucideChevronRight, Plus, X } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import useSWR from "swr";
import { Backend_URL } from "@/lib/fetch";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import useSWRMutation from "swr/mutation";
import { useRouter } from "next/navigation";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Button } from "@/components/ui/button";
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
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

type OrderRecord = {
  productVariantId: number;
  salePrice: number;
};

type OrderData = {
  orderCode: any;
  subTotal: number;
  total: number;
  orderRecords: OrderRecord[];
  discount?: number;
  addressId: any;
  remark?: string;
  couponName?: string;
};

type userData = {
  name: "";
  email: "";
  phone: "";
  dateOfBirth?: "";
};

const Checkout = () => {
  const {
    totalCost,
    cartItems,
    couponDiscount,
    setCouponDiscount,
    setCartItems,
    couponCode,
    setCouponCode,
    setValidCoupon,
    setInputValue,
    orderRecord,
    setOrderRecord,
    getSession,
  } = useAppProvider();

  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [remark, setRemark] = useState("");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setUserId(localStorage.getItem("userId"));

      if (!localStorage.getItem("accessToken")) {
        router.push("/shopping-bag");
      }
    }
  }, [isClient]);

  const router = useRouter();

  const patchData = async (url: string, { arg }: any) => {
    try {
      const token = isClient && (await getSession());

      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "PATCH",
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
      return response;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const deleteData = async (url: string, { arg }: any) => {
    try {
      const token = isClient && (await getSession());
      if (!token) {
        throw new Error("No access token found");
      }

      const options: RequestInit = {
        method: "DELETE",
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
      return response;
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  const getData = async (url: string) => {
    try {
      const token = isClient && (await getSession());

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

  const postOrder = async (url: string, { arg }: { arg: OrderData }) => {
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

  // order
  const {
    data: orderData,
    error: orderError,
    trigger: order,
    isMutating,
  } = useSWRMutation(`${Backend_URL}/orders`, postOrder);

  const { data: userInfoData, isLoading } = useSWR(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    getData
  );

  const {
    data: addressData,
    isLoading: addressLoading,
    mutate,
  } = useSWR(userId !== null ? `${Backend_URL}/address` : null, getData);

  useEffect(() => {
    if (addressData) {
      setSelectedAddress(`${addressData[0]?.id}`);
      setReady(true);
    }
  }, [addressData]);

  const {
    data: editUserData,
    error: editUserError,
    trigger: editUser,
  } = useSWRMutation(
    userId !== null ? `${Backend_URL}/ecommerce-users/${userId}` : null,
    patchData
  );

  const {
    data: addAddressData,
    error: addAddressError,
    trigger: addAddress,
    isMutating: addingAddress,
  } = useSWRMutation(
    selectedAddress !== "" ? `${Backend_URL}/address` : null,
    postData
  );

  const {
    data: editAddressData,
    error: editAddressError,
    trigger: editAddress,
    isMutating: editingAddress,
  } = useSWRMutation(
    selectedAddress !== "" ? `${Backend_URL}/address/${selectedAddress}` : null,
    patchData
  );

  const {
    data: editAddressDeleteData,
    error: editAddressDeleteError,
    trigger: deleteAddress,
  } = useSWRMutation(
    selectedAddress !== "" ? `${Backend_URL}/address/${selectedAddress}` : null,
    deleteData
  );

  const schema = z.object({
    city: z.string().min(1, { message: "This field cannot be empty!" }),
    township: z.string().min(1, { message: "This field cannot be empty!" }),
    street: z.string().min(1, { message: "This field cannot be empty!" }),
    company: z.string().optional(),
    addressDetail: z
      .string()
      .min(1, { message: "This field cannot be empty!" }),
  });

  const infoSchema = z.object({
    name: z.string().min(3, { message: "This field cannot be empty!" }),
    phone: z.string().min(1, { message: "This field cannot be empty!" }),
    email: z.string().email({ message: "Invalid email format!" }),
    dateOfBirth: z.string().nullable(),
  });

  type FormData = z.infer<typeof schema>;
  type InfoFormData = z.infer<typeof infoSchema>;

  const {
    register,
    handleSubmit: handleAddressSubmit,
    setValue,
    formState: { errors },
    reset,
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: {
      city: "",
      township: "",
      street: "",
      company: "",
      addressDetail: "",
    },
  });

  const {
    register: infoRegister,
    handleSubmit,
    formState: { errors: infoErrors },
    reset: infoReset,
  } = useForm<InfoFormData>({
    resolver: zodResolver(infoSchema),
    defaultValues: {
      name: "",
      phone: "",
      email: "",
      dateOfBirth: "",
    },
  });

  useEffect(() => {
    if (userInfoData) {
      infoReset({
        name: userInfoData.name || "",
        phone: userInfoData.phone || "",
        email: userInfoData.email || "",
      });
    }
  }, [userInfoData]);

  const generateLongNumber = (length: number) => {
    let number = "";
    for (let i = 0; i < length; i++) {
      number += Math.floor(Math.random() * 10);
    }
    return parseInt(number);
  };

  const btn = useRef<HTMLButtonElement | null>(null);

  const onSubmit = async (value: any) => {
    const userData: userData = {
      name: value.name,
      phone: value.phone,
      email: value.email,
    };

    if (value.dateOfBirth !== "") {
      const date = new Date(value?.dateOfBirth);

      // Format it as ISO 8601
      const isoString = date?.toISOString();

      value.dateOfBirth = isoString;
      userData.dateOfBirth = value.dateOfBirth;
    }

    const res = await editUser(userData as never);

    const newOrderRecord = orderRecord.flatMap((el: any) => {
      if (el.quantity > 1) {
        const availableIds = el.availableIds.slice(0, el.quantity);
        const data = availableIds.map((item: any) => ({
          variantId: item,
          salePrice: el.priceAfterDiscount,
        }));
        return data; // Return array of objects for multiple items
      } else {
        return {
          variantId: el.variantId,
          salePrice: el.priceAfterDiscount,
        };
      }
    });

    if (res?.ok) {
      const dataToOrder: OrderData = {
        orderCode: `${generateLongNumber(7)}`,
        addressId: parseInt(selectedAddress),
        subTotal: newOrderRecord.reduce(
          (pv: any, cv: any) => pv + cv.salePrice,
          0
        ),
        total: totalCost,
        orderRecords: newOrderRecord.map((el: any) => {
          return {
            productVariantId: el.variantId,
            salePrice: el.salePrice,
          };
        }),
      };

      if (couponDiscount > 0) {
        dataToOrder.discount = couponDiscount;
        dataToOrder.couponName = couponCode;
      }

      if (remark !== "") {
        dataToOrder.remark = remark;
      }

      const orderRes = await order(dataToOrder);
      if (orderRes?.status) {
        setCartItems([]);
        router.push(`/order/${orderRes.data.id}`);
        setCouponCode("");
        setInputValue("");
        setCouponDiscount("");
        setOrderRecord([]);
        setValidCoupon(false);
      }
    }
  };

  const handleEdit = (id: any) => {
    setOpen(true);
    setIsEditing(true);
    const data = addressData?.find((el: any) => el.id == id);
    if (data) {
      reset({
        city: data.city || "",
        company: data.company || "",
        addressDetail: data.addressDetail || "",
        street: data.street || "",
        township: data.township || "",
      });
    }
  };

  const handleEditAddress = async (value: any) => {
    const res = isEditing ? await editAddress(value) : await addAddress(value);
    if (res) {
      setIsEditing(false);
      setOpen(false);
      mutate();
      reset({
        city: "",
        company: "",
        addressDetail: "",
        street: "",
        township: "",
      });
      btn?.current?.click();
    }
  };

  return (
    <Container className=" flex flex-col gap-4 py-12">
      <div className=" flex  lg:flex-col gap-4">
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
            <BreadcrumbSeparator>
              <LucideChevronRight />
            </BreadcrumbSeparator>
            <BreadcrumbItem>
              <BreadcrumbPage className=" capitalize  !text-stone-500">
                Checkout
              </BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className=" flex lg:flex-row flex-col justify-between items-start gap-8">
        <div className=" space-y-3 lg:basis-8/12">
          <p className=" text-xl lg:text-3xl pb-3 capitalize font-semibold">
            delivery Information
          </p>

          {orderError && (
            <p className=" text-red-500 text-sm">{orderError.message}</p>
          )}

          {addAddressError && (
            <p className=" text-red-500 text-sm">{addAddressError.message}</p>
          )}

          {editUserError && (
            <p className=" text-red-500 text-sm">{editUserError.message}</p>
          )}

          <div className=" space-y-4 pb-6">
            {editAddressError && (
              <p className=" text-sm text-red-500">
                {editAddressError.message}
              </p>
            )}

            <div className=" space-y-3 ">
              <RadioGroup
                defaultValue={selectedAddress}
                value={selectedAddress}
                onValueChange={(e) => setSelectedAddress(e)}
                className=" space-y-2"
              >
                {addressLoading ? (
                  <p>Loading...</p>
                ) : (
                  <>
                    {addressData?.map(
                      ({
                        id,
                        city,
                        company,
                        street,
                        township,
                        addressDetail,
                      }: any) => (
                        <div
                          key={id}
                          className={`flex items-center ${
                            selectedAddress == id && "bg-gold-50"
                          } border border-gold-400 p-5 justify-between rounded-xl`}
                        >
                          <div className=" flex items-center gap-2">
                            <RadioGroupItem
                              className={`${
                                selectedAddress == id && "bg-gold-400"
                              }`}
                              value={`${id}`}
                              id={id}
                            />
                            <Label htmlFor={id}>
                              {addressDetail}, {township} , {city}, {street}
                            </Label>
                          </div>

                          <div className=" flex items-center">
                            <Button
                              size={"sm"}
                              disabled={editingAddress}
                              onClick={() => {
                                handleEdit(id);
                                setSelectedAddress(`${id}`);
                                btn?.current?.click();
                              }}
                              variant={"ghost"}
                            >
                              Edit
                            </Button>
                          </div>
                        </div>
                      )
                    )}
                  </>
                )}
              </RadioGroup>

              <div className=" flex justify-end">
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button ref={btn} variant="outline">
                      <Plus /> <span>Add New Address</span>
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>
                        <span className=" mb-4 flex justify-between items-center">
                          <span className=" font-serif text-xl">
                            Add New Address{" "}
                          </span>
                        </span>
                      </AlertDialogTitle>
                      <AlertDialogDescription className=" text-primary">
                        <form
                          onSubmit={handleAddressSubmit(handleEditAddress)}
                          className=" grid grid-cols-2 gap-4"
                        >
                          <div className=" flex flex-col col-span-full gap-1.5">
                            <Label htmlFor="address">Address Detail</Label>
                            <Textarea
                              id="address"
                              {...register("addressDetail")}
                              name="addressDetail"
                            />
                            {errors.addressDetail && (
                              <p className="text-red-500 text-xs">
                                {errors.addressDetail?.message}
                              </p>
                            )}
                          </div>

                          <div className=" space-y-1.5">
                            <FormInput
                              label="Township"
                              {...register("township")}
                              type="text"
                              id={"township"}
                              name={"township"}
                            />
                            {errors.township && (
                              <p className="text-red-500 text-xs">
                                {errors.township?.message}
                              </p>
                            )}
                          </div>

                          <div className=" space-y-1.5">
                            <FormInput
                              label="City"
                              type="text"
                              {...register("city")}
                              id={"city"}
                              name={"city"}
                            />
                            {errors.city && (
                              <p className="text-red-500 text-xs">
                                {errors.city?.message}
                              </p>
                            )}
                          </div>

                          <div className=" space-y-1.5 mb-10 col-span-full">
                            <FormInput
                              {...register("street")}
                              label="Street"
                              type="text"
                              id={"street"}
                              name={"street"}
                            />
                            {errors.street && (
                              <p className="text-red-500 text-xs">
                                {errors.street?.message}
                              </p>
                            )}
                          </div>

                          <div className=" flex col-span-full justify-end gap-3 items-center">
                            <Button
                              type="button"
                              onClick={() => {
                                btn.current?.click();
                                setOpen(false);
                                setIsEditing(false);
                                reset({
                                  city: "",
                                  company: "",
                                  addressDetail: "",
                                  street: "",
                                  township: "",
                                });
                              }}
                              disabled={addingAddress || editingAddress}
                              variant={"link"}
                            >
                              Cancel
                            </Button>
                            <Button
                              disabled={addingAddress || editingAddress}
                              variant={"default"}
                            >
                              Save Address
                            </Button>
                          </div>
                        </form>
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel ref={btn} className=" hidden">
                        Close
                      </AlertDialogCancel>
                      <AlertDialogAction className=" hidden">
                        Continue
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          </div>

          <div className=" pb-6">
            <p className=" text-xl lg:text-3xl pb-3 capitalize font-semibold">
              Personal Information
            </p>

            <div className=" p-8 border border-gold-400 rounded-xl ">
              <div className=" lg:grid-cols-2 gap-8 grid grid-cols-1">
                <div className="">
                  <FormInput
                    label="Your Name"
                    {...infoRegister("name")}
                    type="text"
                    id={"name"}
                  />

                  {infoErrors.name && (
                    <p className="text-red-500 text-xs">
                      {infoErrors.name?.message}
                    </p>
                  )}
                </div>
                <div className="">
                  <FormInput
                    label="Your Phone"
                    {...infoRegister("phone")}
                    type="text"
                    id={"phone"}
                  />

                  {infoErrors.phone && (
                    <p className="text-red-500 text-xs">
                      {infoErrors.phone?.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <FormInput
                    label="Your Email"
                    {...infoRegister("email")}
                    type="email"
                    id={"email"}
                  />

                  {infoErrors.email && (
                    <p className="text-red-500 text-xs">
                      {infoErrors.email?.message}
                    </p>
                  )}
                </div>

                <div className="">
                  <FormInput
                    label="Date of Birth (Optional)"
                    {...infoRegister("dateOfBirth")}
                    className=" !w-full"
                    type="date"
                    id={"dateOfBirth"}
                  />

                  {infoErrors.email && (
                    <p className="text-red-500 text-xs">
                      {infoErrors.email?.message}
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="">
            <p className=" text-xl lg:text-3xl pb-3 capitalize font-semibold">
              Remark for order
            </p>

            <div className=" space-y-1.5">
              <Textarea
                value={remark}
                rows={6}
                onChange={(e) => setRemark(e.target.value)}
                className=" mb-6 shadow w-full focus-visible:ring-gold-400 border-gold-400"
              />

              {infoErrors.email && (
                <p className="text-red-500 text-xs">
                  {infoErrors.email?.message}
                </p>
              )}
            </div>
          </div>

          <p className=" text-xl lg:text-3xl pb-3 capitalize font-semibold">
            Payment Method
          </p>

          <RadioGroup defaultValue={"cash"}>
            <div
              className={`flex items-center bg-gold-50 border border-gold-400 p-5 justify-between rounded-xl`}
            >
              <div className=" flex items-center gap-2">
                <RadioGroupItem
                  className={`bg-gold-400`}
                  value={`cash`}
                  id={"cash"}
                />
                <Label htmlFor={"cash"}>Cash On Delivery</Label>
              </div>
            </div>
          </RadioGroup>
        </div>

        <div className=" col-span-full w-full lg:basis-4/12">
          <OrderSummary
            buttonName={"Place Order"}
            cost={totalCost}
            disabled={
              selectedAddress == "" ||
              selectedAddress == "undefined" ||
              isMutating
            }
            run={handleSubmit(onSubmit)}
          />
        </div>
      </div>
    </Container>
  );
};

export default Checkout;
