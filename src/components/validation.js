// функции работы с валидацией, переделал согласно чек-листу
// функция инициализирует процесс валидации всех форм
const enableValidation = (validationConfig) => {
  const formList = Array.from(
      document.querySelectorAll(validationConfig.formSelector)
  );
  formList.forEach((formElement) => {
      setEventListeners(
          formElement,
          validationConfig.inputSelector,
          validationConfig.inputErrorClass,
          validationConfig.errorClass,
          validationConfig.submitButtonSelector,
          validationConfig.inactiveButtonClass
      );
  });
};
//Выводит сообщение об ошибке для конкретного поля ввода
const showInputError = (
  formElement,
  inputElement,
  errorMessage,
  inputErrorClass,
  errorClass
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.add(inputErrorClass)
  errorElement.textContent = errorMessage
  errorElement.classList.add(errorClass)
}
//Скрывает сообщение об ошибке для конкретного поля ввода
const hideInputError = (
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
) => {
  const errorElement = formElement.querySelector(`.${inputElement.id}-error`)
  inputElement.classList.remove(inputErrorClass)
  errorElement.textContent = ''
  errorElement.classList.remove(errorClass)
}
//Проверяет актуальность значения поля ввода
const checkInputValidity = (
  formElement,
  inputElement,
  inputErrorClass,
  errorClass
) => {
  if (inputElement.validity.patternMismatch) {
      inputElement.setCustomValidity(inputElement.dataset.errorMessage)
  } else {
      inputElement.setCustomValidity('')
  }

  if (!inputElement.validity.valid) {
      showInputError(
          formElement,
          inputElement,
          inputElement.validationMessage,
          inputErrorClass,
          errorClass
      )
  } else {
      hideInputError(formElement, inputElement, inputErrorClass, errorClass)
  }
}
//обавляет слушатели событий для каждого поля ввода формы
const setEventListeners = (
  formElement,
  inputSelector,
  inputErrorClass,
  errorClass,
  submitButtonSelector,
  inactiveButtonClass
) => {
  const inputList = Array.from(formElement.querySelectorAll(inputSelector))
  const buttonElement = formElement.querySelector(submitButtonSelector)
  toggleButtonState(inputList, buttonElement, inactiveButtonClass)
  inputList.forEach((inputElement) => {
      inputElement.addEventListener('input', () => {
          checkInputValidity(
              formElement,
              inputElement,
              inputErrorClass,
              errorClass
          )
          toggleButtonState(inputList, buttonElement, inactiveButtonClass)
      })
  })
}
//Проверяет, есть ли невалидные поля ввода в списке. Возвращает true, если хотя бы одно поле невалидно
const hasInvalidInput = (inputList) => {
  return inputList.some((inputElement) => {
      return !inputElement.validity.valid
  })
}
//Изменяет состояние кнопки отправки формы на основе валидности всех полей ввода
const toggleButtonState = (inputList, buttonElement, inactiveButtonClass) => {
  if (hasInvalidInput(inputList)) {
      buttonElement.classList.add(inactiveButtonClass)
      buttonElement.disabled = true
  } else {
      buttonElement.classList.remove(inactiveButtonClass)
      buttonElement.disabled = false
  }
}
// Очищает валидацию для формы, скрывая все ошибки и сбрасывая состояние поля ввода
const clearValidation = (formElement, validationConfig) => {
  const inputList = Array.from(
    formElement.querySelectorAll(validationConfig.inputSelector)
  );

  // Очищаем поля ввода от ошибок
  inputList.forEach((inputElement) => {
    inputElement.classList.remove(validationConfig.inputErrorClass);
    const errorElement = formElement.querySelector(`.${inputElement.id}-error`);
    errorElement.textContent = '';
  });

  const buttonElement = formElement.querySelector(
    validationConfig.submitButtonSelector
  );

  // Используем toggleButtonState для управления состоянием кнопки
  toggleButtonState(inputList, buttonElement, validationConfig.inactiveButtonClass);
}



export { enableValidation, clearValidation }
