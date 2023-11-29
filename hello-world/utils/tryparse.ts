const tryParse = <T>(input: unknown): T | unknown => {
    if (!input) {
        return input;
    }
    try {
        // Attempt to parse the input as JSON and cast it to the type T
        return JSON.parse(input as string) as T;
    } catch (error) {
        // If parsing fails, return the original input
        return input;
    }
};

export default tryParse;
