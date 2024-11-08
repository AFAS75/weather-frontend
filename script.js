// Token access
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
// Local storage
const storedUsername = localStorage.getItem('userName');
const storedEmail = localStorage.getItem('email');
// DOM
const openPopoverButton = document.getElementById('userIcon');
const cityNameInput = document.getElementById('cityNameInput');
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
const msgUserHomePage = document.getElementById('message-user-home-page');
const logoutButton = document.getElementById('button-logout');
const deleteCountButton = document.getElementById('button-delete-account');
const deleteUserContainer = document.getElementById('delete-user-container-button');
const questionDeleteAccount = document.getElementById('question-delete-account');
const returnDeleteUser = document.getElementById('back-delete-user');
const confirmDeleteUser = document.getElementById('yes-delete-user');
const msgError = document.getElementById('error');
const msgSuccesSignup = document.getElementById('success-signup');
const msgFailed1Signup = document.getElementById('failed-signup');
const msgSuccessSignin = document.getElementById('success-signin');
const msgFailed0Signin = document.getElementById('failed0-signin');
const msgFailed1Signin = document.getElementById('failed1-signin');
const msgFailed2Signin = document.getElementById('failed1-signin');
const msgFailed3Signin = document.getElementById('failed3-signin');
const msgFailed4Signin = document.getElementById('failed4-signin');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const msgSuccessUpdatePassword = document.getElementById('success-update-password');
const msgFailed1UpdatePassword = document.getElementById('failed1-update-password');
const msgFailed2UpdatePassword = document.getElementById('failed2-update-password');
const msgDeletedAccount = document.getElementById('deleted-account');


if (accessToken) {
	document.getElementById('username').textContent = `Welcome ${storedUsername} !`;
	document.getElementById('email').textContent = `${storedEmail}`;
	logoutButton.style.display = 'flex';
	deleteCountButton.style.display = 'flex';
}

// Refresh token
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
					overlayHomePage.style.display = 'flex';
					document.getElementById('session-timeout').classList.remove('hidden');
					setTimeout(function() {
						localStorage.removeItem('userName');
						localStorage.removeItem('email');
						localStorage.removeItem('accessToken');
						localStorage.removeItem('refreshToken');
						window.location.reload();
					}, 5000)
				})
			}
		});
	}
};

setInterval(newAccessToken, 900000);

// Add new city
document.getElementById('addCity').addEventListener('click', () => {
	const cityName = cityNameInput.value;
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
					overlayHomePage.style.display = 'flex';
					msgError.classList.remove('hidden');
					cityNameInput.value = '';
					setTimeout(function() {
						msgError.classList.add('show');
					}, 10);
					setTimeout(function() {
						overlayHomePage.style.display = 'none';
						msgError.classList.add('hidden');
						msgError.classList.remove('show');
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
						overlayHomePage.style.display = 'flex';
						msgError.classList.remove('hidden');
						cityNameInput.value = '';
						setTimeout(function() {
							msgError.classList.add('show');
						}, 10);
						setTimeout(function() {
							overlayHomePage.style.display = 'none';
							msgError.classList.add('hidden');
							msgError.classList.remove('show');
						}, 3000);
					}
				})
			} else {
				overlayHomePage.style.display = 'flex';
				msgError.classList.remove('hidden');
				cityNameInput.value = '';
				setTimeout(function() {
					msgError.classList.add('show');
				}, 10);
				setTimeout(function() {
					overlayHomePage.style.display = 'none';
					msgError.classList.add('hidden');
					msgError.classList.remove('show');
				}, 3000);
			}
		}
	}
});

// Show weather forecast 
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
				msgError.classList.remove('hidden');
				overlayHomePage.style.display = 'flex';
				cityNameInput.value = '';
				setTimeout(function() {
					msgError.classList.add('show');
				}, 10);
				setTimeout(function() {
					msgError.classList.add('hidden');
					overlayHomePage.style.display = 'none';
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
		};
	});
};

// Show welcome message on logged in user's home page
function updateMessageVisibility() {
	if (document.querySelectorAll('.cityContainer').length === 0) {
		msgUserHomePage.classList.remove('hidden')
	} else {
		msgUserHomePage.classList.add('hidden');
	}
};

// Delete city
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

// Handle popover
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

