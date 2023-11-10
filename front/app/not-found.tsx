export default function NotFound() {
  return (
    <div className="h-screen flex flex-col justify-center items-center mx-10">
      <img src="assets/images/not_found.svg" alt="404 not found" />
      <div className="font-bitBit text-rose-500 mt-10">요청하신 페이지를 찾을 수 없습니다.</div>
    </div>
  );
}