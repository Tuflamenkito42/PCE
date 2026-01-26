export const isValidEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
};

export const isStrongPassword = (password) => {
    // Min 8 characters, at least one uppercase, one lowercase, one number
    // You can adjust complexity requirements here
    const minLength = 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    // Optional: check for special chars if needed: const hasSpecial = /[!@#$%^&*]/.test(password);

    return password.length >= minLength && hasUpperCase && hasLowerCase && hasNumbers;
};

export const isValidDNI = (dni) => {
    // Standard Spanish DNI validation
    // Expects 8 digits followed by a letter (e.g., 12345678Z)
    // NIE support could be added if needed (starts with X, Y, Z)

    // Normalize: uppercase and trim
    const str = dni.toUpperCase().trim();

    // Regex for DNI (8 digits + 1 char) or NIE (X/Y/Z + 7 digits + 1 char)
    const contentRegex = /^([XYZ]\d{7,8}|\d{8})([A-Z])$/;

    if (!contentRegex.test(str)) return false;

    const matches = str.match(contentRegex);
    let numberPart = matches[1];
    const letterPart = matches[2];

    // Replace NIE prefix (X,Y,Z) with 0,1,2 respectively for calculation
    numberPart = numberPart.replace('X', '0').replace('Y', '1').replace('Z', '2');

    const number = parseInt(numberPart, 10);
    const validLetters = 'TRWAGMYFPDXBNJZSQVHLCKE';

    return validLetters.charAt(number % 23) === letterPart;
};
