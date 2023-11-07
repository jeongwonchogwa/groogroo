"use client";

import { useEffect, useState } from 'react';
import { userInfoStore } from "@/stores/userInfoStore";
import { redirect } from "next/navigation";
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

  useEffect(() => {
    if (userToken === "") redirect("/");
  }, [userToken]);

  const [isOpen, setIsOpen] = useState(false);

  const [sortType, setSortType] = useState<null | true | false>(null);

  const [reportList, setReportList] = useState<Report[]>([]);
  const [totalPages, setTotalPages] = useState<number>(0);

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
    fetchGetReportList(0, null);
  }, []);

  const clickExpel = async (userId: number) => {
    console.log("추방버튼 클릭");
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_GROOGROO_API_URL}/admin/user`,
        {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userToken}`,
          },
          body: JSON.stringify({
            userId,
          }),
        }
      );

      if (response.status === 200) {
        const responseData = await response.json();
        console.log(responseData);
      } 
    } catch (error) {
      console.error("에러", error);
    }
  };

  const clickDelete = async (targetId: number, contentType: string) => {
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

  // Define items array and admin data

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
      <AdminTable reportList={reportList} sortType={sortType} clickExpel={clickExpel} clickDelete={clickDelete} />
      {/* Use the Pagination component here */}
      <AdminPagenation totalPages={totalPages}/>
    </div>
  );
};

export default AdminPage;