// Handle popover home page background
overlayCount.addEventListener('click', (event) => {
	if (event.target === overlayCount) {
		initialContainer.classList.remove('show-count');
		overlayCount.style.display = 'none';
		signup.classList.add('hidden');
		signin.classList.add('hidden');
		forgotPassword.classList.add('hidden')
		initialContainer.style.display = 'flex'
		msgSuccesSignup.classList.add('hidden');
		msgFailed1Signup.classList.add('hidden');
		msgFailed1Signin.classList.add('hidden');
		msgFailed2Signin.classList.add('hidden');
		msgFailed3Signin.classList.add('hidden');
		signupForm.userName.value = '';
		signupForm.email.value = '';
		signupForm.password.value = '';
		signinForm.infos.value = '';
		signinForm.password.value = '';
		forgotPasswordForm.userName.value = '';
		forgotPasswordForm.email.value = ''
		forgotPasswordForm.password.value = '';
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
		msgSuccesSignup.classList.add('hidden');
		msgFailed1Signup.classList.add('hidden');
		signupForm.userName.value = '';
		signupForm.email.value = '';
		signupForm.password.value = '';
	});

	returnSigninButton.addEventListener('click', () => {
		signin.classList.add('hidden');
		initialContainer.style.display = 'flex'
		initialContainer.classList.remove('hidden');
		initialContainer.classList.add('show-count');
		popoverCount.style.width = '380px';
		msgSuccessSignin.classList.add('hidden');
		msgFailed1Signin.classList.add('hidden');
		msgFailed2Signin.classList.add('hidden');
		msgFailed3Signin.classList.add('hidden');
		signinForm.infos.value = '';
		signinForm.password.value = '';
	});

	forgotPasswordButton.addEventListener('click', () => {
		signin.classList.add('hidden');
		forgotPassword.classList.remove('hidden');
	})

	returnFortgotPasswordButton.addEventListener('click', () => {
		signin.classList.remove('hidden');
		forgotPassword.classList.add('hidden');
		msgSuccessUpdatePassword.classList.add('hidden');
		msgFailed1UpdatePassword.classList.add('hidden');
		msgFailed2UpdatePassword.classList.add('hidden');
		forgotPasswordForm.userName.value = '';
		forgotPasswordForm.email.value = '';
		forgotPasswordForm.password.value = '';
	})
});

// Handle popover user home page background
overlayHomePage.addEventListener('click', (event) => {
	if (event.target === overlayHomePage) {
		overlayHomePage.style.display = 'none';
		msgError.classList.add('hidden');
	}
})


// Handle popover user account logged background
overlayLogged.addEventListener('click', (event) => {
	if (event.target === overlayLogged) {
		overlayLogged.style.display = 'none';
		overlayLogged.classList.remove('show-logged');
		deleteUserContainer.classList.add('hidden');
		questionDeleteAccount.style.display = 'none';
		returnDeleteUser.style.display = 'none';
		confirmDeleteUser.style.display = 'none';
		logoutButton.style.display = 'flex';
		deleteCountButton.style.display = 'flex';
	}
	
	deleteCountButton.addEventListener('click', () => {
		logoutButton.style.display = 'none';
		deleteCountButton.style.display = 'none';
		deleteUserContainer.classList.remove('hidden');
		questionDeleteAccount.style.display = 'flex';
		returnDeleteUser.style.display = 'flex';
		confirmDeleteUser.style.display = 'flex';
	});

	returnDeleteUser.addEventListener('click', () => {
		logoutButton.style.display = 'flex';
		deleteCountButton.style.display = 'flex';
		deleteUserContainer.classList.add('hidden');
		questionDeleteAccount.style.display = 'none';
		returnDeleteUser.style.display = 'none';
		confirmDeleteUser.style.display = 'none';
	});
})

// User signup
signupForm.addEventListener('submit', (event) => {
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
	})
	.then(res => res.json())
	.then(userData => {
		if (userData.result) {
			msgFailed1Signup.classList.add('hidden');
			msgSuccesSignup.classList.remove('hidden');
			setTimeout(function() {
				msgSuccesSignup.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgSuccesSignup.classList.add('hidden');
				overlayCount.style.display = 'none';
				signupForm.userName.value = '';
				signupForm.email.value = '';
				signupForm.password.value = '';
				window.location.reload();
			}, 10000);
		} else {
			if (msgFailed1Signup.classList.contains('hidden')) {
				msgFailed1Signup.classList.remove('hidden');
				setTimeout(function() {
					msgFailed1Signup.classList.add('show');
				}, 10);
			} else {
				msgFailed1Signup.classList.remove('show');
				setTimeout(function() {
					msgFailed1Signup.classList.add('show');
				}, 500);
			}
		}
	})
});

