import constants from './constGlobal.js';

// Handle click events on the overlay for signup/signin popover
export const handleOverlaySignupSigninClick = (event) => {
    if (event.target === constants.overlaySignupSingnin) {
        constants.initialContainer.classList.remove('show-account');
        constants.overlaySignupSingnin.style.display = 'none';
        constants.signup.classList.add('hidden');
        constants.signin.classList.add('hidden');
        constants.changePassword.classList.add('hidden');
        constants.forgotPassword.classList.add('hidden');
        constants.initialContainer.style.display = 'flex';
        hideAllMessages();
        resetForms();
    }
};

// Handle click events on the signup button
export const handleSignupButtonClick = () => {
    constants.initialContainer.classList.add('hidden');
    constants.initialContainer.style.display = 'none';
    constants.signup.classList.remove('hidden');
    constants.popoverSignupSingnin.style.width = '';
};

// Handle click events on the signin button
export const handleSigninButtonClick = () => {
    constants.initialContainer.classList.add('hidden');
    constants.initialContainer.style.display = 'none';
    constants.signin.classList.remove('hidden');
    constants.popoverSignupSingnin.style.width = '';
};

// Handle click events on the return signup button
export const handleReturnSignupButtonClick = () => {
    constants.signup.classList.add('hidden');
    constants.initialContainer.style.display = 'flex';
    constants.initialContainer.classList.remove('hidden');
    constants.initialContainer.classList.add('show-account');
    constants.popoverSignupSingnin.style.width = '380px';
    hideAllMessages();
    resetForms();
};

// Handle click events on the return signin button
export const handleReturnSigninButtonClick = () => {
    constants.signin.classList.add('hidden');
    constants.initialContainer.style.display = 'flex';
    constants.initialContainer.classList.remove('hidden');
    constants.initialContainer.classList.add('show-account');
    constants.popoverSignupSingnin.style.width = '380px';
    hideAllMessages();
    resetForms();
};

// Handle click events on the forgot password button
export const handleForgotPasswordButtonClick = () => {
    constants.signin.classList.add('hidden');
    constants.forgotPassword.classList.remove('hidden');
    hideAllMessages();
    resetForms();
};

// Handle click events on the return forgot password button
export const handleReturnForgotPasswordButtonClick = () => {
    constants.signin.classList.remove('hidden');
    constants.forgotPassword.classList.add('hidden');
    hideAllMessages();
    resetForms();
};

// Handle click events on the overlay for the home page
export const handleOverlayHomePageClick = (event) => {
    if (event.target === constants.overlayHomePage) {
        constants.overlayHomePage.style.display = 'none';
        constants.msgError.classList.add('hidden');
    }
};

// Handle click events on the open popover button
export const handleOpenPopoverButtonClick = (event) => {
    if (constants.accessToken) {
        const rect = event.target.getBoundingClientRect();
        constants.popoverLogged.style.top = (rect.bottom + window.scrollY) + 'px';
        constants.popoverLogged.style.left = (rect.left + window.scrollX) + 'px';
        constants.popoverLogged.style.transform = 'translateX(-100%)';
        constants.overlayLogged.style.display = 'flex';
        setTimeout(() => {
            constants.overlayLogged.classList.add('show-logged');
        }, 10);
    } else {
        constants.overlaySignupSingnin.style.display = 'flex';
        setTimeout(() => {
            constants.initialContainer.classList.add('show-account');
            constants.popoverSignupSingnin.style.width = '380px';
        }, 10);
    }
};

// Handle click events on the overlay for the logged-in user's home page
export const handleOverlayHomePageLoggedClick = (event) => {
    if (event.target === constants.overlayHomePageLogged) {
        constants.overlayHomePageLogged.style.display = 'none';
        constants.changePassword.classList.add('hidden');
        resetChangePasswordForm();
    }
};

