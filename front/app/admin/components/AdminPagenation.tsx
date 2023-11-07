interface AdminPagenationProp {
  totalPages: number;
}

const AdminPagenation = ({totalPages}:AdminPagenationProp) => {

  const pages = Array.from({ length: totalPages }, (_, index) => index + 1);
console.log(pages)
  return (
    <div className="w-full mt-5">
      <nav aria-label="w-full flex Page navigation example">
        <ul className="list-style-none flex justify-center">
          <li>
            <a
              className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              href="#"
              aria-label="Previous"
            >
              <span aria-hidden="true">&laquo;</span>
            </a>
          </li>
          {pages.map((page)=>{
            return(
              <li key={page}>
              <a
                className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
                href={`#${page}`}
              >
                {page}
              </a>
            </li>
            )
          })}
          <li>
            <a
              className="relative block rounded bg-transparent px-3 py-1.5 text-sm text-neutral-600 transition-all duration-300 hover:bg-neutral-100 dark:text-white dark:hover:bg-neutral-700 dark:hover:text-white"
              href="#"
              aria-label="Next"
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
