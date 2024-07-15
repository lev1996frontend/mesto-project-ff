export function enableValidation(validationConfig) {
  document.addEventListener('DOMContentLoaded', () => {
    Array.from(document.querySelectorAll(validationConfig.formSelector)).forEach(
      (form) => {
        bindValidation(form, validationConfig);
      }
    );
  });
}

function toggleButtonState(inputList, button, validationConfig) {
  const isValid = Array.from(inputList).every((inputElement) => {
    return inputElement.validity.valid;
  });
  button.disabled = !isValid;
  button.classList.toggle(validationConfig.inactiveButtonClass, !isValid);
}

function bindValidation(form, validationConfig) {
  const inputs = form.querySelectorAll(validationConfig.inputSelector);
  const button = form.querySelector(validationConfig.submitButtonSelector);

  inputs.forEach((input) => {
    input.addEventListener("input", () => {
      checkInputValidity(form, input, validationConfig);
      toggleButtonState(inputs, button, validationConfig);
    });
  });
}

function checkInputValidity(form, input, validationConfig) {
  if (input.validity.patternMismatch) {
    input.setCustomValidity(input.dataset.error);
  } else {
    input.setCustomValidity("");
  }

  if (!input.validity.valid) showCustomError(form, input, validationConfig);
  else clearCustomError(form, input, validationConfig);
}

function showCustomError(form, input, validationConfig) {
  const errorText = input.validationMessage;
  const errorForm = form.querySelector(
    `.${validationConfig.inputErrorClass}-${input.name}`
  );
  input.classList.add(validationConfig.inputErrorClass);
  errorForm.classList.add(validationConfig.errorClass);
  errorForm.textContent = errorText;
}

function clearCustomError(form, input, validationConfig) {
  const errorForm = form.querySelector(
    `.${validationConfig.inputErrorClass}-${input.name}`
  );
  input.classList.remove(validationConfig.inputErrorClass);
  errorForm.classList.remove(validationConfig.errorClass);
  errorForm.textContent = "";
}

export function clearValidation(form, validationConfig) {
  const inputs = form.querySelectorAll(validationConfig.inputSelector);
  Array.from(inputs).forEach((input) => {
    clearValidation(form, input, validationConfig);
  });
  const button = form.querySelector(".button");
  button.disabled = true;
  button.classList.toggle(validationConfig.inactiveButtonClass, true);
}

