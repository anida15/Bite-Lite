"use client";

import { useState, useEffect, useMemo } from "react";
import { Button } from "@heroui/button";
import {
  Navbar as HeroUINavbar,
  NavbarBrand,
  NavbarContent,
  NavbarItem,
} from "@heroui/navbar";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/dropdown";
import {
  Menu,
  X,
  ShoppingCart,
  ChevronDown,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import clsx from "clsx";

import { ThemeSwitch } from "@/components/theme-switch";
import { Sidebar } from "@/components/sidebar";
import { Logo } from "@/components/logo";
import { siteConfig } from "@/config/site";
import useSaleStore, { type CartProduct } from "@/pages/data/Store";


const getPageTitle = (pathname: string): string => {
  if (pathname === "/") return "Bite Lite";
  const navItem = siteConfig.navItems.find(
    (item) => pathname === item.href || pathname.startsWith(item.href + "/")
  );
  return navItem?.label || "Bite Lite";
};

export const Navbar = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const location = useLocation();
  const { cartItems } = useSaleStore();
  const navigate = useNavigate();
  const userInitials = "C";

  useEffect(() => {
    const checkMobile = () => {
      const mobile = window.innerWidth < 1024;
      setIsMobile(mobile);
      if (!mobile) {
        setIsSidebarOpen(true);
      }
    };

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("resize", checkMobile);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const pageTitle = getPageTitle(location.pathname);
  const cartItemCount = useMemo(() => {
    const cart = cartItems?.[0];
    if (!cart?.products) return 0;
    return cart.products.reduce((total, product) => total + (product as CartProduct).quantity, 0);
  }, [cartItems]);
  const cartBadgeLabel =
    cartItemCount > 999 ? "999+" : cartItemCount.toString();

  return (
    <>
      <HeroUINavbar
        maxWidth="full"
        position="sticky"
        className={clsx(
          " transition-all duration-300 z-40",
          "backdrop-blur-xl bg-background/70 dark:bg-background/80",
          "border-b border-divider/50",
          isScrolled && "shadow-sm"
        )}
        classNames={{
          wrapper: "px-4 sm:px-6 lg:px-8 h-16",
          base: "min-h-16",
        }}
      >
        <NavbarContent className="basis-1/5 sm:basis-full" justify="start">
          <NavbarBrand className="gap-3 max-w-fit">
            {isSidebarOpen ? (
              <div className=" items-center md:flex">
                <Logo width={96} className="w-auto h-auto" />
              </div>
            ) : (
              <div className=" hidden items-center md:flex">
                <Logo width={96} className="w-auto h-auto" />
              </div>
            )}
            <Button
              isIconOnly
              variant="light"
              className="lg:hidden mr-2 min-w-10 h-10"
              onPress={toggleSidebar}
              aria-label="Toggle menu"
              radius="lg"
            >
              {isSidebarOpen ? (
                <X size={20} className="transition-transform" />
              ) : (
                <Menu size={20} className="transition-transform" />
              )}
            </Button>

            <div className="hidden md:flex items-center gap-3">
              <div className="h-8 w-px bg-divider" />
              <h1 className="text-lg font-semibold text-foreground tracking-tight">
                {pageTitle}
              </h1>
            </div>


          </NavbarBrand>
        </NavbarContent>

        <NavbarContent
          className="basis-1/5 sm:basis-full gap-2 "
          justify="end"
        >


          

          <NavbarItem>
            <Button
              isIconOnly
              variant="light"
              className="min-w-10 h-10 relative"
              aria-label="Shopping cart"
              radius="lg"
              onPress={() => navigate("/sales/cart")}
            >
              <ShoppingCart size={18} />
              {cartItemCount > 0 && (
                <span className=" text-white absolute -top-0.5 -right 0.5 flex h-5 max-w-[1.9rem] items-center justify-center rounded-full bg-danger px-1.5 text-[11px] font-semibold leading-none whitespace-nowrap">
                  {cartBadgeLabel}
                </span>
              )}
            </Button>
          </NavbarItem>

          <NavbarItem>
            <div className="flex items-center">
              <ThemeSwitch />
            </div>
          </NavbarItem>
              
          <NavbarItem>
            <Dropdown placement="bottom-end" radius="lg">
              <DropdownTrigger>
                <Button
                  variant="light"
                  className="h-10 px-2 gap-2 data-[hover=true]:bg-default-100"
                  radius="lg"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-secondary flex items-center justify-center overflow-hidden ring-2 ring-default-200 dark:ring-default-100">
                    <span className="text-xs font-semibold text-primary-foreground">
                      {userInitials}
                    </span>
                  </div>
                  <span className="hidden sm:flex items-center gap-1 text-sm font-medium text-foreground">
                    Customer
                    <ChevronDown size={14} className="text-default-400" />
                  </span>
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                aria-label="User menu"
                variant="flat"
                className="min-w-[200px]"
              >
                <DropdownItem
                  key="user-info"
                  className="h-auto py-3 cursor-default"
                  textValue="user-info"
                  isReadOnly
                >
                  <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold">Customer</span>
                  </div>
                </DropdownItem>
                <DropdownItem
                  key="cart"
                  startContent={<ShoppingCart size={18} />}
                  className="h-12"
                  onPress={() => navigate("/sales/cart")}
                >
                  <div className="flex flex-col">
                    <span className="text-sm font-semibold">Cart</span>
                    <span className="text-xs text-default-500">View your cart</span>
                  </div>
                </DropdownItem>
              </DropdownMenu>
            </Dropdown>
          </NavbarItem>
        </NavbarContent>
      </HeroUINavbar>

      <Sidebar
        isOpen={isSidebarOpen}
        onClose={() => setIsSidebarOpen(false)}
        isMobile={isMobile}
      />
    </>
  );
};
