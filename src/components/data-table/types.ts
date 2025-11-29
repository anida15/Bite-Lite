export interface ActionTabItem{
    key: string;
    label: string;
    onClick?: () => void;
    href?: string;
    startContent?: React.ReactNode;
    endContent?: React.ReactNode;
    color?: "default" | "primary" | "success" | "warning" | "danger";
    textValue?: string;
    allowedRoles?: string[];
}

export interface TableColumnInterface {
    key: string;
    label: string;
    sortable?: boolean;
  }
  