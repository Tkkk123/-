// axios基础的封装
import axios from "axios";
import { ElMessage } from "element-plus";
import { useUserStore } from "@/stores/userStore";
import { hideLoading, showLoading } from "@/loading/loading";
const request = axios.create({
  baseURL: "https://apifoxmock.com/m1/4022804-3659542-default",
  timeout: 5000, // 设置请求超时时间
});

request.interceptors.request.use(
  (config) => {
    showLoading();
    const userStore = useUserStore();
    const token = userStore.userInfo.token;
    if (token) {
      config.headers.Authorization = token;
    }
    return config;
  },
  (e) => {
    hideLoading();
    Promise.reject(e);
  }
);

// axios 响应拦截器
request.interceptors.response.use(
  (response) => {
    hideLoading();
    return response.data;
  },
  (error) => {
    hideLoading();
    useErrorHandler(error);
    return Promise.reject(error);
  }
);

// 错误处理函数
export function useErrorHandler(error) {
  // 使用 provide/inject 在应用中全局注册这个函数
  ElMessage({
    type: "warning",
    message: error.response?.data?.message || "网络错误,请重试",
  });
}

export default request;
