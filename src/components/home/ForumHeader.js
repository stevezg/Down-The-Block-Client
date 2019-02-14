import React from 'react';
import {connect} from 'react-redux';
import { changeSearchTerm, changeCategoryFilter } from '../../actions/posts'
import './forum-header.css';

export class ForumHeader extends React.Component{
  
  whichForum(){
    return (
      this.props.type === "neighbor-forum" ? 
      <h1>What's Happening In Your Neighborhood</h1> : 
      <h1>What's Happening In Your City</h1>
    );
  }

  render(){
    return(
      <header className="forum-header">
        <input onChange={e=>this.props.dispatch(changeSearchTerm(e.target.value))} className="search-posts" placeholder='Search Posts'/> 

        {this.whichForum()}

        <select className="filter-posts" onChange={e=>this.props.dispatch(changeCategoryFilter(e.target.value))}>
          <option value="">Filter Category:</option>
          <option value="Crime">Crime</option>
          <option value="Personal">Personal</option>
          <option value="Event">Event</option>
          <option value="Other">Other</option>
        </select>
      </header>
    );
  }
}

export default connect()(ForumHeader)
