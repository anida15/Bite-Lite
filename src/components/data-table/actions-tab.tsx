"use client";

import { Button } from "@heroui/button";
import {
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/dropdown";

import { MoreVertical } from "lucide-react";

import { ActionTabItem } from "./types";

const ActionsTab = ({ items }: { items: ActionTabItem[] }) => {
  return (
    <div className="flex relative gap-2 justify-end items-center">
      <Dropdown className="bg-background border-1 border-default-200">
        <DropdownTrigger>
          <Button isIconOnly radius="full" size="sm" variant="light">
            <MoreVertical className="text-default-400" />
          </Button>
        </DropdownTrigger>
        <DropdownMenu>
          {items.map((item) => {
              return (
                <DropdownItem
                  key={item.key}
                  className={`text-${item.color}-900 bg-${item.color}-50`}
                  color={item.color}
                  endContent={item.endContent}
                  href={item.href}
                  startContent={item.startContent}
                  onClick={item.onClick}
                  textValue={item.textValue || item.label}
                >
                  {item.label}
                </DropdownItem>
              );

          })}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

export default ActionsTab;
