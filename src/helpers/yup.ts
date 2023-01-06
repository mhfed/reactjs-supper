import * as yup from 'yup';
import validate from './validate';

declare module 'yup' {
  interface StringSchema {
    checkEmail(message: string): any; // eslint-disable-line
  }
}

yup.addMethod(yup.string, 'checkEmail', function (message = 'lang_email_invalid') {
  return this.test('email', message, function (value) {
    const { path, createError } = this;
    if (value) {
      const errorCodeLang = validate.isValidEmail(value);
      if (errorCodeLang) {
        return createError({ path, message: errorCodeLang });
      }
    }
    return true;
  });
});

export default yup;
