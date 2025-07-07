export type LanguageOption = {
    value: string;
    name: string;
}

export const languageOptions: LanguageOption[] = [
    { value: 'english', name: 'English' },
    { value: 'spanish', name: 'Spanish' },
    { value: 'french', name: 'French' },
];

// Helper function to get valid language values for validation
export const getValidLanguageValues = (): string[] => {
    return languageOptions.map(language => language.value);
}; 