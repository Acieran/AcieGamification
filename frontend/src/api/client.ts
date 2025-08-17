import axios from 'axios';

const apiClient = axios.create({
    baseURL: 'http://127.0.0.1:8000/', // Replace with your API URL
    headers: {
        'Access-Control-Allow-Origin': '*',
        'Content-Type': 'application/json',
    },
});

export default apiClient;