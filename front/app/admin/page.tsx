"use client";

import { useState } from "react";
import AdminHeader from "./components/AdminHeader";
import AdminDropdown from "./components/AdminDropdown";
import AdminTable from "./components/AdminTable";
import AdminPagenation from "./components/AdminPagenation";

interface DropdownItem {
  label: string;
  action: () => void;
}
const AdminPage = () => {
  const [isOpen, setIsOpen] = useState(false);

  const [sortType, setSortType] = useState<null | true | false>(null);

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

  const clickExpel = () => {
    console.log("추방버튼 클릭");
  };

  const clickDelete = () => {
    console.log("삭제버튼 클릭");
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
      <AdminTable sortType={sortType} clickExpel={clickExpel} clickDelete={clickDelete} />
      {/* Use the Pagination component here */}
      <AdminPagenation />
    </div>
  );
};

export default AdminPage;
