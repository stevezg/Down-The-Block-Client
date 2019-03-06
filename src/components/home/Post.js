import React from 'react';
import {connect} from 'react-redux';
import PostComments from './PostComments';
import PostAddComment from './PostAddComment';
import { postBeingEdited, deletePostSuccess, deletePost } from '../../actions/posts';
import './post.scss';

export class Post extends React.Component {

  componentDidMount(){
    this.props.socket.on('delete_post', post => {
      this.props.dispatch(deletePostSuccess(post.id));
    })
  }

  edit(postId, content, category){
    if(this.props.userId.id===this.props.loggedInUserId){
      return (
        <button
          onClick={()=>this.props.dispatch(postBeingEdited({postId, content, category}))} >
          <i className="fas fa-pencil-alt"></i>
        </button>)
    }
  }

  delete(postId){
    if(this.props.userId.id===this.props.loggedInUserId){
      return (
        <button
          onClick={()=> {
            let confirmDelete = window.confirm('Are you sure you want to delete this post?');
            if(confirmDelete){
              this.props.dispatch(deletePost(postId))
            }
          }} >
          <i className="fas fa-trash"></i>
        </button>)
    }
  }

  generateContent(){
    let linesArr = this.props.content.split('\n');
    return linesArr.map((line, index)=> {
      return(
        <p className="line" key={index}> {line}</p>
      );
    });
  }

  render(){

    return(
      <section className={`entire-thread border-${this.props.category}`}>
        <article className='post'>
            <div className="options">
              {this.edit(this.props.postId, this.props.content, this.props.category)}
              {this.delete(this.props.postId)}
          </div>

          <div className="post-info">
            <div className="profile-photo-avatar">
            {!this.props.userId.photo ?
              <p className="initials">
                {this.props.userId.firstName[0]}
                {this.props.userId.lastName[0]}
              </p>
              :
              <img className="profile-photo" src={this.props.userId.photo.url} alt="profile"/>
            }
            </div>

            <div className="name-and-date">
              <h3 className="post-user-name">{this.props.userId.firstName}</h3>
              <h6>{this.props.date}</h6>
            </div>
          </div>

          {this.generateContent()}
          {/* <p className="post-content">{this.props.content}</p> */}
          {this.props.photo && <img className="post-photo"src={this.props.photo.url} alt="post"/> }

        </article>
        <PostComments comments={this.props.comments}/>
       {!this.props.commentBeingEdited && <PostAddComment form={this.props.postId}/>
       }
      </section>
    );
  }
}

const mapStateToProps = state => {
  return {
    loggedInUserId: state.auth.currentUser.id,
    coords: state.geolocation.coords,
    postsArray: state.postsArray,
    commentBeingEdited: state.comments.commentBeingEdited,
    socket:state.socket.socket
  }
};

export default connect(mapStateToProps)(Post)

