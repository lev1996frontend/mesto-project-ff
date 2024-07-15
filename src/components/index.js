import '../pages/index.css'
import './modal.js'
import {
    renderCard,
    imagePopup,
    createCard,
    deleteCard,
    updateCard,
    cardList,
} from './card.js'
import { closeModal, openModal } from './modal.js'

import mesto from './api.js'
import { clearValidation, enableValidation } from './validation.js'

const validationConfig = {
    formSelector: '.popup__form',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button',
    inactiveButtonClass: 'popup__button_disabled',
    inputErrorClass: 'popup__input_type_error',
    errorClass: 'popup__error_visible',
}

const editForm = document.forms['edit-profile']
const addCardForm = document.forms['new-place']
const updateAvatarForm = document.forms['update-avatar']

const editPopup = document.querySelector('.popup_type_edit')
const addPopup = document.querySelector('.popup_type_new-card')
const updateAvatarPopup = document.querySelector('.popup_type_update-avatar')

const profileTitle = document.querySelector('.profile__title')
const profileDescription = document.querySelector('.profile__description')
const profileImage = document.querySelector('.profile__image')

const imageElement = imagePopup.querySelector('.popup__image')
const captionElement = imagePopup.querySelector('.popup__caption')

const editButton = document.querySelector('.profile__edit-button')
const addButton = document.querySelector('.profile__add-button')
const closeButtons = document.querySelectorAll('.popup__close')

editButton.addEventListener('click', () => {
    editForm.name.value = profileTitle.textContent
    editForm.description.value = profileDescription.textContent
    clearValidation(editForm, validationConfig)
    openModal(editPopup)
})

addButton.addEventListener('click', () => {
    clearValidation(addCardForm, validationConfig)
    openModal(addPopup)
})
profileImage.addEventListener('click', () => {
    clearValidation(updateAvatarPopup, validationConfig)
    openModal(updateAvatarPopup)
})

closeButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const popup = button.closest('.popup')
        closeModal(popup)
    })
})

function handleImageClick(event) {
    const imagePath = event.target.src
    imageElement.src = imagePath
    imageElement.alt =
        event.target.alt ??
        `Информативный аттрибут alt`
    captionElement.textContent = event.target.alt

    openModal(imagePopup)
}

function handleAvatarFormSubmit(event) {
    event.preventDefault()
    const button = event.target.querySelector('.popup__button')
    button.textContent = 'Сохранение...'
    const imageUrl = event.target['link'].value
    mesto
        .updateUserAvatar(imageUrl)
        .then((res) => {
            if (!res) return
            profileImage.style['background-image'] = "url('" + res.avatar + "')"
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            button.textContent = 'Сохранить'
            closeModal(updateAvatarPopup)
        })
}

function handleProfileFormSubmit(event) {
    event.preventDefault()
    const button = event.target.querySelector('.popup__button')
    button.textContent = 'Сохранение...'
    mesto
        .updateUser(event.target.name.value, event.target.description.value)
        .then((res) => {
            if (!res) return
            profileTitle.textContent = res.name
            profileDescription.textContent = res.about
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            button.textContent = 'Сохранить'
            closeModal(editPopup)
        })
}

function handleCardFormSubmit(event, handleImageClick) {
    event.preventDefault()
    const button = event.target.querySelector('.popup__button')
    button.textContent = 'Сохранение...'
    const cardName = event.target['place-name'].value
    const imageUrl = event.target['link'].value

    mesto
        .addNewCard(cardName, imageUrl)
        .then((res) => {
            if (!res) return
            const newCard = createCard({
                cardData: res,
                deleteCallback: deleteCard,
                imageClickCallback: handleImageClick,
                likeCallback: handleLike,
            })
            cardList.prepend(newCard)
            addCardForm.reset()
        })
        .catch((err) => {
            console.log(err)
        })
        .finally(() => {
            button.textContent = 'Сохранить'
            closeModal(addPopup)
        })
}

function handleLike(event) {
    mesto
        .setLikeCard(
            event.target.closest('.places__item').id,
            !event.target.classList.contains('card__like-button_is-active')
        )
        .then((res) => {
            event.target.classList.toggle('card__like-button_is-active')
            updateCard(res)
        })
        .catch((err) => {
            console.error(err)
        })
}

editForm.addEventListener('submit', handleProfileFormSubmit)
addCardForm.addEventListener('submit', (event) => {
    handleCardFormSubmit(event, handleImageClick)
})
updateAvatarForm.addEventListener('submit', handleAvatarFormSubmit)

Promise.all([mesto.getUser(), mesto.getAllCards()])
    .then(([user, cards]) => {
        if (user) {
            profileTitle.textContent = user.name
            profileDescription.textContent = user.about
            profileImage.style['background-image'] =
                "url('" + user.avatar + "')"
        }

        if (cards)
            cards.forEach((cardData) => {
                renderCard({ cardData, handleImageClick, handleLike })
            })
    })
    .catch((error) => {
        console.log(error)
    })

enableValidation(validationConfig)
