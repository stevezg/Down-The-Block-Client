import React from 'react';
import {connect} from 'react-redux';
import Forum from './Forum';
import SettingsPage from '../settings/SettingsPage'
import Chat from './chat/Chat';
import About from '../common/About';
import Directory from './chat/Directory';
import './main.scss';

export class Main extends React.Component{

  display(){
    return this.props.display==="neighbors" || this.props.display==="city" ? <Forum/> :
    this.props.display==="settings" ? <SettingsPage/> : this.props.display==="about" ? <About/> : this.props.display==="searchUsers" ? <Directory/> : this.props.display==="chat" ? <Chat namespace={this.props.namespace}/> : <Forum />
  }

  render(){
    return(
      <main className="main">
        {this.display()}
      </main>
    );
  }
}

const mapStateToProps = state => ({
  display: state.nav.display,
  currentUser: state.auth.currentUser,
  namespace: state.chatMessages.namespace,
});

export default connect(mapStateToProps)(Main)