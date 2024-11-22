const constants = {
    // Token access
    accessToken: localStorage.getItem('Access-token'),
    refreshToken: localStorage.getItem('Refresh-token'),
    // Local storage
    storedUsername: localStorage.getItem('User-name'),
    storedEmail: localStorage.getItem('Email'),
    //DOM
    cityContainer: document.querySelectorAll('.cityContainer'),
    openPopoverButton: document.getElementById('userIcon'),
    cityNameInput: document.getElementById('cityNameInput'),
    cityList: document.querySelector('#cityList'),
    cityListPersonalize: document.querySelector('#cityList-personalize'),
    overlayHomePage: document.getElementById('overlay-home-page'),
    overlayHomePageLogged: document.getElementById('overlay-home-page-logged'),
    overlaySignupSingnin: document.getElementById('overlay-signup-signin'),
    popoverSignupSingnin: document.getElementById('popover-signup-signin'),
    overlayLogged: document.getElementById('overlay-logged'),
    popoverLogged: document.getElementById('popover-logged'),
    initialContainer: document.getElementById('initial-container'),
    signup: document.getElementById('signup'),
    signin: document.getElementById('signin'),
    signupButton: document.getElementById('button-signup'),
    signinButton: document.getElementById('button-signin'),
    returnSignupButton: document.getElementById('return-signup'),
    returnSigninButton: document.getElementById('return-signin'),
    forgotPassword: document.getElementById('forgot-password'),
    forgotPasswordForm: document.getElementById('forgot-password-form'),
    forgotPasswordButton: document.getElementById('forgot-password-button'),
    returnForgotPasswordButton: document.getElementById('return-forgot-password'),
    msgUserHomePage: document.getElementById('message-user-home-page'),
    changePassword: document.getElementById('change-password'),
    changePasswordForm: document.getElementById('change-password-form'),
    changePasswordButton: document.getElementById('button-change-password'),
    returnChangePassword: document.getElementById('return-change-password'),
    logoutButton: document.getElementById('button-logout'),
    deleteAccountButton: document.getElementById('button-delete-account'),
    deleteUserContainer: document.getElementById('delete-user-container-button'),
    questionDeleteAccount: document.getElementById('question-delete-account'),
    returnDeleteUser: document.getElementById('back-delete-user'),
    confirmDeleteUser: document.getElementById('yes-delete-user'),
    msgError: document.getElementById('error'),
    msgSuccessSignup: document.getElementById('success-signup'),
    msgError1Signup: document.getElementById('error1-signup'),
    msgError2Signup: document.getElementById('error2-signup'),
    msgSuccessSignin: document.getElementById('success-signin'),
    msgError0Signin: document.getElementById('error0-signin'),
    msgError1Signin: document.getElementById('error1-signin'),
    msgError2Signin: document.getElementById('error2-signin'),
    msgError3Signin: document.getElementById('error3-signin'),
    msgError4Signin: document.getElementById('error4-signin'),
    signupForm: document.getElementById('signup-form'),
    signinForm: document.getElementById('signin-form'),
    msgSuccessUpdatePassword: document.getElementById('success-update-password'),
    msgError1UpdatePassword: document.getElementById('error1-update-password'),
    msgError2UpdatePassword: document.getElementById('error2-update-password'),
    msgError3UpdatePassword: document.getElementById('error3-update-password'),
    msgDeletedAccount: document.getElementById('deleted-account'),
    msgSessionTimeout: document.getElementById('session-timeout'),
    msgSuccessChangePassword: document.getElementById('success-change-password'),
    msgError1ChangePassword: document.getElementById('error1-change-password'),
    msgError2ChangePassword: document.getElementById('error2-change-password'),
    // Add city 
    cityHtmlWithoutLocalTime: (cityName, homepagedata, i) => {
        return ` 
            <div class="cityContainer" id="city-${i}"> 
                <p class="name">${cityName}</p> 
                <p class="country">(${homepagedata.sys.country})</p>
                <p class="description">${homepagedata.weather[0].main}</p> 
                <img class="weatherIcon" src="images/${homepagedata.weather[0].main}.png" alt="Weather forecast: $={${homepagedata.weather[0].main}}"/> 
                <div class="temperature"> 
                    <p class="tempMin">${Math.round(homepagedata.main.temp_min)}°C</p> 
                    <span>-</span> 
                    <p class="tempMax">${Math.round(homepagedata.main.temp_max)}°C</p> 
                </div> 
            </div> 
        `;
    },
    cityHtmlWithLocalTime: (cityName, city, currentTime) => {
        return `
	    	<div class="cityContainer" id="city-${cityName}">
	    		<p class="name">${cityName}</p>
	    		<p class="country">(${city.sys.country})</p>				
	    		<p class="currentTime" id="time-${cityName}">${currentTime.toLocaleTimeString()}</p>
	    		<p class="description">${city.weather[0].main}</p>
	    		<img class="weatherIcon" src="images/${city.weather[0].main}.png" alt="Weather forecast: ${homepagedata.weather[0].main}"/>
	    		<div class="temperature">
	    			<p class="tempMin">${Math.round(city.main.temp_min)}°C</p>
	    			<span>-</span>
	    			<p class="tempMax">${Math.round(city.main.temp_max)}°C</p>
	    		</div>
	    	</div>
	    `;
    },
    cityHtmlWithLocalTimeAndDeleteButton: (cityName, city, i) => {
        return ` 
			<div class="cityContainer" id="city-${i}"> 
				<p class="name">${cityName}</p> 
				<p class="country">(${city.sys.country})</p> 
				<p class="currentTime" id="time-${i}">Loading...</p> <!-- Placeholder for time --> 
				<p class="description">${city.weather[0].main}</p> 
				<img class="weatherIcon" src="images/${city.weather[0].main}.png" alt="Weather forecast: ${homepagedata.weather[0].main}"/> 
				<div class="temperature"> 
					<p class="tempMin">${Math.round(city.main.temp_min)}°C</p> 
					<span>-</span> 
					<p class="tempMax">${Math.round(city.main.temp_max)}°C</p> 
				</div> 
				<button class="deleteCity" id="${cityName}">Delete</button> 
			</div>
		 `;
    },
    // Messages
    showAndHideMessageRefreshToken: () => {
        constants.overlayHomePage.style.display = 'flex';
        constants.msgSessionTimeout.classList.remove('hidden');
        setTimeout(function() {
            constants.msgSessionTimeout.classList.add('show');
        }, 10);
        setTimeout(function() {
            constants.msgSessionTimeout.classList.add('hidden');
            window.location.reload();
        }, 5000)
    },

    showSuccessMessageSignup: () => {
        constants.msgError1Signup.classList.add('hidden');
        constants.msgError2Signup.classList.add('hidden');
        constants.msgSuccessSignup.classList.remove('hidden');
        setTimeout(function() {
            constants.msgSuccessSignup.classList.add('show');
        }, 10);
    },

    hideSuccessMessageSignup: () => {
        setTimeout(function() {
            constants.msgSuccessSignup.classList.add('hidden');
            constants.overlaySignupSingnin.style.display = 'none';
            constants.signupForm.userName.value = '';
            constants.signupForm.email.value = '';
            constants.signupForm.password.value = '';
            window.location.reload();
        }, 10000);
    },

    showErrorMessageSignup: (msgToDisplay, msgToHide) =>  {
        msgToHide.classList.add('hidden');
        msgToDisplay.classList.remove('show');
        if (msgToDisplay.classList.contains('hidden')) {
            msgToDisplay.classList.remove('hidden');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 10);
        } else {
            msgToDisplay.classList.remove('show');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 500);
        }
    },

    showSuccessMessageSignin: () => {
        constants.msgSuccessSignin.classList.remove('hidden');
        constants.msgSuccessSignin.textContent = 'You have successfully logged in !';
        constants.msgError2Signin.classList.add('hidden');
        setTimeout(function() {
            constants.msgSuccessSignin.classList.add('show');
        }, 10);
    },

    hideSuccessMessageSignin: () => {
        setTimeout(function() { 
            constants.msgSuccessSignin.classList.add('hidden');
            constants.overlaySignupSingnin.style.display = 'none';
            constants.signinForm.infos.value = '';
            constants.signinForm.password.value = '';
            constants.msgSuccessSignin.textContent = '';
            window.location.reload();
        }, 2500);
    },

    showAndHideErrorMessageSignin1: (msgToDisplay, msgToHide) => {
        msgToHide.classList.add('hidden');
        msgToDisplay.classList.remove('show');
        if (msgToDisplay.classList.contains('hidden')) {
            msgToDisplay.classList.remove('hidden');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 10);
        } else {
            msgToDisplay.classList.remove('show');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 500);
        }
    },

    showAndHideErrorMessageSignin2: (msgToDisplay) => {
        msgToDisplay.classList.remove('hidden');
        setTimeout(function() {
            msgToDisplay.classList.add('show');
        }, 10);
        setTimeout(function() {
            msgToDisplay.classList.add('hidden');
            constants.overlaySignupSingnin.style.display = 'none';
            constants.signinForm.infos.value = '';
            constants.signinForm.password.value = '';
            window.location.reload();
        }, 4000);
    },

    showAndHideErrorMessageSignin3: (msgToDisplay, msgTohide1, msgTohide2) => {
        msgTohide1.classList.add('hidden');
        msgTohide2.classList.add('hidden')
        msgToDisplay.classList.remove('hidden');
        setTimeout(function() {
            msgToDisplay.classList.add('show');
        }, 10);
        setTimeout(function() {
            msgToDisplay.classList.add('hidden');
            constants.overlaySignupSingnin.style.display = 'none';
            constants.signinForm.infos.value = '';
            constants.signinForm.password.value = '';
            window.location.reload();
        }, 6000);
    },

    showSuccessMessageChangePassword: () => {
        constants.msgError1ChangePassword.classList.add('hidden');
        constants.msgError2ChangePassword.classList.add('hidden');
        constants.msgSuccessChangePassword.classList.remove('hidden');
        setTimeout(function() {
            constants.msgSuccessChangePassword.classList.add('show');
        }, 10);
    },

    hideSuccessMessageChangePasword: () => {
        setTimeout(function() {
            constants.msgSuccessChangePassword.classList.add('hidden');
            constants.overlayHomePageLogged.style.display = 'none';
            constants.changePasswordForm.userName.value = '';
            constants.changePasswordForm.email.value = ''
            constants.changePasswordForm.currentPassword.value = '';
            constants.changePasswordForm.newPassword.value = '';
            constants.changePasswordForm.confirmPassword.value = '';
            window.location.reload();
        }, 6000);
    },

    showAndHideErrorMessageChangePassword: (msgToDisplay, msgToHide) => {
        msgToHide.classList.add('hidden');
        msgToDisplay.classList.remove('show');
        if (msgToDisplay.classList.contains('hidden')) {
            msgToDisplay.classList.remove('hidden');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 10);
        } else {
            msgToDisplay.classList.remove('show');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 500);
        }
    },

    showSuccessMessageForgotPassword: () => {
        constants.msgError2UpdatePassword.classList.add('hidden');
        constants.msgError3UpdatePassword.classList.add('hidden');
        constants.msgSuccessUpdatePassword.classList.remove('hidden');
        setTimeout(function() {
        	constants.msgSuccessUpdatePassword.classList.add('show');
        }, 10);
    },

    hideSuccessMessageForgotPassword: () => {
        setTimeout(function() {
            constants.msgSuccessUpdatePassword.classList.add('hidden');
            constants.overlaySignupSingnin.style.display = 'none';
            constants.forgotPasswordForm.userName.value = '';
            constants.forgotPasswordForm.email.value = ''
            constants.forgotPasswordForm.password.value = '';
            window.location.reload();
        }, 6000);
    },

    showAndHideErrorMessageForgotPassword1: (msgToDisplay, msgTohide1, msgTohide2) => {
        msgTohide1.classList.add('hidden');
        msgTohide2.classList.add('hidden');
        msgToDisplay.classList.remove('hidden');
        setTimeout(function() {
            msgToDisplay.classList.add('show');
        }, 10);
        setTimeout(function() {
            msgToDisplay.classList.add('hidden');
            constants.overlaySignupSingnin.style.display = 'none';
            constants.forgotPasswordForm.userName.value = '';
            constants.forgotPasswordForm.email.value = ''
            constants.forgotPasswordForm.password.value = '';
            window.location.reload();
        }, 6000);
    },

    showAndHideErrorMessageForgotPassword2: (msgToDisplay, msgToHide) => {
        msgToHide.classList.add('hidden');
        msgToDisplay.classList.remove('show');
        if (msgToDisplay.classList.contains('hidden')) {
            msgToDisplay.classList.remove('hidden');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 10);
        } else {
            msgToDisplay.classList.remove('show');
            setTimeout(function() {
                msgToDisplay.classList.add('show');
            }, 500);
        }
    },

    showAndHideMessageDeleteUserAccount: () => {
        constants.overlayHomePage.style.display = 'flex';
        constants.overlayLogged.style.display ='none';
        constants.msgDeletedAccount.classList.remove('hidden');
        setTimeout(function() {
            constants.msgDeletedAccount.classList.add('show');
        }, 10);
        setTimeout(function() {
            constants.msgDeletedAccount.classList.add('show');
            constants.overlayHomePage.style.display = 'none';
            window.location.reload();
        }, 6000)
    },
}

export default constants;