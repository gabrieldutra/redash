import React from 'react';
import PropTypes from 'prop-types';

export default class CheckboxInput extends React.Component {
  static propTypes = {
    name: PropTypes.string.isRequired,
    label: PropTypes.string,
    dataTest: PropTypes.string,
    defaultValue: PropTypes.bool,
    listenForChange: PropTypes.func,
  };

  static defaultProps = {
    label: '',
    dataTest: '',
    defaultValue: false,
    listenForChange: () => {},
  };

  constructor(props) {
    super(props);
    this.state = {
      checked: this.props.defaultValue,
    };

    this.onChange = this.onChange.bind(this);
  }

  onChange = (event) => {
    const newValue = event.target.checked;
    this.props.listenForChange(newValue);

    this.setState({
      checked: newValue,
    });
  };

  render() {
    const {
      label,
      name,
      dataTest,
      defaultValue,
      listenForChange,
      ...other
    } = this.props;

    const { checked } = this.state;

    return (
      <div className="checkbox">
        <label htmlFor={name}>
          <input
            {...other}
            id={name}
            name={name}
            type="checkbox"
            data-test={dataTest || label || name}
            onChange={this.onChange}
            checked={checked}
          />
          {label || name}
        </label>
      </div>
    );
  }
}
