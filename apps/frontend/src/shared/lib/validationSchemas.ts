import { string } from 'yup';

type Translation = (key: string) => string

export const passwordValidationSchema = (t: Translation) => {
  return string()
    .required(t('errors.required'))
    .trim()
    .min(8, t('auth.errors.passwordNotValid'))
    .max(32,
      t('auth.errors.passwordNotValid')).test('is-strong-password', t('auth.errors.passwordTooWeak'), (value) => {
      if (!value) return false;
      const pattern = /[\d\W]/;

      return pattern.test(value);
    });
};

export const emailValidationSchema = (t: Translation) => {
  return string().email(t('auth.errors.emailNotValid')).required(t('errors.required'));
};

export const nameValidationSchema = (t: Translation) => {
  return string().required(t('errors.required')).trim().min(1, t('auth.errors.nameInvalid')).max(32, t('auth.errors.nameInvalid'));
};

export const imageUrlValidationSchema = (t: Translation) => {
  return string().url(t('errors.urlNotValid')).trim().required(t('errors.required'));
};
