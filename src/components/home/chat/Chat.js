import React from 'react'; 
import { connect } from 'react-redux';
import moment from 'moment';
import {updateChat, sendMessage} from '../../../actions/chatMessages';
import socketClient from "socket.io-client";
import { API_BASE_URL } from '../../../config'; 
import Message from './Message';

export class Chat extends React.Component {
    constructor(props){
      super(props);

      this.message='';
      this.socket='';
      this.day='';
      this.showDay=true
    }

    componentDidMount(){
      this.content.focus();
      // window.scrollTo(0, document.body.scrollHeight);
      //create the namespaced socket
      fetch(`${API_BASE_URL}/messages/${this.props.namespace}`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.props.authToken}`
        },
      })
      .then(res => res.json())
      .then(() =>{ 
        this.socket= socketClient(`${API_BASE_URL}/${this.props.namespace}`);
        this.socket.on('chat', chat => {
          //send notification
          this.props.dispatch(updateChat(chat));
        })
      })
      .catch(err=>{
        // add error handling
      });
    }

      componentWillUnmount(){
        if(this.socket){
          this.socket.off('chat');
        }
      }

      generateOtherParticipant(){
        let participantA = this.props.chat.participants[0];
        let participantB = this.props.chat.participants[1];
        let other = participantA.id === this.props.currentUser.id ? participantB : participantA;
        return `${other.firstName} ${other.lastName}`;
      }

      onSubmit(e) {
        e.preventDefault();
        this.message=this.content.value;       
        if(this.message.trim()===""){
            return;
        }
        let date = moment().format('LLLL');
        this.props.dispatch(sendMessage(this.props.namespace, this.message, date, this.props.currentUser.id, this.props.chat.id))
        .then(()=>window.scrollTo(0, document.body.scrollHeight))
        this.content.value="";   
        this.message="";
    } 

    handleKeyDown(e){
      if (e.keyCode === 13 && !e.shiftKey)
      {
          //form should submit
          this.message=this.content.value
          this.onSubmit(e);
      }
      else if(e.keyCode===13 && e.shiftKey){
        this.message = this.content.value + ' \n ';
      }
  }

    render() {   
      if(!this.props.namespace || !this.props.chat){
        return null;
      }

    let messages = this.props.chat.messages.map((message, index)=>{
      let next = moment(message.date).format('LL');
      if(this.day!==next){
        this.day=next;
        this.showDay= true;
      }
      else{
        this.showDay= false;
      }
      return(
        <React.Fragment key={index}>
          {this.showDay && <h3>{this.day}</h3>}
          <Message message={message}/>
        </React.Fragment>
      )
    });

      return (
        <section className="chat-container">
          <h1>Chat With {this.generateOtherParticipant()} </h1>
          <section className="messages">
            {messages}
          </section>
          <form
            onSubmit={(e)=> this.onSubmit(e)}
            className="send-message-form"
          >
          <textarea 
            ref={input => this.content = input}
            type="textarea" 
            id="message" 
            name="message" 
            className="send-message"
            placeholder="Send a Message"
            onKeyDown={(e)=>this.handleKeyDown(e)}
          />

          <button 
            type="submit" 
            className="send-message-button"
          >
            <i className="fas fa-arrow-circle-right"></i>
          </button>
          </form>
        </section>
      )
    }
}

const mapStateToProps = state => {
    return {
      currentUser: state.auth.currentUser,
      chat: state.chatMessages.chat,
      authToken: state.auth.authToken,
      day: state.chatMessages.day,
    }
  };
  
export default connect(mapStateToProps)(Chat)

