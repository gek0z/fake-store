import { create } from "zustand";

export type SortOption = "price-asc" | "price-desc" | "rate-desc" | "none";

type ProductsUiState = {
  query: string;
  category: string; // "all" means no filter
  sort: SortOption;
};

type ProductsUiActions = {
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;
  reset: () => void;
};

const initialState: ProductsUiState = {
  query: "",
  category: "all",
  sort: "none",
};

export const useProductsStore = create<ProductsUiState & ProductsUiActions>(
  (set) => ({
    ...initialState,
    setQuery: (query) => set({ query }),
    setCategory: (category) => set({ category }),
    setSort: (sort) => set({ sort }),
    reset: () => set({ ...initialState }),
  })
);
