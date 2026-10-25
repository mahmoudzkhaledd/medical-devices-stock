"use client";

import { useState } from "react";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { cn } from "cn";
import { Input } from "../ui/input";
import { useDebounce } from "use-debounce";
import { Label } from "../ui/label";
import { ListFilter, RefreshCcwDot } from "lucide-react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { siteConstants } from "@/constants/site-constants";

type DynamicSelectorProps<T> = {
  id: string;
  name?: string;
  title: string;
  placeholder: string;
  description?: string;
  dependancies?: unknown[];

  // Controlled API
  value?: T | null;

  // Backward compatibility
  selectedItem?: T;
  onChooseItem?: (item?: T) => void;

  onFetchData: (search: string, page: number) => Promise<T[]>;
  dataExtractor: (item: T) => {
    key: string;
    value: string;
  };
  label?: string;
  disabled?: boolean;
  required?: boolean;
  error?: string;
  className?: string;
  allOption?: {
    key: string;
    value: string;
  };
};

export default function DynamicSelector<T>({
  title,
  placeholder,
  description,
  dependancies = [],
  id,
  onFetchData,
  dataExtractor,
  selectedItem,
  onChooseItem,
  name,
  disabled = false,
  required = false,
  error,
  className,
  allOption,
  label,
}: DynamicSelectorProps<T>) {
  const [open, setOpen] = useState(false);
  const [page, setPage] = useState<number>(0);
  const [text, setSearch] = useState<string>("");
  const [search] = useDebounce(text, 1000);
  const {
    isLoading,
    data,
    isError,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: [id, search, ...dependancies],
    initialPageParam: 0,
    queryFn: ({ pageParam }) => onFetchData(search, pageParam),
    getNextPageParam: (lastPage, allPages) =>
      lastPage.length === siteConstants.maxItemsPerPage
        ? allPages.length
        : undefined,
    enabled: open,
  });
  const items = data?.pages.flat() ?? [];
  const selectedItemData = selectedItem
    ? dataExtractor(selectedItem)
    : allOption;

  const handleItemClick = (item?: T) => {
    onChooseItem?.(item);
    setOpen(false);
  };
  const handleSearchChange = (s: string) => {
    setSearch(s);
  };
  const handleLoadMore = () => {
    if (hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  };
  return (
    <div className={cn("", className)}>
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>
          <div className="w-full space-y-2">
            {label && <Label className="text-muted-foreground">{label}</Label>}
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              aria-invalid={!!error}
              aria-required={required}
              className={cn(
                "w-full justify-start font-normal",
                !selectedItemData && "text-muted-foreground",
                error && "border-destructive",
              )}
            >
              {selectedItemData?.value ?? placeholder}
            </Button>
          </div>
        </DialogTrigger>

        {error && (
          <p className="text-destructive text-sm" role="alert">
            {error}
          </p>
        )}
        <DialogContent className="w-full !max-w-[700px] pb-4">
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
            {description && (
              <DialogDescription>{description}</DialogDescription>
            )}
          </DialogHeader>
          {!isLoading && !isError && (
            <div>
              <Input
                value={text}
                onChange={(e) => handleSearchChange(e.target.value)}
                placeholder="Search ..."
                className="w-full"
              />
            </div>
          )}
          <hr />
          <div className="max-h-[500px] space-y-2 overflow-y-auto px-1">
            {isLoading && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                Loading...
              </p>
            )}

            {isError && (
              <p className="text-destructive py-4 text-center text-sm">
                Failed to load items. Please try again.
              </p>
            )}

            {!isLoading && !isError && allOption && items.length > 0 && (
              <button
                type="button"
                key={allOption.key}
                onClick={() => handleItemClick(undefined)}

                className={cn(
                  "hover:bg-muted flex w-full cursor-pointer items-center gap-2 rounded-lg border px-3 py-2 text-start transition-colors",
                  selectedItem == null && "bg-muted",
                )}
              >
                <ListFilter className="size-4" />
                {allOption.value}
              </button>
            )}
            {items.map((item) => {
              const itemData = dataExtractor(item);
              const isSelected = itemData.key === selectedItemData?.key;

              return (
                <button
                  type="button"
                  key={itemData.key}
                  onClick={() => handleItemClick(item)}
                  aria-pressed={isSelected}
                  className={cn(
                    "hover:bg-muted w-full cursor-pointer rounded-lg border px-3 py-2 text-start transition-colors",
                    isSelected && "bg-muted border-primary",
                  )}
                >
                  {itemData.value}
                </button>
              );
            })}
            {!isLoading && !isError && hasNextPage && (
              <div className="mt-4 flex w-full items-center justify-center">
                <Button
                  onClick={handleLoadMore}
                  disabled={isFetchingNextPage}
                  className=""
                >
                  <RefreshCcwDot
                    className={cn({
                      "animate-spin": isFetchingNextPage,
                    })}
                  />
                  Load more
                </Button>
              </div>
            )}
            {!isLoading && !isError && items.length === 0 && (
              <p className="text-muted-foreground py-4 text-center text-sm">
                No items found.
              </p>
            )}
          </div>

          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {name && (
        <input
          type="hidden"
          name={name}
          value={selectedItemData?.key ?? ""}
          required={required}
        />
      )}
    </div>
  );
}
