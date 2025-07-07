export const languageOptions = [
    { value: 'english', name: 'English' },
    { value: 'spanish', name: 'Spanish' },
    { value: 'french', name: 'French' },
];
// Helper function to get valid language values for validation
export const getValidLanguageValues = () => {
    return languageOptions.map(language => language.value);
};
//# sourceMappingURL=languages.js.map