import { useState } from 'react';

interface AdminPagenationProp {
  totalPages: number;
  onPageChange: (pageNumber: number) => void;
}

const AdminPagenation = ({ totalPages, onPageChange }: AdminPagenationProp) => {
  const [currentPage, setCurrentPage] = useState(1);

  const itemsPerPage = 5; // 한 번에 보여줄 페이지 수
  const totalPageGroups = Math.ceil(totalPages / itemsPerPage);
  const currentPageGroup = Math.ceil(currentPage / itemsPerPage);

  const startPage = (currentPageGroup - 1) * itemsPerPage + 1;
  const endPage = Math.min(currentPageGroup * itemsPerPage, totalPages);

  const handlePageClick = (pageNumber: number) => {
    setCurrentPage(pageNumber);
    onPageChange(pageNumber-1);
  };

  const handlePrevClick = () => {
    if (currentPageGroup > 1) {
      setCurrentPage((currentPageGroup - 1) * itemsPerPage);
      onPageChange((currentPageGroup - 1) * itemsPerPage -1);
    }
  };

  const handleNextClick = () => {
    if (currentPageGroup < totalPageGroups) {
      setCurrentPage(currentPageGroup * itemsPerPage + 1);
      onPageChange(currentPageGroup * itemsPerPage);
    }
  };

  const pages = Array.from({ length: endPage - startPage + 1 }, (_, index) => startPage + index);

  return (
    <div className="w-full mt-5">
      <nav aria-label="w-full flex Page navigation example">
        <ul className="list-style-none flex justify-center">
          <li>
            <a
              className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100"
              aria-label="Previous"
              onClick={handlePrevClick}
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>

          {pages.map((page) => (
            <li key={page}>
              <a
                className={`relative block rounded px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 ${
                  currentPage === page ? 'bg-slate-400' : ''
                }`}
                onClick={() => handlePageClick(page)}
              >
                {page}
              </a>
            </li>
          ))}

          <li>
            <a
              className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100"
              aria-label="Next"
              onClick={handleNextClick}
            >
              <span aria-hidden="true">&raquo;</span>
            </a>
          </li>
        </ul>
      </nav>
    </div>
  );
};

export default AdminPagenation;