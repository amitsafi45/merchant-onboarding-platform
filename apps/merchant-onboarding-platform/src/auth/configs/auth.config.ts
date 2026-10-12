export const SecurityConfig = {
  SALT_ROUNDS: 10,
  PASSWORD_RULES: {
    minLength: 8,
    minNumbers: 1,
    minUppercase: 1,
    minSymbols: 1,
  },
};
