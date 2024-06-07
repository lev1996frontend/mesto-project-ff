// @todo: Темплейт карточки
const cardTemplate = document.querySelector('#card-template').content;
// @todo: DOM узлы
const cardsList = document.querySelector('.places__list');

// @todo: Функция создания карточки
function createCardElement(item, eraseButtonHandler) { 
  const cardElement = cardTemplate.querySelector('.places__item').cloneNode(true); 
  const deleteButton = cardElement.querySelector('.card__delete-button');	 
  cardElement.querySelector('.card__image').src = item.link; 
  cardElement.querySelector('.card__image').alt = item.name; // Установка уникального альтернативного текста

  cardElement.querySelector('.card__title').textContent = item.name; 
   
  deleteButton.addEventListener('click', function(e) {
    eraseButtonHandler(e); 
  }); 

  return cardElement; 
}

// @todo: Функция удаления карточки
function eraseButtonClick(e) { 
  e.currentTarget.closest('.places__item').remove(); 
}

// @todo: Вывести карточки на страницу
initialCards.forEach(function(item) {
  const initialElement = createCardElement(item, eraseButtonClick); // Передача eraseButtonClick как аргумента
  cardsList.append(initialElement);
});
