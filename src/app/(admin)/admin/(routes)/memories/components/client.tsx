"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter, useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { ProductColumn, columns } from "./columns";

interface ProductsClientProps {
  data: ProductColumn[];
};

export const ProductsClient: React.FC<ProductsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();
  const searchParams = useSearchParams();

  // ✅ FILTER HANDLER
  const updateFilter = (key: string, value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    if (value) {
      params.set(key, value);
    } else {
      params.delete(key);
    }

    router.push(`?${params.toString()}`);
  };

  return (
    <> 
      {/* HEADER */}
      <div className="flex items-center justify-between">
        <Heading title={`Ram (${data.length})`} description="Manage products for your store" />
        <Button onClick={() => router.push(`/admin/memories/new`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>

      <Separator />

      {/* 🔥 FILTER BAR */}
      <div className="flex gap-4 mb-4">

        {/* Availability */}
        <select
          value={searchParams.get("availability") || ""}
          onChange={(e) => updateFilter("availability", e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">All Products</option>
          <option value="in_stock">In Stock</option>
          <option value="out_of_stock">Out of Stock</option>
          <option value="coming_soon">Coming Soon</option>
        </select>

        {/* Sorting */}
        <select
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateFilter("sort", e.target.value)}
          className="border rounded px-3 py-2 text-sm"
        >
          <option value="">Sort</option>
          <option value="price_asc">Price ↑</option>
          <option value="price_desc">Price ↓</option>
          <option value="name_asc">Name A-Z</option>
          <option value="name_desc">Name Z-A</option>
          <option value="date_desc">Newest</option>
          <option value="date_asc">Oldest</option>
        </select>

      </div>

      {/* TABLE */}
      <DataTable searchKey="name" columns={columns} data={data} />

      {/* API */}
      <Heading title="API" description="API Calls for memories" />
      <Separator />
      <ApiList entityName="products" entityIdName="productId" />
    </>
  );
};