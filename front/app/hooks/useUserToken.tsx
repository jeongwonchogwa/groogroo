import { useState, useEffect } from "react";
import { redirect } from "next/navigation";

const useUserToken = () => {
  const [userToken, setUserToken] = useState("");

  useEffect(() => {
    const sessionStorageData = sessionStorage.getItem("userInfo");
    if (sessionStorageData) {
      const sessionStorageObject = JSON.parse(sessionStorageData);
      const token = sessionStorageObject?.state?.userToken;
      if (token) {
        setUserToken(token);
      } else {
        console.log("userToken이 존재하지 않습니다.");
        redirect("/enter");
      }
    }
  }, []);

  return userToken;
};

export default useUserToken;
