"use client";

import { useAppProvider } from "@/app/Provider/AppProvider";
import FormInput from "@/components/FormInput.components";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from "@/components/ui/textarea";
import { Backend_URL } from "@/lib/fetch";
import { zodResolver } from "@hookform/resolvers/zod";
import { Plus } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useEffect, useRef, useState } from "react";
import { useForm } from "react-hook-form";
import SweetAlert2 from "react-sweetalert2";
import useSWR from "swr";
import useSWRMutation from "swr/mutation";
import { z } from "zod";
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

const UserAddressPage = () => {
  const [isClient, setIsClient] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [open, setOpen] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const { handleLogin,getSession } = useAppProvider();
  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
  }, []);

  useEffect(() => {
    if (isClient) {
      setUserId(localStorage.getItem("userId"));
    }
  }, [isClient]);

  const patchData = async (url: string, { arg }: any) => {
    try {
      const token = isClient && getSession();
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
      const token = isClient && getSession();
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
      const token = isClient && getSession();
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
    } catch (error: any) {
      console.error("Fetch API Error:", error.message);
      throw new Error(error.message || "An error occurred");
    }
  };

  useEffect(() => {
    setIsClient(true);
  }, []);

  const alertRef = useRef<HTMLButtonElement | null>(null);

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        alertRef.current?.click();
      }
    }
  }, [isClient]);
  const {
    data: addressData,
    isLoading: addressLoading,
    mutate,
  } = useSWR(userId !== null ? `${Backend_URL}/address` : null, getData);

  useEffect(() => {
    if (addressData) {
      setSelectedAddress(`${addressData[0]?.id}`);
    }
  }, [addressData]);

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
  type FormData = z.infer<typeof schema>;

  const {
    register,
    handleSubmit,
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

  const [swalProps2, setSwalProps2] = useState({
    show: false,
    showConfirmButton: false,
  });

  const [swalProps, setSwalProps] = useState({
    show: false,
    showConfirmButton: false,
  });

  useEffect(() => {
    if (isClient) {
      if (!localStorage.getItem("accessToken")) {
        setSwalProps({
          show: true,
          showConfirmButton: false,
        });
      }
    }
  }, [isClient]);

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

  const onSubmit = async (value: any) => {
    console.log(selectedAddress);
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
      btn.current?.click();
    }
  };

  const btn = useRef<HTMLButtonElement | null>(null);

  return (
    <div>
      <div className=" space-y-4 lg:ps-8 pb-6">
        {editAddressError && (
          <p className=" text-sm text-red-500">{editAddressError.message}</p>
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
                            btn?.current?.click();
                            setSelectedAddress(`${id}`);
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
                      onSubmit={handleSubmit(onSubmit)}
                      className=" grid grid-cols-2 gap-4"
                    >
                      <div className=" flex flex-col col-span-full gap-1.5">
                        <Label htmlFor="address">Street Address</Label>
                        <Textarea id="address" {...register("addressDetail")} />
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
                          id={"Township"}
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
                          id={"City"}
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
                          label="State or Division"
                          type="text"
                          id={"Street"}
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

      <div onClick={(e) => e.stopPropagation()}>
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button
              className=" hidden"
              onClick={(e) => e.stopPropagation()}
              ref={alertRef}
              variant="outline"
            >
              Sign In To Continue
            </Button>
          </AlertDialogTrigger>

          <AlertDialogContent className=" w-[400px] flex justify-center items-center flex-col py-6">
            <AlertDialogHeader>
              <AlertDialogTitle>Sign In To Continue!</AlertDialogTitle>
              <AlertDialogDescription>
                You need to sign in to continue.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel onClick={() => router.push("/")}>
                Cancel
              </AlertDialogCancel>
              <AlertDialogAction
                onClick={(e) => {
                  handleLogin();
                  e.stopPropagation();
                }}
              >
                Log in
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default UserAddressPage;
