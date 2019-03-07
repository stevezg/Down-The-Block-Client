import React from 'react';
import {connect} from 'react-redux';
import Input from '../common/input';
import {reduxForm, Field, focus} from 'redux-form';
import {updatedUser} from '../../actions/users';
import {required, nonEmpty, isTrimmed} from '../common/validators';
import {formatName} from '../common/helper-functions';
import { formError } from '../../actions/auth'

export class UpdateAccountForm extends React.Component{
  onSubmit(values) {
    const {username, firstName, lastName} = values;
    const user = {username, firstName, lastName};
    user.firstName = formatName(user.firstName);
    return this.props.dispatch(updatedUser(user));
}

generateError(){
  let error;
  if (this.props.error) {
      error = (
          <div className="form-error" aria-live="polite">
              {this.props.error}
          </div>
      );
  }
  else if(this.props.formError){
      error = (
          <div className="form-error" aria-live="polite">
              {this.props.formError}
          </div>
      );            
  }
  return error;
}

componentWillUnmount(){
  this.props.dispatch(formError(null));
}


  render(){
    return(
        <form
          className="settings-form"
          onSubmit={this.props.handleSubmit(values =>
              this.onSubmit(values)
          )}>
          <h2>Account</h2>
          {this.generateError()}
          <Field 
              component={Input} 
              type="text" 
              name="firstName" 
              label="First Name"
              maxLength="12"
              className="required"
              validate={[required, nonEmpty, isTrimmed]}
          />
          <Field 
              component={Input} 
              type="text" 
              name="lastName" 
              label="Last Name"
              className="required"
              validate={[required, nonEmpty, isTrimmed]}
          />
          <Field
              component={Input}
              type="text"
              name="username"
              label = "Username"
              className="required"
              validate={[required, nonEmpty, isTrimmed]}
          />

          <button
            className="update"
            type="submit"
            disabled={this.props.pristine || this.props.submitting}>
            Update Account
          </button>
        </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    display: state.nav.display,
    formError: state.auth.formError,
    initialValues: {
      firstName: state.auth.currentUser.firstName,
      lastName: state.auth.currentUser.lastName,
      username: state.auth.currentUser.username,
    }
  }
}

export default connect(mapStateToProps)(reduxForm({
  form:'UpdateAccountForm',
  onSubmitFail: (error, dispatch) => {
    dispatch(focus('UpdateAccountForm', Object.keys(error)[0]));
}
})(UpdateAccountForm));