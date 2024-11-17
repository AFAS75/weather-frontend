// Token access
const accessToken = localStorage.getItem('accessToken');
const refreshToken = localStorage.getItem('refreshToken');
const cleanUsernNameLocalStorage = localStorage.removeItem('userName');
const cleanEmailLocalStorage = localStorage.removeItem('email');
const cleanAccessTokennLocalStorage = localStorage.removeItem('accessToken');
const cleanRefreshTokennLocalStorage = localStorage.removeItem('refreshToken');
// Local storage
const storedUsername = localStorage.getItem('userName');
const storedEmail = localStorage.getItem('email');
// DOM
const cityContainer = document.querySelectorAll('.cityContainer');
const openPopoverButton = document.getElementById('userIcon');
const cityNameInput = document.getElementById('cityNameInput');
const overlayHomePage = document.getElementById('overlay-home-page');
const overlayAccount = document.getElementById('overlay-account');
const popoverAccount = document.getElementById('popover-account');
const overlayLogged = document.getElementById('overlay-logged');
const overlayHomePageLogged = document.getElementById('overlay-home-page-logged');
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
const changePassword = document.getElementById('change-password');
const changePasswordButton = document.getElementById('button-change-password')
const changePasswordForm = document.getElementById('change-password-form')
const returnChangePassword = document.getElementById('return-change-password')
const logoutButton = document.getElementById('button-logout');
const deleteAccountButton = document.getElementById('button-delete-account');
const deleteUserContainer = document.getElementById('delete-user-container-button');
const questionDeleteAccount = document.getElementById('question-delete-account');
const returnDeleteUser = document.getElementById('back-delete-user');
const confirmDeleteUser = document.getElementById('yes-delete-user');
const msgError = document.getElementById('error');
const msgSuccessSignup = document.getElementById('success-signup');
const msgFailed1Signup = document.getElementById('failed1-signup');
const msgFailed2Signup = document.getElementById('failed2-signup');
const msgSuccessSignin = document.getElementById('success-signin');
const msgFailed0Signin = document.getElementById('failed0-signin');
const msgFailed1Signin = document.getElementById('failed1-signin');
const msgFailed2Signin = document.getElementById('failed2-signin');
const msgFailed3Signin = document.getElementById('failed3-signin');
const msgFailed4Signin = document.getElementById('failed4-signin');
const signupForm = document.getElementById('signup-form');
const signinForm = document.getElementById('signin-form');
const forgotPasswordForm = document.getElementById('forgot-password-form');
const msgSuccessUpdatePassword = document.getElementById('success-update-password');
const msgFailed1UpdatePassword = document.getElementById('failed1-update-password');
const msgFailed2UpdatePassword = document.getElementById('failed2-update-password');
const msgFailed3UpdatePassword = document.getElementById('failed3-update-password');
const msgDeletedAccount = document.getElementById('deleted-account');
const msgSessionTimeout = document.getElementById('session-timeout');
const msgSuccessChangePassword = document.getElementById('success-change-password');
const msgFailed1ChangePassword = document.getElementById('failed1-change-password');
const msgFailed2ChangePassword = document.getElementById('failed2-change-password');

// Show user account popover
if (accessToken) {
	document.getElementById('username').textContent = `Welcome ${storedUsername} !`;
	document.getElementById('email').textContent = `${storedEmail}`;
	changePasswordButton.style.display = 'flex';
	logoutButton.style.display = 'flex';
	deleteAccountButton.style.display = 'flex';
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
					msgSessionTimeout.classList.remove('hidden');
					setTimeout(function() {
						msgSessionTimeout.classList.add('show');
					}, 10);
					setTimeout(function() {
						msgSessionTimeout.classList.add('hidden');
						cleanUsernNameLocalStorage;
						cleanEmailLocalStorage;
						cleanAccessTokennLocalStorage;
						cleanRefreshTokennLocalStorage;
						window.location.reload();
					}, 5000)
				})
			}
		});
	}
};

