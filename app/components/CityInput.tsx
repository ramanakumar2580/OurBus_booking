"use client";

import React, { useState, useRef, useEffect } from "react";
import { MapPin } from "lucide-react";

interface CityInputProps {
  label: string;
  value: string;
  onChange: (val: string) => void;
  cities: string[];
  icon?: React.ReactNode;
}

export default function CityInput({
  label,
  value,
  onChange,
  cities,
  icon,
}: CityInputProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(value.toLowerCase()),
  );

  return (
    <div className="flex-1 relative w-full group" ref={wrapperRef}>
      <div
        className={`absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${value ? "text-red-500" : "text-gray-400 dark:text-gray-500 group-focus-within:text-red-500"}`}
      >
        {icon || <MapPin size={20} />}
      </div>

      <input
        type="text"
        placeholder={label}
        className="w-full p-4 pl-12 border border-gray-200 dark:border-gray-700 rounded-xl outline-none focus:border-red-500 focus:ring-4 focus:ring-red-500/10 dark:focus:ring-red-500/20 font-medium text-lg transition-all bg-gray-50 dark:bg-gray-800 focus:bg-white dark:focus:bg-gray-900 text-gray-900 dark:text-white placeholder:text-gray-400 dark:placeholder:text-gray-500 truncate"
        value={value}
        onChange={(e) => {
          onChange(e.target.value);
          setIsOpen(true);
        }}
        onFocus={() => setIsOpen(true)}
      />
      {isOpen && filteredCities.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white dark:bg-gray-900 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700 max-h-60 overflow-y-auto z-50 animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
          {filteredCities.map((city) => (
            <div
              key={city}
              className="flex items-center gap-3 p-3 hover:bg-red-50 dark:hover:bg-red-900/20 cursor-pointer transition-colors border-b border-gray-50 dark:border-gray-800 last:border-0"
              onClick={() => {
                onChange(city);
                setIsOpen(false);
              }}
            >
              <div className="bg-gray-100 dark:bg-gray-800 p-2 rounded-full text-gray-500 dark:text-gray-400">
                <MapPin size={16} />
              </div>
              <div>
                <p className="font-bold text-gray-800 dark:text-gray-200 text-sm">
                  {city}
                </p>
                <p className="text-xs text-gray-400 dark:text-gray-500">
                  India
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
