import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Pagination,
  Stack,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
import {
  Add as AddIcon,
  Check as CheckIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { ITest, ITestQuestion, TestTypes } from "~/types";
import { SelectTestType } from "~/components/testForm/SelectTestType";
import { toast } from "react-toastify";

const OptionsForm = ({
  question,
  onUpdate,
}: {
  question: ITestQuestion;
  onUpdate: (question: ITestQuestion) => void;
}) => {
  const updateOptionText = (option: string, index: number) => {
    question.options![index] = option;
    onUpdate({ ...question });
  };

  const setValidOption = (index: number) => {
    question.validOptionIndex = index;
    onUpdate({ ...question });
  };

  const deleteOption = (index: number) => {
    onUpdate({
      ...question,
      options: question.options!.filter((opt, ind) => ind !== index),
    });
  };

  const addOption = () => {
    question.options!.push("");
    onUpdate({ ...question });
  };

  return (
    <>
      {question.options?.map((option, index) => (
        <Box
          key={index}
          sx={{
            display: "flex",
            justifyContent: "row",
            alignItems: "center",
          }}
        >
          <TextField
            label={"Вариант ответа"}
            fullWidth
            value={option}
            onChange={(event) => updateOptionText(event.target.value, index)}
            color={index === question.validOptionIndex ? "success" : undefined}
            focused={index === question.validOptionIndex}
          />
          {index !== question.validOptionIndex && (
            <IconButton onClick={() => setValidOption(index)}>
              <CheckIcon />
            </IconButton>
          )}
          <IconButton
            aria-label={"Удалить вариант"}
            onClick={() => deleteOption(index)}
          >
            <DeleteIcon />
          </IconButton>
        </Box>
      ))}
      <Button startIcon={<AddIcon />} variant={"outlined"} onClick={addOption}>
        Добавить вариант ответа
      </Button>
    </>
  );
};

const InputForm = ({
  question,
  onUpdate,
}: {
  question: ITestQuestion;
  onUpdate: (question: ITestQuestion) => void;
}) => {
  const onTextChange = (text: string) => {
    onUpdate({ ...question, validTextInput: text });
  };

  return (
    <Box>
      <TextField
        label={"Ответ на вопрос"}
        fullWidth
        value={question.validTextInput}
        onChange={(event) => onTextChange(event.target.value)}
      />
    </Box>
  );
};

const Question = ({
  question,
  onUpdate,
  onDelete,
  allowDelete,
}: {
  question: ITestQuestion;
  onUpdate: (question: ITestQuestion) => void;
  onDelete: () => void;
  allowDelete: boolean;
}) => {
  let form: React.ReactNode;

  if (question.type === TestTypes.OPTIONS) {
    form = <OptionsForm question={question} onUpdate={onUpdate} />;
  } else if (question.type === TestTypes.INPUT) {
    form = <InputForm question={question} onUpdate={onUpdate} />;
  }

  const onTitleChange = (title: string) => {
    onUpdate({ ...question, title });
  };

  return (
    <Stack gap={2}>
      <SelectTestType
        value={question.type}
        onChange={(val) =>
          onUpdate({ ...question, type: Number.parseInt(val.target.value) })
        }
      />
      <Stack direction={"row"}>
        <TextField
          label={"Вопрос"}
          fullWidth
          value={question.title}
          onChange={(event) => onTitleChange(event.target.value)}
        />
        {allowDelete && (
          <IconButton onClick={onDelete}>
            <DeleteIcon color={"error"} />
          </IconButton>
        )}
      </Stack>
      {form}
    </Stack>
  );
};

export default function TestDialog({
  test,
  isOpen,
  onClose,
  onSubmit,
}: {
  test?: ITest;
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (test: ITest) => void;
}) {
  const [$test, setTest] = useState<ITest>(
    test ??
      ({
        name: "",
        questions: [
          {
            type: TestTypes.OPTIONS,
            options: [],
            validOptionIndex: -1,
            title: "",
          },
        ],
      } as ITest),
  );
  const [pagesCount, setPagesCount] = useState<number>(
    test ? test.questions.length : 1,
  );
  const [pageNumber, setPageNumber] = useState<number>(1);

  const preSubmit = () => {
    if (!$test.name) {
      return toast.error("Не указано название теста!");
    }
    if (!$test.questions.length) {
      return toast.error("Должен быть указан как минимум 1 вопрос!");
    }
    $test.questions.forEach((question, index) => {
      if (!question.title) {
        return toast.error(`Пропущен заголовок вопроса №${index + 1}`);
      }
      if (question.type === TestTypes.OPTIONS) {
        if (question.validOptionIndex === -1) {
          return toast.error(
            `Не указан правильный вариант ответа на вопрос №${index + 1}`,
          );
        }
        if (
          !question.options!.length ||
          question.options!.filter((opt) => !opt).length
        ) {
          return toast.error(
            `Не указаны варианты ответа на вопрос №${index + 1}`,
          );
        }
      } else if (question.type === TestTypes.INPUT) {
        if (!question.validTextInput) {
          return toast.error(
            `Не указан правильный ответ на вопрос №${index + 1}`,
          );
        }
      }
    });

    onSubmit($test);
  };

  const addBlankTestQuestion = () => {
    setTest({
      ...$test,
      questions: [
        ...$test.questions,
        {
          title: "",
          type: TestTypes.OPTIONS,
          options: [],
          validOptionIndex: -1,
        } as ITestQuestion,
      ],
    });
  };

  const updateTestQuestion = (question: ITestQuestion) => {
    const questions = [...$test.questions];
    questions[pageNumber - 1] = question;

    setTest({
      ...$test,
      questions,
    });
  };

  const deleteTestQuestion = (index: number) => {
    setTest({
      ...$test,
      questions: $test.questions.filter((val, ind) => ind !== index),
    });
    setPagesCount((prev) => {
      if (pageNumber === prev) {
        setPageNumber(prev - 1);
      }
      return prev - 1;
    });
  };

  const onPageAdd = () => {
    addBlankTestQuestion();
    setPagesCount((prev) => {
      setPageNumber(prev + 1);
      return prev + 1;
    });
  };

  const setTestName = (name: string) => {
    setTest({
      ...$test,
      name,
    });
  };

  return (
    <Dialog open={isOpen} onClose={onClose}>
      <DialogTitle>{test ? "Редактирование" : "Создание"} теста</DialogTitle>
      <DialogContent>
        <Stack gap={2} my={1}>
          <TextField
            label={"Название теста"}
            value={$test.name}
            onChange={(event) => setTestName(event.target.value)}
          />
          <Question
            question={$test.questions[pageNumber - 1]}
            onUpdate={updateTestQuestion}
            onDelete={() => deleteTestQuestion(pageNumber - 1)}
            allowDelete={pagesCount !== 1}
          />
          <Stack
            direction={"row"}
            gap={2}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <Pagination
              count={pagesCount}
              page={pageNumber}
              onChange={(event, value) => setPageNumber(value)}
            />
            <IconButton onClick={onPageAdd}>
              <AddIcon />
            </IconButton>
          </Stack>
        </Stack>
      </DialogContent>
      <DialogActions>
        <Button onClick={preSubmit}>Сохранить</Button>
      </DialogActions>
    </Dialog>
  );
}
