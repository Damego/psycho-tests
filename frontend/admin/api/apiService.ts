import HttpClient from "./httpClient";
import {
  IUserForm,
} from "../components/modelForms/types";
import { TestCreate } from "./types/tests";

class ApiService {
  private http: HttpClient;

  constructor() {
    this.http = new HttpClient();
  }

  setCredentialsTokens({
    accessToken,
    refreshToken,
  }: {
    accessToken: string;
    refreshToken: string;
  }) {
    return this.http.setTokens({ accessToken, refreshToken });
  }

  refreshAccessToken() {
    return this.http.refreshAccessToken();
  }

  signIn(email: string, password: string) {
    return this.http.signIn(email, password);
  }

  getUsers() {
    return this.http.getUsers();
  }

  getUser(userId: number) {
    return this.http.getUser(userId);
  }

  getMe() {
    return this.http.getMe();
  }

  createUser(user: IUserForm) {
    return this.http.createUser(user);
  }

  updateUser(userId: number, user: IUserForm) {
    return this.http.updateUser(userId, user);
  }

  deleteUser(userId: number) {
    return this.http.deleteUser(userId);
  }

  getTestList() {
    return this.http.getTestList();
  }

  getTestById(testId: number) {
    return this.http.getTestById(testId);
  }

  addTest(create: TestCreate) {
    return this.http.addTest(create);
  }

  updateTest(testId: number, update: TestCreate) {
    return this.http.updateTest(testId, update);
  }

  deleteTest(testId: number) {
    return this.http.deleteTest(testId);
  }
}

export const apiService = new ApiService();
