import React from 'react';
import {connect} from 'react-redux';
import Comment from './Comment';

export class PostComments extends React.Component{
  
  generateComments(){
    return this.props.comments.map((comment, index)=>
        <Comment key={index} {...comment} />
    );
  }

  render(){
    return(
      <div className="comments-list">
        {this.generateComments()}
      </div>
    );
  }
}
const mapStateToProps = (state) => {
  return {
  postsArray: state.posts.posts, 
  coords: state.geolocation.coords
  }
}
export default connect(mapStateToProps)(PostComments)