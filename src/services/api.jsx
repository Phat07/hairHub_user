import axios from "axios";
const BASE_URL = "https://hairhub.gahonghac.net/api/v1";

export const API = axios.create({
  baseURL: BASE_URL,
});
