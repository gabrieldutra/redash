/* eslint-disable jsx-a11y/label-has-for */
import React from 'react';
import PropTypes from 'prop-types';
import InputErrorMessages from './InputErrorMessages';

export default class TextInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    required: PropTypes.bool,
    type: PropTypes.oneOf(['text', 'string', 'number', 'password', 'email']),
    label: PropTypes.string,
    dataTest: PropTypes.string,
    minLength: PropTypes.number,
    defaultValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
    listenForChange: PropTypes.func,
  };

  static defaultProps = {
    required: false,
    type: 'text',
    label: '',
    dataTest: '',
    minLength: 0,
    defaultValue: '',
    listenForChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      errors: {
        required: false,
        minLength: false,
        email: false,
      },
      value: this.props.defaultValue,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange = (event) => {
    const newValue = event.target.value;
    const newErrors = {
      required: !newValue && this.props.required,
      minLength: newValue.length < this.props.minLength,
    };

    const hasErrors = Object.values(newErrors).reduce((acc, cur) => acc || cur);
    this.props.listenForChange(newValue, hasErrors);

    this.setState({
      errors: newErrors,
      value: newValue,
    });
  };

  render() {
    const {
      label,
      type,
      required,
      name,
      dataTest,
      defaultValue,
      listenForChange,
      ...other
    } = this.props;

    const { errors, value } = this.state;
    const showErrors = errors.required || errors.minLength || errors.email;

    return (
      <div className={`form-group ${showErrors ? 'has-error' : ''} ${required ? 'required' : ''}`}>
        <label htmlFor={name} className="control-label">
          {label || name}
        </label>
        <input
          {...other}
          id={name}
          name={name}
          type={type}
          className="form-control"
          data-test={dataTest || label || name}
          required={required}
          onChange={this.onChange}
          value={value}
        />
        {showErrors && <InputErrorMessages errors={errors} />}
      </div>
    );
  }
}
