"use client";

import { useState, useEffect } from "react";
import { Link } from "@heroui/link";
import { Button } from "@heroui/button";
import {
  Package,
  TrendingUp,
  Settings,
  X,
  ChevronRight,
  LucideIcon,
  List,
  Folder,
  BarChart,
  FileText,
  Users,
  ShoppingCart,
  CreditCard,
  PieChart,
  Plus,
  Grid,
  PlusCircle,
  FolderPlus,
  Tags,
  Building,
  CircleDollarSign,
  Receipt,
  Store,
  UserCheck,
  PackageSearch,
} from "lucide-react";



import { siteConfig, NavItem } from "@/config/site";
import clsx from "clsx";
import { useLocation } from "react-router-dom";
import { Logo } from "./logo";

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
  isMobile: boolean;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const iconMap: Record<string, LucideIcon> = {
  Package,
  TrendingUp,
  Settings,
  List,
  Folder,
  BarChart,
  FileText,
  Users,
  ShoppingCart,
  CreditCard,
  PieChart,
  Plus,
  Grid,
  PlusCircle,
  FolderPlus,
  Tags,
  Building,
  CircleDollarSign,
  Receipt,
  Store,
  UserCheck,
  PackageSearch,
};

interface MenuItemProps {
  item: NavItem;
  isCollapsed: boolean;
  isMobile: boolean;
  onClose?: () => void;
  location: ReturnType<typeof useLocation>;
  level?: number;
}

