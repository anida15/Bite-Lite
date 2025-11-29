import { BreadcrumbItem, Breadcrumbs } from "@heroui/breadcrumbs";
import { useBreadcrumb } from "@/contexts/breadcrumb-context";
import { useLocation } from "react-router-dom";

function BreadCrumb() {
  const { items } = useBreadcrumb();
  const location = useLocation();
  
  if (location.pathname === "/" && items.length === 0) {
    return null;
  }

  return (
    <Breadcrumbs
      classNames={{
        list: "gap-2",
        separator: "text-default-400",
      }}
      itemClasses={{
        base: "gap-2 text-sm",
      }}
    >
      <BreadcrumbItem href="/">Bite Lite</BreadcrumbItem>
      {items.map((item, index) => (
        <BreadcrumbItem 
          key={`${item.label}-${index}`} 
          href={item.href}
          isCurrent={index === items.length - 1 && !item.href}
        >
          {item.label}
        </BreadcrumbItem>
      ))}
    </Breadcrumbs>
  );
}

export default BreadCrumb;
