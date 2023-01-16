/*
 * Created on Fri Jan 06 2023
 *
 * Custom yup validate
 *
 * Copyright (c) 2023 - Novus Fintech
 */

import moment from 'moment';
import * as yup from 'yup';
import { AnyObject } from 'yup/lib/types';
import validate from './validate';

const urlPattern = /(?:https?):\/\/(\w+:?\w*)?(\S+)(:\d+)?(\/|\/([\w#!:.?+=&%!\-\/]))?/;

type methodString = yup.StringSchema<string | undefined, AnyObject, string | undefined>;

declare module 'yup' {
  interface MixedSchema<TType, TContext, TOut> {
    checkFile(message: string, maxSize?: number, accept?: string): any;
  }
  interface StringSchema {
    checkEmail(message: string): methodString;
    checkValidField(message: string): methodString;
    compareTimesLocal(message?: string): methodString;
    checkValidUrl(message?: string): methodString;
    compareTimes(message?: string): methodString;
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

yup.addMethod(yup.string, 'checkValidField', function (message = 'lang_date_of_birth_invalid') {
  return this.test('checkValidField', '', function (value) {
    const { path, createError } = this;
    const formatDate = typeof value === 'string' && value.length === 13 ? Number(value) : value;
    const date = moment(formatDate);
    if (date.isValid()) {
      return true;
    } else {
      return createError({ path, message: message });
    }
  });
});

yup.addMethod(yup.string, 'checkValidUrl', function (message = 'lang_invalid_url') {
  return this.test('checkValidUrl', '', function (value: string) {
    const { path, createError } = this;
    if (urlPattern.test(value)) {
      return true;
    } else {
      return createError({ path, message: message });
    }
  });
});

yup.addMethod(yup.string, 'compareTimesLocal', function (message = 'lang_expire_date_require') {
  return this.test('compareTimesLocal', '', function (value) {
    const { path, createError } = this;
    const localTime = moment().toDate().getTime();
    const valueTime = moment(value).toDate().getTime();

    if (localTime > valueTime) return createError({ path, message: message });
    return true;
  });
});

yup.addMethod(yup.mixed, 'checkFile', function (message, maxSize = 10000000, accept = '.jpeg, .jpg, .png, .heic') {
  return this.test('checkFile', '', function (value) {
    const { path, createError } = this;
    if ([null, undefined, ''].includes(value)) {
      return createError({ path, message });
    }
    if (value.size && value.size > maxSize)
      return createError({
        path,
        message: 'lang_field_size_limit_exceeded',
      });
    if (value.extension && !accept.includes(value.extension)) return createError({ path, message: 'lang_file_format_error' });
    return true;
  });
});

yup.addMethod(yup.string, 'compareTimes', function (message = 'lang_expire_date_require') {
  return this.test('compareTimes', '', function (value, context) {
    const { path, createError } = this;
    const { expire, type_expired } = context.parent;

    const timeCompare = moment()
      .add(expire, (type_expired + '').toLowerCase())
      .toDate()
      .getTime();
    const valueCompare = moment(value).toDate().getTime();

    if (valueCompare > timeCompare) return createError({ path, message: message });
    return true;
  });
});

export default yup;
