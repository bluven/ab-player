import React, { useState, useRef } from 'react';
import './index.css';

interface DropdownItem {
  label: string;
  value: any;
}

interface DropdownProps {
  items: DropdownItem[];
  onSelect: (item: DropdownItem) => void;
  buttonText: string;
}

export const Dropdown: React.FC<DropdownProps> = ({ items, onSelect, buttonText }) => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<number | null>(null);

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    timeoutRef.current = window.setTimeout(() => {
      setIsOpen(false);
    }, 1000);
  };

  const handleSelect = (item: DropdownItem) => {
    onSelect(item);
    setIsOpen(false);
  };

  return (
    <div className="dropdown" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <button className="dropdown-button">
        {buttonText}
      </button>
      {isOpen && (
        <ul className="dropdown-menu">
          {items.map((item) => (
            <li key={item.value} className="dropdown-item" onClick={() => handleSelect(item)}>
              {item.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export type { DropdownItem };
export default Dropdown;