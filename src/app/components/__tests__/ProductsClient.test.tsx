import React from "react";
import { describe, it, expect, beforeEach } from "vitest";
import { render, screen, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import ProductsClient from "@/app/components/ProductsClient";
import { useProductsStore } from "@/store/useProductsStore";
import type { Product } from "@/types/product";

function makeProducts(): Product[] {
  return [
    {
      id: 1,
      title: "Alpha Backpack",
      price: 100,
      description: "",
      category: "bags",
      image: "https://fakestoreapi.com/img/1.png",
      rating: { rate: 4.5, count: 10 },
    },
    {
      id: 2,
      title: "Beta Jacket",
      price: 150,
      description: "",
      category: "clothing",
      image: "https://fakestoreapi.com/img/2.png",
      rating: { rate: 3.0, count: 5 },
    },
    {
      id: 3,
      title: "Gamma Backpack",
      price: 80,
      description: "",
      category: "bags",
      image: "https://fakestoreapi.com/img/3.png",
      rating: { rate: 4.9, count: 50 },
    },
  ];
}

describe("ProductsClient", () => {
  beforeEach(() => {
    useProductsStore.getState().reset();
  });

  it("filters by search query deterministically", async () => {
    render(
      <ProductsClient
        products={makeProducts()}
        categories={["bags", "clothing"]}
      />
    );
    const user = userEvent.setup();

    const input = screen.getByLabelText(/search by title/i);
    await user.type(input, "Backpack");

    const cards = screen.getAllByRole("article");
    const titles = cards.map((c) => within(c).getByRole("heading").textContent);
    expect(titles).toEqual(["Alpha Backpack", "Gamma Backpack"]);
  });

  it("filters by category deterministically", async () => {
    render(
      <ProductsClient
        products={makeProducts()}
        categories={["bags", "clothing"]}
      />
    );
    const user = userEvent.setup();

    const categoryTrigger = screen.getByRole("combobox", { name: /category/i });
    await user.click(categoryTrigger);
    await user.click(await screen.findByRole("option", { name: /clothing/i }));

    const cards = screen.getAllByRole("article");
    expect(cards).toHaveLength(1);
    expect(within(cards[0]).getByRole("heading")).toHaveTextContent(
      "Beta Jacket"
    );
  });

  it("sorts by highest rating deterministically", async () => {
    render(
      <ProductsClient
        products={makeProducts()}
        categories={["bags", "clothing"]}
      />
    );
    const user = userEvent.setup();

    const sortTrigger = screen.getByRole("combobox", { name: /sort/i });
    await user.click(sortTrigger);
    await user.click(
      await screen.findByRole("option", { name: /highest rating/i })
    );

    const cards = screen.getAllByRole("article");
    const titles = cards.map((c) => within(c).getByRole("heading").textContent);
    expect(titles).toEqual(["Gamma Backpack", "Alpha Backpack", "Beta Jacket"]);
  });
});
