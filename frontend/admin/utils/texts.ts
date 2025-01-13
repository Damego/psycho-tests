import { ErrorResponseCodes, UserPermissions } from "../api/types/enums";
import { decomposeFlag } from "./enums";

export const errorMessages = {
  [ErrorResponseCodes.MISSING_TOKEN]: "Токен аутентификации не обнаружен",
  [ErrorResponseCodes.INVALID_TOKEN]: "Невалидный токен аутентификации",
  [ErrorResponseCodes.INVALID_TOKEN_TYPE]:
    "Некорректный тип токена аутентификации",
  [ErrorResponseCodes.INVALID_USER_CREDENTIALS]:
    "Неверно указана почта или пароль",
  [ErrorResponseCodes.USER_ALREADY_EXISTS]:
    "Пользователь с такой почтой уже существует",
  [ErrorResponseCodes.USER_ALREADY_VERIFIED]:
    "Вы уже подтвердили свою учётную запись",
  [ErrorResponseCodes.USER_NOT_FOUND]: "Пользователь не найден",
  [ErrorResponseCodes.MISSING_PERMISSIONS]: "Это действие доступно только администраторам",
  [ErrorResponseCodes.UNSUPPORTED_FILE_TYPE]: "Неподдерживаемый тип файла",
  [ErrorResponseCodes.INCORRECT_DOCUMENT_FILE]:
    "Содержимое документа не поддерживается",
  [ErrorResponseCodes.CATEGORY_NOT_FOUND]: "Категория не найдена",
  [ErrorResponseCodes.SUBCATEGORY_NOT_FOUND]: "Подкатегория не найдена",
  [ErrorResponseCodes.POST_NOT_FOUND]: "Пост не найден",
};

export const getErrorMessage = (code: ErrorResponseCodes) =>
  errorMessages[code] || `Произошла неизвестная ошибка. Код: ${code}`;

export const userPermissions = {
  [UserPermissions.ADMINISTRATOR]: "Администратор",
};

export const getTextUserPermissions = (permissions: number): string[] => {
  const flags = decomposeFlag(permissions);
  return flags.map((flag) => userPermissions[flag] ?? flag.toString());
};
