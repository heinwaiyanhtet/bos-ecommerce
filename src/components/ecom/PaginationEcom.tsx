import React from "react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";

interface PaginationEcomProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

const PaginationEcom: React.FC<PaginationEcomProps> = ({
  currentPage,
  totalPages,
  onPageChange,
}) => {
  const maxPageLinks = 3;
  const generatePageNumbers = () => {
    const pageNumbers = [];
    const halfMaxPageLinks = Math.floor(maxPageLinks / 2);

    let startPage = Math.max(currentPage - halfMaxPageLinks, 1);
    let endPage = Math.min(startPage + maxPageLinks - 1, totalPages);

    if (endPage - startPage < maxPageLinks - 1) {
      startPage = Math.max(endPage - maxPageLinks + 1, 1);
    }

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return { startPage, endPage, pageNumbers };
  };

  const handlePageClick = (page: number) => {
    if (page !== currentPage && page > 0 && page <= totalPages) {
      onPageChange(page);
    }
  };

  const { startPage, endPage, pageNumbers } = generatePageNumbers();

  return (
    <Pagination>
      <PaginationPrevious
        onClick={() => handlePageClick(currentPage - 1)}
        isActive={currentPage === 1}
      ></PaginationPrevious>
      <PaginationContent>
        {startPage > 1 && (
          <>
            <PaginationItem>
              <PaginationLink
                className=" hover:bg-[#c4a35840]"
                onClick={() => handlePageClick(1)}
              >
                1
              </PaginationLink>
            </PaginationItem>
            {startPage > 2 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
          </>
        )}
        {pageNumbers.map((page) => (
          <PaginationItem key={page}>
            <PaginationLink
              isActive={page === currentPage}
              onClick={() => handlePageClick(page)}
              className={` ${
                page === currentPage
                  ? " bg-gold-400 text-white hover:text-white  hover:bg-[#9e8446]"
                  : ""
              } hover:bg-[#c4a35840]`}
            >
              {page}
            </PaginationLink>
          </PaginationItem>
        ))}
        {endPage < totalPages && (
          <>
            {endPage < totalPages - 1 && (
              <PaginationItem>
                <PaginationEllipsis />
              </PaginationItem>
            )}
            <PaginationItem>
              <PaginationLink
                className=" hover:bg-[#c4a35840]"
                onClick={() => handlePageClick(totalPages)}
              >
                {totalPages}
              </PaginationLink>
            </PaginationItem>
          </>
        )}
      </PaginationContent>
      <PaginationNext
        onClick={() => handlePageClick(currentPage + 1)}
        isActive={currentPage === totalPages}
      ></PaginationNext>
    </Pagination>
  );
};

export default PaginationEcom;
