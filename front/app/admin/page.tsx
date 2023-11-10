"use client";

import { useEffect, useState } from "react";
import { redirect, useRouter } from "next/navigation";
import { Report } from "@/app/types";
import AdminHeader from "./components/AdminHeader";
import AdminDropdown from "./components/AdminDropdown";
import AdminTable from "./components/AdminTable";
import AdminPagenation from "./components/AdminPagenation";
import { userInfoStore } from "@/stores/userInfoStore";

interface DropdownItem {
  label: string;
  action: () => void;
}

const AdminPage = () => { 
  const router = useRouter();
  const [userToken, setUserToken] = useState<string>("");
  const [certified, setCertified] = useState<boolean>(false);
  const [isOpen, setIsOpen] = useState(false);
  const [sortType, setSortType] = useState<null | true | false>(false);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);

  const { setMember } = userInfoStore();

  useEffect(() => {
    setMember("eyJhbGciOiJIUzI1NiJ9.eyJzdWIiOiJraW1qdzM5MjhAbmF2ZXIuY29tIiwiaWQiOjEsInJvbGUiOiJST0xFX0FETUlOIiwiaWF0IjoxNjk5NTAyOTk2LCJleHAiOjE3MDA3MTI1OTZ9.F9yzokfTwuiqV8D158LOhTj8Jyqj74PIo_NMjmnacYY");

    // 세션 스토리지에서 userInfo 가져오기
    const userInfoString = sessionStorage.getItem('userInfo');
    
    if(userInfoString) {
        const userInfo = JSON.parse(userInfoString);
        setUserToken(userInfo.state.userToken);

        const tokenParts = userInfo.state.userToken.split(".");
        console.log(tokenParts[1]);
        const decodedToken = JSON.parse(atob(tokenParts[1]));
        console.log("Role", decodedToken.role);
        
        if(decodedToken.role !== "ROLE_ADMIN") {
          redirect("/not-found");
        }

        setCertified(true);
    } else {
      redirect("/not-found");
    }
  }, []);

    useEffect(() => {
    if(certified){
      fetchGetReportList(pageNumber, sortType);
    }
  }, [certified]);

  useEffect(() => {
    fetchGetReportList(pageNumber, sortType);
  }, [pageNumber, sortType]);

  const items: DropdownItem[] = [
    {
      label: "전체",
      action: () => {
        console.log(sortType);
        setSortType(null);
      },
    },
    {
      label: "처리중",
      action: () => {
        console.log(sortType);
        setSortType(false);
      },
    },
    {
      label: "완료",
      action: () => {
        console.log(sortType);
        setSortType(true);
      },
    },
  ];

  // 신고 목록 API 요청
  const fetchGetReportList = async (pageNumber: number, completed: boolean | null) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin?pageNumber=${pageNumber}`;
      if (completed !== null) {
        url += `&completed=${completed}`;
      }
      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        setTotalPages(responseData.totalPages);
        setReportList(responseData.reportList);
      }
    } catch (error) {}
  };

  // 회원 차단 API  요청
  const clickExpel = async (userId: number) => {
    console.log("차단버튼 클릭");
    console.log("userId: ", userId);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin/user/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        fetchGetReportList(pageNumber, sortType);
      }
    } catch (error) {
      console.error("에러", error);
    }
  };

  // 신고 대상 삭제 API 요청
  const clickDelete = async (contentType: string, targetId: number) => {
    console.log("삭제버튼 클릭");
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userToken}`,
        },
        body: JSON.stringify({
          targetId,
          contentType,
        }),
      });

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        fetchGetReportList(pageNumber, sortType);
      }
    } catch (error) {
      console.error("에러", error);
    }
  };

  // 신고 대상 상세 보기 API 요청
  const clickDetail = async (contentType: string, targetId: number, reportId: number) => {
    try {
      let url = `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin/detail?contentType=${contentType}&targetId=${targetId}`;

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${userToken}`,
        },
      });
      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        if (contentType === "GARDEN") {
          console.log(responseData.gardenUrl);
          router.push(`/garden/${responseData.gardenUrl}`);
        } else {
          router.push(`/admin/${reportId}?content=${JSON.stringify(responseData.content)}`);
        }
      }
    } catch (error) {
      console.error("에러", error);
    }
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleItemClick = (action: () => void) => {
    action();
    setIsOpen(false);
  };

  const handlePageChange = (pageNumber: number) => {
    setPageNumber(pageNumber);
  };

  return ( 
    certified &&
    <div className="w-full h-full">
      {/* Use the Header component here */}
      <AdminHeader />
      {/* Use the Dropdown component here */}
      <AdminDropdown
        isOpen={isOpen}
        toggleDropdown={toggleDropdown}
        sortType={sortType}
        items={items}
        handleItemClick={handleItemClick}
      />
      {/* Use the Table component here */}
      <AdminTable
        reportList={reportList}
        sortType={sortType}
        clickExpel={clickExpel}
        clickDelete={clickDelete}
        clickDetail={clickDetail}
      />
      {/* Use the Pagination component here */}
      <AdminPagenation totalPages={totalPages} onPageChange={handlePageChange} />
    </div>
  );
};

export default AdminPage;
