import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
    baseURL: API_URL
});

// Automatically inject admin authentication tokens for requests
api.interceptors.request.use(
    (config) => {
        const url = config.url || "";
        if (url.includes("senior")) {
            const seniorToken = sessionStorage.getItem("seniorAdminToken");
            if (seniorToken) {
                config.headers.Authorization = `Bearer ${seniorToken}`;
            }
        } else {
            const juniorToken = sessionStorage.getItem("adminToken");
            if (juniorToken) {
                config.headers.Authorization = `Bearer ${juniorToken}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);