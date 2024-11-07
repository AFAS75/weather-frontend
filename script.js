const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');

const newAccessToken = () => {
	if (accessToken) {
		fetch('http://localhost:3000/users/refresh_token', {
			method: 'POST',
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({ refreshToken: refreshToken }),
		})
		.then(res => res.json())
		.then(data => {
			if (data.result) {
				localStorage.setItem('accessToken', data.accessToken);
				window.location.reload();
			} else {
				fetch('http://localhost:3000/users/logout', {
					method: 'POST',
				}).then(() => {
					document.getElementById('overlay-home-page').style.display = 'flex';
					document.getElementById('session-timeout').classList.remove('hidden');
					setTimeout(function() {
						localStorage.removeItem('userName');
						localStorage.removeItem('email');
						localStorage.removeItem('accessToken');
						localStorage.removeItem('refreshToken');
						document.getElementById('username').style.display = 'none';
						window.location.reload();
					}, 5000)
				})
			}
		});
	}
};

setInterval(newAccessToken, 900000);

if (accessToken) {
	fetch('http://localhost:3000/weather/my_cities_added', {
		headers: { 'Authorization': `Bearer ${accessToken}` },
	})
	.then(res => res.json())
	.then(apiData => {
		if (apiData.myCities) {
			for (i = 0; i < apiData.myCities.length; i++) {
				document.querySelector('#cityList').innerHTML += `
				<div class="cityContainer">
				<p class="name">${apiData.myCitiesName[i]}</p>
				<p class="country">(${apiData.myCities[i].sys.country})</p>
				<p class="description">${apiData.myCities[i].weather[0].main}</p>
				<img class="weatherIcon" src="images/${apiData.myCities[i].weather[0].main}.png"/>
				<div class="temperature">
				<p class="tempMin">${apiData.myCities[i].main.temp_min}°C</p>
				<span>-</span>
				<p class="tempMax">${apiData.myCities[i].main.temp_max}°C</p>
				</div>
				<button class="deleteCity" id="${apiData.myCitiesName[i]}">Delete</button>
				</div>
				`;
			}
			if (apiData.cityNotFound) {
				document.getElementById('')
				document.getElementById('error').classList.remove('hidden');
				document.getElementById('overlay-home-page').style.display = 'flex';
				document.getElementById('cityNameInput').value = '';
				setTimeout(function() {
					document.getElementById('error').classList.add('show');
				}, 10);
				setTimeout(function() {
					document.getElementById('error').classList.add('hidden');
					document.getElementById('overlay-home-page').style.display = 'none';
				}, 5000);
			}
			updateDeleteCityEventListener();
			updateMessageVisibility();
		}
	});
} else {
	fetch('http://localhost:3000/weather/home_page')
	.then(res => res.json())
	.then(apiData => {
		for (i = 0; i < apiData.homepagedata.length; i++) {
			document.querySelector('#cityList').innerHTML += `
			<div class="cityContainer">
				<p class="name">${apiData.cityName[i]}</p>
				<p class="country">(${apiData.homepagedata[i].sys.country})</p>				
				<p class="description">${apiData.homepagedata[i].weather[0].main}</p>
				<img class="weatherIcon" src="images/${apiData.homepagedata[i].weather[0].main}.png"/>
				<div class="temperature">
					<p class="tempMin">${apiData.homepagedata[i].main.temp_min}°C</p>
					<span>-</span>
					<p class="tempMax">${apiData.homepagedata[i].main.temp_max}°C</p>
				</div>
			</div>
			`;
		}
	})
}

function updateMessageVisibility() {
	if (document.querySelectorAll('.cityContainer').length === 0) {
		document.getElementById('message').classList.remove('hidden')
	} else {
		document.getElementById('message').classList.add('hidden');
	}
}

function updateDeleteCityEventListener() {
	for (let i = 0; i < document.querySelectorAll('.deleteCity').length; i++) {
		document.querySelectorAll('.deleteCity')[i].addEventListener('click', function() {
			fetch(`http://localhost:3000/weather/${this.id}`, { 
				method: 'DELETE', 
				headers: { 'Authorization': `Bearer ${accessToken}` },
			})
			.then(res => res.json())
			.then(data => {
				if (data.result) {
					this.parentNode.remove();
					updateMessageVisibility();
				}
			});
		});
	}
};

