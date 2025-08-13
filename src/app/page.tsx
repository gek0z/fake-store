import { Suspense } from "react";
import ProductsClient from "./components/ProductsClient";
import type { Product } from "@/types/product";

// Server component to fetch products from the API
async function fetchProducts(): Promise<Product[] | false> {
  try {
    const response = await fetch("https://fakestoreapi.com/products", {
      // Revalidate every 2 hours to avoid stale data
      next: { revalidate: 7200 },
    });
    if (!response.ok) {
      return false;
    }
    return response.json();
  } catch (error) {
    console.log(error);
    return false;
  }
}

async function ProductsSection() {
  const products = await fetchProducts();
  // Show error message if products are not fetched
  if (!products) {
    return (
      <div className="flex flex-col items-center justify-center gap-4">
        <div className="text-center text-2xl font-bold text-red-500">
          Failed to fetch products
        </div>
        <div className="text-center text-sm text-black/60 dark:text-white/60">
          Please try again later
        </div>
      </div>
    );
  }
  const categories = Array.from(new Set(products.map((p) => p.category))).sort(
    (a, b) => a.localeCompare(b)
  );
  return <ProductsClient products={products} categories={categories} />;
}

// Loading skeleton to show while products are loading
function ProductsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div
          key={idx}
          className="rounded-xl border border-black/10 dark:border-white/10 p-4 animate-pulse"
        >
          <div className="h-40 bg-black/5 dark:bg-white/10 rounded mb-4" />
          <div className="h-4 bg-black/5 dark:bg-white/10 rounded mb-2 w-3/4" />
          <div className="h-4 bg-black/5 dark:bg-white/10 rounded w-1/2" />
        </div>
      ))}
    </div>
  );
}

export default function Home() {
  return (
    <div className="font-sans min-h-screen p-8 sm:p-12">
      <header className="mb-8 flex items-center gap-3">
        <img
          src="/fakestore-logo.svg"
          alt="FakeStore Logo"
          className="w-32 h-auto"
        />
      </header>
      <div className="space-y-6">
        {/* Suspense boundary to show loading skeleton while products are loading */}
        <Suspense fallback={<ProductsSkeleton />}>
          <ProductsSection />
        </Suspense>
      </div>
    </div>
  );
}
