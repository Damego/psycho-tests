import axios, { AxiosInstance } from "axios";
import { IUser } from "./types/users";
import {
  IUserForm,
} from "../components/modelForms/types";
import { ErrorResponseCodes } from "./types/enums";
import { getErrorMessage } from "../utils/texts";
import { ITest, TestCreate } from "./types/tests";

export const API_URL = "http://127.0.0.1:8000";

export interface IApiError {
  code: ErrorResponseCodes;
  message: string;
}

export interface IApiResponse<T> {
  error?: IApiError;
  data?: T;
}

export default class HttpClient {
  private client: AxiosInstance;
  private accessToken: string | null;
  private refreshToken: string | null;

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
    this.accessToken = null;
    this.refreshToken = null;
  }

  async request<T>(
    method: string,
    endpoint: string,
    {
      data,
      file,
      asFormData,
    }: { data?: object; file?: File; asFormData?: boolean } = {},
  ): Promise<IApiResponse<T>> {
    let payload = undefined;

    if (file) {
      payload = new FormData();
      payload.append("file", file);
      if (data) {
        payload.append("json_payload", JSON.stringify(data));
      }
    } else if (asFormData) {
      payload = new FormData();
      Object.entries(data).forEach(([key, value]) => {
        payload.append(key, value);
      });
    } else {
      payload = data;
    }
    console.log(`[HTTP] [${method}] '${endpoint}' data: ${payload}`);
    let cookies = "";
    if (this.accessToken) cookies += `access_token=${this.accessToken}; `;
    if (this.refreshToken) cookies += `refresh_token=${this.refreshToken}; `;

    const response = await this.client.request({
      method,
      url: endpoint,
      data: payload,
      headers: {
        "Content-Type":
          payload instanceof FormData
            ? "multipart/form-data"
            : "application/json",
        Cookie: cookies,
      },
    });

    if (response.status >= 400) {
      if (response.data.detail.code === ErrorResponseCodes.TOKEN_EXPIRED) {
        await this.refreshAccessToken();
        await this.request(method, endpoint, { data, file, asFormData });
      }
      const error = {
        code: response.data.detail.code,
        message: getErrorMessage(response.data.detail.code),
      };

      console.error(
        `HTTP Error with code ${error.code}. Message: ${error.message}`,
      );
      return { error };
    }
    return {
      data: response.data,
    };
  }

  setTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }

  async refreshAccessToken() {
    this.accessToken = null;
    const res = await this.request<{
      access_token: string;
    }>("POST", "/refresh");
    if (res.data) {
      this.accessToken = res.data.access_token;
    }
    return res;
  }

  async signIn(email: string, password: string) {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    const res = await this.request<{
      access_token: string;
      refresh_token: string;
    }>("POST", "/signin?as_admin=true", { data: form });

    if (res.data) {
      this.accessToken = res.data.access_token;
      this.refreshToken = res.data.refresh_token;
    }

    return res;
  }

  getUsers() {
    return this.request<IUser[]>("GET", "/users");
  }

  getUser(userId: number) {
    return this.request<IUser>("GET", `/users/${userId}`);
  }

  getMe() {
    return this.request<IUser>("GET", "/users/me");
  }

  createUser(user: IUserForm) {
    return this.request<IUser>("POST", "/users", {
      data: user,
      asFormData: true,
    });
  }

  updateUser(userId: number, user: IUserForm) {
    return this.request<IUser>("PATCH", `/users/${userId}`, { data: user });
  }

  deleteUser(userId: number) {
    return this.request<null>("DELETE", `/users/${userId}`);
  }

  getTestList() {
    return this.request<ITest[]>("GET", "/tests/list");
  }

  getTestById(testId: number) {
    return this.request<ITest>("GET", `/tests/${testId}`);
  }

  addTest(create: TestCreate) {
    return this.request<ITest>("POST", "/tests", { data: create });
  }

  updateTest(testId: number, update: TestCreate) {
    return this.request<ITest>("PATCH", `/tests/${testId}`, { data: update });
  }

  deleteTest(testId: number) {
    return this.request<null>("DELETE", `/tests/${testId}`);
  }
}
