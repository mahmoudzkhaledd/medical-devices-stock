"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
} from "@/components/ui/pagination";

import { cn } from "@/lib/utils";
import { Button } from "../ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { siteConstants } from "@/constants/site-constants";

export default function AppPagination({
  page,
  length,
  totalItemsCount,
  className,
  onChangePage: userOnChangePage,
  additionalParams,
}: {
  page: number;
  length: number;
  totalItemsCount?: number | null;
  className?: string;
  additionalParams?: Record<string, string>;
  onChangePage?: (page: number) => void;
}) {
  const pageSize = siteConstants.maxItemsPerPage || 10;
  const totalPages = totalItemsCount
    ? Math.ceil(totalItemsCount / pageSize)
    : 0;
  const hasTotalCount = totalItemsCount != null && totalItemsCount > 0;

  const onChangePage = (newPage: number) => {
    if (userOnChangePage) {
      userOnChangePage(newPage);
    } else {
      const params = new URLSearchParams(window.location.search);
      if (additionalParams) {
        Object.entries(additionalParams).forEach(([key, value]) => {
          params.set(key, value);
        });
      }
      params.set("page", `${newPage}`);
      window.location.href = `?${params.toString()}`;
    }
  };

  return (
    <Pagination className={className}>
      <PaginationContent
        className={cn("flex-wrap items-center justify-center gap-2", {})}
      >
        {/* Previous Button */}
        <PaginationItem>
          <Button
            variant="ghost"
            className="cursor-pointer border"
            onClick={() => onChangePage(page - 1)}
            disabled={page === 0}
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Previous
          </Button>
        </PaginationItem>

        {/* Direct Page Numbers (if totalItemsCount is provided) */}
        {hasTotalCount ? (
          Array.from({ length: totalPages }).map((_, index) => {
            const isCurrent = page === index;
            return (
              <PaginationItem key={index}>
                <Button
                  variant={isCurrent ? "default" : "outline"}
                  size="icon"
                  className="h-9 w-9 cursor-pointer"
                  onClick={() => onChangePage(index)}
                >
                  {index + 1}
                </Button>
              </PaginationItem>
            );
          })
        ) : (
          <span className="text-muted-foreground px-2 text-sm">
            Page {page + 1}
          </span>
        )}

        {/* Next Button */}
        <PaginationItem>
          <Button
            variant="ghost"
            className="cursor-pointer border"
            onClick={() => onChangePage(page + 1)}
            disabled={
              hasTotalCount
                ? page >= totalPages - 1
                : length < siteConstants.maxItemsPerPage
            }
          >
            Next
            <ArrowRight className="ml-1 h-4 w-4" />
          </Button>
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
