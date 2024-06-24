const arkhyz = new URL("https://pictures.s3.yandex.net/frontend-developer/cards-compressed/arkhyz.jpg", import.meta.url);
const chelyabinsk = new URL("https://pictures.s3.yandex.net/frontend-developer/cards-compressed/chelyabinsk-oblast.jpg", import.meta.url);
const ivanovo = new URL("https://pictures.s3.yandex.net/frontend-developer/cards-compressed/ivanovo.jpg", import.meta.url);
const kamchatka = new URL("https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kamchatka.jpg", import.meta.url);
const kholmogorsky = new URL("https://pictures.s3.yandex.net/frontend-developer/cards-compressed/kholmogorsky-rayon.jpg", import.meta.url);
const baikal = new URL("https://pictures.s3.yandex.net/frontend-developer/cards-compressed/baikal.jpg", import.meta.url);



export const initialCards = [
  {
    name: "Архыз",
    link: arkhyz,
  },
  {
    name: "Челябинская область",
    link: chelyabinsk,
  },
  {
    name: "Иваново",
    link: ivanovo,
  },
  {
    name: "Камчатка",
    link: kamchatka,
  },
  {
    name: "Холмогорский район",
    link: kholmogorsky,
  },
  {
    name: "Байкал",
    link: baikal,
  }
];

function createCard(item, cbRemove, cbLike, cbFullImg) {
const content = document.querySelector('#card-template').content;
const card = content.querySelector('.card');
const popupImage = document.querySelector('.popup_type_image');
const cloneCard = card.cloneNode(true);
const cardImg = cloneCard.querySelector('.card__image');
const cardTitle = cloneCard.querySelector('.card__title');
const cardLike = cloneCard.querySelector('.card__like-button');
const btnDelete = cloneCard.querySelector('.card__delete-button');

cardImg.setAttribute('src', item.link);
cardImg.setAttribute('alt', item.name);
cardTitle.textContent = item.name;

btnDelete.addEventListener('click', cbRemove);

cardLike.addEventListener('click', () => cbLike(cardLike) );

cardImg.addEventListener('click', function() {
  popupImage.querySelector('.popup__image').src = cardImg.src;
  popupImage.querySelector('.popup__caption').textContent = cardTitle.textContent;
  cbFullImg(popupImage);
});

return cloneCard;
};

function like(item) {
item.classList.toggle('card__like-button_is-active');
};

function removeCard(evt) {
const target = evt.target;
const card = target.closest('.card');
card.remove();
};


export { createCard, like, removeCard};
