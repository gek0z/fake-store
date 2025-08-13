import { create } from "zustand";

export type SortOption = "price-asc" | "price-desc" | "rate-desc" | "none";
export type ViewOption = "grid" | "list";

type ProductsUiState = {
  query: string;
  category: string; // "all" means no filter
  sort: SortOption;
  view: ViewOption;
};

type ProductsUiActions = {
  setQuery: (query: string) => void;
  setCategory: (category: string) => void;
  setSort: (sort: SortOption) => void;
  setView: (view: ViewOption) => void;
  reset: () => void;
};

const initialState: ProductsUiState = {
  query: "",
  category: "all",
  sort: "none",
  view: "grid",
};

export const useProductsStore = create<ProductsUiState & ProductsUiActions>(
  (set) => ({
    ...initialState,
    setQuery: (query) => set({ query }),
    setCategory: (category) => set({ category }),
    setSort: (sort) => set({ sort }),
    setView: (view) => set({ view }),
    reset: () => set({ ...initialState }),
  })
);
