import constants from './constGlobal.js';
import userRequests from './userRequests.js';
import weatherRequests from './weatherRequests.js';
import * as popoverHandlers from './popoverHandlers.js';

// Refresh token
const newAccessToken =  async () => {
	try {
		if (constants.accessToken) {
			const apiData = await userRequests.fetchRefreshToken(constants.refreshToken);
			if (apiData.result) {
				localStorage.setItem('Access-token', apiData.accessToken);
			} else {
				localStorage.removeItem('User-name');
				localStorage.removeItem('Email');
				localStorage.removeItem('Access-token');
				localStorage.removeItem('Refresh-token');
				constants.showAndHideMessageRefreshToken();
			}
		}
	} catch (error) {
		console.error('Error fetchRefreshToken: ', error);
	}
};

// Every 15m a new access token is regenerated
setInterval(newAccessToken, 1 * 60 * 1000); // 15m * 60s * 1000 thousandth of a second = 15m

// Opening the popover for error messages when city already exists o not found
const showError = () => {
	constants.overlayHomePage.style.display = 'flex';
	constants.msgError.classList.remove('hidden');
	constants.cityNameInput.value = '';
	setTimeout(function() {
		constants.msgError.classList.add('show');
	}, 10);
	setTimeout(function() {
		constants.overlayHomePage.style.display = 'none';
		constants.msgError.classList.add('hidden');
		constants.msgError.classList.remove('show');
	}, 3000);
};

// handle add city
const addCity = async (cityName) => {
	if (constants.accessToken) {
		try {
			const apiData = await weatherRequests.fetchAddNewCity(cityName);
			if (apiData.result) {
				window.location.reload();
			} else {
				showError();
			}
		} catch {error} {
			console.error('Error fetchAddNewCity: City already exists or not found');
		}
	} else {
		try {
			let cityAlreadyExists = false;
			document.querySelectorAll('.name').forEach(e => {
				if (e.textContent.includes(cityName.slice(0,1).toUpperCase()+cityName.slice(1))) {
					cityAlreadyExists = true
				}
			})
			if (!cityAlreadyExists) {
				const apiData = await weatherRequests.fetchAddCityHomePage(cityName);
				if (apiData.result) {
					const lat = apiData.city.coord.lat;
					const lon = apiData.city.coord.lon;
					const apiTimeData = await weatherRequests.fetchLocalTime(lat, lon);
					if (apiTimeData) {
						let currentTime = new Date(apiTimeData.localTime.formatted);
						const cityHtml = constants.cityHtmlWithLocalTime(apiData.cityName, apiData.city, currentTime)
						constants.cityListPersonalize.innerHTML += cityHtml;
						setInterval(() => {
							currentTime.setSeconds(currentTime.getSeconds() + 1);
							const timeElement = document.querySelector(`#time-${apiData.cityName}`);
							if (timeElement) {
								timeElement.textContent = `${currentTime.toLocaleTimeString()}`;
							}
						}, 1000);
						await new Promise(resolve => setTimeout(resolve, 10));
						const titlePersonalizeElement = document.querySelector(`#title-personalize`);
						titlePersonalizeElement.classList.add('show-personalize');
						titlePersonalizeElement.style.position = 'static';
						document.querySelector(`#city-${apiData.cityName}`).classList.add('show-city');
						constants.cityNameInput.value = '';
					}
				} else {
					showError()
				}
			} else {
				showError();
			}
		} catch (error) {
			console.error('Error fetchAddCityHomePage', error);
		}
	}
}

// Add new city by clicking the button glass icon 
document.getElementById('addCity').addEventListener('click', async () => {
	const cityName = constants.cityNameInput.value;
	if (cityName) {
		addCity(cityName);
	}
});

// Add new city when pressing the 'Enter' key on the keyboard
document.getElementById('cityNameInput').addEventListener('keydown', (event) => {
	const cityName = constants.cityNameInput.value;
	if (cityName) {
		if (event.key === 'Enter') {
			addCity(cityName)
		}
	}
});

