import React from "react";

interface LoadingProps {
  size: number;
}

export const SpinnerComponent: React.FC<LoadingProps> = ({ size }) => {
  return (
    <div className="flex justify-center items-center h-screen w-screen">
      <div
        style={{ width: `${size}px`, height: `${size}px` }}
        className="animate-spin rounded-full border-4 border-t-indigo-500 border-b-red-700"
      >
        {/* The actual spinner */}
      </div>
    </div>
  );
};