// Every 15m a new access token is regenerated
setInterval(newAccessToken, 15 * 60 * 1000); // 15m * 60s * 1000 thousandth of a second = 15m

// Add new city by clicking the button glass icon 
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
				async function fetchAndDisplayCity() {
					const res = await fetch('http://localhost:3000/weather/add_city_home_page', {
						method: 'POST',
						headers: { 'Content-Type': 'application/json' },
						body: JSON.stringify({ cityName }),
					});
					const apiData = await res.json();
					if (apiData.result) {
						const lat = apiData.city.coord.lat;
						const lon = apiData.city.coord.lon;
						async function fetchAndDisplayCityTime() {
							const res = await fetch(`http://localhost:3000/weather/local_time/${lat}/${lon}`);
							const apiTimeData = await res.json();
							if (apiTimeData) {
								let currentTime = new Date(apiTimeData.localTime.formatted);
								document.querySelector('#cityList-personalize').innerHTML += `
								<div class="cityContainer" id="city-${apiData.cityName}">
									<p class="name">${apiData.cityName}</p>
									<p class="country">(${apiData.city.sys.country})</p>				
									<p class="currentTime" id="time-${apiData.cityName}">${currentTime.toLocaleTimeString()}</p>
									<p class="description">${apiData.city.weather[0].main}</p>
									<img class="weatherIcon" src="images/${apiData.city.weather[0].main}.png"/>
									<div class="temperature">
										<p class="tempMin">${apiData.city.main.temp_min}°C</p>
										<span>-</span>
										<p class="tempMax">${apiData.city.main.temp_max}°C</p>
									</div>
								</div>
								`;
								setInterval(() => {
									currentTime.setSeconds(currentTime.getSeconds() + 1);
									document.querySelector(`#time-${apiData.cityName}`).textContent = `${currentTime.toLocaleTimeString()}`;
								}, 1000);
								await new Promise(resolve => setTimeout(resolve, 10));
								document.querySelector(`#title-personalize`).classList.add('show-personalize');
								document.querySelector(`#city-${apiData.cityName}`).classList.add('show-city');
								cityNameInput.value = '';
							}
						} 
						fetchAndDisplayCityTime();
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
				fetchAndDisplayCity();
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

// Add new city when pressing the 'Enter' key on the keyboard
document.getElementById('cityNameInput').addEventListener('keydown', (event) => {
	const cityName = cityNameInput.value;
	if (cityName) {
		if (event.key === 'Enter') {
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
					async function fetchAndDisplayCity() {
						const res = await fetch('http://localhost:3000/weather/add_city_home_page', {
							method: 'POST',
							headers: { 'Content-Type': 'application/json' },
							body: JSON.stringify({ cityName }),
						});
						const apiData = await res.json();
						if (apiData.result) {
							const lat = apiData.city.coord.lat;
							const lon = apiData.city.coord.lon;
							async function fetchAndDisplayCityTime() {
								const res = await fetch(`http://localhost:3000/weather/local_time/${lat}/${lon}`);
								const apiTimeData = await res.json();
								if (apiTimeData) {
									let currentTime = new Date(apiTimeData.localTime.formatted);
									document.querySelector('#cityList-personalize').innerHTML += `
									<div class="cityContainer" id="city-${apiData.cityName}">
										<p class="name">${apiData.cityName}</p>
										<p class="country">(${apiData.city.sys.country})</p>				
										<p class="currentTime" id="time-${apiData.cityName}">${currentTime.toLocaleTimeString()}</p>
										<p class="description">${apiData.city.weather[0].main}</p>
										<img class="weatherIcon" src="images/${apiData.city.weather[0].main}.png"/>
										<div class="temperature">
											<p class="tempMin">${apiData.city.main.temp_min}°C</p>
											<span>-</span>
											<p class="tempMax">${apiData.city.main.temp_max}°C</p>
										</div>
									</div>
									`;
									setInterval(() => {
										currentTime.setSeconds(currentTime.getSeconds() + 1);
										document.querySelector(`#time-${apiData.cityName}`).textContent = `${currentTime.toLocaleTimeString()}`;
									}, 1000);
									await new Promise(resolve => setTimeout(resolve, 10));
									document.querySelector(`#title-personalize`).classList.add('show-personalize');
									document.querySelector(`#city-${apiData.cityName}`).classList.add('show-city');
									cityNameInput.value = '';
								}
							} 
							fetchAndDisplayCityTime();
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
					fetchAndDisplayCity();
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
	}
});

// Show weather forecast 
if (accessToken) {
	document.getElementById('title-home-page-bar').textContent = `My cities`;
	async function fetchAndDisplayCities() {
		try {
			const res = await fetch('http://localhost:3000/weather/my_cities_added', {
					headers: { 'Authorization': `Bearer ${accessToken}` },
			});
			const apiData = await res.json();
			if (apiData.myCities) {
				for (let i = 0; i < apiData.myCities.length; i++) {
					if (apiData.myCities[i]) {
						const cityHtml = ` 
						<div class="cityContainer" id="city-${i}"> 
							<p class="name">${apiData.myCitiesName[i]}</p> 
							<p class="country">(${apiData.myCities[i].sys.country})</p> 
							<p class="currentTime" id="time-${i}">Loading...</p> <!-- Placeholder for time --> 
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
						document.querySelector('#cityList').innerHTML += cityHtml;
						setTimeout(() => {
							const newCityContainer = document.querySelector(`#city-${i}`);
							if (newCityContainer) {
								newCityContainer.classList.add( 'show-city');
							}
						}, 10);
						await fetchAndUpdateTime(apiData.myCities[i].coord.lat,apiData.myCities[i].coord.lon, i);
						await pause(1000);
					} else {
						console.error(`City data for index ${i} is undifined`);
					}
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
			} else {
				console.error('No cities found in API');
			}
		} catch (error) {
			console.error('Error fetching and displaying cities: ', error);
		}
	};

	async function fetchAndUpdateTime(lat, lon, i) {
		try {
			const res = await fetch(`http://localhost:3000/weather/local_time/${lat}/${lon}`);
			const apiTimeData = await res.json();
		
			if(apiTimeData.result) {
				let currentTime = new Date(apiTimeData.localTime.formatted);
				const updateClock = () => {
					currentTime.setSeconds(currentTime.getSeconds() + 1);
					document.getElementById(`time-${i}`).textContent = currentTime.toLocaleTimeString();
				};
				updateClock()
				setInterval(updateClock, 1000);
			} else {
				console.error('Failed to fetch local time', apiTimeData.error);
			}
		} catch (error) {
			console.error('Error fetching local tile: ', error);
		}
	};

	// Wait for a few seconds before continuing
	function pause(duration) {
		return new Promise(resolve => setTimeout(resolve, duration));
	};

	// Show welcome message on logged in user's home page
	function updateMessageVisibility() {
		if (document.querySelectorAll('.cityContainer').length === 0) {
			msgUserHomePage.classList.remove('hidden');
		} else {
			msgUserHomePage.classList.add('hidden');
		}
	};

	// Delete city
	function updateDeleteCityEventListener() {
		const deleteButtons = document.querySelectorAll('.deleteCity'); 
		deleteButtons.forEach((button, i) => { 
			button.addEventListener('click', function() { 
				fetch(`http://localhost:3000/weather/${this.id}`, { 
					method: 'DELETE', 
					headers: { 
						'Authorization': `Bearer ${accessToken}` 
					}, 
				})
				.then(res => res.json())
				.then(data => { 
					if (data.result) { 
						console.error('Failed to delete city: ', data);
						updateMessageVisibility(); 
						window.location.reload(); 
					} else { 
						updateMessageVisibility(); 
						window.location.reload(); 
					} 
				})
				.catch(error => {
					console.error('Error deleting city: ', error);
				});
			}); 
		});
	};
	fetchAndDisplayCities();
} else {
	fetch('http://localhost:3000/weather/home_page') 
	.then(res => res.json()) 
	.then(apiData => { 
		const cityList = document.querySelector('#cityList'); 
		apiData.homepagedata.forEach((city, i) => {  
		const cityHtml = ` 
		<div class="cityContainer" id="city-${i}"> 
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
			cityList.innerHTML += cityHtml; 
			setTimeout(() => { 
				const newCityContainer = document.querySelector(`#city-${i}`); 
				if (newCityContainer) { 
					newCityContainer.classList.add('show-city'); 
				} 
			}, 10 );
		});
	});
};

// Handle button user icon popover
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
		overlayAccount.style.display = 'flex';
		setTimeout(function() {
			initialContainer.classList.add('show-account');
			popoverAccount.style.width = '380px';
		}, 10);
	}
});

