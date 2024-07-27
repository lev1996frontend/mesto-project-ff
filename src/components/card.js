import { deleteLike, putLike } from './api'

// Селекторы, вынес для минимизации запросов к DOM
const cardTemplate = document.querySelector('#card-template').content

// Функция для обработки лайков, упрощена через функциональное выражение
const likeCard = (likeButton, likeCountElement, cardId) => {
    if (likeButton.classList.contains('card__like-button_is-active')) {
        deleteLike(cardId)
            .then((res) => {
                likeButton.classList.remove('card__like-button_is-active')
                likeCountElement.textContent = res.likes.length
            })
            .catch((err) => {
                console.log(err)
            })
    } else {
        putLike(cardId)
            .then((res) => {
                likeButton.classList.add('card__like-button_is-active')
                likeCountElement.textContent = res.likes.length
            })
            .catch((err) => {
                console.log(err)
            })
    }
}

// Создание карточек
export const createCard = (
    cardData,
    userId,
    deleteCardFn,
    likeCard,
    openFullImageFn
) => {
    const cardElement = cardTemplate.querySelector('.card').cloneNode(true)
    const cardDeleteButton = cardElement.querySelector('.card__delete-button')
    const cardLikeButton = cardElement.querySelector('.card__like-button')
    const cardImage = cardElement.querySelector('.card__image')
    const cardTitle = cardElement.querySelector('.card__title')
    const cardLikeCount = cardElement.querySelector('.card__like-count')

    // Установка данных карточки
    cardImage.src = cardData.link
    cardImage.alt = cardData.name
    cardTitle.textContent = cardData.name

    // Рендер лайков
    cardLikeCount.textContent = cardData.likes.length
    const isLiked = cardData.likes.some((like) => like._id === userId)
    if (isLiked) {
        cardLikeButton.classList.add('card__like-button_is-active')
    }

    // Удаление карточек
    if (cardData.owner._id === userId) {
        cardDeleteButton.addEventListener('click', (evt) => {
            deleteCardFn(evt, cardData._id)
        })
    } else {
        cardDeleteButton.remove()
    }

    // Лайк карточки
    cardLikeButton.addEventListener('click', () =>
        likeCard(cardLikeButton, cardLikeCount, cardData._id)
    )

    // Попап с картинкой
    cardImage.addEventListener('click', () => {
        openFullImageFn({
            src: cardData.link,
            alt: cardData.name,
            title: cardData.name,
        })
    })

    return cardElement
}

export { likeCard }
