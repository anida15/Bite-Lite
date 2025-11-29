"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Button } from "@heroui/button";
import { Divider } from "@heroui/react";
import { Input } from "@heroui/input";
import { ShoppingCart } from "lucide-react";
import { useNavigate } from "react-router-dom";

import useStore, { computeCartTotals, type CartProduct } from "@/pages/data/Store";
import type { PaymentMethod } from "@/pages/data/types";
import { useMessage } from "@/contexts/message-context";
import { useLoading } from "@/contexts/loading-context";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";

const paymentMethods: PaymentMethod[] = ["mpesa", "credit", "cash"];

const breadcrumbItems = [
  { label: "Orders", href: "/" },
  { label: "Cart", href: "/sales/cart" },
  { label: "Checkout", href: "/sales/checkout" },
];

const Checkout = () => {
  const navigate = useNavigate();
  const { showMessage } = useMessage();
  const { isLoading, setIsLoading } = useLoading();
  const { cartItems, resetStore } = useStore();
  const { setItems } = useBreadcrumb();
  const hasCompletedCheckout = useRef(false);
  useEffect(() => {
    setItems(breadcrumbItems);
  }, [setItems]);

  const cart = cartItems[0];
  const products = cart?.products ?? [];

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("cash");
  const [customerName, setCustomerName] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (hasCompletedCheckout.current) {
      return;
    }
    if (!cart || products.length === 0) {
      showMessage("Your cart is empty. Add items before checking out.", "warning");
      navigate("/sales/cart", { replace: true });
    }
  }, [cart, products.length, navigate, showMessage]);

  const totals = useMemo(() => computeCartTotals(products), [products]);

  const currencyFormatter = useMemo(
    () =>
      new Intl.NumberFormat("en-NG", {
        style: "currency",
        currency: "KES",
        minimumFractionDigits: 0,
      }),
    [],
  );

  const subtotal = totals.total;
  const vatTotal = 0; 
  const discountTotal = 0;  
  const originalSubtotal = subtotal;
  const totalPayable = subtotal + vatTotal;

  const handleCheckout = async () => {
    if (!cart || products.length === 0) {
      showMessage("Your cart is empty. Add items before checking out.", "warning");
      return;
    }

    if (!paymentMethod) {
      showMessage("Please select a payment method.", "warning");
      return;
    }

    if (paymentMethod === "mpesa" && phoneNumber.trim().length === 0) {
      showMessage("Please provide the phone number for Mpesa payment.", "warning");
      return;
    }

    const payload = {
      products: products.map((product) => ({
        product_id: (product as CartProduct).id,
        quantity: (product as CartProduct).quantity,
      })),
      payment_method: paymentMethod,
      phone_number:
        paymentMethod === "mpesa" ? phoneNumber.trim() : phoneNumber.trim() || undefined,
      customer_name: customerName.trim() || undefined,
    };

    try {
      setIsSubmitting(true);
      setIsLoading(true);
      // const response = await apiCreateSale(showMessage, setIsLoading, payload);
      // if (response) {
        hasCompletedCheckout.current = true;
        console.log("Checkout completed", payload);
        resetStore();
        navigate("/");
      // }
    } catch (error) {
      console.error(error);
      showMessage("Unable to process checkout. Please try again.", "danger");
    } finally {
      setIsSubmitting(false);
      setIsLoading(false);
    }
  };

  return (
    <div className="mx-auto flex w-full  flex-col gap-8  ">
     

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <section className="space-y-6">
          <div className="rounded-xl border border-default-200 bg-background p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Payment details</h2>
            <Divider className="my-4" />

            <div className="space-y-6">
              <div>
                <p className="text-sm font-medium text-foreground">Payment method</p>
                <div className="mt-3 grid gap-3 sm:grid-cols-3">
                  {paymentMethods.map((method) => (
                    <Button
                      key={method}
                      type="button"
                      onClick={() => {
                        setPaymentMethod(method);
                      }}
                      className={`rounded-lg border px-4 py-3 text-left text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-primary ${
                        paymentMethod === method
                          ? "border-primary bg-primary/10 text-primary"
                          : "border-default-200 bg-background text-default-600 hover:border-primary/60"
                      }`}
                    >
                      {method === "mpesa"
                        ? "Mpesa"
                        : method === "credit"
                        ? "Credit card"
                        : "Cash"}
                    </Button>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <Input
                  label="Customer name"
                  placeholder="Optional"
                  value={customerName}
                  onChange={(event) => {
                    setCustomerName(event.target.value);
                  }}
                />
                <Input
                  label="Phone number"
                  placeholder={paymentMethod === "mpesa" ? "Required for Mpesa" : "Optional"}
                  value={phoneNumber}
                  onChange={(event) => {
                    setPhoneNumber(event.target.value);
                  }}
                  isRequired={paymentMethod === "mpesa"}
                  type="tel"
                />
              </div>
            </div>
          </div>

          <div className="rounded-xl border border-default-200 bg-background p-5 shadow-sm">
            <h2 className="text-lg font-semibold text-foreground">Order items</h2>
            <Divider className="my-4" />

            <div className="space-y-4">
              {products.map((product) => {
                const cartProduct = product as CartProduct;
                const unitPrice = cartProduct.price ?? 0;
                const quantity = cartProduct.quantity ?? 1;
                const lineSubtotal = unitPrice * quantity;
                const lineVat = 0;  
                const lineTotal = lineSubtotal + lineVat;

                return (
                  <div
                    key={cartProduct.id}
                    className="rounded-lg border border-default-200 bg-default-50 p-4"
                  >
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-medium text-foreground">
                          {cartProduct.name || "Unnamed product"}
                        </p>
                        <p className="text-xs text-default-500">
                          ID: {cartProduct.id}
                        </p>
                      </div>
                      <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                        Qty: {quantity}
                      </span>
                    </div>
                    <Divider className="my-3" />
                    <div className="flex flex-wrap items-center gap-3 text-xs sm:text-sm text-default-500">
                      <span>
                        Unit: {" "}
                        <span className="font-medium text-foreground">
                          {currencyFormatter.format(unitPrice)}
                        </span>
                      </span>
                      <span className="ml-auto text-base font-semibold text-foreground">
                        {currencyFormatter.format(lineTotal)}
                      </span>
                    </div>
                  </div>
                );
              })}

              {products.length === 0 && (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-default-200 bg-default-50 px-4 py-6 text-center text-sm text-default-500">
                  <ShoppingCart className="mb-3 h-8 w-8 text-default-300" />
                  No items in your cart.
                </div>
              )}
            </div>
          </div>
        </section>

        <aside className="h-max rounded-xl border border-default-200 bg-background p-5 shadow-md">
          <h2 className="text-lg font-semibold text-foreground">Summary</h2>
          <Divider className="my-4" />

          <div className="space-y-3 text-sm text-default-500">
            <div className="flex items-center justify-between">
              <span>Subtotal</span>
              <span className="font-semibold text-foreground">
                {currencyFormatter.format(subtotal)}
              </span>
            </div>
            {discountTotal > 0 && (
              <div className="flex items-center justify-between text-success">
                <span>Discount</span>
                <span className="font-semibold">-{currencyFormatter.format(discountTotal)}</span>
              </div>
            )}
            <div className="flex items-center justify-between">
              <span>VAT</span>
              <span className="font-semibold text-foreground">
                {currencyFormatter.format(vatTotal)}
              </span>
            </div>
          </div>

          <Divider className="my-4" />

          <div className="flex items-center justify-between text-base font-semibold text-foreground">
            <span>Total payable</span>
            <span>{currencyFormatter.format(totalPayable)}</span>
          </div>

          {discountTotal > 0 && (
            <p className="mt-2 text-xs text-default-400">
              You saved {currencyFormatter.format(discountTotal)} off the original total of {currencyFormatter.format(originalSubtotal)}.
            </p>
          )}

          <Button
            color="success"
            className="mt-5 w-full"
            size="sm"
            onPress={handleCheckout}
            isDisabled={products.length === 0 || isSubmitting || isLoading}
            isLoading={isSubmitting || isLoading}
          >
            {isSubmitting || isLoading ? "Processing..." : "Confirm and pay"}
          </Button>

          <p className="mt-3 text-center text-xs text-default-400">
            By confirming, you agree to process this sale with the selected payment method.
          </p>
        </aside>
      </div>
    </div>
  );
};

export default Checkout;