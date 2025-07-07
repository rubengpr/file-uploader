export const countryOptions = [
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
export const getValidCountryValues = () => {
    return countryOptions.map(country => country.value);
};
//# sourceMappingURL=countries.js.map