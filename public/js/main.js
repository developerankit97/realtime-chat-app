const backend = 'http://localhost:3000';

let userList = document.querySelector('.user-list');
let chatContainer = document.querySelector('#chat-container');
let inputMessage = document.querySelector('#input-message');
let chatContainerMessageList = document.querySelector(
	'.chat-container-msg-list'
);
const sendMessageBtn = document.querySelector('.send-message');
const chatRecipient = document.querySelector('.chat-recipient');

window.addEventListener('DOMContentLoaded', getUsers);
userList.addEventListener('click', selectUserForChat);
sendMessageBtn.addEventListener('click', sendMessage);
inputMessage.addEventListener('keydown', typingHandler);

var typingAnimation = `<div class="chat-bubble">
<div class="typing">
  <div class="dot"></div>
  <div class="dot"></div>
  <div class="dot"></div>
</div>
</div>`;

const socket = io();

socket.on('chatMessage', (data) => {
	showSentMessage(data);
});

socket.on('typing', (data) => {
	if (data.room == chatContainer.datasetRoom) {
		if (data.sender != chatContainer.datasetLoggedUser) {
			if (chatContainerMessageList.lastChild) {
				// chatContainerMessageList.removeChild(
				// 	chatContainerMessageList.lastChild
				// );
			}
			chatContainerMessageList.innerHTML = typingAnimation;
			console.log(chatContainerMessageList.lastChild);
			setTimeout(() => {
				if (chatContainerMessageList.lastChild) {
					chatContainerMessageList.removeChild(
						chatContainerMessageList.lastChild
					);
				}
			}, 1000);
		}
	}
});

async function getUsers(e) {
	try {
		const allUsers = await axios.get(`${backend}/users/`, {
			headers: { 'authorization': localStorage.getItem('token') },
		});
		userList.innerHTML = '';
		allUsers.data.response.forEach((user) => {
			let output = `<li class="user-item" data-id="${user.id}">
                            <img src="" class="user-image" data-id="${user.id}">
                            <span class="user-name" data-id="${user.id}">${user.name}</span>
                            <span class="user-time" data-id="${user.id}">3:20 pm</span>
                        </li>`;
			userList.innerHTML += output;
		});
		chatContainer.datasetLoggedUser = localStorage.getItem('user')[0];
	} catch (err) {
		console.log(err.response);
		alert('Something went wrong, please refresh your browser');
	}
}

async function selectUserForChat(e) {
	e.preventDefault();
	chatRecipient.textContent = e.target.textContent;
	const id = e.target.getAttribute('data-id');
	chatContainer.datasetRoom = [id, chatContainer.datasetLoggedUser]
		.sort()
		.join('');
	chatContainer.datasetReceiver = id;
	console.log(chatContainer.datasetRoom);
	try {
		const response = await axios.get(
			`${backend}/messages/${chatContainer.datasetReceiver}`,
			{
				headers: { 'authorization': localStorage.getItem('token') },
			}
		);
		console.log(response);
		showMessages(response.data.response);
		socket.emit('joinroom', chatContainer.datasetRoom);
	} catch (err) {
		console.log(err.response);
		alert('Something went wrong');
	}
}

async function sendMessage(e) {
	e.preventDefault();
	if (inputMessage.value) {
		if (chatContainer.datasetRoom) {
			const message = inputMessage.value;
			const receiverId = chatContainer.datasetReceiver;
			try {
				const response = await axios.post(
					`${backend}/messages/`,
					{
						message: message,
						receiverId: receiverId,
					},
					{
						headers: {
							'authorization': localStorage.getItem('token'),
						},
					}
				);
				console.log(response);
				socket.emit('chatMessage', {
					room: chatContainer.datasetRoom,
					message: response.data.response,
				});
				inputMessage.value = '';
			} catch (err) {
				console.log(err.response);
				alert('Something went wrong');
			}
		}
	} else {
		inputMessage.focus();
	}
}

function showMessages(messages) {
	chatContainerMessageList.innerHTML = '';
	let output;
	messages.forEach((message) => {
		if (message.senderId == chatContainer.datasetLoggedUser) {
			output = `<li class="chat-container-msg me">
                        <div class="chat-container-msg-box">
                            <p class="chat-container-msg-sender">${message.senderId}&nbsp;</p>
                            <p class="chat-container-msg-sendtime">&nbsp;${message.createdAt}</p>
                        </div>
                        <p class="chat-container-msg-content">${message.message}</p>
                    </li>`;
		} else {
			output = `<li class="chat-container-msg">
                        <div class="chat-container-msg-box">
                            <p class="chat-container-msg-sender">${message.senderId}&nbsp;</p>
                            <p class="chat-container-msg-sendtime">&nbsp;${message.createdAt}</p>
                        </div>
                        <p class="chat-container-msg-content">${message.message}</p>
                    </li>`;
		}
		chatContainerMessageList.innerHTML += output;
	});
}

function showSentMessage(data) {
	const room = data.room;
	const message = data.message;
	console.log(room, message);
	if (chatContainer.datasetRoom == room) {
		let output;
		if (message.senderId == chatContainer.datasetLoggedUser) {
			output = `<li class="chat-container-msg me">
                        <div class="chat-container-msg-box">
                            <p class="chat-container-msg-sender">${message.senderId}&nbsp;</p>
                            <p class="chat-container-msg-sendtime">&nbsp;${message.createdAt}</p>
                        </div>
                        <p class="chat-container-msg-content">${message.message}</p>
                    </li>`;
		} else {
			output = `<li class="chat-container-msg">
                        <div class="chat-container-msg-box">
                            <p class="chat-container-msg-sender">${message.senderId}&nbsp;</p>
                            <p class="chat-container-msg-sendtime">&nbsp;${message.createdAt}</p>
                        </div>
                        <p class="chat-container-msg-content">${message.message}</p>
                    </li>`;
		}
		chatContainerMessageList.innerHTML += output;
	}
}

async function typingHandler(e) {
	socket.emit('typing', {
		room: chatContainer.datasetRoom,
		sender: chatContainer.datasetLoggedUser,
	});
}
