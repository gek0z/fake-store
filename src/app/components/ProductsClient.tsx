"use client";

import React, { useMemo, useState, useCallback } from "react";
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
import { cn } from "@/lib/utils";
import { LayoutGrid, List as ListIcon } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

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
  const view = useProductsStore((s) => s.view);
  const setQuery = useProductsStore((s) => s.setQuery);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setSort = useProductsStore((s) => s.setSort);
  const setView = useProductsStore((s) => s.setView);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const openProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }, []);

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
              className="w-full sm:w-[220px] capitalize"
            >
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" className="capitalize">
                All
              </SelectItem>
              {categories.map((c) => (
                <SelectItem key={c} value={c} className="capitalize">
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
        <div>
          <Label className="mb-1 block">View</Label>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(
                "h-9 px-3 rounded-md border flex items-center gap-2",
                view === "grid"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-transparent"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="hidden sm:inline">Grid</span>
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={cn(
                "h-9 px-3 rounded-md border flex items-center gap-2",
                view === "list"
                  ? "bg-black text-white dark:bg-white dark:text-black"
                  : "bg-transparent"
              )}
            >
              <ListIcon className="h-4 w-4" />
              <span className="hidden sm:inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((p) => (
            <Card
              key={p.id}
              className="p-4 cursor-pointer"
              onClick={() => openProduct(p)}
            >
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
      ) : (
        <div className="space-y-4">
          {visibleProducts.map((p) => (
            <Card
              key={p.id}
              className="p-4 cursor-pointer"
              onClick={() => openProduct(p)}
            >
              <article className="flex gap-4 items-start">
                <div className="relative w-28 h-28 shrink-0">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="flex-1 min-w-0">
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
                </div>
              </article>
            </Card>
          ))}
        </div>
      )}

      {visibleProducts.length === 0 && (
        <div className="text-center text-sm text-black/60 dark:text-white/60">
          No products found.
        </div>
      )}

      <Dialog
        open={isDialogOpen}
        onOpenChange={(open) => {
          setIsDialogOpen(open);
          if (!open) setSelectedProduct(null);
        }}
      >
        {selectedProduct && (
          <DialogContent className="max-w-4xl w-full sm:max-w-2xl">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold">
                {selectedProduct.title}
              </DialogTitle>
              <DialogDescription>
                <span className="flex gap-2">
                  <span className="capitalize border border-black/10 dark:border-white/10 rounded-md px-2 py-1">
                    {selectedProduct.category}
                  </span>
                  <span className="border border-black/10 dark:border-white/10 rounded-md px-2 py-1">
                    Rating: {selectedProduct.rating?.rate ?? 0}
                    {selectedProduct.rating?.count > 0 &&
                      ` (from ${selectedProduct.rating?.count} reviews)`}
                  </span>
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-[200px_1fr] w-full">
              <div className="relative w-full aspect-square border rounded-md p-3 bg-white dark:bg-black">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="text-sm leading-6 text-black/80 dark:text-white/80 flex flex-col gap-2 justify-between">
                <p>{selectedProduct.description}</p>
                <span className="text-black text-base sm:text-xl font-bold block text-center sm:text-right dark:text-white">
                  Price: £{selectedProduct.price.toFixed(2)}
                </span>
              </div>
            </div>
          </DialogContent>
        )}
      </Dialog>
    </div>
  );
}
