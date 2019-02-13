import React from 'react';
import {connect} from 'react-redux';
import {reduxForm, Field, focus} from 'redux-form';
import Input from '../common/input';
import {submitPost} from '../../actions/posts';
import {required, nonEmpty} from '../common/validators';
import {todaysDate} from '../common/helper-functions';

export class CreatePost extends React.Component{
  onSubmit(values){
    return this.props.dispatch(submitPost(values, this.props.currentPetId, this.props.currentPostId));
  }

  render(){
    let error;
    if (this.props.error) {
        error = (
            <div className="form-error" aria-live="polite">
                {this.props.error}
            </div>
        );
    }

    return(
      <div>
        <form className="form" onSubmit={this.props.handleSubmit(values => this.onSubmit(values))}>

        {error}

          <Field
            component={Input}
            className="required"
            type="text" 
            name="category" 
            id="category"
            validate={[required, nonEmpty]}
          /> 

          <Field
            component={Input} 
            className="required"
            label = "Date:"
            name="date" 
            id="date"
            type = "date"
            max= {todaysDate()}
            validate={[required, nonEmpty]}
          />

          <Field
            component={Input}
            label="Content:" 
            element="textarea" 
            maxLength = '180'
            name="content" 
            id="content"
          /> 

          <Field
            component={Input}
            label="Coordinates:" 
            type="text" 
            name="coordinates" 
            id="coordinates"
            >
          </Field>
          
          <div className="buttons">
            <button disabled={this.props.pristine || this.props.submitting} type="submit">Post</button>
          </div>

        </form>
      </div>
    );
  }
}

export default connect()(reduxForm({
  form:'CreatePost',
  onSubmitFail: (error, dispatch) => {
    dispatch(focus('CreatePost', Object.keys(error)[0]));
  },
})(CreatePost));