import { initialCards } from './cards.js'
import { removeCard, handleLikeClick } from './card.js'
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

function createCard(item, handleCardClick, handleLikeClick) {
    const content = document.querySelector('#card-template').content
    const card = content.querySelector('.card').cloneNode(true)
    const cardImg = card.querySelector('.card__image')
    const cardTitle = card.querySelector('.card__title')
    const cardLike = card.querySelector('.card__like-button')
    const btnDelete = card.querySelector('.card__delete-button')

    cardImg.src = item.link
    cardImg.alt = item.name
    cardTitle.textContent = item.name

    cardImg.addEventListener('click', () => handleCardClick(item))
    btnDelete.addEventListener('click', removeCard)
    cardLike.addEventListener('click', (evt) => {
      handleLikeClick(evt.target); 
    });

    return card
}

function handleCardClick(item) {
    const popupImage = document.querySelector('.popup_type_image')
    const popupImageElement = popupImage.querySelector('.popup__image')
    const popupCaptionElement = popupImage.querySelector('.popup__caption')

    popupImageElement.src = item.link
    popupImageElement.alt = item.name
    popupCaptionElement.textContent = item.name

    openModal(popupImage)
}

function handleSubmitForm(evt) {
    evt.preventDefault()
    closeModal(evt.target.closest('.popup'))
}

editBtn.addEventListener('click', () => {
    openModal(popupTypeEdit)
    editForm.name.value = profileTitle.textContent
    editForm.description.value = profileDescription.textContent
})

addBtn.addEventListener('click', () => {
    openModal(popupTypeNewCard)
})

editForm.addEventListener('submit', (evt) => {
    profileTitle.textContent = editForm.name.value
    profileDescription.textContent = editForm.description.value

    handleSubmitForm(evt)
})

newPlaceForm.addEventListener('submit', (evt) => {
    evt.preventDefault()

    const newCard = createCard(
        {
            name: newPlaceForm.elements['place-name'].value,
            link: newPlaceForm.elements.link.value,
        },
        handleCardClick,
        handleLikeClick,
    )
    placesList.prepend(newCard)

    closeModal(popupTypeNewCard)
})

initialCards.forEach((item) => {
    const newCard = createCard(item, handleCardClick, handleLikeClick)
    placesList.append(newCard)
})

document.querySelectorAll('.popup__close').forEach((closeButton) => {
    closeButton.addEventListener('click', function () {
        const popup = this.closest('.popup')
        closeModal(popup)
    })
})

// Устанавливаем обработчик для закрытия попапа по клику на оверлей
document.querySelectorAll('.popup').forEach((popup) => {
    popup.addEventListener('click', closeModalOnOverlay)
})
document.querySelectorAll('.button_open-popup').forEach((button) => {
    button.addEventListener('click', function () {
        const popup = document.querySelector(button.getAttribute('data-popup'))
        openModal(popup)

        // Если в попапе есть форма, то сбрасываем её содержимое
        const form = popup.querySelector('.popup__form')
        if (form) {
            form.reset()
        }
    })
})
