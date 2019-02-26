import React from 'react';
import {connect} from 'react-redux';
import Sidebar from "react-sidebar";
import { display } from '../../actions/navigation'
import './sidebar.css'
import { fetchPosts } from '../../actions/posts';
import { fetchUsers } from '../../actions/users';
import { HashLink as Link } from 'react-router-hash-link';
import { clearAuth } from '../../actions/auth';
import { clearAuthToken } from '../common/local-storage';

const mql = window.matchMedia(`(min-width: 900px)`);

class SidebarNav extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false
    };

    this.mediaQueryChanged = this.mediaQueryChanged.bind(this);
    this.onSetSidebarOpen = this.onSetSidebarOpen.bind(this);
  }

  componentWillMount() {
    mql.addListener(this.mediaQueryChanged);
  }

  componentWillUnmount() {
    mql.removeListener(this.mediaQueryChanged);
  }

  onSetSidebarOpen(open) {
    this.setState({ sidebarOpen: open });
  }

  mediaQueryChanged() {
    this.setState({ sidebarDocked: mql.matches, sidebarOpen: false });
  }

  componentDidMount (){
    this.props.dispatch(fetchUsers(this.props.coords));
  }

  showAllUsers(){
    if(this.props.users){
      return this.props.users.map((user,index)=> {
        return (
          <button
            className="content"
            onClick={()=>{
              this.onSetSidebarOpen(false)
              this.props.dispatch(display('chat'))
              }
            }
            key={index}>{user.firstName}
          </button>
        )
      })
    }
  }

  logOut() {
    this.props.dispatch(clearAuth());
    this.props.dispatch(display('loginUsername'));
    clearAuthToken();
  }

  generateNav(){
    if(this.props.loggedIn){
      return (
        <React.Fragment>
          <h4>Account</h4>
          <button
             className="content"
             onClick={()=>{
              this.onSetSidebarOpen(false)
              this.props.dispatch(display('about'))
             }
            }
          >            
            About
          </button>
          <button
             className="content"
             onClick={()=>{
              this.onSetSidebarOpen(false)
              this.props.dispatch(display('settings'))
             }
            }
          >            
            Settings
          </button>
          <button id="logout" 
            className="content"
            onClick={() => {
              this.onSetSidebarOpen(false)
              this.logOut()
              }
            }>
            Logout
          </button>
        </React.Fragment>
      )
    }
  }

 render(){
   console.log('CURRENT USER', this.props.currentUser)
    return(
      <React.Fragment>
        {!this.state.sidebarDocked && 
        <button 
          className="open-sidebar" 
          onClick={() => this.onSetSidebarOpen(!this.state.sidebarOpen)}>
          <i className="fa fa-bars"></i>
        </button>}
        <Sidebar
          sidebar=
          {
            <nav className="sidebar">
              <h4>Forums</h4>
              <button 
                className="content" 
                onClick={()=>{
                  this.onSetSidebarOpen(false)
                  this.props.dispatch(fetchPosts(this.props.coords, 'neighbors'))
                }
                }
              >Neighors
              </button>
              <button 
                className="content" 
                onClick={()=>{
                this.onSetSidebarOpen(false)
                this.props.dispatch(fetchPosts(this.props.coords, 'city'))
                } 
              }
              >City
              </button>
              <h4>Chats</h4>
              {this.showAllUsers()}
              {this.generateNav()}
            </nav>
          }
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { position: 'fixed', top: 60, background: 'black', width: 200, padding: 10} , root: {position: 'relative'}  }}
        >
        </Sidebar>
        </React.Fragment>
    );
  }
}
const mapStateToProps = state => ({
  coords: state.geolocation.coords,
  display: state.nav.display,
  users: state.auth.users,
  loggedIn: state.auth.currentUser !== null,
  currentUser: state.auth.currentUser,
});

export default connect(mapStateToProps)(SidebarNav)