// Handle click events on the return change password button
export const handleReturnChangePasswordClick = () => {
    if (
        constants.changePasswordForm.userName.value.length === 0 &&
        constants.changePasswordForm.email.value.length === 0 &&
        constants.changePasswordForm.currentPassword.value.length === 0 &&
        constants.changePasswordForm.newPassword.value.length === 0
    ) {
        constants.overlayHomePageLogged.style.display = 'none';
        constants.changePassword.classList.add('hidden');
        hideChangePasswordMessages();
    } else {
        constants.overlayHomePageLogged.style.display = 'none';
        constants.changePassword.classList.add('hidden');
        resetChangePasswordForm();
        hideChangePasswordMessages();
        window.location.reload();
    }
};

// Handle click events on the overlay for logged-in users
export const handleOverlayLoggedClick = (event) => {
    if (event.target === constants.overlayLogged) {
        constants.overlayLogged.style.display = 'none';
        constants.overlayLogged.classList.remove('show-logged');
        resetAccountSettings();
    }
};

// Handle click events on the delete account button
export const handleDeleteAccountButtonClick = () => {
    constants.logoutButton.style.display = 'none';
    constants.changePasswordButton.style.display = 'none';
    constants.deleteAccountButton.style.display = 'none';
    constants.deleteUserContainer.classList.remove('hidden');
    constants.questionDeleteAccount.style.display = 'flex';
    constants.returnDeleteUser.style.display = 'flex';
    constants.confirmDeleteUser.style.display = 'flex';
};

// Handle click events on the return delete user button
export const handleReturnDeleteUserClick = () => {
    constants.logoutButton.style.display = 'flex';
    constants.changePasswordButton.style.display = 'flex';
    constants.deleteAccountButton.style.display = 'flex';
    constants.deleteUserContainer.classList.add('hidden');
    constants.questionDeleteAccount.style.display = 'none';
    constants.returnDeleteUser.style.display = 'none';
    constants.confirmDeleteUser.style.display = 'none';
};

// Hide all error and success messages
const hideAllMessages = () => {
    constants.msgSuccessSignup.classList.add('hidden');
    constants.msgError1Signup.classList.add('hidden');
    constants.msgError2Signup.classList.add('hidden');
    constants.msgError0Signin.classList.add('hidden');
    constants.msgError1Signin.classList.add('hidden');
    constants.msgError2Signin.classList.add('hidden');
    constants.msgError3Signin.classList.add('hidden');
    constants.msgSuccessUpdatePassword.classList.add('hidden');
    constants.msgError1UpdatePassword.classList.add('hidden');
    constants.msgError2UpdatePassword.classList.add('hidden');
    constants.msgError3UpdatePassword.classList.add('hidden');
};

// Reset all forms to their default values
const resetForms = () => { 
    constants.signupForm.userName.value = ''; 
    constants.signupForm.email.value = ''; 
    constants.signupForm.password.value = ''; 
    constants.signupForm.confirmPassword.value = ''; 
    constants.signinForm.infos.value = ''; 
    constants.signinForm.password.value = ''; 
    constants.forgotPasswordForm.userName.value = ''; 
    constants.forgotPasswordForm.email.value = ''; 
    constants.forgotPasswordForm.password.value = ''; 
    constants.forgotPasswordForm.againPassword.value = ''; 
}; 

// Reset the fields of the change password form to their default values
const resetChangePasswordForm = () => { 
    constants.changePasswordForm.userName.value = ''; 
    constants.changePasswordForm.email.value = ''; 
    constants.changePasswordForm.currentPassword.value = ''; 
    constants.changePasswordForm.newPassword.value = ''; 
    constants.changePasswordForm.confirmPassword.value = ''; 
}; 

// Hides the change password error messages
const hideChangePasswordMessages = () => { 
    constants.msgError1ChangePassword.classList.add('hidden'); 
    constants.msgError2ChangePassword.classList.add('hidden'); 
}; 

// Resets account settings after certain actions
const resetAccountSettings = () => { 
    constants.deleteUserContainer.classList.add('hidden'); 
    constants.questionDeleteAccount.style.display = 'none'; 
    constants.returnDeleteUser.style.display = 'none'; 
    constants.confirmDeleteUser.style.display = 'none'; 
    constants.logoutButton.style.display = 'flex'; 
    constants.deleteAccountButton.style.display = 'flex'; 
    constants.changePasswordButton.style.display = 'flex';
};