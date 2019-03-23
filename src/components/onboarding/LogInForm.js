import React from 'react';
import {connect} from 'react-redux';
import {Field, reduxForm, focus} from 'redux-form';
import Input from '../common/input';
import {login} from '../../actions/auth';
import {required, nonEmpty} from '../common/validators';
import { display, focusOn } from '../../actions/navigation'
import { formError } from '../../actions/auth'

export class LogInForm extends React.Component {
    onSubmit(values) {
        return this.props.dispatch(login(values.loginUsername, values.password));
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

    componentWillUnmount(){
        this.props.dispatch(formError(null));
    }

    render() {

        return (
            <form
                id = "login"
                className="login-form"
                onSubmit={this.props.handleSubmit(values =>
                    this.onSubmit(values)
                )}>
                <h2>Sign In</h2>
                {this.generateError()}
                <Field
                    component={Input}
                    ref={input => (this.input = input)}
                    type="text"
                    name="loginUsername"
                    id="loginUsername"
                    label="Username"
                    validate={[required, nonEmpty]}
                />
                <Field
                    component={Input}
                    type="password"
                    name="password"
                    label="Password"
                    validate={[required, nonEmpty]}
                />
               
                <button 
                type="submit"
                className="submit"
                >
                    Log in
                </button>
                <div className="bottom-text">
                    <p>Don't Have An Account? 
                        <button
                        type="button"
                        className="link-to-form"
                        onClick={()=>this.onClick('registerUsername')} 
                        > Sign Up Here!</button>
                    </p>   
                    <p>Want To See A Live Demo?
                        <button
                        type="button"
                        className="link-to-form"
                        onClick={()=>{
                            let values = {
                                loginUsername:'ross',
                                password:"friends123",
                            }
                            this.onSubmit(values)
                        }} 
                        > Click Here!</button>
                    </p>  
                </div>
            </form>
        );
    }
}

const mapStateToProps = state => ({
    focusOn: state.nav.focusOn,
    formError: state.auth.formError
});

export default connect(mapStateToProps)(reduxForm({
    form:'login',
    onSubmitFail: (error, dispatch) => {
      dispatch(focus('login', Object.keys(error)[0]));
    },
  })(LogInForm));