// Show user's added cities
async function displayMyCities() {
	try {
		const apiData = await weatherRequests.fetchMyCitiesAdded();
		if (apiData.myCities) {
			for (let i = 0; i < apiData.myCities.length; i++) {
				if (apiData.myCities[i]) {
					const cityHtml = constants.cityHtmlWithLocalTimeAndDeleteButton(apiData.myCitiesName[i], apiData.myCities[i], i)
					constants.cityList.innerHTML += cityHtml;
					setTimeout(() => {
						document.querySelector(`#city-${i}`).classList.add( 'show-city');
					}, 10);
					await fetchAndUpdateTime(apiData.myCities[i].coord.lat, apiData.myCities[i].coord.lon, i);
					await pause(1000);
				} else {
					console.error(`City data for index ${i} is undifined`);
				}
			} 
			if (apiData.cityNotFound) { 
				constants.overlayHomePage.style.display = 'flex';
				constants.msgError.classList.remove('hidden');
				constants.cityNameInput.value = '';
				setTimeout(function() {
					constants.msgError.classList.add('show');
				}, 10); 
				setTimeout(function() { 
					constants.overlayHomePage.style.display = 'none'; 
					constants.msgError.classList.add('hidden');
				}, 5000);
			} 
			updateDeleteCityEventListener(); 
			updateMessageVisibility(); 
		} else {
			console.error('No cities found in API');
		}
	} catch (error) {
		console.error('Error fetcMyCitiesAdded: ', error);
	};
}

// Api for local time
async function fetchAndUpdateTime(lat, lon, i) {
	try {
		const apiTimeData = await weatherRequests.fetchLocalTime(lat, lon)
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
		console.error('Error fetchLocalTime: ', error);
	}
};

// Wait for a few seconds before continuing
function pause(duration) {
	return new Promise(resolve => setTimeout(resolve, duration));
};

// Show welcome message on logged in user's home page
function updateMessageVisibility() {
	if (document.querySelectorAll('.cityContainer').length === 0) {
		constants.msgUserHomePage.classList.remove('hidden');
	} else {
		constants.msgUserHomePage.classList.add('hidden');
	}
};

// Delete city
async function updateDeleteCityEventListener() {
	const deleteButtons = document.querySelectorAll('.deleteCity'); 
	deleteButtons.forEach((button, i) => { 
		button.addEventListener('click', async function() { 
			try {
				const apiData = await weatherRequests.fetchDeleteCity(this.id);
				if (apiData.result) { 
					updateMessageVisibility(); 
					window.location.reload(); 
				} else { 
					updateMessageVisibility(); 
					window.location.reload(); 
				}
			} catch (error) { 
				console.error('Error fetchDeleteCity: ', error); 
			} 
		}); 
	});
};

// Show default cities on the home page
async function displayDefaultCities() {
	try { 
		const apiData = await weatherRequests.fetchHomePageDefaultCities();
		if (apiData.result) {
			apiData.homepagedata.forEach((city, i) => { 
				const cityHtml = constants.cityHtmlWithoutLocalTime(apiData.cityName[i], apiData.homepagedata[i], i); 
				constants.cityList.innerHTML += cityHtml; 
				setTimeout(() => { 
					const newCityContainer = document.querySelector(`#city-${i}`); 
					if (newCityContainer) { 
						newCityContainer.classList.add('show-city'); 
					} 
				}, 10 );
			});
		}
	} catch (error) {
		console.error('Error fetcHomePageDefaultCities: ', error);
	}
};

// Initial call to show weather forecast 
showWeatherForecast();

// How show weather forecast in both cases
async function showWeatherForecast() {
	if (constants.accessToken)  {
		document.getElementById('title-home-page-bar').textContent = `My cities`;
		await displayMyCities();
	} else {
		await displayDefaultCities();
	};
};

