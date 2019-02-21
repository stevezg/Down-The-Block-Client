import React from 'react';
import {Field, reduxForm, focus} from 'redux-form';
import {registerUser} from '../../actions/users';
import {login} from '../../actions/auth';
import Input from '../common/input';
import {Link} from 'react-router-dom';
import {required, nonEmpty, matches, length, isTrimmed, sizeLimit } from '../common/validators';

const passwordLength = length({min: 8, max: 72});
const matchesPassword = matches('password');

export class SignUpForm extends React.Component {
    onSubmit(values) {
        if(values.img){
            values.img = values.img[0];
        }
        const {password, firstName, lastName, img} = values;
        const user = { password, firstName, lastName, img};
        user.username = values['register-username'];
        return this.props
            .dispatch(registerUser(user))
            .then(() => this.props.dispatch(login(user.username, password)));
    }

    render() {
        return (
            <form
                id="register"
                className="registration-form"
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                <h2>Register</h2>

                <label htmlFor="username">Username:</label>
                <Field
                    component={Input}
                    type="text"
                    name="register-username"
                    validate={[required, nonEmpty, isTrimmed]}
                />

                <label htmlFor="firstName">First name:</label>
                <Field 
                    component={Input} 
                    type="text" 
                    name="firstName" 
                    validate={[required, nonEmpty, isTrimmed]}
                />

                <label htmlFor="lastName">Last name:</label>
                
                <Field 
                    component={Input} 
                    type="text" 
                    name="lastName" 
                    validate={[required, nonEmpty, isTrimmed]}
                />
                <label htmlFor="password">Password:</label>
                <Field
                    component={Input}
                    type="password"
                    name="password"
                    validate={[required, passwordLength, isTrimmed]}
                />
                <label htmlFor="passwordConfirm">Confirm password:</label>
                <Field
                    component={Input}
                    type="password"
                    name="passwordConfirm"
                    validate={[required, nonEmpty, matchesPassword]}
                />
                <Field
                    component={Input}
                    label="Profile Photo:" 
                    name="img" 
                    id="img"
                    type= "file"
                    validate={[sizeLimit]}
                />
                <button
                    type="submit"
                    disabled={this.props.pristine || this.props.submitting}>
                    Register
                </button>
                <label>Already Registered?</label>
                <Link to="/">Login</Link>
            </form>
        );
    }
}

export default reduxForm({
    form: 'registration',
    onSubmitFail: (errors, dispatch) =>
        dispatch(focus('registration', Object.keys(errors)[0]))
})(SignUpForm);
