export function createCard(item, handleCardClick, handleLikeClick, handleRemoveClick) {
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
    btnDelete.addEventListener('click', handleRemoveClick)
    cardLike.addEventListener('click', (evt) => {
        handleLikeClick(evt.target)
    })

    return card
}

function handleLikeClick(button) {
    button.classList.toggle('card__like-button_is-active')
}

function handleRemoveClick(evt) {
    const card = evt.target.closest('.card')
    card.remove()
}

export { handleLikeClick, handleRemoveClick }
