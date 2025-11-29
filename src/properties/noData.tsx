import React from "react";

interface PolicyNoDataProps {
  message?: string;
}

const NoDataDisplay: React.FC<PolicyNoDataProps> = ({ message }) => {
  return (
    <div className="p-3 flex flex-col items-center justify-center bg-background shadow-sm">
      <img
        src="/images/Chatbot Searching.gif"
        alt="No data"
        className="w-48 h-48 object-contain"
      /> 
      <p className="mt-2 text-default-300">{message}</p>
    </div>
  );
};

export default NoDataDisplay;
