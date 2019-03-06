import React from 'react';
import ForumHeader from './ForumHeader';
import PostsList from './PostsList';
import CreatePost from './CreatePost';
import {connect} from 'react-redux';
import './main.scss'

export class Forum extends React.Component{

  componentDidMount(){
    window.scrollTo(0, 0);
    document.title='DownTheBlock';
  }

  render(){
    return(
      <section className="forum">
        <ForumHeader type={this.props.display} />
        {this.props.coords && 
        <React.Fragment>
          <CreatePost 
            editPost={this.props.postBeingEdited}/>
          <PostsList/>
        </React.Fragment>
        }
      </section>
    );
  }
}

const mapStateToProps = state => {
  return{
    display: state.nav.display,
    postBeingEdited: state.posts.postBeingEdited,
    showAnimation: state.nav.showAnimation,
    coords: state.geolocation.coords,
    currentUser: state.auth.currentUser
  }
};

export default connect(mapStateToProps)(Forum)