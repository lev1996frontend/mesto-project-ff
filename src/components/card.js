
function handleLikeClick(button) {
  button.classList.toggle('card__like-button_is-active');
}

function removeCard(evt) {
  const card = evt.target.closest('.card');
  card.remove();
}

export { handleLikeClick, removeCard };
