'use strict'

import { initialCards } from './cards.js'
import { handleLikeClick, createCard, handleRemoveClick } from './card.js'
import { openModal, closeModal, closeModalOnOverlay } from './modal.js'

import '../pages/index.css'

const popupTypeEdit = document.querySelector('.popup_type_edit')
const popupTypeNewCard = document.querySelector('.popup_type_new-card')

const editBtn = document.querySelector('.profile__edit-button')
const addBtn = document.querySelector('.profile__add-button')

const editForm = document.forms['edit-profile']
const newPlaceForm = document.forms['new-place']

const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')

const placesList = document.querySelector('.places__list')

function handleCardClick(item) {
    const popupImage = document.querySelector('.popup_type_image')
    const popupImageElement = popupImage.querySelector('.popup__image')
    const popupCaptionElement = popupImage.querySelector('.popup__caption')

    popupImageElement.src = item.link
    popupImageElement.alt = item.name
    popupCaptionElement.textContent = item.name

    openModal(popupImage)
}


editBtn.addEventListener('click', () => {
    openModal(popupTypeEdit)
    editForm.name.value = profileTitle.textContent
    editForm.description.value = profileDescription.textContent
})

addBtn.addEventListener('click', () => {
    openModal(popupTypeNewCard)
})

function updateProfileInfo({ name, description }) {
  profileTitle.textContent = name;
  profileDescription.textContent = description;
}

editForm.addEventListener('submit', (evt) => {
  evt.preventDefault();
  const { name, description } = editForm.elements;
  updateProfileInfo({ name: name.value, description: description.value });
  closeModal(popupTypeEdit);
});

newPlaceForm.addEventListener('submit', (evt) => {
    evt.preventDefault()

    const newCard = createCard(
        {
            name: newPlaceForm.elements['place-name'].value,
            link: newPlaceForm.elements.link.value,
        },
        handleCardClick,
        handleLikeClick
    )
    placesList.prepend(newCard)

    closeModal(popupTypeNewCard)
    newPlaceForm.reset()
})

initialCards.forEach((item) => {
    const newCard = createCard(item, handleCardClick, handleLikeClick)
    placesList.append(newCard)
})

// Устанавливаем обработчик для закрытия попапа по клику на оверлей
document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('click', (evt) => {
        if (evt.target === evt.currentTarget) {
            closeModalOnOverlay(evt)
        }
    })
})

document.addEventListener('click', (evt) => {
  if(evt.target.classList.contains('popup__close') || evt.target.classList.contains('popup')) {
      const popup = evt.target.classList.contains('popup') ? evt.target : evt.target.closest('.popup');
      closeModal(popup);
  }
});

placesList.addEventListener('click', (evt) => {
  if (evt.target.classList.contains('card__delete-button')) {
    handleRemoveClick(evt);
  }
});