// Handle popover home page background
overlayAccount.addEventListener('click', (event) => {
	if (event.target === overlayAccount) {
		initialContainer.classList.remove('show-account');
		overlayAccount.style.display = 'none';
		signup.classList.add('hidden');
		signin.classList.add('hidden');
		changePassword.classList.add('hidden');
		forgotPassword.classList.add('hidden')
		initialContainer.style.display = 'flex'
		msgSuccessSignup.classList.add('hidden');
		msgFailed1Signup.classList.add('hidden');
		msgFailed0Signin.classList.add('hidden');
		msgFailed1Signin.classList.add('hidden');
		msgFailed2Signin.classList.add('hidden');
		msgFailed3Signin.classList.add('hidden');
		msgSuccessUpdatePassword.classList.add('hidden');
		msgFailed1UpdatePassword.classList.add('hidden');
		msgFailed2UpdatePassword.classList.add('hidden');
		msgFailed3UpdatePassword.classList.add('hidden');
		signupForm.userName.value = '';
		signupForm.email.value = '';
		signupForm.password.value = '';
		signupForm.confirmPassword.value = '';
		signinForm.infos.value = '';
		signinForm.password.value = '';
		forgotPasswordForm.userName.value = '';
		forgotPasswordForm.email.value = ''
		forgotPasswordForm.password.value = '';
		forgotPasswordForm.againPassword.value = '';
	};

	signupButton.addEventListener('click', () => {
		initialContainer.classList.add('hidden');
		initialContainer.style.display = 'none'
		signup.classList.remove('hidden');
		popoverAccount.style.width = '';
	});

	signinButton.addEventListener('click', () => {
		initialContainer.classList.add('hidden');
		initialContainer.style.display = 'none'
		signin.classList.remove('hidden');
		popoverAccount.style.width = '';
	});

	returnSignupButton.addEventListener('click', () => {
		signup.classList.add('hidden');
		initialContainer.style.display = 'flex'
		initialContainer.classList.remove('hidden');
		initialContainer.classList.add('show-account');
		popoverAccount.style.width = '380px';
		msgSuccessSignup.classList.add('hidden');
		msgFailed1Signup.classList.add('hidden');
		signupForm.userName.value = '';
		signupForm.email.value = '';
		signupForm.password.value = '';
		signupForm.confirmPassword.value = '';
	});

	returnSigninButton.addEventListener('click', () => {
		signin.classList.add('hidden');
		initialContainer.style.display = 'flex'
		initialContainer.classList.remove('hidden');
		initialContainer.classList.add('show-account');
		popoverAccount.style.width = '380px';
		msgSuccessSignin.classList.add('hidden');
		msgFailed0Signin.classList.add('hidden');
		msgFailed1Signin.classList.add('hidden');
		msgFailed2Signin.classList.add('hidden');
		msgFailed3Signin.classList.add('hidden');
		signinForm.infos.value = '';
		signinForm.password.value = '';
	});

	forgotPasswordButton.addEventListener('click', () => {
		signin.classList.add('hidden');
		forgotPassword.classList.remove('hidden');
		msgFailed0Signin.classList.add('hidden');
		msgFailed1Signin.classList.add('hidden');
		msgFailed2Signin.classList.add('hidden');
		msgFailed3Signin.classList.add('hidden');
		msgFailed4Signin.classList.add('hidden');
		signinForm.infos.value = '';
		signinForm.password.value = '';
	})

	returnFortgotPasswordButton.addEventListener('click', () => {
		signin.classList.remove('hidden');
		forgotPassword.classList.add('hidden');
		msgSuccessUpdatePassword.classList.add('hidden');
		msgFailed1UpdatePassword.classList.add('hidden');
		msgFailed2UpdatePassword.classList.add('hidden');
		msgFailed3UpdatePassword.classList.add('hidden');
		forgotPasswordForm.userName.value = '';
		forgotPasswordForm.email.value = '';
		forgotPasswordForm.password.value = '';
		forgotPasswordForm.againPassword.value = '';
	})
});