// Handle the “signup/signin” popover 
constants.overlaySignupSingnin.addEventListener('click', popoverHandlers.handleOverlaySignupSigninClick); 
constants.signupButton.addEventListener('click', popoverHandlers.handleSignupButtonClick); 
constants.signinButton.addEventListener('click', popoverHandlers.handleSigninButtonClick); 
constants.returnSignupButton.addEventListener('click', popoverHandlers.handleReturnSignupButtonClick); 
constants.returnSigninButton.addEventListener('click', popoverHandlers.handleReturnSigninButtonClick); 
constants.forgotPasswordButton.addEventListener('click', popoverHandlers.handleForgotPasswordButtonClick); 
constants.returnForgotPasswordButton.addEventListener('click', popoverHandlers.handleReturnForgotPasswordButtonClick); 

// Handle the popover of the home page 
constants.overlayHomePage.addEventListener('click', popoverHandlers.handleOverlayHomePageClick); 

// Handle the location of the popover when clicking on the icon on the home page or during a connection 
constants.openPopoverButton.addEventListener('click', popoverHandlers.handleOpenPopoverButtonClick); 

// Handle the “Account” popover of the logged in user c
constants.overlayHomePageLogged.addEventListener('click', popoverHandlers.handleOverlayHomePageLoggedClick); 
constants.returnChangePassword.addEventListener('click', popoverHandlers.handleReturnChangePasswordClick); 

// Handle the popover account of the connected user 
constants.overlayLogged.addEventListener('click', popoverHandlers.handleOverlayLoggedClick); 
constants.deleteAccountButton.addEventListener('click', popoverHandlers.handleDeleteAccountButtonClick); 
constants.returnDeleteUser.addEventListener('click', popoverHandlers.handleReturnDeleteUserClick);

// User signup
constants.signupForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const form = event.target;

	const formData = ({
			userName: form.userName.value,
			email: form.email.value,
			password: form.password.value,
			confirmPassword: form.confirmPassword.value,
		})
	try {
		console.log('JSON: ', formData);
		const apiUserData = await userRequests.fetchSignUpUser(formData)
		console.log('LA OUI: ', apiUserData);
		if (apiUserData.result) {
			console.log('toi tu rentre pas ici');
			constants.showSuccessMessageSignup();
			constants.hideSuccessMessageSignup();
		} else if (apiUserData.error === 'Username or email address already exists') {
			constants.showErrorMessageSignup(constants.msgError1Signup, constants.msgError2Signup);
		} else if (apiUserData.error === 'Password mismatch') {
			constants.showErrorMessageSignup(constants.msgError2Signup, constants.msgError1Signup);
		}
	} catch (error) {
		console.error('Error user sign up: ', error);
	}
});

// User signin
constants.signinForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const form = event.target;

	const formData = {
			userName: form.infos.value,
			email: form.infos.value,
			password: form.password.value,
		};
	try {
		const apiUserData = await userRequests.fetchSigninUser(constants.accessToken, formData);
		if (apiUserData.result) {
			localStorage.setItem('User-name', apiUserData.user.userName);
			localStorage.setItem('Email', apiUserData.user.email);
			localStorage.setItem('Access-token', apiUserData.accessToken);
			localStorage.setItem('Refresh-token', apiUserData.refreshToken);
			newAccessToken();
			constants.showSuccessMessageSignin();
			constants.hideSuccessMessageSignin();
		} else if (form.infos.value === "" || apiUserData.error === 'Missing or empty fields') {
			constants.showAndHideErrorMessageSignin1(constants.msgError0Signin, constants.msgError2Signin);
		} else if (apiUserData.error === 'Email address not yet verified') {
			constants.showAndHideErrorMessageSignin2(constants.msgError1Signin);
		} else if (apiUserData.error === 'User not found' || apiUserData.error === 'Wrong password') {
			constants.showAndHideErrorMessageSignin1(constants.msgError2Signin, constants.msgError0Signin);
		} else if (apiUserData.error === 'User already logged in' ) {
			constants.showAndHideErrorMessageSignin2(constants.msgError3Signin);
		} else if (apiUserData.error === 'Password change request not yet confirmed') {
			constants.showAndHideErrorMessageSignin3(constants.msgError4Signin, constants.msgError0Signin, constants.msgError2Signin);
		} 
	} catch (error) {
		console.error('Error user sign in: ', error);
	}
});

