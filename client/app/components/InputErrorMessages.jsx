import React from 'react';
import { InputErrors } from './proptypes';

export default function InputErrorMessages({ errors }) {
  const { required, minLength, email } = errors;

  return (
    <div className="help-block">
      <ul>
        {required && <li><span className="error">This field is required.</span></li>}
        {minLength && <li><span className="error">This field is too short.</span></li>}
        {email && <li><span className="error">This needs to be a valid email.</span></li>}
      </ul>
    </div>
  );
}

InputErrorMessages.propTypes = {
  errors: InputErrors,
};

InputErrorMessages.defaultProps = {
  errors: {
    required: false,
    minLength: false,
    email: false,
  },
};
