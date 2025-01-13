import { ErrorResponseCodes, UserContentTypes } from "~/api/types/enums";
import axios, { AxiosInstance } from "axios";
import { getErrorMessage } from "~/api/responses/message";
import { ICategory, IPost, IUserContent } from "~/api/types/content";
import { IUser } from "~/api/types/users";
import {
  ICreateUserContent,
  IUserContentUpdate,
  IUserForm,
} from "~/api/types/payloads";
import { ITest, ITestResult, IUserTestAnswer, IUserTestResult } from "./types/tests";
import { sessionStorage } from "~/sessions";

export const API_URL = "http://127.0.0.1:8000"; //"https://stoboi.damego.ru/api";

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

  constructor() {
    this.client = axios.create({
      baseURL: API_URL,
      withCredentials: true,
      validateStatus: (status) => status < 500,
    });
  }

  request<T>(
    method: string,
    endpoint: string,
    {
      data,
      file,
      params,
      asFormData,
      sendCredentials = true,
    }: {
      data?: object;
      file?: File;
      asFormData?: boolean;
      params?: object;
      sendCredentials?: boolean;
    } = {}
  ): (request: Request) => Promise<IApiResponse<T>> {
    const makeRequest = async (request: Request) => {
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
      let cookies = undefined;
      if (sendCredentials) {
        cookies = "";
        const session = await sessionStorage.getSession(
          request.headers.get("cookie")
        );
        const accessToken = session.get("access_token");
        const refreshToken = session.get("refresh_token");

        if (accessToken) cookies += `access_token=${accessToken}; `;
        if (refreshToken) cookies += `refresh_token=${refreshToken}; `;
      }

      const response = await this.client.request({
        method,
        url: endpoint,
        data: payload,
        params,
        headers: {
          "Content-Type":
            payload instanceof FormData
              ? "multipart/form-data"
              : "application/json",
          Cookie: cookies,
        },
      });

      console.log(
        `[HTTP] [${response.status}] [${method}] '${endpoint}' data: ${JSON.stringify(response.data)}`
      );

      if (response.status >= 400) {
        if (
          response.data.detail.code === ErrorResponseCodes.TOKEN_EXPIRED &&
          sendCredentials
        ) {
          await this.refreshAccessToken();
          await this.request(method, endpoint, { data, file, asFormData });
        }
        const error = {
          code: response.data.detail.code,
          message: getErrorMessage(response.data.detail.code),
        };

        console.error(
          `HTTP Error with code ${error.code}. Message: ${error.message}`
        );
        return { error };
      }
      return {
        data: response.data,
      };
    };

    return makeRequest;
  }

  refreshAccessToken() {
    return this.request<{
      access_token: string;
    }>("POST", "/refresh");
  }

  signIn(email: string, password: string) {
    const form = new FormData();
    form.append("email", email);
    form.append("password", password);

    return this.request<{
      access_token: string;
      refresh_token: string;
    }>("POST", "/signin", { data: form });
  }

  signUp(username: string, email: string, password: string) {
    const formData = new FormData();
    formData.append("name", username);
    formData.append("email", email);
    formData.append("password", password);

    return this.request<null>("POST", "/signup", { data: formData });
  }

  getMe() {
    return this.request<IUser>("GET", "/users/me");
  }

  changeUserName(name: string) {
    return this.request<null>("PATCH", "/users/me/name", { params: { name } });
  }

  requestChangeUserEmail(email: string) {
    return this.request<null>("POST", `/request-email-change`, {
      data: { email },
      sendCredentials: !email,
    });
  }

  requestChangeUserPassword(email?: string) {
    return this.request<null>("POST", `/request-password-change`, {
      data: email ? { email } : undefined,
    });
  }

  changeUserEmail(token: string) {
    return this.request<null>("POST", `/change-email`, { data: { token } });
  }

  changePassword(token: string, password: string) {
    return this.request<null>("POST", `/change-password`, {
      data: { password, token },
    });
  }

  getCategories() {
    return this.request<ICategory[]>("GET", "/categories");
  }

  getCategory(categoryId: number) {
    return this.request<ICategory>("GET", `/categories/${categoryId}`);
  }

  getPostById(postId: number) {
    return this.request<IPost>("GET", `/posts/${postId}?fetch_all=true`);
  }

  getPopularPosts() {
    return this.request<IPost[]>("GET", `/popular`);
  }

  getUserContentList({
    type,
    postId,
  }: {
    type?: UserContentTypes;
    postId?: number;
  }) {
    return this.request<IUserContent[]>("GET", "/me/content", {
      params: { type, post_id: postId },
    });
  }

  addUserContent(content: ICreateUserContent) {
    return this.request<null>("POST", "/me/content", { data: content });
  }

  updateUserContent(contentId: number, contentUpdate: IUserContentUpdate) {
    return this.request<null>("PATCH", `/me/content/${contentId}`, {
      data: contentUpdate,
    });
  }

  deleteUserContent(contentId: number) {
    return this.request<null>("DELETE", `/me/content/${contentId}`);
  }

  searchPosts(query: string, postId?: number) {
    return this.request<IPost>("GET", "/search", {
      params: { query, post_id: postId },
    });
  }

  getTestById(testId: number) {
    return this.request<ITest>("GET", `/tests/${testId}`);
  }

  completeTest(testId: number, answers: IUserTestAnswer[]) {
    return this.request<ITestResult>("POST", `/tests/${testId}/complete`, {
      data: { answers },
    });
  }

  getUserCompletedTests() {
    return this.request<ITestResult[]>("GET", "/me/tests")
  }
}

export const httpClient = new HttpClient();
