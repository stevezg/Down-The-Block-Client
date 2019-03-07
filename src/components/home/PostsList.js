import React from 'react';
import {connect} from 'react-redux';
import Post from './Post';
import { fetchPosts } from '../../actions/posts';
import { filterPostsBySearch, filterByCategory } from '../common/helper-functions'
import logo from '../../img/logo.png';
import moment from 'moment';

export class PostsList extends React.Component{
  componentDidMount(){
    this.props.dispatch(fetchPosts(this.props.coords, this.props.display));
  }

  generatePosts(){
    if(this.props.posts.length===0){
      let post={
        category: "Other",
        content: "Looks like there aren't any posts yet in this forum. Be the first and post something above!",
        date: moment().format('LLLL'),
        postId: "123",
        comments: [],
        userId: {
          firstName: "DownTheBlock",
          photo: {
            url: logo,
          },
          id: '123'
        }
      }
      return <Post {...post} />
    }

    let posts = this.props.posts.map((post)=> <Post key={post.id} postId={post.id} {...post} />);

    if(this.props.searchTerm){
      posts = filterPostsBySearch(this.props.searchTerm, posts);
    }

    if(this.props.categoryFilter){
      posts = filterByCategory(this.props.categoryFilter, posts)
    }
    return posts;
  }

  render(){
    return(
      <section className="posts-list">
        {this.generatePosts()}
      </section>

    );
  }
}

const mapStateToProps = state => {
  return { 
    posts: state.posts.posts,
    coords: state.geolocation.coords,
    searchTerm: state.posts.searchTerm,
    categoryFilter: state.posts.categoryFilter,
    display: state.nav.display, 
    socket:state.socket.socket, 
  }
};

export default connect(mapStateToProps)(PostsList)

