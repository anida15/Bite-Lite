"use client";

import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useEffect, useMemo, useState } from "react";
import { useLoading } from "@/contexts/loading-context";
import { useMessage } from "@/contexts/message-context";
import { AutocompleteItem, Autocomplete, Input, Skeleton } from "@heroui/react";
import { Button } from "@heroui/button";
import { Search, ShoppingCart } from "lucide-react";
import clsx from "clsx";

import AddToCart from "./add-to-Cart";
import DeliveryAnimation from "@/components/delivery-animation";
import { Category, Product } from "../data/types";
import { apiGetCategories, apiGetProductsStock } from "../data/api";

const breadcrumbItems = [
  { label: "Orders", href: "/"},
];

const Order = () => {
  const { isLoading, setIsLoading } = useLoading();
  const { showMessage } = useMessage();
  const { setItems } = useBreadcrumb();
  const [categories, setCategories] = useState<Category[] | undefined>(undefined);
  const [selectedCategory, setSelectedCategory] = useState<Category | undefined>(undefined);
  const [productsStock, setProductsStock] = useState<Product[]>([]);
  const [showAddToCart, setShowAddToCart] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [searchValue, setSearchValue] = useState("");
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(0);
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);


  useEffect(() => {
    setItems(breadcrumbItems);
    setLimit(10);
  }, [setItems]);

  useEffect(() => {
    let isMounted = true;
    const handleGetCategories = async () => {
      const response = await apiGetCategories(showMessage, setIsLoading);
      if (isMounted && response) {
        setCategories(response);
      }
    };
    handleGetCategories();
    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    setProductsStock([]);
    setPage(1);
    setHasMore(true);
  }, [selectedCategory?.id, searchValue]);

  useEffect(() => {
    let isMounted = true;
    const isLoadMore = page > 1;

    const handleGetProducts = async () => {
      if (isLoadMore) {
        setIsLoadingMore(true);
      }
      const response = await apiGetProductsStock(showMessage, setIsLoading, selectedCategory?.id ?? undefined, page, limit, searchValue);
      if (isMounted && response) {
        const newProducts = response.products ?? [];
        if (isLoadMore) {
          setProductsStock((prev) => [...prev, ...newProducts]);
        } else {
          setProductsStock(newProducts);
        }
        setTotal(response.total ?? 0);
        setPages(response.totalPages ?? 0);
        setHasMore(page < (response.totalPages ?? 0));
      }
      if (isLoadMore) {
        setIsLoadingMore(false);
      }
    };
    handleGetProducts();
    return () => {
      isMounted = false;
    };
  }, [page, limit, selectedCategory?.id, showMessage, setIsLoading, searchValue]);

  const formatCurrency = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }),
    [],
  );

  const filteredProducts = useMemo(() => {
    const query = searchValue.trim().toLowerCase();
    if (!query) {
      return productsStock ?? [];
    }

    return (productsStock ?? []).filter((product) => {
      const nameMatches = product.name?.toLowerCase().includes(query);
      const categoryMatches = product.Category?.name?.toLowerCase().includes(query);
      return Boolean(nameMatches || categoryMatches);
    });
  }, [productsStock, searchValue]);

  const hasSearchQuery = searchValue.trim().length > 0;
  const visibleProducts = hasSearchQuery ? (filteredProducts ?? []) : (productsStock ?? []);

  const currentRangeStart = hasSearchQuery ? (visibleProducts.length > 0 ? 1 : 0) : (page - 1) * limit + 1;
  const currentRangeEnd = hasSearchQuery ? visibleProducts.length : Math.min(page * limit, total);
  const currentTotal = hasSearchQuery ? visibleProducts.length : total;

  const handleSearchChange = (value: string) => {
    setSearchValue(value);
    if (page !== 1) {
      setPage(1);
    }
  };

  useEffect(() => {
    const handleScroll = () => {
      if (hasSearchQuery || isLoading || isLoadingMore || !hasMore || page >= pages) {
        return;
      }

      const scrollTop = window.scrollY || document.documentElement.scrollTop;
      const scrollHeight = document.documentElement.scrollHeight;
      const clientHeight = document.documentElement.clientHeight;
      const scrollPercentage = (scrollTop + clientHeight) / scrollHeight;
      if (scrollPercentage > 0.8) {
        setPage((prev) => prev + 1);
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [hasSearchQuery, isLoading, isLoadingMore, hasMore, page, pages]);

  const handleCategoryChange = (categoryId: string | null) => {
    if (categoryId) {
      const category = categories?.find((cat) => cat.id.toString() === categoryId);
      setSelectedCategory(category);
    } else {
      setSelectedCategory(undefined);
    }
    setPage(1);
  };

  return (
    <div className="w-full max-w-7xl mx-auto">
      <div className="mb-6">
        <DeliveryAnimation />
      </div>
      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-3">
          <Autocomplete
            className="w-full sm:w-auto sm:min-w-[200px]"
            label="Category"
            placeholder="All categories"
            defaultItems={categories ?? []}
            selectedKey={selectedCategory?.id?.toString() ?? null}
            onSelectionChange={(key) => handleCategoryChange(key as string | null)}
            allowsCustomValue={false}
            isClearable
          >
            {(category) => (
              <AutocompleteItem key={category.id.toString()}>
                {category.name}
              </AutocompleteItem>
            )}
          </Autocomplete>
        </div>
        <Input
          aria-label="Search products"
          classNames={{
            base: "w-full sm:w-auto sm:min-w-[260px]",
            mainWrapper: "h-full",
            input: "text-sm",
            inputWrapper: "h-10 bg-default-100/50 dark:bg-default-50/50 border-default-200/50 hover:bg-default-100 dark:hover:bg-default-50 transition-colors",
          }}
          placeholder="Search by product name"
          size="sm"
          startContent={<Search size={18} className="text-default-400" />}
          type="search"
          value={searchValue}
          onValueChange={handleSearchChange}
          radius="lg"
          isClearable
          onClear={() => handleSearchChange("")}
        />
      </div>
      <section
        className={clsx(
          "grid gap-4",
          "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4",
        )}
      >
        {isLoading
          ? Array.from({ length: 8 }).map((_, index) => (
            <article
              key={`skeleton-${index}`}
              className="rounded-xl border border-default-200 bg-default-50 p-3 sm:p-4"
            >
              <Skeleton className="h-24 sm:h-32 w-full rounded-lg" />
              <Skeleton className="h-4 sm:h-5 w-3/4 mt-3 rounded-lg" />
              <Skeleton className="h-3 sm:h-4 w-1/2 mt-2 rounded-lg" />
              <Skeleton className="h-8 sm:h-10 w-full mt-4 sm:mt-6 rounded-full" />
            </article>
          ))
          : visibleProducts.map((productStock) => {

            return (
              <article
                key={productStock.id}
                className="group flex flex-col rounded-xl border border-default-200 bg-background shadow-sm transition hover:-translate-y-1 hover:shadow-lg"
              >
                <div className="relative h-28 sm:h-36 overflow-hidden rounded-t-xl bg-default-100">
                  {productStock.image ? (
                    <img
                      src={productStock.image}
                      alt={productStock.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                        const placeholder = target.nextElementSibling as HTMLElement;
                        if (placeholder) {
                          placeholder.style.display = 'flex';
                        }
                      }}
                    />
                  ) : null}
                  <div 
                    className={`absolute inset-0 flex items-center justify-center text-4xl sm:text-6xl font-black text-default-200 opacity-50 ${productStock.image ? 'hidden' : 'flex'}`}
                  >
                    {productStock.name.charAt(0).toUpperCase()}
                  </div>
                </div>

                <div className="flex flex-1 flex-col gap-2.5 p-3 sm:p-4">
                  <div className="space-y-1">
                    <p className="text-[10px] sm:text-xs uppercase tracking-widest text-primary/70">
                      {productStock.Category?.name || "Featured"}
                    </p>
                    <h2 className="line-clamp-2 text-sm sm:text-base font-semibold text-foreground">
                      {productStock.name}
                    </h2>
                    {productStock.description && (
                      <div className="mt-1.5">
                        <p className="text-xs sm:text-sm text-default-600 line-clamp-2">
                          {productStock.description}
                        </p>
                      </div>
                    )}
                  </div>

                  <div className="flex items-end gap-2">
                    <p className="text-sm sm:text-base font-bold text-primary">
                      {formatCurrency.format(productStock.price)}
                    </p>
                  </div>

                  <div className="flex flex-col gap-2 mt-auto">
                      <Button
                        variant="light"
                        size="sm"
                        className="text-xs sm:text-sm"
                        onPress={() => {
                          setSelectedProduct(productStock);
                          setShowAddToCart(true);
                        }}
                      >
                        View Details
                      </Button>
                    <Button
                      color="primary"
                      variant="flat"
                      size="sm"
                      endContent={<ShoppingCart className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
                      className="rounded-full text-xs sm:text-sm"
                      onPress={() => {
                        setSelectedProduct(productStock);
                        setShowAddToCart(true);
                      }}
                    >
                      Add to Cart
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}

        {!isLoading && visibleProducts.length === 0 && (
          <div className="col-span-full flex flex-col items-center justify-center rounded-2xl border border-dashed border-default-200 bg-default-50 p-10 text-center">
            <ShoppingCart className="h-10 w-10 text-default-300" />
            <p className="mt-3 text-base font-semibold text-foreground">No products available</p>
            <p className="text-sm text-default-500">
              Check back soon for fresh deals tailored for you.
            </p>
          </div>
        )}

      </section>
      <div className="mt-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <p className="text-xs sm:text-sm text-default-500">
          Showing {currentRangeStart}-{currentRangeEnd} of {currentTotal} products
        </p>
        {hasSearchQuery && (
          <div className="flex items-center gap-2">
            <Button
              variant="light"
              size="sm"
              isDisabled={page <= 1 || isLoading}
              onPress={() => setPage((prev) => Math.max(prev - 1, 1))}
            >
              Previous
            </Button>
            <span className="text-xs sm:text-sm text-default-500">
              Page {page} of {Math.max(pages, 1)}
            </span>
            <Button
              variant="light"
              size="sm"
              isDisabled={page >= pages || isLoading}
              onPress={() => setPage((prev) => Math.min(prev + 1, pages))}
            >
              Next
            </Button>
          </div>
        )}
        {!hasSearchQuery && isLoadingMore && (
          <div className="flex items-center gap-2 text-xs sm:text-sm text-default-500">
            <span>Loading more products...</span>
          </div>
        )}
        {!hasSearchQuery && !hasMore && productsStock.length > 0 && (
          <p className="text-xs sm:text-sm text-default-500">
            All products loaded
          </p>
        )}
      </div>
      {showAddToCart && selectedProduct && (
        <AddToCart
          isOpen={showAddToCart}
          onClose={() => {
            setShowAddToCart(false);
            setSelectedProduct(null);
          }}
          productStock={selectedProduct}
        />
      )}
    </div>
  );
};

export default Order;






























