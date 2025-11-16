"use client";

import { FC } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Pagination } from "@nextui-org/react";

interface PaginationControlsProps {
  hasNextPage: boolean;
  hasPrevPage: boolean;
  pagetotal: number;
  perpage: number;
  pageindex: number;
}

const PaginationControls: FC<PaginationControlsProps> = ({
  hasNextPage,
  hasPrevPage,
  pagetotal,
  perpage,
  pageindex,
}) => {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateUrl = (newPage: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(newPage)); // add / replace page param

    router.push(`/shop?${params.toString()}`, { scroll: false }); // no refresh needed
  };

  return (
    <div className="flex gap-2">
      <div className="flex flex-col gap-5">
        {pagetotal > 0 ? (
          <Pagination
            isCompact
            showControls
            total={pagetotal}
            classNames={{
              wrapper: "gap-2",
              item: "w-10 h-10 md:w-8 md:h-8 text-foreground bg-[hsl(var(--card)/0.60)] border border-border hover:bg-[hsl(var(--card)/0.80)]",
              cursor: "bg-[hsl(var(--accent))] text-black font-semibold",
              prev: "w-10 h-10 md:w-8 md:h-8 bg-[hsl(var(--card)/0.60)] border border-border text-foreground hover:bg-[hsl(var(--card)/0.80)]",
              next: "w-10 h-10 md:w-8 md:h-8 bg-[hsl(var(--card)/0.60)] border border-border text-foreground hover:bg-[hsl(var(--card)/0.80)]",
            }}
            page={pageindex}
            onChange={(e) => {
              updateUrl(Number(e));
            }}
          />
        ) : null}
      </div>
    </div>
  );
};

export default PaginationControls;
