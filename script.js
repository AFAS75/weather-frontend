fetch('http://localhost:3000/weather')
	.then(res => res.json())
	.then(data => {
		if (data.weather) {
			for (let i = 0; i < data.weather.length; i++) {
				document.querySelector('#cityList').innerHTML += `
				<div class="cityContainer">
				<p class="name">${data.weather[i].cityName}</p>
				<p class="description">${data.weather[i].description}</p>
				<img class="weatherIcon" src="images/${data.weather[i].main}.png"/>
				<div class="temperature">
					<p class="tempMin">${data.weather[i].tempMin}°C</p>
					<span>-</span>
					<p class="tempMax">${data.weather[i].tempMax}°C</p>
				</div>
				<button class="deleteCity" id="${data.weather[i].cityName}">Delete</button>
			</div>
			`;
			}
			updateDeleteCityEventListener();
		}
});

function updateDeleteCityEventListener() {
	for (let i = 0; i < document.querySelectorAll('.deleteCity').length; i++) {
		document.querySelectorAll('.deleteCity')[i].addEventListener('click', function () {
			fetch(`http://localhost:3000/weather/${this.id}`, { method: 'DELETE' })
				.then(response => response.json())
				.then(data => {
					if (data.result) {
						this.parentNode.remove();
					}
				});
		});
	}
}


// fetch('http://localhost:3000/weather')
// 	.then(res => res.json())
// 	.then(data => {
// 		if (data.weather) {
// 			for (let i = 0; i < data.weather.length; i++) {
// 				document.querySelector('#cityList').innerHTML += `
// 				<div class="cityContainer">
// 				<p class="name">${data.weather[i].cityName}</p>
// 				<p class="description">${data.weather[i].description}</p>
// 				<img class="weatherIcon" src="images/${data.weather[i].main}.png"/>
// 				<div class="temperature">
// 					<p class="tempMin">${data.weather[i].tempMin}°C</p>
// 					<span>-</span>
// 					<p class="tempMax">${data.weather[i].tempMax}°C</p>
// 				</div>
// 				<button class="deleteCity" id="${data.weather[i].cityName}">Delete</button>
// 			</div>
// 			`;
// 			}
// 			updateDeleteCityEventListener();
// 		}
// });

// function updateDeleteCityEventListener() {
// 	for (let i = 0; i < document.querySelectorAll('.deleteCity').length; i++) {
// 		document.querySelectorAll('.deleteCity')[i].addEventListener('click', () => {
// 			fetch(`http://localhost:3000/weather/${this.id}`, { method: 'DELETE' })
// 				.then(res => res.json())
// 				.then(data => {
// 					if (data.result) {
// 						this.parentNode.remove();
// 					}
// 				});
// 		});
// 	}
// }

document.querySelector('#addCity').addEventListener('click', () => {
	const cityName = document.querySelector('#cityNameInput').value;

	fetch('http://localhost:3000/weather', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json' },
		body: JSON.stringify({ cityName }),
	}).then(res => res.json())
		.then(data => {
			if (data.result) {
				document.querySelector('#cityList').innerHTML += `
			<div class="cityContainer">
				<p class="name">${data.weather.cityName}</p>
				<p class="description">${data.weather.description}</p>
				<img class="weatherIcon" src="images/${data.weather.main}.png"/>
				<div class="temperature">
					<p class="tempMin">${data.weather.tempMin}°C</p>
					<span>-</span>
					<p class="tempMax">${data.weather.tempMax}°C</p>
				</div>
				<button class="deleteCity" id="${data.weather.cityName}">Delete</button>
			</div>`;
				updateDeleteCityEventListener();
				document.querySelector('#cityNameInput').value = '';
			}
		});
});

const openPopoverButton = document.getElementById('userIcon');
const overlay = document.getElementById('overlay');
const signupButton = document.getElementById('button-signup');
const signinButton = document.getElementById('button-signin');
const initialButtons = document.getElementById('initial-buttons');
const signup = document.getElementById('signup');
const signin = document.getElementById('signin');
const returnSignupButton = document.getElementById('return-signup');
const returnSigninButton = document.getElementById('return-signin');
const forgotPasswordButton = document.getElementById('forgot-password-button');
const forgotPassword = document.getElementById('forgot-password');
const returnFortgotPasswordButton = document.getElementById('return-forgot-password');

openPopoverButton.addEventListener('click', () => {
	overlay.style.display = 'flex';
});

overlay.addEventListener('click', (event) => {
	if (event.target === overlay) {
		overlay.style.display = 'none';
		document.getElementById('success-signup').classList.add('hidden');
		document.getElementById('failed-signup').classList.add('hidden');
		document.getElementById('failed1-signin').classList.add('hidden');
		document.getElementById('failed2-signin').classList.add('hidden');
		document.getElementById('failed3-signin').classList.add('hidden');
		document.getElementById('signup-form').userName.value = '';
		document.getElementById('signup-form').email.value = '';
		document.getElementById('signup-form').password.value = '';
		document.getElementById('signin-form').infos.value = '';
		document.getElementById('signin-form').password.value = '';
	}

signupButton.addEventListener('click', () => {
	initialButtons.classList.add('hidden');
	signup.classList.remove('hidden');
});

signinButton.addEventListener('click', () => {
	initialButtons.classList.add('hidden');
	signin.classList.remove('hidden');
});

returnSignupButton.addEventListener('click', () => {
	signup.classList.add('hidden');
	initialButtons.classList.remove('hidden');
	document.getElementById('success-signup').classList.add('hidden');
	document.getElementById('failed-signup').classList.add('hidden');
	document.getElementById('signup-form').userName.value = '';
	document.getElementById('signup-form').email.value = '';
	document.getElementById('signup-form').password.value = '';
});

returnSigninButton.addEventListener('click', () => {
	signin.classList.add('hidden');
	initialButtons.classList.remove('hidden');
	document.getElementById('failed1-signin').classList.add('hidden');
	document.getElementById('failed2-signin').classList.add('hidden');
	document.getElementById('failed3-signin').classList.add('hidden');
	document.getElementById('signin-form').infos.value = '';
	document.getElementById('signin-form').password.value = '';
});

forgotPasswordButton.addEventListener('click', () => {
	signin.classList.add('hidden');
	forgotPassword.classList.remove('hidden');
})

returnFortgotPasswordButton.addEventListener('click', () => {
	forgotPassword.classList.add('hidden');
	signin.classList.remove('hidden');
})
});

