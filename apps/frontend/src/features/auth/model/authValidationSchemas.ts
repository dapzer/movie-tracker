import { string } from 'yup';
import { useI18n } from '#imports';

export const passwordValidationSchema = () => {
  const { t } = useI18n();

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

export const emailValidationSchema = () => {
  const { t } = useI18n();

  return string().email(t('auth.errors.emailNotValid')).required(t('errors.required'));
};

export const nameValidationSchema = () => {
  const { t } = useI18n();

  return string().required(t('errors.required')).trim().min(1, t('auth.errors.nameInvalid')).max(32, t('auth.errors.nameInvalid'));
};