document.getElementById('addCity').addEventListener('click', () => {
	const cityName = document.getElementById('cityNameInput').value;
	if (cityName) {
		if (accessToken) {
			fetch('http://localhost:3000/weather/add_new_city', {
				method: 'POST', 
				headers: {
					'Content-Type': 'application/json',
					'Authorization': `Bearer ${accessToken}`,
				},
				body: JSON.stringify({ cityName }),
			})
			.then(res => res.json())
			.then((data) => {
				if (data.result) {
					window.location.reload();
				} else {
					document.getElementById('overlay-home-page').style.display = 'flex';
					document.getElementById('error').classList.remove('hidden');
					document.getElementById('cityNameInput').value = '';
					setTimeout(function() {
						document.getElementById('error').classList.add('show');
					}, 10);
					setTimeout(function() {
						document.getElementById('overlay-home-page').style.display = 'none';
						document.getElementById('error').classList.add('hidden');
						document.getElementById('error').classList.remove('show');
					}, 3000);
				}
			})
		} else {
			let cityAlreadyExists = false;
			document.querySelectorAll('.name').forEach(e => {
				if (e.textContent.includes(cityName.slice(0,1).toUpperCase()+cityName.slice(1))) {
					cityAlreadyExists = true
				}
			})
			if (!cityAlreadyExists) {
				fetch('http://localhost:3000/weather/add_city_home_page', {
					method: 'POST',
					headers: { 'Content-Type': 'application/json' },
					body: JSON.stringify({ cityName }),
				})
				.then(res => res.json())
				.then(apiData => {
					if (apiData.result) {
						document.querySelector('#cityList').innerHTML += `
						<div class="cityContainer">
							<p class="name">${apiData.cityName}</p>
							<p class="country">(${apiData.city.sys.country})</p>
							<p class="description">${apiData.city.weather[0].main}</p>
							<img class="weatherIcon" src="images/${apiData.city.weather[0].main}.png"/>
							<div class="temperature">
								<p class="tempMin">${apiData.city.main.temp_min}°C</p>
								<span>-</span>
								<p class="tempMax">${apiData.city.main.temp_max}°C</p>
							</div>
						</div>
						`;
					} else {
						document.getElementById('overlay-home-page').style.display = 'flex';
						document.getElementById('error').classList.remove('hidden');
						document.getElementById('cityNameInput').value = '';
						setTimeout(function() {
							document.getElementById('error').classList.add('show');
						}, 10);
						setTimeout(function() {
							document.getElementById('overlay-home-page').style.display = 'none';
							document.getElementById('error').classList.add('hidden');
							document.getElementById('error').classList.remove('show');
						}, 3000);
					}
				})
			} else {
				document.getElementById('overlay-home-page').style.display = 'flex';
				document.getElementById('error').classList.remove('hidden');
				document.getElementById('cityNameInput').value = '';
				setTimeout(function() {
					document.getElementById('error').classList.add('show');
				}, 10);
				setTimeout(function() {
					document.getElementById('overlay-home-page').style.display = 'none';
					document.getElementById('error').classList.add('hidden');
					document.getElementById('error').classList.remove('show');
				}, 3000);
			}
		}
	}
});

const openPopoverButton = document.getElementById('userIcon');
const overlayHomePage = document.getElementById('overlay-home-page');
const overlayCount = document.getElementById('overlay-count');
const popoverCount = document.getElementById('popover-count');
const overlayLogged = document.getElementById('overlay-logged');
const popoverLogged = document.getElementById('popover-logged');
const initialContainer = document.getElementById('initial-container');
const signupButton = document.getElementById('button-signup');
const signinButton = document.getElementById('button-signin');
const signup = document.getElementById('signup');
const signin = document.getElementById('signin');
const returnSignupButton = document.getElementById('return-signup');
const returnSigninButton = document.getElementById('return-signin');
const forgotPasswordButton = document.getElementById('forgot-password-button');
const forgotPassword = document.getElementById('forgot-password');
const returnFortgotPasswordButton = document.getElementById('return-forgot-password');

overlayHomePage.addEventListener('click', (event) => {
	if (event.target === overlayHomePage) {
		overlayHomePage.style.display = 'none';
		document.getElementById('error').classList.add('hidden');
	}
})

overlayLogged.addEventListener('click', (event) => {
	if (event.target === overlayLogged) {
		overlayLogged.style.display = 'none';
		overlayLogged.classList.remove('show-logged');
	}
})

openPopoverButton.addEventListener('click', (event) => {
	if (accessToken) {
		const rect = event.target.getBoundingClientRect();
		popoverLogged.style.top = (rect.bottom + window.scrollY) + 'px';
		popoverLogged.style.left = (rect.left + window.scrollX) + 'px';
		popoverLogged.style.transform = 'translateX(-100%)';
		overlayLogged.style.display = 'flex';
		setTimeout(function() {
			overlayLogged.classList.add('show-logged');
		}, 10);
	} else {
		overlayCount.style.display = 'flex';
		setTimeout(function() {
			initialContainer.classList.add('show-count');
			popoverCount.style.width = '380px';
		}, 10);
	}
});

