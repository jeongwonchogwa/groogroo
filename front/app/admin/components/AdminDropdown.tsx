interface DropdownItem {
  label: string;
  action: () => void;
}

interface AdminDropdownProps {
  isOpen: boolean;
  toggleDropdown: () => void;
  sortType: null | boolean;
  items: DropdownItem[];
  handleItemClick: (action: () => void) => void;
}

const AdminDropdown = ({ isOpen, toggleDropdown, sortType, items, handleItemClick }: AdminDropdownProps) => {
  return (
    <div className="flex justify-end w-full mt-5">
      {/* 너비 w-24로 고정 */}
      <div className="flex w-24 mr-5">
        <div className="relative inline-block w-full">
          <button
            className="w-full bg-gray-400 text-white shadow-lg px-4 py-2 rounded font-neoDunggeunmo_Pro text-sm"
            onClick={toggleDropdown}
          >
            {sortType === null ? "전체 ▽" : sortType === false ? "처리중 ▽" : "완료 ▽"}
          </button>
          {isOpen && (
            <ul className="w-24 absolute mt-2 py-2 bg-white border rounded">
              {items.map((item, index) => (
                <li
                  key={index}
                  className="cursor-pointer hover:bg-gray-100 px-4 py-2 font-neoDunggeunmo_Pro text-sm"
                  onClick={() => handleItemClick(item.action)}
                >
                  {item.label}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminDropdown;
