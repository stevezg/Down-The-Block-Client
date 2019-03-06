import React from 'react';
import {connect} from 'react-redux';
import { fetchChat } from '../../../actions/chatMessages';
import { fetchUsers } from '../../../actions/users';
import './directory.scss';

export class Directory extends React.Component{  
  constructor(props){
    super(props)

    this.state={
      searchTerm: '',
    }
  }

  componentDidMount(){
    this.props.dispatch(fetchUsers(this.props.coords));
    this.search.focus();
  }

  componentDidUpdate(prevProps){
    this.search.focus();
  }

  setSearchTerm(term){
    this.setState({searchTerm: term});
  }
  
  showAllUsers(){
    let directory; 

    if(this.props.users.length>0){
      let users = this.props.users;

      if(this.state.searchTerm){
        console.log('Search term is', this.state.searchTerm)
        users = users.filter(user=>user.firstName.includes(this.state.searchTerm) || user.lastName.includes(this.state.searchTerm))
      }

      directory = users.map((user,index)=> {
        return (
          <button
            onClick={()=>{
              let namespaceArr = [this.props.currentUser.username, user.username];
              namespaceArr.sort();
              let namespace = namespaceArr.join('');
              this.setState({sidebarOpen: false});
              this.props.dispatch(fetchChat(namespace, this.props.currentUser.id, user.id));
              }
            }
            className="user"
          >
            <div className="profile-photo-avatar">
            {!user.photo ?
              <p className="initials">
                {user.firstName[0]}
                {user.lastName[0]}
              </p>
              :
              <img className="profile-photo" src={user.photo.url} alt="profile"/>
            }
            </div>
            <h3
            className="name"
            key={index}>
            {user.firstName + ' ' + user.lastName}
          </h3>
          </button>
        )
      })
    }
    else{
      directory= <h3>No Neighbors Yet On The App, Spread The Word About DownTheBlock!</h3>
    }

  return directory;
}

  render(){
    return(
      <main className="directory-main">
        <h1>Neighbor Directory</h1>
        <div className="search-container">
          <i className="fas fa-search"></i>
          <input 
            ref={input=>this.search=input}
            className="search"
            placeholder="Search Neighbors Directory"
            value={this.state.searchTerm}
            onChange={e => this.setSearchTerm(e.target.value)}
            type="search" />
        </div>
        <section className="directory">
          {this.showAllUsers()}
        </section>
      </main>
    );
  }
}

const mapStateToProps = state => ({
  coords: state.geolocation.coords,
  display: state.nav.display,
  currentUser: state.auth.currentUser,
  namespace: state.chatMessages.namespace,
  users: state.auth.users,
  loggedIn: state.auth.currentUser !== null,
});

export default connect(mapStateToProps)(Directory)