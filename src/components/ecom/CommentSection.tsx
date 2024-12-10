"use client";

import React, { useEffect, useRef, useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { DotsVerticalIcon } from "@radix-ui/react-icons";
import useSWR from "swr";
import { Backend_URL, getFetchForEcom } from "@/lib/fetch";
import useSWRMutation from "swr/mutation";
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
import { Clock } from "lucide-react";
import { useAppProvider } from "@/app/Provider/AppProvider";
import Image from "next/image";
import { FaGoogle } from "react-icons/fa";

// Define the response shape for your post request
interface PostCommentResponse {
  status: boolean;
  message?: string;
  data?: any;
}

const CommentSection = ({
  isUser,
  handleLogin,
  postData,
  productId,
  deleteData,
  customerId,
  getSession,
}: {
  isUser: boolean;

  postData: (
    url: string,
    { arg }: { arg: any }
  ) => Promise<PostCommentResponse>;
  productId: number;
  handleLogin: () => void;
  deleteData: (url: string) => any;
  customerId: number | undefined;
  getSession: () => void;
}) => {
  const [text, setText] = useState("");
  const [replyText, setReplyText] = useState("");
  const [isClient, setIsClient] = useState(false);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const [deleteId, setDeleteId] = useState<null | number>(null);
  const [editId, setEditId] = useState({
    status: false,
    id: "",
  });

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getData = (url: string) => {
    return getFetchForEcom(url);
  };

  const { data, error, mutate } = useSWR(
    `${Backend_URL}/comments/product/${productId}`,
    getData,
    {
      shouldRetryOnError: false,
      errorRetryCount: 0,
    }
  );

  const alertRef = useRef<HTMLButtonElement | null>(null);

  const getSingleData = async (url: string) => {
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

  const { data: singleData, mutate: editMutate } = useSWR(
    editId.status ? `${Backend_URL}/comments/${editId.id}` : null,
    getSingleData,
    {
      revalidateIfStale: false,
      revalidateOnFocus: false,
      revalidateOnReconnect: false,
      errorRetryInterval: 5000,
      dedupingInterval: 0,
      shouldRetryOnError: false,
    }
  );

  useEffect(() => {
    if (singleData) {
      setText(singleData.content);
      inputRef.current && inputRef.current?.focus();
    }
  }, [singleData]);

  const {
    data: addData,
    error: addError,
    trigger: postComment,
  } = useSWRMutation(`${Backend_URL}/comments`, postData);

  const { trigger: deleteItem } = useSWRMutation(
    deleteId !== null ? `${Backend_URL}/comments/${deleteId}` : null,
    deleteData
  );

  const patchComment = async (url: string, { arg }: { arg: any }) => {
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

  const {
    data: editCommentData,
    error: editCommentError,
    trigger: editComment,
  } = useSWRMutation(
    editId.status ? `${Backend_URL}/comments/${editId.id}` : null,
    patchComment
  );

  const ref = useRef<HTMLButtonElement | null>(null);

  const [replyId, setReplyId] = useState<null | number>(null);

  const { error: replyError, trigger: reply } = useSWRMutation(
    replyId !== null ? `${Backend_URL}/comments` : null,
    postData
  );

  const timeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.round((now.getTime() - date.getTime()) / 1000);

    const intervals: { label: string; seconds: number }[] = [
      { label: "year", seconds: 31536000 },
      { label: "month", seconds: 2592000 },
      { label: "day", seconds: 86400 },
      { label: "hr", seconds: 3600 },
      { label: "min", seconds: 60 },
    ];

    for (let i = 0; i < intervals.length; i++) {
      const interval = Math.floor(seconds / intervals[i].seconds);
      if (interval >= 1) {
        return `${interval} ${intervals[i].label}${
          interval > 1 ? "s" : ""
        } ago`;
      }
    }

    return "just now";
  };

  const [isFocus, setIsFocus] = useState(false);

  return (
    <div className="my-12 me-2 space-y-3">
      <p className="text-2xl font-semibold">Customer Reviews</p>
      {addError && (
        <p>
          <span className="text-red-500">Error:</span> {addError.message}
        </p>
      )}
      {editCommentError && (
        <p>
          <span className="text-red-500">Error:</span> {addError.message}
        </p>
      )}
      <div className=" relative group">
        <Textarea
          rows={5}
          value={text}
          ref={inputRef}
          onChange={(e) => setText(e.target.value)}
          placeholder="Write a review"
          className="w-full"
          onFocus={() => {
            if (!isUser) {
              alertRef.current && alertRef.current.click();
            } else {
              setIsFocus(true);
            }
          }}
          onBlur={() => setIsFocus(false)}
        />

        <div className={`absolute bottom-0 right-0 p-3 duration-300`}>
          <Button
            onClick={async () => {
              const res = editId.status
                ? await editComment({ content: text, status: "PENDING" })
                : await postComment({
                    content: text,
                    productId: productId,
                  });

              if (res?.status) {
                setText("");
                setEditId({
                  status: false,
                  id: "",
                });
                mutate();
              }
            }}
          >
            Save Review
          </Button>
        </div>
      </div>
      <div className="w-full my-6">
        {data?.data.filter(
          (el: any) => el.status == "APPROVED" || el.customer.id == customerId
        ).length === 0 ? (
          <p className="font-medium">Be the first one to give a review!</p>
        ) : (
          <p className="font-medium">All Reviews</p>
        )}

        {data?.data
          .filter(
            (el: any) =>
              // el.parentId == null &&
              el.status == "APPROVED" || el.customer.id == customerId
          )
          .map(
            ({
              id: parentId,
              content,
              replies,
              customer: { name, id: customerIds },
              createdAt,
            }: any) => (
              <div
                key={parentId}
                className="border mt-3 space-y-0.5 rounded-xl border-stone-400 p-4"
              >
                <div className="flex items-center justify-between">
                  <p className=" font-serif ps-3">{name}</p>
                  {customerIds == customerId && (
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <DotsVerticalIcon />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent>
                        <DropdownMenuItem
                          onClick={() =>
                            setEditId({
                              status: true,
                              id: parentId,
                            })
                          }
                        >
                          Edit
                        </DropdownMenuItem>
                        <DropdownMenuItem
                          onClick={async () => {
                            await setDeleteId(parentId);
                            const res = await deleteItem();
                            if (res) {
                              mutate();
                            }
                          }}
                        >
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>

                <p className="text-sm text-stone-500 bg-[#fff5de] p-3 rounded leading-6">
                  {content}
                </p>

                <div className=" flex gap-1  items-center">
                  <div className=" flex gap-2 ps-3 items-center">
                    <Clock size={16} />
                    <p className=" text-xs">{timeAgo(createdAt)}</p>
                  </div>

                  <Button
                    variant={"link"}
                    size={"sm"}
                    onClick={() => {
                      setReplyId(parentId);
                    }}
                  >
                    Reply
                  </Button>
                </div>

                <div className=" ms-4">
                  {replies.length > 0 && (
                    <>
                      {replies.map(
                        (
                          {
                            content,
                            customer: { name, id: replyCustomerId },
                            id,
                            shopCreated,
                            parentId,
                            createdAt,
                            status,
                          }: any,
                          index: any
                        ) => (
                          <React.Fragment key={index}>
                            {(status == "APPROVED" ||
                              replyCustomerId == customerId) && (
                              <div
                                key={index}
                                className=" border-l-2 mb-3 border-l-gold-400 pt-3 ps-3 space-y-0.5"
                              >
                                <div className=" flex justify-between items-center">
                                  <p className=" font-serif ps-3">{name}</p>
                                  {!shopCreated &&
                                    replyCustomerId == customerId && (
                                      <DropdownMenu>
                                        <DropdownMenuTrigger>
                                          <DotsVerticalIcon />
                                        </DropdownMenuTrigger>
                                        <DropdownMenuContent>
                                          <DropdownMenuItem
                                            onClick={() =>
                                              setEditId({
                                                status: true,
                                                id,
                                              })
                                            }
                                          >
                                            Edit
                                          </DropdownMenuItem>
                                          <DropdownMenuItem
                                            onClick={async () => {
                                              await setDeleteId(id);
                                              const res = await deleteItem();
                                              if (res) {
                                                mutate();
                                                console.log(res);
                                              }
                                            }}
                                          >
                                            Delete
                                          </DropdownMenuItem>
                                        </DropdownMenuContent>
                                      </DropdownMenu>
                                    )}
                                </div>

                                <p className="text-sm text-stone-500 bg-[#fff5de] p-3 rounded leading-6">
                                  {content}
                                </p>

                                <div className=" flex gap-1 items-center">
                                  <div className=" flex gap-2 ps-3  items-center">
                                    <Clock size={16} />
                                    <p className=" text-xs">
                                      {timeAgo(createdAt)}
                                    </p>
                                  </div>

                                  <Button
                                    variant={"link"}
                                    size={"sm"}
                                    className=" !text-xs"
                                    onClick={() => {
                                      setReplyId(parentId);
                                    }}
                                  >
                                    Reply
                                  </Button>
                                </div>
                              </div>
                            )}
                          </React.Fragment>
                        )
                      )}
                    </>
                  )}
                </div>

                <div className=" mt-2">
                  {replyId !== null && replyId == parentId && (
                    <div className=" relative group">
                      <Textarea
                        rows={5}
                        value={replyText}
                        ref={inputRef}
                        onChange={(e) => setReplyText(e.target.value)}
                        placeholder="Write a review"
                        className="w-full"
                        onFocus={() => {
                          if (!isUser) {
                            alertRef.current && alertRef.current.click();
                          } else {
                            setIsFocus(true);
                          }
                        }}
                        onBlur={() => setIsFocus(false)}
                      />

                      <div
                        className={`absolute bottom-0 right-0 p-3 duration-300`}
                      >
                        <Button
                          onClick={async () => {
                            const res = await reply({
                              content: replyText,
                              productId: productId,
                              parentId: parentId,
                            });
                            if (res?.status) {
                              setReplyText("");
                              mutate();
                              setReplyId(null);
                            }
                          }}
                        >
                          Save Review
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )
          )}
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
              Add to wishlist
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle className=" flex justify-center">
                <Image width={300} height={300} src={"/svg7.svg"} alt="" />
              </AlertDialogTitle>
              <AlertDialogDescription>
                <p className=" mt-4 text-stone-800 text-lg text-center font-bold font-serif">
                  Sign in with Google to Checkout
                </p>
                <p className=" text-center">
                  You&apos;re just one step away from getting your favorites!
                </p>
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter className=" mt-6 flex  !justify-center">
              <AlertDialogCancel ref={ref}>Cancel</AlertDialogCancel>
              <Button
                onClick={() => {
                  handleLogin();
                  ref.current?.click();
                }}
                className=" bg-gold-400 hover:bg-[#e2be6a]  !py-4 rounded-full "
              >
                <FaGoogle className=" me-1" /> Login with Google
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    </div>
  );
};

export default CommentSection;
