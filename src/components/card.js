import mesto, { profileId } from './api'

const cardTemplate = document.querySelector('#card-template').content
export const imagePopup = document.querySelector('.popup_type_image')
export const cardList = document.querySelector('.places__list')

export function createCard({
    cardData,
    deleteCallback,
    imageClickCallback,
    likeCallback,
}) {
    const cardElement = cardTemplate
        .querySelector('.places__item')
        .cloneNode(true)
    const image = cardElement.querySelector('.card__image')
    image.src = cardData.link
    image.alt = cardData.altText ?? `не знаю как лучше`
    cardElement.id = cardData._id
    cardElement.querySelector('.card__title').textContent = cardData.name
    cardElement.querySelector('.card__image-likes-count').textContent =
        cardData.likes.length
    if (cardData.likes.some((u) => u._id === profileId))
        cardElement
            .querySelector('.card__like-button')
            .classList.toggle('card__like-button_is-active')
    if (cardData.owner._id !== profileId) {
        cardElement.querySelector('.card__delete-button').style.display = 'none'
        deleteCallback = null
    }

    setDefaultEventHandlers({
        image,
        cardElement,
        deleteCallback,
        imageClickCallback,
        likeCallback,
    })

    return cardElement
}

export function updateCard(cardData) {
    const cardElement = cardList.querySelector(`[id="${cardData._id}"`)
    cardElement.querySelector('.card__image-likes-count').textContent =
        cardData.likes.length
}

export function deleteCard(element) {
    mesto
        .deleteCard(element.id)
        .then((res) => {
            element.remove()
        })
        .catch((err) => {
            console.log(err)
        })
}

export function renderCard({ cardData, handleImageClick, handleLike }) {
    const cardElement = createCard({
        cardData,
        deleteCallback: deleteCard,
        imageClickCallback: handleImageClick,
        likeCallback: handleLike,
    })
    cardList.append(cardElement)
}

export function setDefaultEventHandlers({
    image,
    cardElement,
    deleteCallback,
    imageClickCallback,
    likeCallback,
}) {
    if (deleteCallback) {
        const deleteCardButton = cardElement.querySelector(
            '.card__delete-button'
        )
        deleteCardButton.addEventListener('click', () => {
            deleteCallback(cardElement)
        })
    }
    const likeButton = cardElement.querySelector('.card__like-button')
    likeButton.addEventListener('click', likeCallback)

    image.addEventListener('click', imageClickCallback)
}
