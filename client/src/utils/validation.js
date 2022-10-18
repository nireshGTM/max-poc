import Validator from 'validatorjs';

Validator.register('telephone', function(value, requirement, attribute) { 
  if(value.length === 3 && value.slice(0,3) === '+1 ' && attribute !== 'officialPhoneNumber') {
    return true;
  }
  //return value.match(/^(\+1\s)(\()(\d{3})(\))(\s)(\d{3})(-)(\d{4})$/);
  return value.match(/^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/);
}, 'Enter a valid phone number.');

Validator.register('telephone_required', function(value, requirement, attribute) { 
  return value.match(/^((\+1|1)?( |-)?)?(\([2-9][0-9]{2}\)|[2-9][0-9]{2})( |-)?([2-9][0-9]{2}( |-)?[0-9]{4})$/);
}, 'Enter a valid phone number.');

Validator.register('password', function(value, requirement, attribute) { 
  return value.match(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[A-Za-z\d[\]{}();:=<>_+~^#$@!%*?&-."/\\|` ]{6,}$/);
  //^ $ * . [ ] { } ( ) ? " ! @ # % & / \ , > < ' : ; | _ ~ ` = + -
  },
  'Your password should contain at least six characters with at least one lowercase letter, one uppercase letter, and one number.');

export const allFieldsValidation = (data, rules, options) => {
  const validation = new Validator(data, rules, options);
  const validationResponse = { isValid: validation.passes() };
  if (!validationResponse.isValid) {
    validationResponse.errors = validation.errors.all();
  }

  return validationResponse;
};
