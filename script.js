
fetch('http://localhost:3000/weather')
	.then(response => response.json())
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
				.then(res => res.json())
				.then(data => {
					if (data.result) {
						this.parentNode.remove();
					}
				});
		});
	}
}

document.querySelector('#addCity').addEventListener('click', function () {
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
const forgotPassword = document.getElementById('button-forgot-password');
const forgotPasswordForm = document.getElementById('forgot-password-form');
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
	document.getElementById('signin-form').infos.value = '';
	document.getElementById('signin-form').password.value = '';
});

forgotPassword.addEventListener('click', () => {
	signin.classList.add('hidden');
	forgotPasswordForm.classList.remove('hidden');
})

returnFortgotPasswordButton.addEventListener('click', () => {
	forgotPasswordForm.classList.add('hidden');
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
	.then(dataUser => {
		if (dataUser.result) {
			console.log(dataUser.newUser, 'SUCCES');
			console.log('local storage USERNAME : ', storedUsername);
			document.getElementById('success-signup').classList.remove('hidden');
		} else {
			console.log(dataUser, 'ECHEC');
			document.getElementById('failed-signup').classList.remove('hidden');
		}
	})
});

document.getElementById('signin-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const form = event.target;

	fetch('http://localhost:3000/users/signin', {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify({
			userName: form.infos.value,
			email: form.infos.value,
			password: form.password.value,
		})
	}).then(res => res.json())
	.then(dataUser => {
		if (dataUser.result) {
			console.log(dataUser.user, 'SUCCES');
			localStorage.setItem('userName', dataUser.user.userName);
			const storedUsername = localStorage.getItem('userName');
			document.getElementById('success-signin').classList.remove('hidden')
			document.getElementById('success-signin').textContent += storedUsername + ' !';
			setTimeout(function() { 
				document.getElementById('success-signin').classList.add('hidden');
				overlay.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				document.getElementById('success-signin').textContent = 'Hi ';
			}, 2000);
		} else if (dataUser.error === 'Email address not yet verified') {
			console.log(dataUser, 'ECHEC 1');
			document.getElementById('failed1-signin').classList.remove('hidden');
		} else if (dataUser.error === 'User not found' || dataUser.error === 'Wrong password') {
			console.log(dataUser, 'ECHEC 2');
			document.getElementById('failed2-signin').classList.remove('hidden');
		}
	}) 
});

const storedUsername = localStorage.getItem('userName');
if (storedUsername != '') {
	document.getElementById('username').classList.remove('hidden');
	document.getElementById('username').textContent = storedUsername;
}