const MenuItem = ({
  item,
  isCollapsed,
  isMobile,
  onClose,
  location,
  level = 0,
}: MenuItemProps) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const Icon = iconMap[item.icon] || Package;
  const hasSubmenu = item.submenu && item.submenu.length > 0;
  const isActive =
    item.href &&
    (location.pathname === item.href ||
      (location.pathname.startsWith(item.href + "/") &&
        !hasSubmenu)); // Only active if exact match or no submenu
  
  // Check if any submenu item is active
  const hasActiveSubmenu =
    hasSubmenu &&
    item.submenu?.some(
      (subItem) =>
        subItem.href &&
        (location.pathname === subItem.href ||
          location.pathname.startsWith(subItem.href + "/"))
    );
  
  // Parent is highlighted if it has active submenu
  const isParentActive = hasActiveSubmenu;

  // Auto-expand if has active submenu
  useEffect(() => {
    if (hasActiveSubmenu && !isCollapsed) {
      setIsExpanded(true);
    }
  }, [hasActiveSubmenu, isCollapsed]);

  const handleClick = () => {
    if (hasSubmenu && !isCollapsed) {
      setIsExpanded(!isExpanded);
    }
    if (isMobile && !hasSubmenu && onClose) {
      onClose();
    }
  };

  if (isCollapsed) {
    return (
      <div className="relative group">
        <Link
          href={item.href || "#"}
          className={clsx(
            "flex items-center justify-center rounded-lg transition-all duration-200 p-2.5",
            isActive
              ? "bg-primary text-primary-foreground"
              : "text-default-600 hover:bg-default-100 hover:text-foreground"
          )}
          title={item.label}
        >
          <Icon size={18} />
        </Link>
        <div className="absolute left-full ml-2 px-2 py-1.5 bg-foreground text-background text-xs rounded-md opacity-0 group-hover:opacity-100 pointer-events-none whitespace-nowrap z-50 transition-opacity shadow-lg">
          {item.label}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <div
        className={clsx(
          "flex items-center rounded-lg transition-all duration-200 group",
          "min-h-[36px]",
          level === 0
            ? clsx(
                "px-3 py-2",
                isActive || isParentActive
                  ? "bg-primary/10 text-primary font-medium"
                  : "text-default-600 hover:bg-default-100 hover:text-foreground"
              )
            : clsx(
                "px-3 py-1.5 ml-6 text-sm",
                isActive
                  ? "bg-primary text-primary-foreground font-medium"
                  : "text-default-500 hover:bg-default-100 hover:text-foreground"
              )
        )}
      >
        {item.href ? (
          <Link
            href={item.href}
            onClick={isMobile && !hasSubmenu ? onClose : undefined}
            className="flex items-center gap-2.5 flex-1 min-w-0"
          >
            <Icon
              size={level === 0 ? 18 : 16}
              className={clsx(
                "flex-shrink-0",
                isActive || isParentActive ? " text-white" : "text-default-500"
              )}
            />
            <span className={clsx(
              "truncate text-sm font-medium",
              isActive || isParentActive ? "text-white" : ""
            )}>{item.label}</span>
          </Link>
        ) : (
          <div className="flex items-center gap-2.5 flex-1 min-w-0">
            <Icon
              size={level === 0 ? 18 : 16}
              className={clsx(
                "flex-shrink-0",
                isParentActive ? "text-primary" : "text-default-500"
              )}
            />
            <span className={clsx(
              "truncate text-sm font-medium",
              isParentActive ? "text-primary" : ""
            )}>{item.label}</span>
          </div>
        )}

        {hasSubmenu && (
          <Button
            isIconOnly
            variant="light"
            size="sm"
            className={clsx(
              "min-w-6 w-6 h-6 flex-shrink-0 transition-transform duration-200",
              isExpanded && "rotate-90"
            )}
            onPress={handleClick}
            aria-label={isExpanded ? "Collapse" : "Expand"}
          >
            <ChevronRight size={14} />
          </Button>
        )}
      </div>

      {/* Submenu */}
      {hasSubmenu && isExpanded && (
        <div
          className={clsx(
            "overflow-hidden transition-all duration-300 ease-in-out",
            isExpanded ? "max-h-[500px] opacity-100" : "max-h-0 opacity-0"
          )}
        >
          <div className="py-1 space-y-0.5">
            {item.submenu?.map((subItem, index) => (
              <MenuItem
                key={subItem.href || index}
                item={subItem}
                isCollapsed={false}
                isMobile={isMobile}
                onClose={onClose}
                location={location}
                level={level + 1}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export const Sidebar = ({
  isOpen,
  onClose,
  isMobile,
  isCollapsed = false,
}: SidebarProps) => {
  const location = useLocation();

  const sidebarContent = (
    <div className="flex flex-col h-full bg-background mt-4">
      <div
        className={clsx(
          "hidden lg:flex items-center border-b border-divider/50 transition-all duration-300",
          isCollapsed ? "justify-center p-3" : "justify-start px-4 py-3"
        )}
      >
        {!isCollapsed && (
          <span className="ml-2 text-sm font-semibold text-foreground">
            {siteConfig.name}
          </span>
        )}
      </div>

      {/* Mobile Header */}
      <div className="flex lg:hidden items-center justify-between px-4 py-3 border-b border-divider/50 bg-background min-h-[56px]">
        <div className="flex items-center gap-2.5 flex-1 min-w-0">
          <Logo width={96} className="w-auto h-auto" />
          <span className="font-semibold text-base text-foreground truncate">
            {siteConfig.name || "Bite Lite"}
          </span>
        </div>
        {isMobile && (
          <Button
            isIconOnly
            variant="light"
            color="primary"
            size="sm"
            onPress={onClose}
            aria-label="Close menu"
            className="flex-shrink-0"
          >
            <X size={18} />
          </Button>
        )}
      </div>

      {/* Navigation Menu */}
      <nav
        className={clsx(
          "flex-1 overflow-y-auto transition-all duration-300",
          "scrollbar-thin scrollbar-thumb-default-200 scrollbar-track-transparent",
          isCollapsed ? "p-2 space-y-1" : "p-3 space-y-1"
        )}
      >
         {siteConfig.navItems.map((item, index) => (
          <MenuItem
            key={item.href || index}
            item={item}
            isCollapsed={isCollapsed}
            isMobile={isMobile}
            onClose={onClose}
            location={location}
            level={0}
          />
        ))}
      </nav>
    </div>
  );

  if (isMobile) {
    return (
      <>
        {/* Backdrop */}
        {isOpen && (
          <div
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300"
            onClick={onClose}
            aria-hidden="true"
          />
        )}
        {/* Mobile Drawer */}
        <div
          className={clsx(
            "fixed top-0 left-0 h-full w-72 bg-background border-r border-divider/50 z-50",
            "transform transition-transform duration-300 ease-out",
            "shadow-xl",
            isOpen ? "translate-x-0" : "-translate-x-full"
          )}
        >
          {sidebarContent}
        </div>
      </>
    );
  }

  // Desktop Sidebar
  return (
    <aside
      className={clsx(
        "hidden lg:flex lg:flex-col lg:fixed lg:inset-y-0 lg:left-0 lg:z-30",
        "bg-background border-r border-divider/50",
        "transition-all duration-300 ease-in-out",
        "shadow-sm",
        isCollapsed ? "lg:w-16" : "lg:w-64"
      )}
    >
      {sidebarContent}
    </aside>
  );
};
