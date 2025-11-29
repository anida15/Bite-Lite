import type { Selection, SortDescriptor } from "@heroui/react";

import React from "react";
import {
  Table,
  TableHeader,
  TableColumn,
  TableBody,
  TableRow,
  TableCell,
} from "@heroui/react";
import { Autocomplete, AutocompleteItem } from "@heroui/autocomplete";
import { Pagination } from "@heroui/pagination";
import {
  Input,
  Button,
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownItem,
} from "@heroui/react";
import {
  Search,
  ChevronDown,
  Plus,
  ChevronLeftCircleIcon,
  ChevronRightCircleIcon,
  Download,
  UploadIcon,
} from "lucide-react";

import { TableColumnInterface } from "./types";
import NoDataDisplay from "@/properties/noData";

export function capitalize(s: string) {
  return s ? s.charAt(0).toUpperCase() + s.slice(1).toLowerCase() : "";
}

interface FilterOption {
  key: string;
  label: string;
  value: unknown;
}

interface Props<T> {
  columns: TableColumnInterface[];
  data: T[];
  isStriped?: boolean;
  renderCell?: (item: T, columnKey: string) => React.ReactNode;
  searchableColumns?: string[];
  filterOptions?: FilterOption[];
  filterKey?: string;
  title?: string;
  showAddButton?: boolean;
  showExportButton?: boolean;
  onAddClick?: () => void;
  onExportClick?: () => void;
  emptyContent?: string;
  selectionMode?: "none" | "single" | "multiple";
  selectedKeys?: Selection;
  onSelectionChange?: (keys: Selection) => void;
  defaultRowsPerPage?: number;
  rowsPerPageOptions?: number[];
  showUploadButton?: boolean;
  showPaginationButtons?: boolean;
  onUploadClick?: () => void;
  uploadButtonText?: string;
  getRowClassName?: (item: T) => string;
  // External pagination props
  useExternalPagination?: boolean;
  currentPage?: number;
  pageSize?: number;
  totalPages?: number;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

function generateRowKey(item: Record<string, any>): React.Key {
  return item.id ?? item.principal_id ?? item.key ?? JSON.stringify(item);
}

export default function DataTable<T extends Record<string, any>>({
  columns,
  data,
  isStriped = false,
  renderCell,
  searchableColumns = [],
  filterOptions = [],
  filterKey,
  title,
  showAddButton = false,
  showExportButton = false,
  onAddClick,
  onExportClick,
  emptyContent = "No data found",
  defaultRowsPerPage = 10,
  rowsPerPageOptions = [5, 10, 15, 20],
  showUploadButton = false,
  showPaginationButtons = true,
  onUploadClick,
  uploadButtonText = "Upload",
  getRowClassName,
  useExternalPagination = false,
  currentPage,
  pageSize,
  totalPages,
  onPageChange,
  onPageSizeChange,
}: Props<T>) {
  const [filterValue, setFilterValue] = React.useState("");
  const [visibleColumns, setVisibleColumns] = React.useState<Selection>("all");
  const [filterSelection, setFilterSelection] =
    React.useState<Selection>("all");
  const [internalRowsPerPage, setInternalRowsPerPage] = React.useState(defaultRowsPerPage);
  const [sortDescriptor, setSortDescriptor] = React.useState<SortDescriptor>({
    column: columns.find((col) => col.sortable)?.key || "",
    direction: "ascending",
  });
  const [internalPage, setInternalPage] = React.useState(1);

  // Use external or internal pagination
  const rowsPerPage = useExternalPagination ? (pageSize || defaultRowsPerPage) : internalRowsPerPage;
  const page = useExternalPagination ? (currentPage || 1) : internalPage;
  const hasSearchFilter = Boolean(filterValue);
  const hasFilterOptions = filterOptions.length > 0 && filterKey;
  const headerColumns = React.useMemo(() => {
    if (visibleColumns === "all") return columns;
    return columns.filter((column) =>
      Array.from(visibleColumns).includes(column.key)
    );
  }, [visibleColumns, columns]);

  const filteredItems = React.useMemo(() => {
    let filteredData = [...data];

    // Apply search filter
    if (hasSearchFilter && searchableColumns.length > 0) {
      filteredData = filteredData.filter((item) =>
        searchableColumns.some((column) => {
          const value = item[column];

          return (
            value &&
            String(value).toLowerCase().includes(filterValue.toLowerCase())
          );
        })
      );
    }

    // Apply status/custom filter
    if (
      hasFilterOptions &&
      filterSelection !== "all" &&
      Array.from(filterSelection).length !== filterOptions.length
    ) {
      filteredData = filteredData.filter((item) =>
        Array.from(filterSelection).includes(String(item[filterKey!]))
      );
    }

    return filteredData;
  }, [
    data,
    filterValue,
    filterSelection,
    searchableColumns,
    hasSearchFilter,
    hasFilterOptions,
    filterKey,
    filterOptions.length,
  ]);

  // Calculate pages - use external totalPages if provided, otherwise calculate from filtered items
  const pages = useExternalPagination && totalPages 
    ? totalPages 
    : Math.ceil(filteredItems.length / rowsPerPage) || 1;

  // If using external pagination, use data as-is (already paginated on server)
  // Otherwise, paginate locally
  const items = React.useMemo(() => {
    if (useExternalPagination) {
      return filteredItems; // Data is already paginated externally
    }
    const start = (page - 1) * rowsPerPage;
    const end = start + rowsPerPage;
    return filteredItems.slice(start, end);
  }, [page, filteredItems, rowsPerPage, useExternalPagination]);

  const sortedItems = React.useMemo(() => {
    // Only sort if there's a valid sort column
    if (!sortDescriptor.column) {
      return items;
    }
    
    return [...items].sort((a, b) => {
      const first = a[sortDescriptor.column];
      const second = b[sortDescriptor.column];
      const cmp = first < second ? -1 : first > second ? 1 : 0;

      return sortDescriptor.direction === "descending" ? -cmp : cmp;
    });
  }, [sortDescriptor, items]);

  // Default minimal render cell function
  const defaultRenderCell = React.useCallback((item: T, columnKey: string) => {
    const cellValue = item[columnKey];

    // Handle different data types
    if (cellValue === null || cellValue === undefined) {
      return <span className="text-default-400">—</span>;
    }

    if (typeof cellValue === "boolean") {
      return (
        <span
          className={`capitalize ${cellValue ? "text-success" : "text-danger"}`}
        >
          {cellValue ? "Yes" : "No"}
        </span>
      );
    }

    if (typeof cellValue === "object") {
      return <span className="text-default-400">[Object]</span>;
    }

    return <span className="text-small">{String(cellValue)}</span>;
  }, []);

  const cellRenderer = renderCell || defaultRenderCell;

  const onNextPage = React.useCallback(() => {
    if (page < pages) {
      if (useExternalPagination && onPageChange) {
        onPageChange(page + 1);
      } else {
        setInternalPage(page + 1);
      }
    }
  }, [page, pages, useExternalPagination, onPageChange]);

  const onPreviousPage = React.useCallback(() => {
    if (page > 1) {
      if (useExternalPagination && onPageChange) {
        onPageChange(page - 1);
      } else {
        setInternalPage(page - 1);
      }
    }
  }, [page, useExternalPagination, onPageChange]);

  const onRowsPerPageChange = React.useCallback(
    (key: React.Key | null) => {
      if (!key || typeof key !== "string") return;
      
      const newPageSize = Number(key);
      if (useExternalPagination && onPageSizeChange) {
        onPageSizeChange(newPageSize);
        if (onPageChange) {
          onPageChange(1); // Reset to first page when page size changes
        }
      } else {
        setInternalRowsPerPage(newPageSize);
        setInternalPage(1);
      }
    },
    [useExternalPagination, onPageSizeChange, onPageChange]
  );

  const onSearchChange = React.useCallback((value: string) => {
    setFilterValue(value);
    if (useExternalPagination && onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  }, [useExternalPagination, onPageChange]);

  const onClear = React.useCallback(() => {
    setFilterValue("");
    if (useExternalPagination && onPageChange) {
      onPageChange(1);
    } else {
      setInternalPage(1);
    }
  }, [useExternalPagination, onPageChange]);

  const topContent = React.useMemo(() => {
    return (
      <div className="flex flex-col gap-4">
        <div className="flex gap-3 justify-between items-end">
          {/* Search Input - only show if searchable columns are provided */}
          {searchableColumns.length > 0 && (
            <Input
              isClearable
              className="w-full sm:max-w-[44%]"
              placeholder={`Search in ${searchableColumns
                .join(", ")
                .replace(/_/g, " ")}...`}
              startContent={<Search className="w-4 h-4" />}
              value={filterValue}
              onClear={() => onClear()}
              onValueChange={onSearchChange}
            />
          )}

          <div className="flex gap-3">
            {/* Filter Dropdown - only show if filter options are provided */}
            {hasFilterOptions && (
              <Dropdown>
                <DropdownTrigger className="hidden sm:flex">
                  <Button
                    endContent={<ChevronDown className="w-4 h-4" />}
                    variant="flat"
                  >
                    {filterKey ? capitalize(filterKey) : "Filter"}
                  </Button>
                </DropdownTrigger>
                <DropdownMenu
                  disallowEmptySelection
                  aria-label="Filter Options"
                  closeOnSelect={false}
                  selectedKeys={filterSelection}
                  selectionMode="multiple"
                  onSelectionChange={(keys) =>
                    setFilterSelection(keys as Set<string>)
                  }
                >
                  {filterOptions.map((option) => (
                    <DropdownItem key={option.key} className="capitalize">
                      {option.label}
                    </DropdownItem>
                  ))}
                </DropdownMenu>
              </Dropdown>
            )}

            {/* Column Visibility Dropdown */}
            <Dropdown>
              <DropdownTrigger className="hidden sm:flex">
                <Button
                  endContent={<ChevronDown className="w-4 h-4" />}
                  variant="flat"
                >
                  Columns
                </Button>
              </DropdownTrigger>
              <DropdownMenu
                disallowEmptySelection
                aria-label="Table Columns"
                closeOnSelect={false}
                selectedKeys={visibleColumns}
                selectionMode="multiple"
                onSelectionChange={setVisibleColumns}
              >
                {columns.map((column) => (
                  <DropdownItem key={column.key} className="capitalize">
                    {column.label}
                  </DropdownItem>
                ))}
              </DropdownMenu>
            </Dropdown>

            {/* Add Button - only show if callback is provided */}
            {showAddButton && onAddClick && (
              <Button
                color="primary"
                endContent={<Plus className="w-4 h-4" />}
                onPress={onAddClick}
              >
                Add New
              </Button>
            )}

            {/* Filter Button */}
            {showExportButton && onExportClick && (
              <Button
                color="primary"
                endContent={<Download className="w-4 h-4" />}
                onPress={onExportClick}
              >
                Export
              </Button>
            )}

            {/* Upload Button */}
            {showUploadButton && onUploadClick && (
              <Button
                color="secondary"
                endContent={<UploadIcon className="w-4 h-4" />}
                onPress={onUploadClick}
              >
                {uploadButtonText}
              </Button>
            )}

            

          
          </div>
        </div>
      </div>
    );
  }, [
    filterValue,
    filterSelection,
    visibleColumns,
    onRowsPerPageChange,
    data.length,
    onSearchChange,
    hasSearchFilter,
    searchableColumns,
    hasFilterOptions,
    filterOptions,
    filterKey,
    showAddButton,
    onAddClick,
    showExportButton,
    onExportClick,
    title,
    rowsPerPage,
    rowsPerPageOptions,
  ]);

  const bottomContent = React.useMemo(() => {
    // Only show pagination if explicitly enabled or using external pagination
    if (!useExternalPagination && !showPaginationButtons) {
      return null;
    }
    
    return (
      <div className="flex flex-col sm:flex-row gap-3 sm:gap-0 sm:justify-between sm:items-center px-2 py-2">
        {/* Left Section: Rows per page and total records */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
          <Autocomplete
            label="Rows per page"
            selectedKey={rowsPerPage.toString()}
            onSelectionChange={onRowsPerPageChange}
            defaultItems={rowsPerPageOptions.map(opt => ({ key: opt.toString(), label: `${opt} rows` }))}
            className="w-full sm:w-48"
            variant="bordered"
            placeholder="Select rows per page"
            allowsCustomValue={false}
            inputValue={rowsPerPage ? `${rowsPerPage} rows` : ""}
            onInputChange={() => {}} // Prevent input changes
            size="sm"
            allowsEmptyCollection={false}
            defaultSelectedKey={rowsPerPage.toString()}
          >
            {rowsPerPageOptions.map((option) => (
              <AutocompleteItem key={option.toString()} textValue={option.toString()}>
                <div className="flex items-center justify-between w-full">
                  <span>{option} rows</span>
                  {rowsPerPage === option && (
                    <span className="text-primary text-xs font-semibold">✓</span>
                  )}
                </div>
              </AutocompleteItem>
            ))}
          </Autocomplete>
          <span className="text-xs sm:text-small text-default-400 whitespace-nowrap">
            Total {filteredItems.length} records
          </span>
        </div>

        {/* Center Section: Pagination */}
        <div className="flex justify-center">
          <Pagination
            isCompact
            showControls
            showShadow
            color="primary"
            page={page}
            total={pages}
            size="sm"
            onChange={(newPage) => {
              if (useExternalPagination && onPageChange) {
                onPageChange(newPage);
              } else {
                setInternalPage(newPage);
              }
            }}
            classNames={{
              wrapper: "gap-0 sm:gap-1",
              item: "w-7 h-7 sm:w-8 sm:h-8 text-xs sm:text-sm",
              cursor: "w-7 h-7 sm:w-8 sm:h-8",
            }}
          />
        </div>

        {/* Right Section: Previous/Next buttons - hidden on mobile, shown on larger screens */}
        {showPaginationButtons && (
          <div className="hidden md:flex w-auto justify-end gap-2">
            <Button
              color="primary"
              isDisabled={pages === 1 || page === 1}
              size="sm"
              startContent={<ChevronLeftCircleIcon className="w-4 h-4" />}
              variant="flat"
              onPress={onPreviousPage}
            >
              Previous
            </Button>
            <Button
              color="primary"
              endContent={<ChevronRightCircleIcon className="w-4 h-4" />}
              isDisabled={pages === 1 || page === pages}
              size="sm"
              variant="flat"
              onPress={onNextPage}
            >
              Next
            </Button>
          </div>
        )}

        {/* Mobile: Previous/Next buttons as icon-only */}
        {showPaginationButtons && (
          <div className="flex sm:hidden justify-center gap-2 w-full">
            <Button
              color="primary"
              isDisabled={pages === 1 || page === 1}
              size="sm"
              isIconOnly
              variant="flat"
              onPress={onPreviousPage}
              aria-label="Previous page"
            >
              <ChevronLeftCircleIcon className="w-5 h-5" />
            </Button>
            <span className="text-xs text-default-500 flex items-center px-2">
              Page {page} of {pages}
            </span>
            <Button
              color="primary"
              isDisabled={pages === 1 || page === pages}
              size="sm"
              isIconOnly
              variant="flat"
              onPress={onNextPage}
              aria-label="Next page"
            >
              <ChevronRightCircleIcon className="w-5 h-5" />
            </Button>
          </div>
        )}
      </div>
    );
  }, [
    filteredItems.length, 
    page, 
    pages, 
    rowsPerPage, 
    rowsPerPageOptions, 
    onRowsPerPageChange,
    useExternalPagination,
    onPageChange,
    onPageSizeChange,
    showPaginationButtons,
    onPreviousPage,
    onNextPage
  ]);

  return (
    <Table
      isHeaderSticky
      aria-label={title || "Data table with pagination and sorting"}
      bottomContent={bottomContent}
      bottomContentPlacement="outside"
      classNames={{
        wrapper: "w-full overflow-x-auto",
        table: "min-w-full",
      }}
      isStriped={isStriped}
      sortDescriptor={sortDescriptor}
      topContent={topContent}
      topContentPlacement="outside"
      onSortChange={setSortDescriptor}
    >
      <TableHeader columns={headerColumns}>
        {(column) => (
          <TableColumn
            key={column.key}
            align={column.key === "actions" ? "center" : "start"}
            allowsSorting={column.sortable}
          >
            {column.label}
          </TableColumn>
        )}
      </TableHeader>
      <TableBody
          emptyContent={<NoDataDisplay message={emptyContent} />}
          items={sortedItems}
        >
          {(item) => (
            <TableRow 
              key={generateRowKey(item)} 
              className={`hover:bg-primary-100 ${getRowClassName ? getRowClassName(item) : ''}`}
            >
              {(columnKey) => (
                <TableCell>{cellRenderer(item, columnKey as string)}</TableCell>
              )}
            </TableRow>
          )}
        </TableBody>
    </Table>
  );
}
