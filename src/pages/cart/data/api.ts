import { isAxiosError } from "axios";
import { coreAxiosInstance } from "@/constants";
import type { CreateSalePayload } from "./types";

export const apiGetSalesProducts = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/products`);
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        showMessage(error.response.data.message || "An error occurred.", "danger");
        return null;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
};


export const apiGetProductsStockByProductId = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  product_id: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/products/stock/${product_id}`);
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        showMessage(error.response.data.message || "An error occurred.", "danger");
        return null;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
};


export const apiCreateSale = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  payload: CreateSalePayload,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.post(`/sales/create`, payload);
      showMessage(response.data.message ?? "Sale created successfully.", "success");
      return response.data;
    } catch (error: unknown) {
      if (isAxiosError(error) && error.response) {
        showMessage(error.response.data.message || "An error occurred.", "danger");
        return null;
      }
      throw error;
    } finally {
      setIsLoading(false);
    }
};


export const apiGetProductsStock = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  store_id: string,
  page = 1,
  limit = 10,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/products/stock`, {
        params: {
          store_id,
          page,
          limit,
        },
      });
      ;
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};

export const apiGetSales= async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/sales`, {
      });
      ;
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};

export const apiGetSalesCashier= async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  cashier_id: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/sales/cashier/${cashier_id}`, {
      });
      ;
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};


export const apiGetSalesProduct= async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  product_id: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/sales/product/${product_id}`, {
      });
      ;
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};

export const apiGetSalesStore= async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  store_id: string,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/sales/store/${store_id}`, {
      });
      ;
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};
 
 
export const apiGetStores = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/management/stores`);
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};


export const apiGetStaff = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
) => {
  try {
    setIsLoading(true);
    const response = await coreAxiosInstance.get(`/management/staff`);
    showMessage(response.data.message, "success");
    return response.data;
  } catch (error: unknown) { 
    if (isAxiosError(error) && error.response) {
    showMessage(error.response.data.message || "An error occurred.", "danger");
    return null;
  } 
   } finally {
    setIsLoading(false);
}

};
 


export const apiGetProducts = async (
  showMessage: (message: string, type?: "success" | "danger" | "warning") => void,
  setIsLoading: (isLoading: boolean) => void,
  ) => {
    try {
      setIsLoading(true);
      const response = await coreAxiosInstance.get(`/products`);
      showMessage(response.data.message, "success");
      return response.data;
    } catch (error: unknown) { 
      if (isAxiosError(error) && error.response) {
      showMessage(error.response.data.message || "An error occurred.", "danger");
      return null;
    } 
    } finally {
      setIsLoading(false);
  }

};