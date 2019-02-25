import React, { Component } from 'react';
import Messages from './Messages';
import MessageInput from './MessageInput';
import { connect } from 'react-redux';

class ChatContainer extends Component {
	constructor(props) {
	  super(props);	
	
	  this.state = {
	  	chats:[],
	  	activeChat:null
	  };
	}

	componentDidMount() {
		const { socket } = this.props
		this.initSocket(socket)
	}

	initSocket(socket){
		socket = this.props.socket;
		socket.emit('COMMUNITY_CHAT', this.resetChat)
		socket.on('PRIVATE_MESSAGE', this.addChat)
		socket.on('connect', ()=>{
			socket.emit('COMMUNITY_CHAT', this.resetChat)
		})
	}

	sendOpenPrivateMessage = (reciever) => {
		const { socket, user } = this.props
		const { activeChat } = this.state
		socket.emit('PRIVATE_MESSAGE', {reciever, sender:user.name, activeChat})

	}

	resetChat = (chat)=>{
		return this.addChat(chat, true)
	}

	addChat = (chat, reset = false)=>{
		const { socket } = this.props
		const { chats } = this.state

		const newChats = reset ? [chat] : [...chats, chat]
		this.setState({chats:newChats, activeChat:reset ? chat : this.state.activeChat})

		const messageEvent = `${'MESSAGE_RECIEVED'}-${chat.id}`
		const typingEvent = `${'TYPING'}-${chat.id}`

		socket.on(typingEvent, this.updateTypingInChat(chat.id))
		socket.on(messageEvent, this.addMessageToChat(chat.id))
	}

	addMessageToChat = (chatId)=>{
		return message => {
			const { chats } = this.state
			let newChats = chats.map((chat)=>{
				if(chat.id === chatId)
					chat.messages.push(message)
				return chat
			})

			this.setState({chats:newChats})
		}
	}

	updateTypingInChat = (chatId) =>{
		return ({isTyping, user})=>{
			if(user !== this.props.user.name){

				const { chats } = this.state

				let newChats = chats.map((chat)=>{
					if(chat.id === chatId){
						if(isTyping && !chat.typingUsers.includes(user)){
							chat.typingUsers.push(user)
						}else if(!isTyping && chat.typingUsers.includes(user)){
							chat.typingUsers = chat.typingUsers.filter(u => u !== user)
						}
					}
					return chat
				})
				this.setState({chats:newChats})
			}
		}
	}

	sendMessage = (chatId, message)=>{
		const { socket } = this.props
		socket.emit('MESSAGE_SENT', {chatId, message} )
	}

	sendTyping = (chatId, isTyping)=>{
		const { socket } = this.props
		socket.emit('TYPING', {chatId, isTyping})
	}

	setActiveChat = (activeChat)=>{
		this.setState({activeChat})
	}
	render() {
		const { user } = this.props
		const { chats, activeChat } = this.state
		return (
			<div className="container">
				<div className="chat-room-container">
					{
						activeChat !== null ? (

							<div className="chat-room">
								<Messages 
									messages={activeChat.messages}
									user={user}
									typingUsers={activeChat.typingUsers}
								/>
								<MessageInput 
									sendMessage={
										(message)=>{
											this.sendMessage(activeChat.id, message)
										}
									}
									sendTyping={
										(isTyping)=>{
											this.sendTyping(activeChat.id, isTyping)
										}
									}
								/>

							</div>
						):
						<div className="chat-room choose">
							<h3>Choose a chat!</h3>
						</div>
					}
				</div>

			</div>
		);
	}
}

const mapStateToProps = state => {
	return {
	  user: state.auth.currentUser, 
	  postsArray: state.postsArray, 
	  socket:state.socket.socket
	}
}
  
  export default connect(mapStateToProps)(ChatContainer);