import React from 'react'; 
import { connect } from 'react-redux';
import moment from 'moment'
import './message.scss';

export class Message extends React.Component {
  generateMessage(message){
    let linesArr = message.split('\n');
    return linesArr.map((line, index)=> {
      return(
        <p key={index}>{line}</p>
      );
    });
  }
    
    render() {   
      let className = this.props.message.author.id === this.props.currentUser.id ? 'mine' : 'theirs'

      return(
        <section className={`${className} chat-message`}>
          <div className="profile-photo-avatar">
            {!this.props.message.author.photo ?
              <p className="initials">
                {this.props.message.author.firstName[0]}
                {this.props.message.author.lastName[0]}
              </p>
              :
              <img className="profile-photo" src={this.props.message.author.photo.url} alt="profile"/>
            }
          </div>
          <div className={`${className} message`}>
            <strong><p>{this.props.message.author.firstName}</p></strong>
            <p className="chat-time">{moment(this.props.message.date).format('LT')}</p>
            <div>{this.generateMessage(this.props.message.content)}</div>
          </div>
        </section>
      )
    }
}

const mapStateToProps = state => {
    return {
      currentUser: state.auth.currentUser,
      chatParticipants: state.chatMessages.chat.chatParticipants
    }
  };
  
export default connect(mapStateToProps)(Message)