overlayCount.addEventListener('click', (event) => {
	if (event.target === overlayCount) {
		initialContainer.classList.remove('show-count');
		overlayCount.style.display = 'none';
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
	};

	signupButton.addEventListener('click', () => {
		initialContainer.classList.add('hidden');
		initialContainer.style.display = 'none'
		signup.classList.remove('hidden');
		popoverCount.style.width = '';
	});

	signinButton.addEventListener('click', () => {
		initialContainer.classList.add('hidden');
		initialContainer.style.display = 'none'
		signin.classList.remove('hidden');
		popoverCount.style.width = '';
	});

	returnSignupButton.addEventListener('click', () => {
		signup.classList.add('hidden');
		initialContainer.style.display = 'flex'
		initialContainer.classList.remove('hidden');
		initialContainer.classList.add('show-count');
		popoverCount.style.width = '380px';
		document.getElementById('success-signup').classList.add('hidden');
		document.getElementById('failed-signup').classList.add('hidden');
		document.getElementById('signup-form').userName.value = '';
		document.getElementById('signup-form').email.value = '';
		document.getElementById('signup-form').password.value = '';
	});

	returnSigninButton.addEventListener('click', () => {
		signin.classList.add('hidden');
		initialContainer.style.display = 'flex'
		initialContainer.classList.remove('hidden');
		initialContainer.classList.add('show-count');
		popoverCount.style.width = '380px';
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
		signin.classList.remove('hidden');
		forgotPassword.classList.add('hidden');
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
				document.getElementById('success-signup').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('success-signup').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signup-form').userName.value = '';
				document.getElementById('signup-form').email.value = '';
				document.getElementById('signup-form').password.value = '';
				window.location.reload();
			}, 6000);
		} else {
			document.getElementById('failed-signup').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed-signup').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed-signup').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signup-form').userName.value = '';
				document.getElementById('signup-form').email.value = '';
				document.getElementById('signup-form').password.value = '';
				window.location.reload();
			}, 6000);
		}
	})
});

document.getElementById('signin-form').addEventListener('submit', (event) => {
	event.preventDefault();

	const form = event.target;

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
			localStorage.setItem('userName', userData.user.userName);
			localStorage.setItem('email', userData.user.email);
			localStorage.setItem('accessToken', userData.accessToken);
			localStorage.setItem('refreshToken', userData.refreshToken);
			document.getElementById('success-signin').classList.remove('hidden');
			document.getElementById('success-signin').textContent = 'You have successfully logged in !';
			setTimeout(function() {
				document.getElementById('success-signin').classList.add('show');
			}, 10);
			newAccessToken();
			setTimeout(function() { 
				document.getElementById('success-signin').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				document.getElementById('success-signin').textContent = '';
				window.location.reload();
			}, 3000);
		} 
		if (userData.error === 'Missing or empty fields') {
			document.getElementById('failed0-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed0-signin').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed0-signin').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				window.location.reload();
			}, 6000);
		}
		if (userData.error === 'Email address not yet verified') {
			document.getElementById('failed1-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed1-signin').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed1-signin').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				window.location.reload();
			}, 6000);
		} 
		if (userData.error === 'User not found' || userData.error === 'Wrong password') {
			document.getElementById('failed2-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed2-signin').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed2-signin').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				window.location.reload();
			}, 6000);
		} 
		if (userData.error === 'User already logged in' ) {
			document.getElementById('failed3-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed3-signin').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed3-signin').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				window.location.reload();
			}, 4000);
		} 
		if (userData.error === 'Password change request not yet confirmed') {
			document.getElementById('failed4-signin').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed4-signin').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed4-signin').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('signin-form').infos.value = '';
				document.getElementById('signin-form').password.value = '';
				window.location.reload();
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
				document.getElementById('success-update-password').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('success-update-password').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('forgot-password-forme').userName.value = '';
				document.getElementById('forgot-password-forme').email.value = ''
				document.getElementById('forgot-password-forme').password.value = '';
				window.location.reload();
			}, 6000);
		} if (updatePasswordData.error === 'New password not yet confirmed') {
			document.getElementById('failed1-update-password').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed1-update-password').classList.add('show');
			}, 10);
			etTimeout(function() {
				document.getElementById('failed1-update-password').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('forgot-password-forme').userName.value = '';
				document.getElementById('forgot-password-forme').email.value = ''
				document.getElementById('forgot-password-forme').password.value = '';
				window.location.reload();
			}, 6000);
		} if (updatePasswordData.error === 'User not found') {
			document.getElementById('failed2-update-password').classList.remove('hidden');
			setTimeout(function() {
				document.getElementById('failed2-update-password').classList.add('show');
			}, 10);
			setTimeout(function() {
				document.getElementById('failed2-update-password').classList.add('hidden');
				overlayCount.style.display = 'none';
				document.getElementById('forgot-password-forme').userName.value = '';
				document.getElementById('forgot-password-forme').email.value = ''
				document.getElementById('forgot-password-forme').password.value = '';
				window.location.reload();
			}, 6000);
		}
	}) 
	
})

const storedUsername = localStorage.getItem('userName');
const storedEmail = localStorage.getItem('email');
if (storedUsername) {
	document.getElementById('username').textContent = `Welcome ${storedUsername} !`;
	document.getElementById('email').textContent = `${storedEmail}`;
	document.getElementById('button-logout').style.display = 'flex';
}

document.getElementById('button-logout').addEventListener('click', () => {
	localStorage.removeItem('userName');
	localStorage.removeItem('email');
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	document.getElementById('button-logout').style.display = 'none';
	fetch('http://localhost:3000/users/logout', {
		method: 'POST',
	}).then(() => {
		window.location.reload()
	})
})