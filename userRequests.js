// const BASE_URL = 'http://localhost:3000';
const BASE_URL = 'https://weather-backend-rust.vercel.app';
// const BASE_URL = process.env.BASE_URL;

export const fetchRefreshToken = async (refreshToken) => {
	const res = await fetch(`${BASE_URL}/users/refresh_token`, {
			method: 'POST',
			headers: { 'Content-Type': 'application/json'},
			body: JSON.stringify({ refreshToken }),
	});
	return res.json();
};

export const fetchSignUpUser =  async (formData) => {
	const res = await fetch(`${BASE_URL}/users/signup`, {
		method: 'POST',
		headers: { 'Content-Type': 'application/json'},
		body: JSON.stringify(formData),
	});
	return res.json();
};

export const fetchSigninUser = async (accessToken, formData) => {
	const res = await fetch(`${BASE_URL}/users/signin`, {
		method: 'POST',
		headers: { 
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`},
		body: JSON.stringify(formData),
	});
	return res.json();
}

export const fetchChangePassword = async (accessToken, formData) => {
	const res = await fetch(`${BASE_URL}/users/change_password`, {
		method: 'PUT',
		headers:  { 
			'Content-Type': 'application/json', 
			'Authorization': `Bearer ${accessToken}`},
		body: JSON.stringify(formData),
	});
	return res.json();
};

export const fetchForgotPassword = async (formData) => {
	const res = await fetch(`${BASE_URL}/users/forgot_password`, {
		method: 'PUT',
		headers:  { 'Content-Type': 'application/json'},
		body: JSON.stringify(formData)
	});
	return res.json();
};

export const fetchDeleteUserAccount = async (accessToken) => {
	fetch(`${BASE_URL}/users/delete_user_account`, {
		method: 'DELETE',
		headers: {
			'Content-Type': 'application/json',
			'Authorization': `Bearer ${accessToken}`},
	});
	return res.json();
};

export default { 
	fetchRefreshToken,
	fetchSignUpUser,
	fetchSigninUser,
	fetchChangePassword,
	fetchDeleteUserAccount
};