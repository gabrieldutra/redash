import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox } from 'antd';
import { react2angular } from 'react2angular';
import TextInput from '../TextInput';
import helper from './dynamicFormHelper';

export class DynamicForm extends React.Component {
  static propTypes = {
    target: PropTypes.any,
    type: PropTypes.any,
    actions: PropTypes.any,
    onSubmit: PropTypes.func,
  };

  constructor(props) {
    super(props);
    console.log(props);
    const configurationSchema = this.props.type.configuration_schema;
    const targetOptions = this.props.target.options;

    this.fields = helper.getInputs(configurationSchema, targetOptions);

    this.state = {
      target: this.props.target,
      nameErrors: !this.props.target.name,
      inProgressActions: {},
    };

    this.listenForNameInputChange = this.listenForInputChange
      .bind(this, 'name');
    this.formErrors = this.formErrors.bind(this);
    this.handleAction = this.handleAction.bind(this);
    this.updateFieldState = helper.updateFieldState.bind(this);
    this.setActionInProgress = helper.setActionInProgress.bind(this);
  }

  listenForInputChange = (fieldName, value, hasErrors) => {
    this.updateFieldState(fieldName, value, hasErrors);
  };

  formErrors = () => this.state.nameErrors || Object.values(this.fields)
    .reduce((acc, cur) => acc || cur.hasErrors, false);

  handleAction = (event) => {
    const actionName = event.target.dataset.action;

    this.setActionInProgress(actionName, true);

    this.props.actions.forEach((action) => {
      if (action.name === actionName) {
        action.callback(() => {
          this.setActionInProgress(actionName, false);
        });
      }
    });
  }

  renderFields() {
    return this.fields.map((field) => {
      const commonAttrs = {
        key: field.name,
        name: field.name,
        label: field.property.title || helper.toHuman(field.name),
        dataTest: field.property.title || helper.toHuman(field.name),
        defaultValue: this.state.target.options[field.name],
        listenForChange: this.listenForInputChange.bind(this, field.name),
      };

      switch (field.property.type) {
        case 'checkbox':
          return (
            <Checkbox
              key={field.name}
            >
              {field.property.title || helper.toHuman(field.name)}
            </Checkbox>
          );
        default:
          return (
            <TextInput
              {...commonAttrs}
              type={field.property.type}
              required={field.property.required}
              placeholder={field.property.default}
            />
          );
      }
    });
  }

  renderActions() {
    const { inProgressActions } = this.state;

    return this.props.actions.map(action => (
      <span key={action.name}>
        <button
          type="button"
          className={`btn ${action.class}`}
          onClick={this.handleAction}
          disabled={inProgressActions[action.name]}
          data-action={action.name}
        >
          {inProgressActions[action.name] ? (<i className="zmdi zmdi-spinner zmdi-hc-spin m-r-5" />) : null}
          {action.name}
        </button>
      </span>
    ));
  }

  render() {
    return (
      <form name="dynamicForm">
        <TextInput
          name="name"
          label="Name"
          dataTest="TargetName"
          defaultValue={this.props.target.name}
          listenForChange={this.listenForNameInputChange}
          autoFocus
          required
        />
        <hr />
        {this.renderFields()}
        <button
          className="btn btn-block btn-primary m-b-10"
          disabled={this.formErrors()}
          data-test="Submit"
        >
          Save
        </button>
        {this.state.target.id ? this.renderActions() : null}
      </form>
    );
  }
}

export default function init(ngModule) {
  ngModule.component('dynamicForm', {
    template: `
      <dynamic-form-impl 
        target="$ctrl.target"
        type="$ctrl.type"
        actions="$ctrl.actions"
        onSubmit="$ctrl.target.$save"
      ></dynamic-form-impl>
    `,
    bindings: {
      target: '=',
      type: '=',
      actions: '=',
      onSubmit: '=',
    },
  });
  ngModule.component('dynamicFormImpl', react2angular(DynamicForm));
}

init.init = true;
