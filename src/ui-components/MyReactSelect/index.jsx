import { SettingsContext } from '@/contexts/SettingsContext';
import { usePrefersDarkMode } from '@/hooks/usePrefersDarkMode';
import { forwardRef, useContext } from 'react';
import Select from 'react-select';

const sizeClasses = {
  sm: 'text-sm min-w-[120px]', // Adjust the min-width value as needed
  md: 'text-base min-w-[160px]', // Adjust the min-width value as needed
  lg: 'text-lg min-w-[200px]', // Adjust the min-width value as needed
};

import { components } from 'react-select';

const CustomControl = forwardRef(function CustomControl(
  { children, ...props },
  ref
) {
  const { selectProps } = props;

  return (
    <components.Control {...props}>
      <div
        ref={ref}
        className={`border rounded ${
          sizeClasses[selectProps.size || 'sm']
        } dark:bg-gray-800 dark:border-gray-500 dark:text-white`}
        {...props.innerProps}
      />
      {children}
    </components.Control>
  );
});

const MyReactSelect = forwardRef(function MyReactSelect(
  { size = 'sm', ...props },
  ref
) {
  const { isDarkMode } = useContext(SettingsContext);

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1f2937' : '#FFFFFF', // gray-700 for dark mode, white for light mode
      borderColor: isDarkMode ? '#6B7280' : '#D1D5DB', // gray-500 for dark mode, gray-300 for light mode
      borderWidth: '1px',
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
      // borderRadius: '0.25rem',
      boxShadow: state.isFocused
        ? isDarkMode
          ? '0 0 0 2px #3B82F6'
          : '0 0 0 2px #2563EB'
        : 'none', // Add focus ring if needed
      ...(sizeClasses[size] && {
        // padding: sizeClasses[size].includes('sm') ? '4px' : '8px',
        padding: 0,
        userSelect: 'none',
      }),
    }),
    singleValue: (provided) => ({
      ...provided,
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    menu: (provided) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1f2937' : '#FFFFFF', // gray-800 for dark mode, white for light mode
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isFocused
        ? isDarkMode
          ? '#4B5563'
          : '#E5E7EB' // gray-600 for focused item in dark mode, gray-200 in light mode
        : isDarkMode
        ? '#1F2937'
        : '#FFFFFF', // gray-800 for dark mode, white for light mode
      color: isDarkMode ? '#E5E7EB' : '#111827', // white text for dark mode, gray-900 for light mode
    }),
    // indicatorsContainer: (provided) => ({
    //   ...provided,
    //   padding: '0',
    //   width: '20px',
    //   height: '20px',
    //   alignSelf: 'center',
    // }),
    // dropdownIndicator: (provided) => ({
    //   ...provided,
    //   padding: '0', // To center the icon in the 20x20 container
    //   height: '20px',
    //   width: '20px',
    // }),
    // clearIndicator: (provided) => ({
    //   ...provided,
    //   padding: '0', // To center the icon in the 20x20 container
    //   height: '20px',
    //   width: '20px',
    // }),
  };

  const simpleCustomStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: isDarkMode ? '#1f2937' : '#FFFFFF', // gray-700 for dark mode, white for light mode
      borderColor: isDarkMode ? '#6B7280' : '#D1D5DB', // gray-500 for dark mode, gray-300 for light mode
      borderWidth: '1px',
      color: isDarkMode ? '#FFFFFF' : '#111827', // white text for dark mode, gray-900 for light mode
      // borderRadius: '0.25rem',
      // padding: sizeClasses[size].includes('sm') ? '4px' : '8px',
      padding: 0,
      userSelect: 'none',
    }),
  };

  return (
    <Select
      ref={ref}
      styles={customStyles}
      className={`border rounded ${sizeClasses[size]}`}
      {...props}
    />
  );
});

export default MyReactSelect;