document.getElementById('signup-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const form = event.target;

	fetch('http://localhost:3000/users/signup', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({
			userName: form.userName.value,
			email: form.email.value,
			password: form.password.value
		})
	}).then(res => res.json())
	.then(userData => {
		if (userData.result) {
			document.getElementById('success-signup').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('success-signup').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signup-form').userName.value = '';
				document.getElementById('signup-form').email.value = '';
				document.getElementById('signup-form').password.value = '';
			}, 10000);
		} else {
			console.log(userData, 'ECHEC');
			document.getElementById('failed-signup').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed-signup').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signup-form').userName.value = '';
				document.getElementById('signup-form').email.value = '';
				document.getElementById('signup-form').password.value = '';
			}, 10000);
		}
	})
});

document.getElementById('signin-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const form = event.target;
	const accessToken = localStorage.getItem('accessToken');

	fetch('http://localhost:3000/users/signin', {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`},
		body: JSON.stringify({
			userName: form.infos.value,
			email: form.infos.value,
			password: form.password.value,
		})
	}).then(res => res.json())
	.then(userData => {
		if (userData.result) {
			console.log(userData.user, 'SUCCES');
			localStorage.setItem('userName', userData.user.userName);
			localStorage.setItem('accessToken', userData.accessToken);
			localStorage.setItem('refreshToken', userData.refreshToken);
			const storedUsername = localStorage.getItem('userName');
			document.getElementById('success-signin').classList.remove('hidden')
			document.getElementById('success-signin').textContent += storedUsername + '!';
			setTimeout(function() { 
				document.getElementById('success-signin').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				document.getElementById('success-signin').textContent = 'Hi ';
			}, 10000);
			window.location.reload();
		} 
		if (userData.error === 'Missing or empty fields') {
			document.getElementById('failed0-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed0-signin').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
			}, 6000);
		}
		if (userData.error === 'Email address not yet verified') {
			console.log(userData, 'ECHEC 1');
			document.getElementById('failed1-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed1-signin').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
			}, 6000);
		} 
		if (userData.error === 'User not found' || userData.error === 'Wrong password') {
			document.getElementById('failed2-signin').classList.remove('hidden');
			setTimeout(function() {
				 document.getElementById('failed2-signin').classList.add('hidden');
				 overlay.style.display = 'none';
				 document.getElementById('signin-form').infos.value = '';
				 document.getElementById('signin-form').password.value = '';
			}, 6000);
		} 
		if (userData.error === 'User already logged in' ) {
			document.getElementById('failed3-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed3-signin').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
			}, 6000);
		} 
		if (userData.error === 'Password change request not yet confirmed') {
			document.getElementById('failed4-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed4-signin').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
			}, 6000);
		} 
	}) 
});

document.getElementById('forgot-password-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const form = event.target;

	fetch('http://localhost:3000/users/request_update', {
		method: 'PUT',
		headers:  { 'Content-Type': 'application/json'},
		body: JSON.stringify({ 
			userName: form.userName.value,
			email: form.email.value,
			password: form.password.value,
		})
	}).then(res => res.json())
	.then(updatePasswordData => {
		if (updatePasswordData.result) {
			document.getElementById('success-update-password').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('success-update-password').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('forgot-password-forme').userName.value = '';
				document.getElementById('forgot-password-forme').email.value = ''
				document.getElementById('forgot-password-forme').password.value = '';
			}, 10000);
		} if (updatePasswordData.error === 'New password not yet confirmed') {
			document.getElementById('failed1-update-password').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed1-update-password').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('forgot-password-forme').userName.value = '';
				document.getElementById('forgot-password-forme').email.value = ''
				document.getElementById('forgot-password-forme').password.value = '';
			}, 10000);
		} if (updatePasswordData.error === 'User not found') {
			console.log('NON PAS toiii');
			document.getElementById('failed2-update-password').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed2-update-password').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('forgot-password-forme').userName.value = '';
				document.getElementById('forgot-password-forme').email.value = ''
				document.getElementById('forgot-password-forme').password.value = '';
			}, 10000);
		}
	}) 
	
})

const storedUsername = localStorage.getItem('userName');
if (storedUsername) {
	document.getElementById('username').style.display = 'flex';
	document.getElementById('username').textContent = `Logout ${storedUsername}`;
}

document.getElementById('username').addEventListener('click', () => {
	localStorage.removeItem('userName');
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	document.getElementById('username').style.display = 'none';
	fetch('http://localhost:3000/users/logout', {
		method: 'POST',
	}).then(() => {
		window.location.reload()
	})
})