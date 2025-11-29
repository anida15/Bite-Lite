"use client";
import { addToast } from "@heroui/toast";
import { createContext, useContext } from "react";

interface MessageContextProps {
  showMessage: (
    message: string,
    type?: "success" | "danger" | "warning",
  ) => void;
}

export const MessageContext = createContext<MessageContextProps>({
  showMessage: () => {},
});

 
export const MessageProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const showMessage = (
    message: string,
    type: "success" | "danger" | "warning" = "success",
  ) => {
    addToast({
      color: type,
      title:
        type === "success"
          ? "Success"
          : type === "danger"
            ? "Error"
            : "Warning",
      description: message,
      timeout: 5000,
      shouldShowTimeoutProgress: true,
    });
  };

  return (
    <MessageContext.Provider  value={{ showMessage }}>
      {children}
    </MessageContext.Provider>
  );
};

export const useMessage = () => {
  const context = useContext(MessageContext);

  if (!context) {
    throw new Error("useMessage must be used within a MessageProvider");
  }

  return context;
};
