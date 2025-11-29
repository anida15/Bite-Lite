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
      label: "Sales",
      icon: "CircleDollarSign",
      submenu: [
        {
          label: "Orders",
          href: "/sales/orders",
          icon: "ShoppingCart",
        },
        {
          label: "Sales",
          href: "/sales/sales",
          icon: "Receipt",
        },
        {
          label: "Store sales",
          href: "/sales/store",
          icon: "Store",
        },
        {
          label: "Cashier Sales",
          href: "/sales/cashier",
          icon: "UserCheck",
        },
        {
          label: "Product Sales",
          href: "/sales/product",
          icon: "PackageSearch",
        },
      ],
    },
     
    
  ] as NavItem[],
  
};