// Handle popover user home page background
overlayHomePage.addEventListener('click', (event) => {
	if (event.target === overlayHomePage) {
		overlayHomePage.style.display = 'none';
		msgError.classList.add('hidden');
	}
})

// Handle popover user home page background
overlayHomePageLogged.addEventListener('click', (event) => {
	if (event.target === overlayHomePageLogged) {
		overlayHomePageLogged.style.display = 'none';
		// msgError.classList.add('hidden');
		changePassword.classList.add('hidden');
		changePasswordForm.userName.value = '';
		changePasswordForm.email.value = ''
		changePasswordForm.currentPassword.value = '';
		changePasswordForm.newPassword.value = '';
		changePasswordForm.confirmPassword.value = '';
	}

	returnChangePassword.addEventListener('click', () => {
		overlayHomePageLogged.style.display = 'none';
		changePassword.classList.add('hidden');
		changePasswordForm.userName.value = '';
		changePasswordForm.email.value = ''
		changePasswordForm.currentPassword.value = '';
		changePasswordForm.newPassword.value = '';
		changePasswordForm.confirmPassword.value = '';
		msgFailed1ChangePassword.classList.add('hidden');
		msgFailed2ChangePassword.classList.add('hidden');
		window.location.reload();
	})
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
		deleteAccountButton.style.display = 'flex';
		changePasswordButton.style.display = 'flex';
	}
	
	deleteAccountButton.addEventListener('click', () => {
		logoutButton.style.display = 'none';
		changePasswordButton.style.display = 'none';
		deleteAccountButton.style.display = 'none';
		deleteUserContainer.classList.remove('hidden');
		questionDeleteAccount.style.display = 'flex';
		returnDeleteUser.style.display = 'flex';
		confirmDeleteUser.style.display = 'flex';
	});

	returnDeleteUser.addEventListener('click', () => {
		logoutButton.style.display = 'flex';
		changePasswordButton.style.display = 'flex';
		deleteAccountButton.style.display = 'flex';
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
			password: form.password.value,
			confirmPassword: form.confirmPassword.value,
		})
	})
	.then(res => res.json())
	.then(userData => {
		if (userData.result) {
			msgFailed1Signup.classList.add('hidden');
			msgFailed2Signup.classList.add('hidden');
			msgSuccessSignup.classList.remove('hidden');
			setTimeout(function() {
				msgSuccessSignup.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgSuccessSignup.classList.add('hidden');
				overlayAccount.style.display = 'none';
				signupForm.userName.value = '';
				signupForm.email.value = '';
				signupForm.password.value = '';
				window.location.reload();
			}, 10000);
		} else if (userData.error === 'Username or email address already exists') {
			msgFailed2Signup.classList.add('hidden');
			msgFailed1Signup.classList.remove('show');
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
		} else if (userData.error === 'Password mismatch') {
			msgFailed1Signup.classList.add('hidden');
			msgFailed2Signup.classList.remove('show');
			if (msgFailed2Signup.classList.contains('hidden')) {
				msgFailed2Signup.classList.remove('hidden');
				setTimeout(function() {
					msgFailed2Signup.classList.add('show');
				}, 10);
			} else {
				msgFailed2Signup.classList.remove('show');
				setTimeout(function() {
					msgFailed2Signup.classList.add('show');
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
				overlayAccount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				msgSuccessSignin.textContent = '';
				window.location.reload();
			}, 2500);
		} else if (form.infos.value === "" || userData.error === 'Missing or empty fields') {
			msgFailed2Signin.classList.add('hidden');
			msgFailed0Signin.classList.remove('show');
			if (msgFailed0Signin.classList.contains('hidden')) {
				msgFailed0Signin.classList.remove('hidden');
				setTimeout(function() {
					msgFailed0Signin.classList.add('show');
				}, 10);
			} else {
				msgFailed0Signin.classList.remove('show');
				setTimeout(function() {
					msgFailed0Signin.classList.add('show');
				}, 500);
			}
		} else if (userData.error === 'Email address not yet verified') {
			msgFailed1Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed1Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed1Signin.classList.add('hidden');
				overlayAccount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 6000);
		} else if (userData.error === 'User not found' || userData.error === 'Wrong password') {
			msgFailed0Signin.classList.add('hidden');
			msgFailed2Signin.classList.remove('show');
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
		} else if (userData.error === 'User already logged in' ) {
			msgFailed3Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed3Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed3Signin.classList.add('hidden');
				overlayAccount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 4000);
		} else if (userData.error === 'Password change request not yet confirmed') {
			msgFailed0Signin.classList.add('hidden');
			msgFailed2Signin.classList.add('hidden')
			msgFailed4Signin.classList.remove('hidden');
			setTimeout(function() {
				msgFailed4Signin.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed4Signin.classList.add('hidden');
				overlayAccount.style.display = 'none';
				signinForm.infos.value = '';
				signinForm.password.value = '';
				window.location.reload();
			}, 6000);
		} 
	});
});

