export type NavItem = {
  label: string;
  href?: string;
  icon: string;
  submenu?: NavItem[];
};

export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Bite Lite",
  description: "Manage your ecommerce business efficiently.",
  navItems: [
    {
      label: "Products",
      icon: "CircleDollarSign",
      href: "/",
    },
    {
      label: "Cart",
      icon: "ShoppingCart",
      href: "/sales/cart",
    },
  ] as NavItem[],
  
};
