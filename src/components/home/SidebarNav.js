import React from 'react';
import {connect} from 'react-redux';
import Sidebar from "react-sidebar";
import requiresLogin from '../common/requires-login';
import { display } from '../../actions/navigation'
import { fetchPosts } from '../../actions/posts';
import { clearAuth } from '../../actions/auth';
import {Link} from 'react-router-dom';
import { clearAuthToken } from '../common/local-storage';
import './sidebar.scss';
import { fetchChat, fetchPinnedChatUsers, deletePinnedChat } from '../../actions/chatMessages';
import { focusOn } from '../../actions/navigation';
import { formatName } from '../common/helper-functions'

const mql = window.matchMedia(`(min-width: 900px)`);

class SidebarNav extends React.Component{
  constructor(props) {
    super(props);
    this.state = {
      sidebarDocked: mql.matches,
      sidebarOpen: false,
      showForum: true,
      showChat: true,
      showAccount: true,
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

  componentDidMount(){
    this.props.dispatch(fetchPinnedChatUsers());
  }

  showActiveChats(){
    //if the user hits x on the chat, it takes it out of the pinned array
    if(this.props.pinnedChatUsers.length>0){
      return this.props.pinnedChatUsers.map((pinnedChatUser,index)=> {
        return (
          <section key={index} className="other content">
            <button
              className='chat-content'
              onClick={()=>{
                let namespaceArr = [this.props.currentUser.username, pinnedChatUser.username];
                namespaceArr.sort();
                let namespace = namespaceArr.join('');
                this.setState({sidebarOpen: false});
                this.props.dispatch(fetchChat(namespace, this.props.currentUser.id, pinnedChatUser.id));
                }
              }
              key={index}>
              {formatName(pinnedChatUser.firstName)}
            </button>
            <button 
              onClick={()=>this.props.dispatch(deletePinnedChat(pinnedChatUser.id))}
              className="close-chat">
              <i className="fas fa-times"></i>
            </button>
          </section>
        )
      })
    }
  }

  logOut() {
    this.props.dispatch(clearAuth());
    clearAuthToken();
  }

  toggleCategory(category){
    this.setState({[category]: !this.state[category]});
  }

 render(){
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
            <nav className="sidebar" style={{display: `${!this.state.sidebarOpen && !this.state.sidebarDocked ? 'none' : 'inherit'}`}}>
              <button
                className="nav-parent"
                onClick={()=>{
                  this.toggleCategory('showForum')
                }}
              >
              <i className="fas fa-edit"></i> Forums {this.state.showForum ? <i className="fas fa-angle-up"></i> : <i className="fas fa-angle-down"></i>}
              </button>
              {this.state.showForum && <section className="forum-children">
                <Link 
                  to="/home"
                  className="content" 
                  onClick={()=>{
                    this.onSetSidebarOpen(false)
                    this.props.dispatch(fetchPosts(this.props.coords, 'neighbors'))
                    this.props.dispatch(focusOn('searchPosts'));
                  }
                  }>Neighbors
                </Link>
                <Link 
                  to="/home"
                  className="content" 
                  onClick={()=>{
                  this.onSetSidebarOpen(false)
                  this.props.dispatch(fetchPosts(this.props.coords, 'city'))
                  } 
                }
                >City
                </Link>
              </section>}
              <button
                className="nav-parent"
                onClick={()=>{
                  this.onSetSidebarOpen(false)
                  this.props.dispatch(display('searchUsers'))
                  this.props.dispatch(focusOn('searchDirectory'))
                }}
              ><i className="fas fa-comments"></i> Messages 
              </button>
              {this.showActiveChats()}
              <button
                className="nav-parent"
                onClick={()=>{
                  this.toggleCategory('showAccount')
                }}
              ><i className="fas fa-users-cog"></i> Account {this.state.showAccount ? <i className="fas fa-angle-up"></i> : <i className="fas fa-angle-down"></i>}
              </button>
              {this.state.showAccount && <section className="account-children">
                <Link
                  to="/home"
                  className="content"
                  onClick={()=>{
                    this.onSetSidebarOpen(false)
                    this.props.dispatch(display('about'))
                  }
                  }
                >            
                  About
                </Link>
                <Link
                  className="content"
                  to="/home"
                  onClick={()=>{
                    this.onSetSidebarOpen(false)
                    this.props.dispatch(display('settings'))
                  }
                  }
                >            
                  Settings
                </Link>
                <button id="logout" 
                  className="content"
                  onClick={() => {
                    this.onSetSidebarOpen(false)
                    this.props.dispatch(focusOn('loginUsername'))
                    this.logOut()
                    }
                  }>
                  Logout
                </button>
              </section>}
            </nav>
          }
          open={this.state.sidebarOpen}
          docked={this.state.sidebarDocked}
          onSetOpen={this.onSetSidebarOpen}
          styles={{ sidebar: { position: 'fixed', top: 55, background: 'rgb(237, 236, 217)', width: 200, }, root: {position: 'relative', boxShadow: 0}, }}
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
  pinnedChatUsers: state.chatMessages.pinnedChatUsers
});

export default requiresLogin()(connect(mapStateToProps)(SidebarNav));