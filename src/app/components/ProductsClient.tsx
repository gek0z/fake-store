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
  // Zustand state management
  const query = useProductsStore((s) => s.query);
  const category = useProductsStore((s) => s.category);
  const sort = useProductsStore((s) => s.sort);
  const view = useProductsStore((s) => s.view);
  const setQuery = useProductsStore((s) => s.setQuery);
  const setCategory = useProductsStore((s) => s.setCategory);
  const setSort = useProductsStore((s) => s.setSort);
  const setView = useProductsStore((s) => s.setView);

  // State for product dialog
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);

  const openProduct = useCallback((product: Product) => {
    setSelectedProduct(product);
    setIsDialogOpen(true);
  }, []);

  // Color cycle for category pills using the 4 brand colors
  const colorCycle = useMemo(
    () => [
      "var(--color-xantura-red)",
      "var(--color-xantura-yellow)",
      "var(--color-xantura-blue)",
      "var(--color-xantura-green)",
    ],
    []
  );

  const getCategoryColor = useCallback(
    (cat: string) => {
      const indexInCategories = categories.findIndex((c) => c === cat);
      const safeIndex = indexInCategories >= 0 ? indexInCategories : 0;
      return colorCycle[safeIndex % colorCycle.length];
    },
    [categories, colorCycle]
  );

  const getPillStyle = useCallback(
    (cat: string) => {
      const base = getCategoryColor(cat);
      return {
        // Muted background from the base color
        backgroundColor: `color-mix(in srgb, ${base} 10%, white)`,
        // Darker text and border from the base color
        color: `color-mix(in srgb, ${base} 60%, black)`,
        borderColor: `color-mix(in srgb, ${base} 10%, white)`,
      } as React.CSSProperties;
    },
    [getCategoryColor]
  );

  // Memoized visible products
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
          <Label htmlFor="search-title" className="mb-1.5 block">
            Search by title
          </Label>
          <Input
            id="search-title"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Type to search..."
            className="outline-none focus-visible:ring-0 focus-visible:ring-offset-0 bg-white"
          />
        </div>
        <div>
          <Label className="mb-1.5 block">Category</Label>
          <Select value={category} onValueChange={(v) => setCategory(v)}>
            <SelectTrigger
              aria-label="Category"
              role="combobox"
              className="w-full sm:w-[220px] capitalize outline-none bg-white shadow-none"
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
          <Label className="mb-1.5 block">Sort</Label>
          <Select value={sort} onValueChange={(v) => setSort(v as SortOption)}>
            <SelectTrigger
              aria-label="Sort"
              role="combobox"
              className="w-full sm:w-[220px] outline-none bg-white shadow-none"
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
          <Label className="mb-1.5 block">View</Label>
          <div className="flex gap-2">
            <button
              type="button"
              aria-label="Grid view"
              aria-pressed={view === "grid"}
              onClick={() => setView("grid")}
              className={cn(
                "w-1/2 sm:w-auto h-9 px-3 rounded-md border flex items-center gap-2 shadow-none text-center justify-center",
                view === "grid" ? "bg-xantura-red text-white " : "bg-white"
              )}
            >
              <LayoutGrid className="h-4 w-4" />
              <span className="inline">Grid</span>
            </button>
            <button
              type="button"
              aria-label="List view"
              aria-pressed={view === "list"}
              onClick={() => setView("list")}
              className={cn(
                "w-1/2 sm:w-auto h-9 px-3 rounded-md border flex items-center gap-2 shadow-none text-center justify-center",
                view === "list" ? "bg-xantura-red text-white " : "bg-white"
              )}
            >
              <ListIcon className="h-4 w-4" />
              <span className="inline">List</span>
            </button>
          </div>
        </div>
      </div>

      {view === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleProducts.map((p) => (
            <Card
              key={p.id}
              className="p-4 h-full cursor-pointer shadow-none bg-white hover:bg-transparent transition-colors duration-300 hover:border-black "
              onClick={() => openProduct(p)}
            >
              <article className="flex flex-col h-full">
                <div className="relative w-full h-48 mb-6">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-contain w-full h-full"
                  />
                </div>
                <h3 className="text-sm font-medium line-clamp-2 mb-1">
                  {p.title}
                </h3>
                <div>
                  <span
                    className="text-xs mb-2 capitalize border rounded-md px-2 py-0.5 inline-block"
                    style={getPillStyle(p.category)}
                  >
                    {p.category}
                  </span>
                </div>
                <div className="flex items-center justify-between mt-auto">
                  <span className="font-semibold">£{p.price.toFixed(2)}</span>
                  <span className="text-xs text-black/60 border border-black/10 rounded-md px-2 py-0.5 inline-block bg-black/5 font-bold">
                    {p.rating?.rate.toFixed(1) ?? 0}
                  </span>
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
              className="p-4 cursor-pointer bg-white hover:bg-transparent transition-colors duration-300 hover:border-black shadow-none"
              onClick={() => openProduct(p)}
            >
              <article className="flex gap-4 items-stretch h-full">
                <div className="relative w-28 h-28 shrink-0">
                  <img
                    src={p.image}
                    alt={p.title}
                    className="object-contain w-full h-full"
                  />
                </div>
                <div className="w-full min-w-0 flex-1 flex flex-col">
                  <h3 className="text-sm font-medium line-clamp-2 mb-1">
                    {p.title}
                  </h3>
                  <div>
                    <span
                      className="text-xs mb-2 capitalize border rounded-md px-2 py-0.5 inline-block"
                      style={getPillStyle(p.category)}
                    >
                      {p.category}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-auto">
                    <span className="font-semibold">£{p.price.toFixed(2)}</span>
                    <span className="text-xs text-black/60 border border-black/10 rounded-md px-2 py-0.5 inline-block bg-black/5 font-bold">
                      {p.rating?.rate.toFixed(1) ?? 0}
                    </span>
                  </div>
                </div>
              </article>
            </Card>
          ))}
        </div>
      )}

      {visibleProducts.length === 0 && (
        <div className="text-center text-sm text-black/60">
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
                  <span
                    className="capitalize border rounded-md px-2 py-1 font-bold"
                    style={getPillStyle(selectedProduct.category)}
                  >
                    {selectedProduct.category}
                  </span>
                  <span className="border border-black/10 rounded-md px-2 py-1 font-bold">
                    Rating: {selectedProduct.rating?.rate.toFixed(1) ?? 0}
                    {selectedProduct.rating?.count > 0 &&
                      ` (from ${selectedProduct.rating?.count} reviews)`}
                  </span>
                </span>
              </DialogDescription>
            </DialogHeader>

            <div className="grid gap-4 sm:grid-cols-[200px_1fr] w-full">
              <div className="relative w-full aspect-square border rounded-md p-3 bg-white">
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.title}
                  className="object-contain w-full h-full"
                />
              </div>
              <div className="text-sm leading-6 text-black/80 flex flex-col gap-2 justify-between">
                <p>{selectedProduct.description}</p>
                <span className="text-black text-base sm:text-xl font-bold block text-center sm:text-right">
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
