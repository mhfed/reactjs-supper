class Validate {
  isValidParameterKey = (value: string): boolean => {
    const pattern = /^[a-z]([a-z0-9_-]+)*$/i;
    return pattern.test(value);
  };

  getPasswordPattern = () => {
    return /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.{8,})/;
  };

  isValidEmail = (value: string): boolean => {
    const pattern = this.getEmailPattern();
    return pattern.test(value);
  };

  getEmailPattern = () => {
    return /^([a-z0-9]+[_+.-])*[a-z0-9]+@(([a-z0-9]+-)*([a-z0-9]+)\.)+[a-z]{2,}$/i;
  };
}

const validate = new Validate();

export default validate;
