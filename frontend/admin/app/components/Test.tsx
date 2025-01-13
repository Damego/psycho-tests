import React, { useState } from "react";
import {
  Box,
  Button,
  Container,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { ITest, ITestQuestion, TestTypes } from "~/types";

export const getQuestionsWord = (points: number) => {
  let word = "вопрос";

  let numEnd: number;
  if (points % 1 !== 0) numEnd = (points % 1) * 10;
  else numEnd = points % 10;
  numEnd = parseInt(numEnd.toFixed(0));

  if ([0, 5, 6, 7, 8, 9].includes(numEnd) || (points > 10 && points < 15))
    word += "ов";
  else if ([2, 3, 4].includes(numEnd)) word += "а";

  return word;
};

const SUCCESS_COLOR = "#66BB6A";
const ERROR_COLOR = "#EF5350";
const DEFAULT_COLOR = "#638EFF";

type ButtonAnswerState = "correct" | "incorrect" | "none";

const stateToColor = {
  correct: SUCCESS_COLOR,
  incorrect: ERROR_COLOR,
  none: DEFAULT_COLOR,
};

const stateToText = {
  correct: "Правильно",
  incorrect: "Неправильно",
  none: "Проверить",
};

const OptionButton = ({
  state,
  onClick,
  children,
}: {
  state: ButtonAnswerState;
  onClick: () => void;
  children: string;
}) => {
  return (
    <Button
      sx={{ backgroundColor: stateToColor[state], color: "#FFFFFF" }}
      onClick={onClick}
    >
      {children}
    </Button>
  );
};

const OptionsForm = ({
  question,
  onAnswer,
}: {
  question: ITestQuestion;
  onAnswer: (state: ButtonAnswerState) => void;
}) => {
  const [clickedOptionIndex, setClickedOptionIndex] = useState(-1);

  const getButtonState = (index: number): ButtonAnswerState => {
    if (clickedOptionIndex === -1) return "none";
    if (index === question.validOptionIndex) return "correct";
    if (index !== clickedOptionIndex) return "none";
    return "incorrect";
  };

  const onOptionClick = (index: number) => {
    if (clickedOptionIndex !== -1) return;
    setClickedOptionIndex(index);
    onAnswer(index === question.validOptionIndex ? "correct" : "incorrect");
  };

  return (
    <Stack gap={1}>
      {question.options!.map((opt, index) => (
        <OptionButton
          key={index}
          state={getButtonState(index)}
          onClick={() => onOptionClick(index)}
        >
          {opt}
        </OptionButton>
      ))}
    </Stack>
  );
};

const InputForm = ({
  question,
  onAnswer,
}: {
  question: ITestQuestion;
  onAnswer: (state: ButtonAnswerState) => void;
}) => {
  const [value, setValue] = useState("");
  const [state, setState] = useState<ButtonAnswerState>("none");

  const check = () => {
    if (state !== "none") return;

    if (value.toLowerCase() === question.validTextInput!.toLowerCase()) {
      setState("correct");
      onAnswer("correct");
    } else {
      setState("incorrect");
      onAnswer("incorrect");
    }
  };

  return (
    <Stack gap={2}>
      <TextField
        label={"Ваш ответ"}
        value={value}
        disabled={state !== "none"}
        onChange={(event) => setValue(event.target.value)}
      />
      <Button
        onClick={check}
        sx={{ backgroundColor: stateToColor[state], color: "#FFFFFF" }}
      >
        {stateToText[state]}
      </Button>
    </Stack>
  );
};

const TestQuestion = ({
  question,
  onAnswer,
}: {
  question: ITestQuestion;
  onAnswer: (state: ButtonAnswerState) => void;
}) => {
  if (question.type === TestTypes.OPTIONS) {
    return <OptionsForm question={question} onAnswer={onAnswer} />;
  }
  if (question.type === TestTypes.INPUT) {
    return <InputForm question={question} onAnswer={onAnswer} />;
  }
};

export default function Test({ test }: { test: ITest }) {
  const [currentQuestionNumber, setCurrentQuestionNumber] = useState(1);
  const [answered, setAnswered] = useState(false);
  const [answeredCount, setAnsweredCount] = useState(0);
  const [finished, setFinished] = useState(false);

  const bumpQuestion = () => {
    if (currentQuestionNumber === test.questions.length) {
      setFinished(true);
      return;
    }
    setCurrentQuestionNumber((prev) => prev + 1);
    setAnswered(false);
  };

  const onAnswer = (state: ButtonAnswerState) => {
    if (state === "correct") {
      setAnsweredCount((ac) => ac + 1);
    }
    setAnswered(true);
  };

  return (
    <Box
      sx={{
        bgcolor: `#FFFFFF`,
        boxShadow: "0px 0px 7px #638EFF",
        borderRadius: "4px",
        padding: 2,
        marginY: 1,
        width: "20vw",
      }}
    >
      {finished ? (
        <Stack justifyContent={"center"} alignItems={"center"}>
          <Typography>Вы ответили правильно</Typography>
          <Typography>
            на {answeredCount} {getQuestionsWord(answeredCount)} из{" "}
            {test.questions.length}
          </Typography>
        </Stack>
      ) : (
        <Stack justifyContent={"center"} gap={2}>
          <Typography>
            Вопрос №{currentQuestionNumber} из {test.questions.length}
          </Typography>
          <TestQuestion
            question={test.questions[currentQuestionNumber - 1]}
            onAnswer={onAnswer}
          />
          {answered && <Button onClick={bumpQuestion}>Далее</Button>}
        </Stack>
      )}
    </Box>
  );
}
