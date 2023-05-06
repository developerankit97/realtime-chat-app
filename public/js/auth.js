let signUpName = document.querySelector('#name');
let signUpEmail = document.querySelector('#email');
let signUpPhNo = document.querySelector('#ph-no');
let signUpPassword = document.querySelector('#password');
let signUpConfirmPassword = document.querySelector('#confirm-password');
const signUpBtn = document.querySelector('.signup-btn');
let loginEmail = document.querySelector('#login-email');
let loginPassword = document.querySelector('#login-password');
const loginBtn = document.querySelector('.login-btn');

const backend = 'http://localhost:3000';

if (signUpBtn != null) {
	signUpBtn.addEventListener('click', userSignUp);
}
if (loginBtn != null) {
	loginBtn.addEventListener('click', userLogin);
}

async function userSignUp(e) {
	e.preventDefault();
	if (
		signUpName.value &&
		signUpEmail.value &&
		signUpPhNo.value &&
		signUpPassword.value &&
		signUpConfirmPassword.value
	) {
		if (signUpPassword.value == signUpConfirmPassword.value) {
			let userDetails = {
				'name': signUpName.value,
				'email': signUpEmail.value,
				'phNo': signUpPhNo.value,
				'password': signUpPassword.value,
			};
			console.log(userDetails);
			try {
				const response = await axios.post(`${backend}/auth/signup`, {
					userDetails,
				});
				if (response.status == 200) {
					alert('Signup successful');
					document.location.replace('/html/auth/login.html');
				}
				if (response.status == 400) {
					alert('User already exists');
				}
			} catch (err) {
				console.log(err.message);
			}
		} else {
			alert('Password do not match with Confirm Password');
		}
	} else {
		alert('Please enter all the fields');
	}
}

async function userLogin(e) {
	e.preventDefault();
	if (loginEmail.value && loginPassword.value) {
		try {
			const response = await axios.post(`${backend}/auth/login`, {
				'email': loginEmail.value,
				'password': loginPassword.value,
			});
			console.log(response.data);
			if (response.status == 202) {
				alert('Password is incorrect');
			}
			if (response.status == 200) {
				localStorage.setItem('token', response.data.token);
				localStorage.setItem('user', [
					response.data.id,
					response.data.name,
					response.data.email,
				]);
				document.location.replace('/html/main.html');
			}
		} catch (error) {
			console.log(error);
			if (error.response.status == 401) {
				alert('You have entered an invalid password');
			}
			if (error.response.status == 404) {
				alert(
					error.response.data.error + '. Please signup and try again'
				);
				window.location.href = 'http://localhost:3000/signup.html';
			}
		}
	} else {
		alert('Please enter email and password');
	}
}
