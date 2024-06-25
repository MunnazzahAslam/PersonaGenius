import React from 'react';
import Select, { components } from 'react-select';
import { X, ChevronDown } from 'lucide-react';
import { useTheme } from 'next-themes';

const CustomSelect = ({ options, handleTypeSelect, isOptionDisabled }: any) => {
    const {theme} = useTheme();
    const isDarkMode = theme === 'dark';
    
    const customStyles = {
        control: (provided: any, state: { isFocused: any; }) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            height: '40px',
            width: '100%',
            borderRadius: '4px',
            borderColor: state.isFocused ? '#3182CE' : isDarkMode ? 'hsl(220 50% 13.2%)' : '#E2E8F0',
            backgroundColor: isDarkMode ? '#03002D' : '#FFF',
            padding: '0 12px',
            fontSize: '14px',
            lineClamp: 1,
            color: isDarkMode ? '#E2E8F0' : '#2D3748',
            ':hover': {
                borderColor: '#3182CE',
            },
            ':focus': {
                outline: 'none',
                boxShadow: '0 0 0 1px #3182CE',
            },
            '[&>span]': {
                lineClamp: 1,
            },
        }),
        singleValue: (provided: any) => ({
            ...provided,
            color: isDarkMode ? '#E2E8F0' : '#2D3748',
        }),
        multiValue: (provided: any) => ({
            ...provided,
            backgroundColor: isDarkMode ? '#4A5568' : '#EDF2F7',
        }),
        multiValueLabel: (provided: any) => ({
            ...provided,
            color: isDarkMode ? '#E2E8F0' : '#2D3748',
        }),
        multiValueRemove: (provided: any) => ({
            ...provided,
            color: '#3182CE',
            ':hover': {
                backgroundColor: '#3182CE',
                color: 'white',
            },
        }),
        menu: (provided: any) => ({
            ...provided,
            zIndex: 50,
            borderRadius: '4px',
            backgroundColor: isDarkMode ? '#03002D' : '#FFF',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
        }),
        menuList: (provided: any) => ({
            ...provided,
            overflow: 'auto',
        }),
        option: (provided: any, state: { isSelected: any; isFocused: any; }) => ({
            ...provided,
            display: 'flex',
            alignItems: 'center',
            padding: '8px 12px',
            backgroundColor: state.isSelected ? (isDarkMode ? '#4A5568' : '#E2E8F0') : state.isFocused ? (isDarkMode ? '#4A5568' : '#EDF2F7') : (isDarkMode ? '#03002D' : '#FFF'),
            color: isDarkMode ? '#E2E8F0' : '#2D3748',
            cursor: 'default',
            ':active': {
                backgroundColor: isDarkMode ? '#4A5568' : '#E2E8F0',
            },
            ':disabled': {
                cursor: 'not-allowed',
                opacity: 0.5,
            },
        }),
        indicatorSeparator: () => ({
            display: 'none',
        }),
        dropdownIndicator: (provided: any) => ({
            ...provided,
            color: isDarkMode ? '#A0AEC0' : '#A0AEC0',
            ':hover': {
                color: isDarkMode ? '#A0AEC0' : '#718096',
            },
        }),
    };

    return (
        <Select
            isMulti
            name="select_features"
            options={options}
            onChange={handleTypeSelect}
            isOptionDisabled={isOptionDisabled}
            styles={customStyles}
            className='mt-4'
            placeholder="Select top features (2 to 5)"
            components={{
                DropdownIndicator: (props) => (
                    <components.DropdownIndicator {...props}>
                        <ChevronDown className="h-4 w-4 opacity-50" />
                    </components.DropdownIndicator>
                ),
                MultiValueRemove: (props) => (
                    <components.MultiValueRemove {...props}>
                        <X className="h-4 w-4" />
                    </components.MultiValueRemove>
                ),
            }}
        />
    );
};

export default CustomSelect;
