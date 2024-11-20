import constants from './constGlobal.js';

const path = 'https://weather-backend-rust.vercel.app';

export const fetchAddNewCity = async (cityName) => {
    const res = await fetch(`${path}/weather/add_new_city`, {
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
    const res = await fetch(`${path}/weather/add_city_home_page`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cityName }),
    });
    return res.json();
};

export const fetchLocalTime = async (lat, lon) => {
    const res = await fetch(`${path}/weather/local_time/${lat}/${lon}`);
    return res.json();
};

export const fetchMyCitiesAdded = async () => {
    const res = await fetch(`${path}/weather/my_cities_added`, {
        headers: { 'Authorization': `Bearer ${constants.accessToken}` },
    });
    return res.json();
};

export const fetchHomePageDefaultCities = async () => {
    const res = await fetch(`${path}/weather/home_page`);
    return res.json();
};

export const fetchDeleteCity = async (cityName) => {
    const res = await fetch(`${path}/weather/${cityName}`, { 
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

