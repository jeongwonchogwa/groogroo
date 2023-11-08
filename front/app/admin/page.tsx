"use client";

import { useEffect, useState } from 'react';
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect, useRouter } from "next/navigation";
import { Report } from  "@/app/types";
import AdminHeader from "./components/AdminHeader";
import AdminDropdown from "./components/AdminDropdown";
import AdminTable from "./components/AdminTable";
import AdminPagenation from "./components/AdminPagenation";

interface DropdownItem {
  label: string;
  action: () => void;
}
const AdminPage = () => {
  const { userToken } = userInfoStore();
  const router = useRouter();

  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  const [isOpen, setIsOpen] = useState(false);
  const [sortType, setSortType] = useState<null | true | false>(false);
  const [reportList, setReportList] = useState<Report[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(0);

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
  
  useEffect(() => {
    fetchGetReportList(pageNumber, sortType);
  }, [pageNumber, sortType]);

  const clickExpel = async (userId: number) => {
    console.log("차단버튼 클릭");
    console.log("userId: ", userId);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin/user/${userId}`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        fetchGetReportList(pageNumber,sortType);
      } 
    } catch (error) {
      console.error("에러", error);
    }
  };

  const clickDelete = async (contentType: string, targetId: number) => {
    console.log("삭제버튼 클릭");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin`,
        {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            targetId,
            contentType,
          }),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
        fetchGetReportList(pageNumber,sortType);
      } 
    } catch (error) {
      console.error("에러", error);
    }
  };

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
        if(contentType==="GARDEN"){
          console.log(responseData.gardenUrl);
          router.push(`/garden/${responseData.gardenUrl}`);
        }else{
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
      <AdminTable reportList={reportList} sortType={sortType} clickExpel={clickExpel} clickDelete={clickDelete} clickDetail={clickDetail}/>
      {/* Use the Pagination component here */}
      <AdminPagenation totalPages={totalPages} onPageChange={handlePageChange}/>
    </div>
  );
};

export default AdminPage;