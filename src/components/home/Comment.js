import React from 'react';
import { connect } from 'react-redux';
import moment from 'moment';
import { deleteComment, commentBeingEdited } from '../../actions/comments';
import { updatePost } from '../../actions/posts';
import PostAddComment from './PostAddComment';

class Comment extends React.Component {
  componentDidMount(){
    this.props.socket.on('delete_comment', post => {
      this.props.dispatch(updatePost(post));
    })
  }

  generateComment(comment){
    let linesArr = comment.content.split('\n');
    return linesArr.map((line, index)=> {
      return(
        <p key={index}> {index===0 && <strong>{comment.userId.firstName}</strong> } {line}</p>
      );
    });
  }

  delete(commentId, postId){
    if(this.props.userId.id===this.props.loggedInUserId){
      return <button className="comment-option" onClick={()=>this.props.dispatch(deleteComment(commentId, postId))} >Delete</button>
    }
  }

  edit(commentId){
    if(this.props.userId.id===this.props.loggedInUserId){
      return <button className="comment-option" onClick={()=>this.props.dispatch(commentBeingEdited(commentId))} >Edit</button>
    }  
  }

  render(){
    if(this.props.commentBeingEdited && this.props.id===this.props.commentBeingEdited.id){
      return (
        <PostAddComment comment={this.props}/>
      )
    }
    
    return(
      <div className="comment-info" >
        <div className="comment-profile-photo-avatar">
          {!this.props.userId.photo ? 
              <p className="initials">
                  {this.props.userId.firstName[0]}
                  {this.props.userId.lastName[0]}
              </p>
              :
              <img className="comment-profile-photo" src={this.props.userId.photo.url} alt="profile"/> 
          }
        </div>
        <div className="comment-content">
          {this.generateComment(this.props)}
          <strong><h6> {moment(this.props.date, 'LLLL').fromNow()} </h6></strong>
          <div>
            {this.edit(this.props)}
            {this.delete(this.props.id, this.props.postId)}
          </div>
        </div>
      </div>
    );
  }
}
//
const mapStateToProps = state => {
  return {
    loggedInUserId: state.auth.currentUser.id, 
    postsArray: state.postsArray, 
    socket:state.socket.socket,
    commentBeingEdited: state.comments.commentBeingEdited
  }
}

export default connect(mapStateToProps)(Comment);