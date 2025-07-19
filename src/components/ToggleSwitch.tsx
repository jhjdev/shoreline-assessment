import React from 'react';

interface ToggleSwitchProps {
  enabled: boolean;
  onChange: (enabled: boolean) => void;
  size?: 'small' | 'medium' | 'large';
}

export const ToggleSwitch: React.FC<ToggleSwitchProps> = ({
  enabled,
  onChange,
  size = 'medium',
}) => {
  const sizeClasses = {
    small: {
      container: 'w-8 h-4',
      circle: 'w-3 h-3',
      translate: enabled ? 'translate-x-4' : 'translate-x-0.5',
    },
    medium: {
      container: 'w-11 h-6',
      circle: 'w-5 h-5',
      translate: enabled ? 'translate-x-5' : 'translate-x-0.5',
    },
    large: {
      container: 'w-14 h-7',
      circle: 'w-6 h-6',
      translate: enabled ? 'translate-x-7' : 'translate-x-0.5',
    },
  };

  const classes = sizeClasses[size];

  return (
    <button
      type="button"
      className={`${
        classes.container
      } relative inline-flex flex-shrink-0 cursor-pointer rounded-full border-2 transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-800 ${
        enabled ? 'bg-blue-600 border-blue-600' : 'bg-gray-600 border-gray-500'
      }`}
      role="switch"
      aria-checked={enabled}
      onClick={() => onChange(!enabled)}
    >
      <span
        aria-hidden="true"
        className={`${classes.circle} ${
          classes.translate
        } pointer-events-none inline-block rounded-full shadow-lg transform ring-0 transition duration-200 ease-in-out ${
          enabled ? 'bg-white' : 'bg-gray-300'
        }`}
      />
    </button>
  );
};
