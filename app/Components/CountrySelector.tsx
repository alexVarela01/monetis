import React, { useMemo } from 'react'
import Select, { SingleValue } from 'react-select'
import countryList from 'react-select-country-list'

interface CountryOption {
  label: string;
  value: string;
}

interface CountrySelectorProps {
  value: string | null;
  onChange: (value: SingleValue<CountryOption>) => void;
}

function CountrySelector({ value, onChange }: CountrySelectorProps) {
  const options = useMemo<CountryOption[]>(() => countryList().getData() as CountryOption[], []);

  console.log('CountrySelector', { value, options });
  return <Select options={options as any} value={value} onChange={onChange as any} />;
}

export default CountrySelector;
