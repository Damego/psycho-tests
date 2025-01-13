import useFetcherAsync from "~/hooks/useFetcherAsync";
import { useNavigate } from "@remix-run/react";
import React, { useState } from "react";
import {
  ITest,
  ITestQuestion,
  ITestQuestionAnswer,
  ITestResult,
  TestTypes,
} from "../../../api/types/tests";
import { toast } from "react-toastify";
import {
  Button,
  Divider,
  Stack,
  Step,
  StepLabel,
  Stepper,
  TextField,
  Typography,
} from "@mui/material";
import TestQuestion from "~/components/tests/TestQuestion";
import TestResult from "~/components/tests/TestResults";

const steps = ["Имя теста", "Вопросы теста", "Результаты"];

export default function TestForm({
  initialTest,
  onDelete,
}: {
  initialTest?: ITest;
  onDelete?: () => void;
}) {
  const fetcher = useFetcherAsync();
  const navigate = useNavigate();

  const [currentStep, setCurrentStep] = useState(0);
  const [test, setTest] = useState<ITest>(
    initialTest ??
      ({
        name: "",
        questions: [],
        results: [],
      } as ITest),
  );

  const handleSave = async () => {
    if (!validateStep()) return;

    test.name = test.name.trim();
    test.questions.forEach((question) => {
      question.title = question.title.trim();

      if (
        question.type === TestTypes.TEXT_FIELD &&
        !question.answers.find((ans) => ans.answer === "{%ANY_INPUT%}")
      ) {
        // это рофл значение - Любой другой вводимый пользователем ответ, заведомого неправильный
        question.answers.push({ answer: "{%ANY_INPUT%}", points: 0 });
      }

      question.answers.forEach((answer) => {
        answer.answer = answer.answer.trim();
      });
    });
    test.results.forEach((result) => {
      result.content = result.content.trim();
    });

    const res = await fetcher.submit(
      { _action: initialTest ? "edit-test" : "add-test", test },
      {
        method: "POST",
        encType: "application/json",
      },
    );
    if (!res.error) {
      toast.success("Тест сохранён");
      navigate("/tests");
    }
  };

  const validateStep = () => {
    if (currentStep === 0) {
      if (!test.name.trim()) {
        toast.error("Имя теста не может быть пустым!");
        return false;
      }
    } else if (currentStep === 1) {
      if (test.questions.length === 0) {
        toast.error("Должен присутствовать как минимум 1 вопрос");
        return false;
      }
      for (const [index, question] of test.questions.entries()) {
        if (!question.title.trim()) {
          toast.error(`Пропущен заголовок вопроса №${index + 1}`);
          return false;
        }
        if (!question.answers.length) {
          toast.error(
            `Должен присутствовать как минимум 1 ответ на вопрос №${index + 1}`,
          );
          return false;
        }
        for (const [answerIndex, answer] of question.answers.entries()) {
          if (!answer.answer.trim()) {
            toast.error(
              `Ответ ${answerIndex + 1} на вопрос №${index + 1} не может быть пустым!`,
            );
            return false;
          }
        }
      }
    } else if (currentStep === 2) {
      if (test.results.length === 0) {
        toast.error("Должен присутствовать как минимум 1 результат теста");
        return false;
      }
      for (const [index, result] of test.results.entries()) {
        if (!result.content.trim()) {
          toast.error(`Отсутствует содержание результата №${index + 1}`);
          return false;
        }
      }
    }
    return true;
  };

  const handleBack = () => {
    setCurrentStep((cs) => cs - 1);
  };

  const handleNext = () => {
    if (validateStep()) setCurrentStep((cs) => cs + 1);
  };

  const handleQuestionUpdate = (question: ITestQuestion, index: number) => {
    setTest((t) => {
      t.questions[index] = question;
      return { ...t };
    });
  };

  const handleQuestionDelete = (index: number) => {
    setTest((t) => {
      t.questions = t.questions.filter((q, ind) => ind !== index);
      return { ...t };
    });
  };

  const handleResultUpdate = (result: ITestResult, index: number) => {
    setTest((t) => {
      t.results[index] = result;
      return { ...t };
    });
  };

  const handleResultDelete = (index: number) => {
    setTest((t) => {
      t.results = t.results.filter((q, ind) => ind !== index);
      return { ...t };
    });
  };

  const handleQuestionAdd = () => {
    setTest((t) => ({
      ...t,
      questions: [
        ...t.questions,
        { title: "", answers: [], type: TestTypes.SINGLE_ANSWER_OPTION },
      ],
    }));
  };

  const handleResultAdd = () => {
    setTest((t) => ({
      ...t,
      results: [...t.results, { min_points: 0, max_points: 0, content: "" }],
    }));
  };

  const getMaxPointsSum = () => {
    const compareAnswers = (
      a1: ITestQuestionAnswer,
      a2: ITestQuestionAnswer,
    ) => {
      // Reversed
      if (a1.points > a2.points) return -1;
      if (a1.points < a2.points) return 1;
      return 0;
    };

    return test.questions.reduce(
      (acc, q) => acc + [...q.answers].sort(compareAnswers)[0]?.points,
      0,
    );
  };

  return (
    <>
      {onDelete && (
        <Stack justifyContent={"flex-end"} alignItems={"flex-end"}>
          <Button variant={"contained"} color={"error"} onClick={onDelete}>
            Удалить тест
          </Button>
        </Stack>
      )}
      <Stack
        gap={2}
        sx={{
          backgroundColor: "#FFFFFF",
          borderRadius: "4px",
          width: "50vw",
          p: 2,
        }}
      >
        <Stepper activeStep={currentStep}>
          {steps.map((label) => {
            return (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            );
          })}
        </Stepper>

        {currentStep === 0 && (
          <TextField
            label={"Название теста"}
            value={test.name}
            onChange={(event) => setTest({ ...test, name: event.target.value })}
          />
        )}

        {currentStep === 1 && (
          <>
            {test.questions.map((question, index) => (
              <>
                <Typography variant={"h5"} fontWeight={"600"}>
                  Вопрос №{index + 1}
                </Typography>
                <TestQuestion
                  key={index}
                  question={question}
                  onQuestionUpdate={(q) => handleQuestionUpdate(q, index)}
                  onDelete={() => handleQuestionDelete(index)}
                />
                {index !== test.questions.length - 1 && <Divider />}
              </>
            ))}
            <Divider />
            <Button variant={"contained"} onClick={handleQuestionAdd}>
              Добавить вопрос
            </Button>
          </>
        )}

        {currentStep === 2 && (
          <>
            <Typography>
              Максимальное количество очков - {getMaxPointsSum()}
            </Typography>
            {test.results.map((result, index) => (
              <>
                <Typography variant={"h5"} fontWeight={"600"}>
                  Результат №{index + 1}
                </Typography>
                <TestResult
                  key={index}
                  maxPoints={getMaxPointsSum()}
                  result={result}
                  onUpdate={(res) => handleResultUpdate(res, index)}
                  onDelete={() => handleResultDelete(index)}
                />
              </>
            ))}
            <Divider />
            <Button variant={"contained"} onClick={handleResultAdd}>
              Добавить Результат
            </Button>
          </>
        )}

        <Stack flexDirection={"row"} justifyContent={"space-between"}>
          {currentStep !== 0 ? (
            <Button onClick={handleBack}>Назад</Button>
          ) : (
            <div />
          )}
          {currentStep !== steps.length - 1 ? (
            <Button onClick={handleNext}>Далее</Button>
          ) : (
            <Button variant={"contained"} onClick={handleSave}>
              Сохранить
            </Button>
          )}
        </Stack>
      </Stack>
    </>
  );
}
