import "../pages/index.css";
import {  likeCard, createCard } from "./card";
import { closeModal, openModal, closeModalOnOverlay } from "./modal";
import { clearValidation, enableValidation } from "./validation";
import {
  getInitialInfo,
  postNewCard,
  updateUserAvatar,
  updateUserProfile,
  deleteCard as deleteCardFromServer,
} from "./api";


const placesList = document.querySelector(".places__list");
const popupProfile = document.querySelector(".popup_type_edit");
const popupProfileForm = document.forms["edit-profile"];
const profileTitle = document.querySelector(".profile__title");
const profileDescription = document.querySelector(".profile__description");
const profileAvatar = document.querySelector(".profile__image");
const profileEditButton = document.querySelector(".profile__edit-button");
const newCardButton = document.querySelector(".profile__add-button");
const popupNewCard = document.querySelector(".popup_type_new-card");
const popupNewCardForm = document.forms["new-place"];
const popupImageElement = document.querySelector(".popup_type_image");
const popupImage = popupImageElement.querySelector(".popup__image");
const popupCaption = popupImageElement.querySelector(".popup__caption");
const popupAvatar = document.querySelector(".popup_type_avatar");
const popupAvatarForm = document.forms["edit-avatar"];
const avatarEditButton = document.querySelector(".profile__image-container");
const popupConfirm = document.querySelector(".popup_type_confirm");
const popupConfirmButton = popupConfirm.querySelector(".popup__button");

//селекторы для форм, полей ввода и кнопок, а также классы для стилизации ошибок
const validationConfig = {
  formSelector: ".popup__form",
  inputSelector: ".popup__input",
  submitButtonSelector: ".popup__button",
  inactiveButtonClass: "popup__button_disabled",
  inputErrorClass: "popup__input_type_error",
  errorClass: "popup__error_visible",
};
let userId;

//удаление карточек
const deleteCard = (evt, cardId) => {
  openModal(popupConfirm);
  popupConfirm.dataset.cardId = cardId;
};


// рендеринг
const renderCard = (
  item,
  userId,
  container,
  likeCard,
  deleteCard,
  openFullImageFn,
  place = "end",
) => {
  const cardElement = createCard(
    item,
    userId,
    deleteCard,
    likeCard,
    openFullImageFn,
  );
  if (place === "end") {
    container.append(cardElement);
  } else {
    container.prepend(cardElement);
  }
};

//Изменяет текст кнопки в зависимости от состояния загрузки
const renderLoading = (isLoading, button) => {
  button.textContent = isLoading ? "Сохранение..." : "Сохранить";
};
//Заполняет информацию профиля (имя, описание, аватар).
const fillProfileInfo = (userInfo) => {
  profileTitle.textContent = userInfo.name;
  profileDescription.textContent = userInfo.about;
  profileAvatar.style.backgroundImage = `url(${userInfo.avatar})`;
};

//Подготавливает форму редактирования профиля, выставляя в нее имеющиеся значения.
const fillProfilePopup = (form, name, description) => {
  form.elements.name.value = name;
  form.elements.description.value = description;
};
popupImageElement.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

