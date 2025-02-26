import api from "../index";

interface AuthRequest {
  email: string;
  password: string;
  remember_me: boolean;
}

interface AuthResponse {
  token: string;
}

const userApi = {
  auth: (params: AuthRequest) => api.post<AuthResponse>("/v1/login", params),
};

export default userApi;
