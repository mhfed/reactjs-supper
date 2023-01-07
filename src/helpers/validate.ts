/*
 * Created on Fri Jan 06 2023
 *
 * Validator
 *
 * Copyright (c) 2023 - Novus Fintech
 */

class Validate {
  isValidParameterKey = (value: string): boolean => {
    const pattern = /^[a-z]([a-z0-9_-]+)*$/i;
    return pattern.test(value);
  };

  getPasswordPattern = () => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,25})/;
  };

  removeVietnamese = (str: string) => {
    str = str.replace(/\s+/g, ' ');
    str = str.trim();
    str = str.replace(/à|á|ạ|ả|ã|â|ầ|ấ|ậ|ẩ|ẫ|ă|ằ|ắ|ặ|ẳ|ẵ/g, '');
    str = str.replace(/è|é|ẹ|ẻ|ẽ|ê|ề|ế|ệ|ể|ễ/g, '');
    str = str.replace(/ì|í|ị|ỉ|ĩ/g, '');
    str = str.replace(/ò|ó|ọ|ỏ|õ|ô|ồ|ố|ộ|ổ|ỗ|ơ|ờ|ớ|ợ|ở|ỡ/g, '');
    str = str.replace(/ù|ú|ụ|ủ|ũ|ư|ừ|ứ|ự|ử|ữ/g, '');
    str = str.replace(/ỳ|ý|ỵ|ỷ|ỹ/g, '');
    str = str.replace(/đ/g, '');
    str = str.replace(/À|Á|Ạ|Ả|Ã|Â|Ầ|Ấ|Ậ|Ẩ|Ẫ|Ă|Ằ|Ắ|Ặ|Ẳ|Ẵ/g, '');
    str = str.replace(/È|É|Ẹ|Ẻ|Ẽ|Ê|Ề|Ế|Ệ|Ể|Ễ/g, '');
    str = str.replace(/Ì|Í|Ị|Ỉ|Ĩ/g, '');
    str = str.replace(/Ò|Ó|Ọ|Ỏ|Õ|Ô|Ồ|Ố|Ộ|Ổ|Ỗ|Ơ|Ờ|Ớ|Ợ|Ở|Ỡ/g, '');
    str = str.replace(/Ù|Ú|Ụ|Ủ|Ũ|Ư|Ừ|Ứ|Ự|Ử|Ữ/g, '');
    str = str.replace(/Ỳ|Ý|Ỵ|Ỷ|Ỹ/g, '');
    str = str.replace(/Đ/g, '');
    return str;
  };

  isValidEmail = (value: string): string => {
    const engEmail = this.removeVietnamese(value);
    if (engEmail.length !== value.length) return 'lang_email_invalid';
    const pattern = this.getEmailPattern();
    return pattern.test(value) && value.length < 256 ? '' : value.length > 255 ? 'lang_email_too_long' : 'lang_email_invalid';
  };

  getEmailPattern = () => {
    return /^([a-z0-9]+[_+.-])*[a-z0-9]+@(([a-z0-9]+-)*([a-z0-9]+)\.)+[a-z]{2,}$/i;
  };
}

const validate = new Validate();

export default validate;