// User change password
changePasswordButton.addEventListener('click', () => {
	changePassword.classList.remove('hidden');
	overlayLogged.style.display = 'none';
	overlayHomePageLogged.style.display = 'flex';

	changePasswordForm.addEventListener('submit', (event) => {
		event.preventDefault();
	
		const form = event.target;
		fetch('http://localhost:3000/users/change_password', {
			method: 'PUT',
			headers:  { 
				'Content-Type': 'application/json', 
				'Authorization': `Bearer ${accessToken}`},
			body: JSON.stringify({ 
				userName: form.userName.value,
				email: form.email.value,
				currentPassword: form.currentPassword.value,
				newPassword: form.newPassword.value,
				confirmPassword: form.confirmPassword.value,
			})
		})
		.then(res => res.json())
		.then(changePasswordData => {
			if (changePasswordData.result) {
				msgSuccessChangePassword.classList.remove('hidden');
				msgFailed1ChangePassword.classList.add('hidden');
				msgFailed2ChangePassword.classList.add('hidden');
				setTimeout(function() {
					msgSuccessChangePassword.classList.add('show');
				}, 10);
				setTimeout(function() {
					msgSuccessChangePassword.classList.add('hidden');
					overlayHomePageLogged.style.display = 'none';
					changePasswordForm.userName.value = '';
					changePasswordForm.email.value = ''
					changePasswordForm.currentPassword.value = '';
					changePasswordForm.newPassword.value = '';
					changePasswordForm.confirmPassword.value = '';
					cleanUsernNameLocalStorage;
					cleanEmailLocalStorage;
					cleanAccessTokennLocalStorage;
					cleanRefreshTokennLocalStorage;
					window.location.reload();
				}, 6000);
			} else if (changePasswordData.error === 'Wrong password' || changePasswordData.error === 'User not found') {
				msgFailed2ChangePassword.classList.add('hidden');
				msgFailed1ChangePassword.classList.remove('show');
				if (msgFailed1ChangePassword.classList.contains('hidden')) {
					msgFailed1ChangePassword.classList.remove('hidden');
					setTimeout(function() {
						msgFailed1ChangePassword.classList.add('show');
					}, 10);
				} else {
					msgFailed1ChangePassword.classList.remove('show');
					setTimeout(function() {
						msgFailed1ChangePassword.classList.add('show');
					}, 500);
				} 
			} else if (changePasswordData.error === 'Password mismatch') {
				msgFailed1ChangePassword.classList.add('hidden');
				msgFailed2ChangePassword.classList.remove('show');
				if (msgFailed2ChangePassword.classList.contains('hidden')) {
					msgFailed2ChangePassword.classList.remove('hidden');
					setTimeout(function() {
						msgFailed2ChangePassword.classList.add('show');
					}, 10);
				} else {
					msgFailed2ChangePassword.classList.remove('show');
					setTimeout(function() {
						msgFailed2ChangePassword.classList.add('show');
					}, 500);
				} 
			} 
		}); 
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
			confirmPassword: form.againPassword.value,
		})
	})
	.then(res => res.json())
	.then(updatePasswordData => {
		if (updatePasswordData.result) {
			msgFailed2UpdatePassword.classList.add('hidden');
			msgFailed3UpdatePassword.classList.add('hidden');
			msgSuccessUpdatePassword.classList.remove('hidden');
			setTimeout(function() {
				msgSuccessUpdatePassword.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgSuccessUpdatePassword.classList.add('hidden');
				overlayAccount.style.display = 'none';
				forgotPasswordForm.userName.value = '';
				forgotPasswordForm.email.value = ''
				forgotPasswordForm.password.value = '';
				window.location.reload();
			}, 6000);
		} else if (updatePasswordData.error === 'New password not yet confirmed') {
			msgFailed2UpdatePassword.classList.add('hidden');
			msgFailed3UpdatePassword.classList.add('hidden');
			msgFailed1UpdatePassword.classList.remove('hidden');
			setTimeout(function() {
				msgFailed1UpdatePassword.classList.add('show');
			}, 10);
			setTimeout(function() {
				msgFailed1UpdatePassword.classList.add('hidden');
				overlayAccount.style.display = 'none';
				forgotPasswordForm.userName.value = '';
				forgotPasswordForm.email.value = ''
				forgotPasswordForm.password.value = '';
				window.location.reload();
			}, 6000);
		} else if (updatePasswordData.error === 'User not found') {
			msgFailed3UpdatePassword.classList.add('hidden');
			msgFailed2UpdatePassword.classList.remove('show');
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
		} else if (updatePasswordData.error === 'Password mismatch') {
			msgFailed2UpdatePassword.classList.add('hidden');
			msgFailed3UpdatePassword.classList.remove('show');
			if (msgFailed3UpdatePassword.classList.contains('hidden')) {
				msgFailed3UpdatePassword.classList.remove('hidden');
				setTimeout(function() {
					msgFailed3UpdatePassword.classList.add('show');
				}, 10);
			} else {
				msgFailed3UpdatePassword.classList.remove('show');
				setTimeout(function() {
					msgFailed3UpdatePassword.classList.add('show');
				}, 500);
			}
		}
	}); 
});

// User log out
logoutButton.addEventListener('click', () => {
	cleanUsernNameLocalStorage;
	cleanEmailLocalStorage;
	cleanAccessTokennLocalStorage;
	cleanRefreshTokennLocalStorage;
	logoutButton.style.display = 'none';
	deleteAccountButton.style.display = 'none';
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
				cleanUsernNameLocalStorage;
				cleanEmailLocalStorage;
				cleanAccessTokennLocalStorage;
				cleanRefreshTokennLocalStorage;
				window.location.reload();
			}, 6000)
		}
	})
})
