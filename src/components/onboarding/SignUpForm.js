import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, focus} from 'redux-form';
import {registerUser} from '../../actions/users';
import Input from '../common/input';
import { formError } from '../../actions/auth'
import { display, focusOn } from '../../actions/navigation'
import {required, nonEmpty, matches, length, isTrimmed } from '../common/validators';

const passwordLength = length({min: 6, max: 72});
const matchesPassword = matches('password');

export class SignUpForm extends React.Component {
    constructor(props){
        super(props);
    
        this.state = {
          uploadedFile: false,
        }
      }

    componentDidMount(){
        document.title = 'Register';
    }

    componentWillUnmount(){
        this.props.dispatch(formError(null));
    }

    checkIfFile(){
        if(this.img.files.length!==0){
            this.setState({uploadedFile: true});
        }
        else{
            this.setState({uploadedFile: false});
        }
    }

    onSubmit(values) {
        if(this.img && this.img.files.length!==0){
            values.img = this.img.files[0];
        }
        const {password, firstName, lastName, img, registerUsername} = values;
        const user = { password, firstName, lastName, img, registerUsername};
        return this.props.dispatch(registerUser(user))
    }

    onClick(focus=""){
        this.props.dispatch(display(focus));
        this.props.dispatch(focusOn(focus));
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

    render() {

        return (
            <form
                id="register"
                className="registration-form"
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                <h2>Register</h2>

                {this.generateError()}

                <Field
                    component={Input}
                    type="text"
                    name="registerUsername"
                    validate={[required, nonEmpty, isTrimmed]}
                    label="Username"
                />

                <Field 
                    component={Input} 
                    type="text" 
                    name="firstName" 
                    validate={[required, nonEmpty, isTrimmed]}
                    label="First Name"
                />
                
                <Field 
                    component={Input} 
                    type="text" 
                    name="lastName" 
                    validate={[required, nonEmpty, isTrimmed]}
                    label="Last Name"
                />
                <Field
                    component={Input}
                    type="password"
                    name="password"
                    validate={[required, passwordLength, isTrimmed]}
                    label="Password"
                />
                <Field
                    component={Input}
                    type="password"
                    name="passwordConfirm"
                    validate={[required, nonEmpty, matchesPassword]}
                    label="Confirm Password"
                />

                <button 
                    type="button"
                    className="upload-photo"
                    onClick={()=>this.img.click()}
                >
                   <i className="fas fa-camera"></i> Upload Profile Picture {this.state.uploadedFile && <i className="fas fa-file"></i>}
                </button>
                <input 
                    type="file"
                    accept="image/*"
                    className="image-input"
                    name="img"
                    id="img"
                    onChange={()=>this.checkIfFile(this.img)}
                    ref={input => this.img = input} 
                />
                <button
                    type="submit"
                    className="submit"
                    >
                    Register
                </button>
                <div className="bottom-text">
                    <p>Already Have An Account? 
                        <button
                        type="button"
                        className="link-to-form"
                        onClick={()=>this.onClick('loginUsername')} 
                        > Sign In Here!</button>
                    </p>    
                </div>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    formError: state.auth.formError
});

export default connect(mapStateToProps)(reduxForm({
    form: 'registration',
    onSubmitFail: (errors, dispatch) =>{
        dispatch(focus('registration', Object.keys(errors)[0]))
    },
})(SignUpForm));