import axios from 'axios';

const apiClient = axios.create({
    baseURL: '/api', // Replace with your API URL
    headers: {
        'Content-Type': 'application/json',
    },
});

export default apiClient;