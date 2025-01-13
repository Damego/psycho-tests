import React, { ChangeEvent } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  Radio,
  RadioGroup,
} from "@mui/material";
import {TestTypes} from "../../../api/types/tests";

export const SelectTestType = ({
  value,
  onChange,
}: {
  value: number;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
}) => {
  return (
    <FormControl>
      <FormLabel id="select-test-type">Тип вопроса</FormLabel>
      <RadioGroup row name="type" id={"type"} value={value} onChange={onChange}>
        <FormControlLabel
          value={TestTypes.SINGLE_ANSWER_OPTION}
          control={<Radio />}
          label="С выбором варианта ответа"
        />
        <FormControlLabel
          value={TestTypes.TEXT_FIELD}
          control={<Radio />}
          label="Открытая форма"
        />
      </RadioGroup>
    </FormControl>
  );
};
