import React, { useMemo } from 'react';
import Select, { SingleValue } from 'react-select';
import countryList from 'react-select-country-list';
import './CountrySelector.css';
import { ibanCodes } from '@/app/api/ibanCodes';

interface CountryOption {
  label: string;
  value: string;
}

interface CountrySelectorProps {
  value: string | null;
  onChange: (value: SingleValue<CountryOption>) => void;
  required?: boolean;
}

function CountrySelector({ value, onChange, required }: CountrySelectorProps) {
  const options = useMemo(() => {
    return countryList()
      .getData()
      .filter((country) => Object.keys(ibanCodes).includes(country.value));
  }, []);

  const selectedOption = options.find(option => option.value === value) || null;

  return options.length > 0 ? (
    <Select className='countrySelect' options={options} value={selectedOption} onChange={onChange} required={required}/>
  ) : null;
}

export default CountrySelector;
