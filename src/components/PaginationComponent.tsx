import type { Dispatch, SetStateAction } from "react";
import {
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "./ui/pagination";

interface IPaginationProps {
  currentPage: number;
  totalPage: number;
  setCurrentPage: Dispatch<SetStateAction<number>>;
}

export default function PaginationComponent({
  currentPage,
  totalPage,
  setCurrentPage,
}: IPaginationProps) {
  if (totalPage <= 1) return null;
  return (
    <div className="flex justify-end mt-6">
      <div>
        <PaginationContent>
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => setCurrentPage((prev) => prev - 1)}
                className={
                  currentPage === 1
                    ? "pointer-events-none opacity-50"
                    : "pointer-events-auto"
                }
              />
            </PaginationItem>
            {Array.from({ length: totalPage }, (_, index) => index + 1).map(
              (page) => (
                <PaginationItem key={page} onClick={() => setCurrentPage(page)}>
                  <PaginationLink isActive={currentPage === page}>
                    {page}
                  </PaginationLink>
                </PaginationItem>
              ),
            )}
            <PaginationItem>
              <PaginationNext
                onClick={() => setCurrentPage((prev) => prev + 1)}
                className={
                  currentPage === totalPage
                    ? "pointer-events-none opacity-50"
                    : "pointer-events-auto"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </PaginationContent>
      </div>
    </div>
  );
}
