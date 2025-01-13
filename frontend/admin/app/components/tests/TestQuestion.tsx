import {
  ITestQuestion,
  ITestQuestionAnswer,
  TestTypes,
} from "../../../api/types/tests";
import {
  Button,
  IconButton,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { SelectTestType } from "~/components/tests/SelectTestType";
import React from "react";
import { Add as AddIcon, Delete as DeleteIcon } from "@mui/icons-material";

const QuestionPossibleAnswer = ({
  answer,
  onUpdate,
  onDelete,
}: {
  answer: ITestQuestionAnswer;
  onUpdate: (answer: ITestQuestionAnswer) => void;
  onDelete: () => void;
}) => {
  const handleAnswerChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({ ...answer, answer: event.target.value });
  };

  const handlePointsChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    let value = Number.parseInt(event.target.value);
    if (value < 0) value = 0;
    onUpdate({ ...answer, points: value });
  };

  return (
    <Stack direction={"row"}>
      <Stack direction={"row"} gap={2}>
        <TextField
          label={"Вариант ответа"}
          fullWidth
          value={answer.answer}
          onChange={handleAnswerChange}
        />
        <TextField
          label={"Очки"}
          type={"number"}
          value={answer.points}
          onChange={handlePointsChange}
        />
      </Stack>
      <IconButton onClick={onDelete}>
        <DeleteIcon />
      </IconButton>
    </Stack>
  );
};

export default function TestQuestion({
  question,
  onQuestionUpdate,
  onDelete,
}: {
  question: ITestQuestion;
  onQuestionUpdate: (question: ITestQuestion) => void;
  onDelete: () => void;
}) {
  const handleSelectType = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuestionUpdate({
      ...question,
      type: Number.parseInt(event.target.value),
    });
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onQuestionUpdate({
      ...question,
      title: event.target.value,
    });
  };

  const handleAnswerAdd = () => {
    onQuestionUpdate({
      ...question,
      answers: [...question.answers, { answer: "", points: 0 }],
    });
  };

  const onAnswerUpdate = (answer: ITestQuestionAnswer, index: number) => {
    question.answers[index] = answer;
    onQuestionUpdate({ ...question, answers: [...question.answers] });
  };

  const onAnswerDelete = (index: number) => {
    onQuestionUpdate({
      ...question,
      answers: question.answers.filter((ans, ind) => ind !== index),
    });
  };

  return (
    <Stack gap={2}>
      <Stack direction={"row"}>
        <TextField
          label={"Заголовок вопроса"}
          fullWidth
          value={question.title}
          onChange={handleTitleChange}
        />
        <IconButton onClick={onDelete}>
          <DeleteIcon />
        </IconButton>
      </Stack>
      <SelectTestType value={question.type} onChange={handleSelectType} />

      <Stack direction={"row"} gap={4} alignItems={"center"}>
        <Typography fontWeight={"500"}>Возможные варианты ответов</Typography>
        <Button
          variant={"outlined"}
          startIcon={<AddIcon />}
          onClick={handleAnswerAdd}
        >
          Добавить
        </Button>
      </Stack>
      {question.answers.map(
        (answer, index) => (
            <QuestionPossibleAnswer
              key={index}
              answer={answer}
              onUpdate={(ans) => onAnswerUpdate(ans, index)}
              onDelete={() => onAnswerDelete(index)}
            />
          ),
      )}
      {question.type === TestTypes.TEXT_FIELD && (
        <Stack direction={"row"} gap={2}>
          <Typography fontWeight={"500"}>
            Любой другой ответ - 0 очков
          </Typography>
        </Stack>
      )}
    </Stack>
  );
}
