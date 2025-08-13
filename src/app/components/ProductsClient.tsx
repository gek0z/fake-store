"use client";

import React from "react";
import { useMemo } from "react";
import type { Product } from "@/types/product";
import { useProductsStore } from "@/store/useProductsStore";
import type { SortOption } from "@/store/useProductsStore";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card } from "@/components/ui/card";

type ProductsClientProps = {
  products: Product[];
  categories: string[];
};

export default function ProductsClient({
  products,
  categories,
}: ProductsClientProps) {
  const query = useProductsStore((s) => s.query);
  const category = useProductsStore((s) => s.category);
  const sort = useProductsStore((s) => s.sort);
  const setQuery = useProductsStore((s) => s.setQuery);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setSort = useProductsStore((s) => s.setSort);

  const visibleProducts = useMemo(() => {
    let list = products;

    if (category !== "all") {
      list = list.filter((p) => p.category === category);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter((p) => p.title.toLowerCase().includes(q));
    }

    if (sort !== "none") {
      list = [...list].sort((a, b) => {
        switch (sort) {
          case "price-asc":
            return a.price - b.price;
          case "price-desc":
            return b.price - a.price;
          case "rate-desc":
            return (b.rating?.rate ?? 0) - (a.rating?.rate ?? 0);
          default:
            return 0;
        }
      });
    }

    return list;
  }, [products, query, category, sort]);

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-3 sm:items-end">
        <div className="flex-1">
          <Label htmlFor="search-title" className="mb-1 block">
            Search by title
          </Label>
          <Input
            id="search-title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
          />
        </div>
        <div>
          <Label className="mb-1 block">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger
              aria-label="Category"
              role="combobox"
              className="w-full sm:w-[220px]"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All</SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c}>
                  {c}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div>
          <Label className="mb-1 block">Sort</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger
              aria-label="Sort"
              role="combobox"
              className="w-full sm:w-[220px]"
            >
              <SelectValue placeholder="Select sort" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="none">None</SelectItem>
              <SelectItem value="price-asc">Price: Low to High</SelectItem>
              <SelectItem value="price-desc">Price: High to Low</SelectItem>
              <SelectItem value="rate-desc">Highest Rating</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleProducts.map((p) => (
          <Card key={p.id} className="p-4">
            <article>
              <div className="relative w-full h-48 mb-3">
                <img
                  src={p.image}
                  alt={p.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-sm font-medium line-clamp-2 mb-1">
                {p.title}
              </h3>
              <div className="text-xs text-black/60 dark:text-white/60 mb-2 capitalize">
                {p.category}
              </div>
              <div className="flex items-center justify-between">
                <span className="font-semibold">£{p.price.toFixed(2)}</span>
                <span className="text-xs">{p.rating?.rate ?? 0}</span>
              </div>
            </article>
          </Card>
        ))}
      </div>

      {visibleProducts.length === 0 && (
        <div className="text-center text-sm text-black/60 dark:text-white/60">
          No products found.
        </div>
      )}
    </div>
  );
}