//Отображает исходные карточки на странице.
const renderInitialCards = (initialCards, userId) => {
  initialCards.forEach((card) => {
    renderCard(card, userId, placesList, likeCard, deleteCard, openImagePopup);
  });
};
// Открывает модальное окно с изображением
const openImagePopup = (imageURL, imageAlt, title) => {
  popupImage.src = imageURL;
  popupImage.alt = imageAlt;
  popupCaption.textContent = title;
  openModal(popupImageElement);
};
//Подтверждает удаление карточки после запроса к серверу
const handleConfirmDelete = async (evt) => {
  deleteCardFromServer(popupConfirm.dataset.cardId)
    .then((result) => {
      const card = document.querySelector(
        `[data-card-id="${popupConfirm.dataset.cardId}"]`,
      );
      card.remove();
      closeModal(popupConfirm);
    })
    .catch((err) => {
      console.log(err);
    });
};
//Обрабатывает отправку формы редактирования профиля и обновляет информацию
const handleProfileFormSubmit = async (evt) => {
  evt.preventDefault();
  renderLoading(true, popupProfileForm.querySelector(".popup__button"));
  updateUserProfile({
    name: popupProfileForm.name.value,
    about: popupProfileForm.description.value,
  })
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
      closeModal(popupProfile);
      clearValidation(popupProfileForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupProfileForm.querySelector(".popup__button"));
    });
};
//Обрабатывает отправку формы для изменения аватара.
const handleAvatarFormSubmit = async (evt) => {
  evt.preventDefault();
  renderLoading(true, popupAvatarForm.querySelector(".popup__button"));
  updateUserAvatar(popupAvatarForm.link.value)
    .then((updatedProfile) => {
      fillProfileInfo(updatedProfile);
      closeModal(popupAvatar);
      clearValidation(popupAvatarForm, validationConfig);
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupAvatarForm.querySelector(".popup__button"));
    });
};
//Обрабатывает отправку формы для добавления новой карточки
const handleNewCardFormSubmit = async (evt) => {
  evt.preventDefault();
  renderLoading(true, popupNewCardForm.querySelector(".popup__button"));
  const name = popupNewCardForm.elements["place-name"].value;
  const link = popupNewCardForm.elements.link.value;
  postNewCard({ name, link })
    .then((newCard) => {
      renderCard(
        newCard,
        userId,
        placesList,
        likeCard,
        deleteCard,
        openImagePopup,
        "start",
      );
      closeModal(popupNewCard);
      popupNewCardForm.reset();
    })
    .catch((err) => {
      console.log(err);
    })
    .finally(() => {
      renderLoading(false, popupNewCardForm.querySelector(".popup__button"));
    });
};


//
profileEditButton.addEventListener("click", () => {
  clearValidation(popupProfileForm, validationConfig);
  fillProfilePopup(
    popupProfileForm,
    profileTitle.textContent,
    profileDescription.textContent,
  );
  openModal(popupProfile);
});
// Обрабатывает отправку формы профиля, вызывая функцию handleProfileFormSubmit для обработки данных, введённых пользователем
popupProfileForm.addEventListener("submit", handleProfileFormSubmit);
//  Закрытие модального окна профиля
popupProfile.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

//Очистит валидацию формы аватара, сбросит её данные и откроет модальное окно для редактирования аватара
avatarEditButton.addEventListener("click", (evt) => {
  clearValidation(popupAvatarForm, validationConfig);
  popupAvatarForm.reset();
  openModal(popupAvatar);
});
//Обрабатывает отправку формы изменения аватара, вызывая функцию
popupAvatarForm.addEventListener("submit", handleAvatarFormSubmit);
//Закрывает окно изменения аватара при клике на оверлей.
popupAvatar.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

// Очищает и открывает форму для создания новой карточки, обеспечивая валидацию
newCardButton.addEventListener("click", () => {
  popupNewCardForm.reset();
  clearValidation(popupNewCardForm, validationConfig);
  openModal(popupNewCard);
});
//Закрывает окно добавления новой карточки при клике на оверлей.
popupNewCardForm.addEventListener("submit", handleNewCardFormSubmit);
// Закрывает окно подтверждения удаления карточки при клике на оверлей
popupNewCard.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

// Обрабатывает удаление карточки при нажатии кнопки подтверждения
popupConfirm.addEventListener("click", (evt) => {
  closeModalOnOverlay(evt);
});

popupConfirmButton.addEventListener("click", handleConfirmDelete);

// Обработка закрытия модального окна
const popupCloseButtons = document.querySelectorAll(".popup__close");
popupCloseButtons.forEach((button) => {
    button.addEventListener("click", (evt) => {
        closeModal(evt.target.closest(".popup")); // Закрываем попап, связанный с кнопкой закрытия
    });
});
//  Асинхронно получает начальную информацию о пользователе и карточках
getInitialInfo()
  .then((result) => {
    const userInfo = result[0];
    userId = userInfo._id;
    const initialCards = result[1];
    fillProfileInfo(userInfo);
    renderInitialCards(initialCards, userId);
  })
  .catch((err) => {
    console.log(err);
  });

enableValidation(validationConfig);
