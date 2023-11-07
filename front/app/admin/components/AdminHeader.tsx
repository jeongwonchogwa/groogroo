import IconButton from "../../components/IconButton";

const AdminHeader = () => {
  return (
    <header className="sticky top-[-1px] z-40 shadow-lg bg-white w-full">
      <div className="flex w-full h-full p-5 bg-slate-400">
        <div className="flex w-full justify-between">
          <p className="my-auto text-2xl font-bitBit">관리자 페이지</p>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
