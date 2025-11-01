import axios from "axios";

const http = axios.create({
    baseURL: "http://localhost:5000",
    withCredentials: true, // needed to receive session cookie
});

export default http;