// User signin
signinForm.addEventListener('submit', (event) => {
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
	})
	.then(res => res.json())
	.then(userData => {
		if (userData.result) {
			localStorage.setItem('userName', userData.user.userName);
			localStorage.setItem('email', userData.user.email);
			localStorage.setItem('accessToken', userData.accessToken);
			localStorage.setItem('refreshToken', userData.refreshToken);
			msgSuccessSignin.classList.remove('hidden');
			msgSuccessSignin.textContent = 'You have successfully logged in !';
			msgFailed2Signin.classList.add('hidden');
			setTimeout(function() {
				msgSuccessSignin.classList.add('show');
			}, 10);
			newAccessToken();
			setTimeout(function() { 
				msgSuccessSignin.classList.add('hidden');
				overlayCount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				msgSuccessSignin.textContent = '';
				window.location.reload();
			}, 2500);
		} 
		if (userData.error === 'Missing or empty fields') {
			msgFailed0Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed0Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed0Signin.classList.add('hidden');
				overlayCount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 6000);
		}
		if (userData.error === 'Email address not yet verified') {
			msgFailed1Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed1Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed1Signin.classList.add('hidden');
				overlayCount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 6000);
		} 
		if (userData.error === 'User not found' || userData.error === 'Wrong password') {
			if (msgFailed2Signin.classList.contains('hidden')) {
				msgFailed2Signin.classList.remove('hidden');
				setTimeout(function() {
					msgFailed2Signin.classList.add('show');
				}, 10);
			} else {
				msgFailed2Signin.classList.remove('show');
				setTimeout(function() {
					msgFailed2Signin.classList.add('show');
				}, 500);
			}
		} 
		if (userData.error === 'User already logged in' ) {
			msgFailed3Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed3Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed3Signin.classList.add('hidden');
				overlayCount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 4000);
		} 
		if (userData.error === 'Password change request not yet confirmed') {
			msgFailed4Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed4Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed4Signin.classList.add('hidden');
				overlayCount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 6000);
		} 
	});
});

// User forgot password
forgotPasswordForm.addEventListener('submit', (event) => {
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
	})
	.then(res => res.json())
	.then(updatePasswordData => {
		if (updatePasswordData.result) {
			msgFailed2UpdatePassword.classList.add('hidden');
			msgSuccessUpdatePassword.classList.remove('hidden');
			setTimeout(function() {
				msgSuccessUpdatePassword.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgSuccessUpdatePassword.classList.add('hidden');
				overlayCount.style.display = 'none';
				forgotPasswordForm.userName.value = '';
				forgotPasswordForm.email.value = ''
				forgotPasswordForm.password.value = '';
				window.location.reload();
			}, 6000);
		} if (updatePasswordData.error === 'New password not yet confirmed') {
			msgFailed1UpdatePassword.classList.remove('hidden');
			setTimeout(function() {
				msgFailed1UpdatePassword.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed1UpdatePassword.classList.add('hidden');
				overlayCount.style.display = 'none';
				forgotPasswordForm.userName.value = '';
				forgotPasswordForm.email.value = ''
				forgotPasswordForm.password.value = '';
				window.location.reload();
			}, 6000);
		} if (updatePasswordData.error === 'User not found') {
			if (msgFailed2UpdatePassword.classList.contains('hidden')) {
				msgFailed2UpdatePassword.classList.remove('hidden');
				setTimeout(function() {
					msgFailed2UpdatePassword.classList.add('show');
				}, 10);
			} else {
				msgFailed2UpdatePassword.classList.remove('show');
				setTimeout(function() {
					msgFailed2UpdatePassword.classList.add('show');
				}, 500);
			}
		}
	}); 
});

// User log out
logoutButton.addEventListener('click', () => {
	localStorage.removeItem('userName');
	localStorage.removeItem('email');
	localStorage.removeItem('accessToken');
	localStorage.removeItem('refreshToken');
	logoutButton.style.display = 'none';
	deleteCountButton.style.display = 'none';
	fetch('http://localhost:3000/users/logout', {
		method: 'POST',
	})
	.then(() => {
		window.location.reload()
	})
});

// User delete account
confirmDeleteUser.addEventListener('click', () => {
	fetch('http://localhost:3000/users/delete_user_account', {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`},
		body: JSON.stringify({ storedEmail }),
	})
	.then(res => res.json())
	.then(deletedUserData => {
		if (deletedUserData) {
			overlayHomePage.style.display = 'flex';
			overlayLogged.style.display ='none';
			msgDeletedAccount.classList.remove('hidden');
			setTimeout(function() {
				msgDeletedAccount.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgDeletedAccount.classList.add('show');
				overlayHomePage.style.display = 'none';
				localStorage.removeItem('userName');
				localStorage.removeItem('email');
				localStorage.removeItem('accessToken');
				localStorage.removeItem('refreshToken');
				window.location.reload();
			}, 6000)
		}
	})
})
