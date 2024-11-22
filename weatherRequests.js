import constants from './constGlobal.js';

// const BASE_URL = 'http://localhost:3000';
// const BASE_URL = 'https://weather-backend-rust.vercel.app';
const BASE_URL = process.env.BASE_URL;

export const fetchAddNewCity = async (cityName) => {
    const res = await fetch(`${BASE_URL}/weather/add_new_city`, {
        method: 'POST', 
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${constants.accessToken}`,
        },
        body: JSON.stringify({ cityName }),
    });
    return res.json();
};

export const fetchAddCityHomePage = async (cityName) => {
    const res = await fetch(`${BASE_URL}/weather/add_city_home_page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityName }),
    });
    return res.json();
};

export const fetchLocalTime = async (lat, lon) => {
    const res = await fetch(`${BASE_URL}/weather/local_time/${lat}/${lon}`);
    return res.json();
};

export const fetchMyCitiesAdded = async () => {
    const res = await fetch(`${BASE_URL}/weather/my_cities_added`, {
        headers: { 'Authorization': `Bearer ${constants.accessToken}` },
    });
    return res.json();
};

export const fetchHomePageDefaultCities = async () => {
    const res = await fetch(`${BASE_URL}/weather/home_page`);
    return res.json();
};

export const fetchDeleteCity = async (cityName) => {
    const res = await fetch(`${BASE_URL}/weather/${cityName}`, { 
        method: 'DELETE', 
        headers: { 
            'Authorization': `Bearer ${constants.accessToken}` 
        }, 
    });
    return res.json();
};

export default {
    fetchAddNewCity,
    fetchAddCityHomePage,
    fetchLocalTime,
    fetchMyCitiesAdded,
    fetchHomePageDefaultCities,
    fetchDeleteCity,
};

