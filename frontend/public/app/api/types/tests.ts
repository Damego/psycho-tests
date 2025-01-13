export enum TestTypes {
  SINGLE_ANSWER_OPTION = 1,
  TEXT_FIELD = 2,
}

export interface ITestQuestionAnswer {
  id?: number;
  test_question_id?: number;
  answer: string;
  points: number;
}

export interface ITestQuestion {
  id?: number;
  test_id?: number;
  title: string;
  type: TestTypes;

  answers: ITestQuestionAnswer[];
}

export interface ITestResult {
  id?: number;
  test_id?: number;
  min_points: number;
  max_points: number;
  content: string;

  test?: ITest;
}

export interface ITest {
  id?: number;
  name: string;

  questions: ITestQuestion[];
  results: ITestResult[];
}

export interface IUserTestAnswer {
  user_test_result_id?: number;
  question_id: number;
  answer_id: number;
}

export interface IUserTestResult {
  id?: number;
  test_id: number;
  user_id: number;
  date: string;

  answers: IUserTestAnswer[];
}

// Create & Update

export interface TestCreate {
  name: string;
  questions: ITestQuestion[];
  results: ITestResult[];
}