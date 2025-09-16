
import React from 'react';
import { StyleOption } from '../types';
import { STYLE_OPTIONS } from '../constants';

interface StyleSelectorProps {
  onSelect: (style: StyleOption) => void;
  isLoading: boolean;
}

export const StyleSelector: React.FC<StyleSelectorProps> = ({ onSelect, isLoading }) => {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
      {STYLE_OPTIONS.map((style) => (
        <button
          key={style.id}
          onClick={() => onSelect(style)}
          disabled={isLoading}
          className={`text-white font-bold py-4 px-2 rounded-lg text-center transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-4 focus:ring-opacity-50 disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 bg-gradient-to-br ${style.className}`}
        >
          {style.name}
        </button>
      ))}
    </div>
  );
};
