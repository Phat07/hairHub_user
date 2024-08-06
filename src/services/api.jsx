import axios from "axios";
const BASE_URL = "https://157.15.86.92:8444/api/v1";

export const API = axios.create({
  baseURL: BASE_URL,
});
