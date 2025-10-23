
import React, { useState } from 'react';
import { ChevronDownIcon } from '../icons/ChevronDownIcon';

interface AccordionProps {
  title: string;
  children: React.ReactNode;
}

const Accordion: React.FC<AccordionProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="border border-gray-700 rounded-lg">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center p-4 bg-gray-700 hover:bg-gray-600 transition-colors duration-200"
      >
        <span className="font-semibold text-lg">{title}</span>
        <ChevronDownIcon
          className={`w-6 h-6 transform transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`grid transition-all duration-500 ease-in-out ${
          isOpen ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0'
        }`}
      >
        <div className="overflow-hidden">
          <div className="p-4 bg-gray-800">{children}</div>
        </div>
      </div>
    </div>
  );
};

export default Accordion;
