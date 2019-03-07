import React from 'react';
import {connect} from 'react-redux';
import Input from '../common/input';
import {reduxForm, Field, focus, reset} from 'redux-form';
import {updatePassword} from '../../actions/users';
import {required, nonEmpty, matches, length, isTrimmed} from '../common/validators';
import { formError } from '../../actions/auth'

const passwordLength = length({min: 6, max: 72});
const matchesPassword = matches('newPassword');

export class UpdatePasswordForm extends React.Component{
  onSubmit(values) {
    const {oldPassword, newPassword} = values;
    const user = {oldPassword, newPassword};
    return this.props.dispatch(updatePassword(user));
}

  componentWillUnmount(){
    this.props.dispatch(formError(null));
  }

  render(){

    return(
        <form
          className="settings-form form"
          onSubmit={this.props.handleSubmit(values =>
              this.onSubmit(values)
          )}>
          <h2>Password</h2>
          <Field
              component={Input}
              type="password"
              name="oldPassword"
              label="Old Password"
              className="required"
              validate={[required, passwordLength, isTrimmed]}
          />

          <Field
              component={Input}
              type="password"
              name="newPassword"
              label="New Password"
              className="required"
              validate={[required, passwordLength, isTrimmed]}
          />
          <Field
              component={Input}
              type="password"
              label="Password Confirmation"
              name="confirmPassword"
              className="required"
              validate={[required, nonEmpty, matchesPassword]}
          />
          <button
            className="update"
            type="submit"
            disabled={this.props.pristine || this.props.submitting}>
            Update Password
          </button>
        </form>
    );
  }
}

const mapStateToProps = state => ({
  formError: state.auth.formError
});


const afterSubmit = (result, dispatch) => dispatch(reset('UpdatePasswordForm'));

export default connect(mapStateToProps)(reduxForm({
  form:'UpdatePasswordForm',
  onSubmitSuccess: afterSubmit,
  onSubmitFail: (error, dispatch) => {
    dispatch(focus('UpdatePasswordForm', Object.keys(error)[0]));
  }
})(UpdatePasswordForm));