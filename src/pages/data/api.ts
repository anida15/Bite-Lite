import { isAxiosError } from "axios";
import { coreAxiosInstance } from "@/constants";
import { Category, StockProduct } from "./types";

export const apiGetProductsStock = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  category_id: number | undefined,
  page = 1,
  limit = 10,
  search: string | undefined,
): Promise<StockProduct | undefined> => {
  try {
    setIsLoading(true);
    const response = await coreAxiosInstance.get(`/products`, {
      params: {
        category_id,
        page,
        limit,
        search,
      },
    });
    return response.data.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return undefined;
    }
  } finally {
    setIsLoading(false);
  }

};


export const apiGetCategories = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
): Promise<Category[] | undefined> => {
  try {
    setIsLoading(true);
    const response = await coreAxiosInstance.get(`/categories`);
    return response.data.data;
  } catch (error: unknown) {
    if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return undefined;
    }
  } finally {
    setIsLoading(false);
  }

};
