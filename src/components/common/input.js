import React from 'react';
import {connect} from 'react-redux';
import { focusOn } from '../../actions/navigation';
import { formError } from '../../actions/auth';


export class Input extends React.Component {
    componentDidUpdate(prevProps) {
        //focus on form when clicked
        if(this.input.id===this.props.focusOn){
            this.input.focus();
            this.props.dispatch(focusOn(""));
        }
        if (!prevProps.meta.active && this.props.meta.active) {
            this.input.focus();
        }
    }

    render() {
        const Element = this.props.element || 'input';

        const max = {max: this.props.max};
        const placeholder = {placeholder: this.props.placholder};
        const accept = {accept: 'image/png, image/jpeg, image/jpg'}
        const maxLength = {maxLength: this.props.maxLength};

        let error;
        if (this.props.meta.touched && this.props.meta.error) {
            error= this.props.label + ' ' + this.props.meta.error;
            if(this.props.meta.error!=="Required"){
                this.props.dispatch(formError(error));
            }
        }

        let element = (<Element
            {...this.props.input}
            {...max}
            {...maxLength}
            {...placeholder}
            id={this.props.input.name}
            type={this.props.type}
            ref={input => (this.input = input)}
            autoFocus = {this.props.autoFocus}
            className={error && "highlight-red"}
            >
            {this.props.children}
        </Element>)

        //if its a file/image, need to handle it differently: 
        if(this.props.input.name==="img"){
            delete this.props.input.value;
            element = (<Element
                {...this.props.input}
                {...accept}
                id={this.props.input.name}
                type={this.props.type}
                ref={input => (this.input = input)}
                autoFocus = {this.props.autoFocus}
                className={error && "highlight-red"}
            >
            </Element>)
        }

        return (
            <div className="form-input">
                <label htmlFor={this.props.input.name}>
                    {this.props.label}
                </label>
                {element}
            </div>
        );
    }
}

const mapStateToProps = (state) => ({
    focusOn: state.nav.focusOn,
    focusForm: state.nav.focusForm,
  });
  
  export default connect(mapStateToProps)(Input);