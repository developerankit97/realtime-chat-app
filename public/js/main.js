const backend = 'http://localhost:3000';

let userList = document.querySelector('.user-list');
let chatContainer = document.querySelector('#chat-container');
let inputMessage = document.querySelector('#input-message');
const sendMessageBtn = document.querySelector('.send-message');
const chatRecipient = document.querySelector('.chat-recipient');

window.addEventListener('DOMContentLoaded', getUsers);
userList.addEventListener('click', selectUserForChat);
sendMessageBtn.addEventListener('click', sendMessage);

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
	chatContainer.datasetRoom = id;
	console.log(chatContainer.datasetRoom);
	try {
		const response = await axios.get(
			`${backend}/messages/${chatContainer.datasetRoom}`,
			{
				headers: { 'authorization': localStorage.getItem('token') },
			}
		);
		console.log(response);
		showMessages(response.data.response);
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
			const receiverId = chatContainer.datasetRoom;
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
				showSentMessage(response.data.response);
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
	chatContainer.innerHTML = '';
	messages.forEach((message) => {
		let output = `<h3>${message.message}</h3>
                        <p>sender: ${message.senderId} receiver: ${message.receiverId}</p>`;
		chatContainer.innerHTML += output;
	});
}

function showSentMessage(message) {
	let output = `<h3>${message.message}</h3>
                        <p>sender: ${message.senderId} receiver: ${message.receiverId}</p>`;
	chatContainer.innerHTML += output;
}
