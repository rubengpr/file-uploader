const sanitizeInput = (input) => {
    if (!input)
        return '';
    return input
        .trim()
        .replace(/[<>]/g, '') // Remove < and >
        .substring(0, 100); // Limit length
};
export default sanitizeInput;
//# sourceMappingURL=sanitizeInput.js.map