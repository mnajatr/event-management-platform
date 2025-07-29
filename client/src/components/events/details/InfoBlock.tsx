import React from "react";

interface InfoBlockProps {
  icon: React.ElementType;
  title: string;
  children: React.ReactNode;
}

export const InfoBlock = ({ icon: Icon, title, children }: InfoBlockProps) => {
  return (
    <div className="flex items-start">
      <Icon className="w-6 h-6 mr-4 mt-1 text-gray-500 flex-shrink-0" />
      <div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
        <div className="text-gray-600">{children}</div>
      </div>
    </div>
  );
};
