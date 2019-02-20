import React from 'react';
import ForumHeader from './ForumHeader';
import PostsList from './PostsList';
import CreatePost from './CreatePost';
import EyeAnimation from '../common/EyeAnimation'
import {connect} from 'react-redux';
import './main.css'

export class Forum extends React.Component{
  whatToDisplay(){
      if(this.props.postBeingEdited){
        return (
          <div className="modal">
          <CreatePost editPost={this.props.postBeingEdited}/>
        </div>
        )
      }
      else{
        if(this.props.coords){
          return (
            <React.Fragment>
              <CreatePost/>
              <PostsList/>
            </React.Fragment>
          )
        }
      }
  }

  render(){
    console.log('SHOWANIMATION IS', this.props.showAnimation)
    return(
      <section className="forum">
        <ForumHeader type={this.props.display} />
        {this.whatToDisplay()}
      </section>
    );
  }
}

const mapStateToProps = state => ({
  display: state.nav.display,
  postBeingEdited: state.posts.postBeingEdited,
  showAnimation: state.nav.showAnimation,
  coords: state.geolocation.coords
});

export default connect(mapStateToProps)(Forum)