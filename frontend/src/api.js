
import axios from "axios";
const api = axios.create({ baseURL: "/api" });
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = token;
  return cfg;
});
export default api;