// Show user account popover
if (constants.accessToken) {
	document.getElementById('username').textContent = `Welcome ${constants.storedUsername} !`;
	document.getElementById('email').textContent = `${constants.storedEmail}`;
	constants.changePasswordButton.style.display = 'flex';
	constants.logoutButton.style.display = 'flex';
	constants.deleteAccountButton.style.display = 'flex';
}

// User change password
constants.changePasswordButton.addEventListener('click', async () => {
	constants.changePassword.classList.remove('hidden');
	constants.overlayLogged.style.display = 'none';
	constants.overlayHomePageLogged.style.display = 'flex';

	constants.changePasswordForm.addEventListener('submit', async (event) => {
		event.preventDefault();
		const form = event.target;

		const formData = {
			userName: form.userName.value,
			email: form.email.value,
			currentPassword: form.currentPassword.value,
			newPassword: form.newPassword.value,
			confirmPassword: form.confirmPassword.value,
		};
		try {
			const changePasswordData = await userRequests.fetchChangePassword(constants.accessToken, formData);
			if (changePasswordData.result) {
				localStorage.removeItem('User-name');
				localStorage.removeItem('Email');
				localStorage.removeItem('Access-token');
				localStorage.removeItem('Refresh-token');
				constants.showSuccessMessageChangePassword();
				constants.hideSuccessMessageChangePasword();
			} else if (changePasswordData.error === 'Wrong password' || changePasswordData.error === 'User not found') {
				constants.showAndHideErrorMessageChangePassword(constants.msgError1ChangePassword, constants.msgError2ChangePassword); 
			} else if (changePasswordData.error === 'Password mismatch') {
				constants.showAndHideErrorMessageChangePassword(constants.msgError2ChangePassword, constants.msgError1ChangePassword); 
			} 
		} catch (error) {
			console.error('Error user change password: ', error);
		}
	});
});

// User forgot password
constants.forgotPasswordForm.addEventListener('submit', async (event) => {
	event.preventDefault();
	const form = event.target;

	const formData = {
		userName: form.userName.value,
		email: form.email.value,
		password: form.password.value,
		confirmPassword: form.againPassword.value,
	};
	try {
		const updatePasswordData = await userRequests.fetchForgotPassword(formData);
			if (updatePasswordData.result) {
				constants.showSuccessMessageForgotPassword();
				constants.hideSuccessMessageForgotPassword();
			} else if (updatePasswordData.error === 'New password not yet confirmed') {
				constants.showAndHideErrorMessageForgotPassword1(constants.msgError1UpdatePassword, constants.msgError2UpdatePassword, constants.msgError3UpdatePassword);
			} else if (updatePasswordData.error === 'User not found') {
				constants.showAndHideErrorMessageForgotPassword2(constants.msgError2UpdatePassword, constants.msgError3UpdatePassword);
			} else if (updatePasswordData.error === 'Password mismatch') {
				constants.showAndHideErrorMessageForgotPassword2(constants.msgError3UpdatePassword, constants.msgError2UpdatePassword);
			}
	} catch (error) {
		console.error('Error fetchForgotPassword: ', error);
	}
});

// User log out
constants.logoutButton.addEventListener('click', () => {
	localStorage.removeItem('User-name');
	localStorage.removeItem('Email');
	localStorage.removeItem('Access-token');
	localStorage.removeItem('Refresh-token');
	constants.logoutButton.style.display = 'none';
	constants.deleteAccountButton.style.display = 'none';
	window.location.reload()
});

// User delete account
constants.confirmDeleteUser.addEventListener('click', async () => {
	try {
		const deletedUserData = userRequests.fetchDeleteUserAccount(constants.accessToken);
		if (deletedUserData) {
			localStorage.removeItem('User-name');
            localStorage.removeItem('Email');
            localStorage.removeItem('Access-token');
            localStorage.removeItem('Refresh-token');
			constants.showAndHideMessageDeleteUserAccount();
		}
	} catch (error) {
		console.error('Error fetchDeleteUserAccount: ', error);
	}
});
