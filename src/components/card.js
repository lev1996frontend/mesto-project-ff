import { deleteLike, putLike } from "./api";

//селекторы, вынес для наименьшего запроса к дом
const cardTemplate = document.querySelector("#card-template").content;


// переделал функции, упростил их через функциональное выражение
const likeCard = (evt, cardId) => {
  const currentLikes = evt.target.closest('.card').querySelector(".card__like-count");


  if (evt.target.classList.contains("card__like-button_is-active")) {
    deleteLike(cardId)
      .then((updatedCard) => {
        evt.target.classList.remove("card__like-button_is-active");
        currentLikes.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  } else {
    putLike(cardId)
      .then((updatedCard) => {
        evt.target.classList.add("card__like-button_is-active");
        currentLikes.textContent = updatedCard.likes.length;
      })
      .catch((err) => {
        console.log(err);
      });
  }
};

// создание карточек
export const createCard = (
  cardData,
  userId,
  deleteCardFn,
  likeCardFn,
  openFullImageFn,
) => {
  const cardElement = cardTemplate.querySelector(".card").cloneNode(true);
  const cardDeleteButton = cardElement.querySelector(".card__delete-button");
  const cardLikeButton = cardElement.querySelector(".card__like-button");
  const cardImage = cardElement.querySelector(".card__image");
  const cardTitle = cardElement.querySelector(".card__title");
  const cardLikeCount = cardElement.querySelector(".card__like-count");

  // использую id для удаления карточки, напрямую не понимаю как передать, старый вариант удалил
  cardImage.src = cardData.link;
  cardImage.alt = cardData.name;
  cardTitle.textContent = cardData.name;

  // рендер лайков
  cardLikeCount.textContent = cardData.likes.length;
  const isLiked = cardData.likes.some((like) => like._id === userId);
  if (isLiked) {
    cardLikeButton.classList.add("card__like-button_is-active");
  }

  // удаление карточек
  if (cardData.owner._id === userId) {
    cardDeleteButton.addEventListener("click", (evt) => {
      deleteCardFn(evt, cardData._id);
    });
  } else {
    cardDeleteButton.remove();
  }



  // лайк карточки
  cardLikeButton.addEventListener("click", (evt) => {
    likeCardFn(evt, cardData._id);
  });

  // картинка попапа
  cardImage.addEventListener("click", () => {
    openFullImageFn(cardData.link, cardData.name);
  });

  return cardElement;
};

export { likeCard };
