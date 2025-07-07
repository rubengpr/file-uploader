export type CountryOption = {
    value: string;
    name: string;
}

export const countryOptions: CountryOption[] = [
    { value: 'US', name: 'United States' },
    { value: 'ES', name: 'Spain' },
    { value: 'FR', name: 'France' },
    { value: 'DE', name: 'Germany' },
    { value: 'IT', name: 'Italy' },
    { value: 'BR', name: 'Brazil' },
    { value: 'MX', name: 'Mexico' },
    { value: 'JP', name: 'Japan' },
    { value: 'CN', name: 'China' },
    { value: 'IN', name: 'India' },
];

// Helper function to get valid country values for validation
export const getValidCountryValues = (): string[] => {
    return countryOptions.map(country => country.value);
}; 