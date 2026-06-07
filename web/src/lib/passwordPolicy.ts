export type PasswordChecks = {
  minLength: boolean;
  lowercase: boolean;
  uppercase: boolean;
  digit: boolean;
  special: boolean;
};

export function getPasswordChecks(password: string): PasswordChecks {
  return {
    minLength: password.length >= 8,
    lowercase: /[a-z]/.test(password),
    uppercase: /[A-Z]/.test(password),
    digit: /\d/.test(password),
    special: /[^A-Za-z0-9\s]/.test(password),
  };
}

export function isPasswordStrong(password: string): boolean {
  const c = getPasswordChecks(password);
  return c.minLength && c.lowercase && c.uppercase && c.digit && c.special;
}
