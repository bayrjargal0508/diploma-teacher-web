export const EMAIL_REG = /^[\w._-]+[+]?[\w._-]+@[\w.-]+\.[a-zA-Z]{2,6}$/;

export const REGISTRY_REG = /^[а-яА-ЯёүөЁҮӨ]{2}[0-9]{8}$/u;

export const PASSWORD_REG = /^(?=.*[A-Z])(?=.*[a-z]+)(?=.*\d).{8,}$/;
export const MIN_LENGTH_8_REG = /.{8,}/;
export const UPPERCASE_REG = /(?=.*[A-Z])/;
export const LOWERCASE_REG = /[a-z]+/;
export const ONE_DIGIT_REG = /(?=.*\d)/;
