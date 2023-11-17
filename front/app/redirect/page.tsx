"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { userInfoStore } from "../../stores/userInfoStore";
import { useEventSourceStore } from "../../stores/eventSourceStore";
import Image from "next/image";

const RedirectPage = () => {
  const router = useRouter();
  const search = useSearchParams();
  const { approachUrl } = userInfoStore();
  //나무 존재 여부 확인
  const searchTree = async (accessToken: string) => {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/tree/exist`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );
      const data = await res.json();
      console.log(data);
      console.log(data.treeId);
      return data.treeId;
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      const accessToken = search?.get("accesstoken");

      if (accessToken) {
        // accessToken을 userInfoStore에 저장
        userInfoStore.getState().setMember(accessToken);
        console.log("Received access token:", accessToken);

        const tokenParts = accessToken.split(".");
        if (tokenParts.length === 3) {
          const decodedToken = JSON.parse(atob(tokenParts[1]));
          const userId = decodedToken.id;

          console.log("id:", userId);

          const treeId = await searchTree(accessToken);
          console.log("treeId: ", treeId);

          // EventSource 생성
          const sse = new EventSource(
            `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/notification/subscribe/${userId}`
          );
          useEventSourceStore.getState().setEventSource(sse);
          console.log("sse: ", sse);

          // 트리 존재 여부에 따라 페이지 이동

          let destination = null;

          if (treeId === null) {
            destination = "/enter/terms";
          } else if (approachUrl !== "") {
            destination = `/garden/${approachUrl}`;
          } else {
            destination = "home";
          }

          router.push(destination);
        } else {
          console.error("Invalid access token format");
        }
      }
    };
    fetchData();
  }, []);

  return (
    <div className="w-screen h-screen bg-white flex flex-col items-center justify-center gap-5">
      <Image
        alt="logo"
        src={"/assets/images/groogroo_logo.png"}
        width={300}
        height={100}
      ></Image>
      <Image
        alt="loading"
        src={"/assets/gif/loading.gif"}
        width={100}
        height={30}
      ></Image>
    </div>
  );
};

export default RedirectPage;
