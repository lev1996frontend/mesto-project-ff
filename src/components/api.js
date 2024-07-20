const config = {
    baseUrl: 'https://mesto.nomoreparties.co/v1/wff-cohort-18',
    headers: {
        authorization: '9cfe8ba5-4a8f-48c8-a36e-8500fb2455cf',
        'Content-Type': 'application/json',
    },
}
//функция обрабатывает ответ от сервера
const getResponseData = (res) => {
    return res.ok ? res.json() : Promise.reject(`Ошибка: ${res.status}`)
}
//функция, которая получает информацию о пользователе
const getInitialCards = async () => {
    return fetch(config.baseUrl + '/cards', {
        headers: config.headers,
    }).then((res) => getResponseData(res))
}
//функция, которая получает информацию о пользователе
const getUserInfo = async () => {
    return fetch(config.baseUrl + '/users/me', {
        headers: config.headers,
    }).then((res) => getResponseData(res))
}
//функция, которая выполняет запросы для получения информации о пользователе и карточках одновременно, используя Promise.all.
const getInitialInfo = async () => {
    return Promise.all([getUserInfo(), getInitialCards()])
}
//функция для обновления профиля пользователя
const updateUserProfile = async (userProfileData) => {
    return fetch(config.baseUrl + '/users/me', {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            name: userProfileData.name,
            about: userProfileData.about,
        }),
    }).then((res) => getResponseData(res))
}
//функция для добавления новой карточки
const postNewCard = async (cardData) => {
    return fetch(config.baseUrl + '/cards', {
        method: 'POST',
        headers: config.headers,
        body: JSON.stringify({
            name: cardData.name,
            link: cardData.link,
        }),
    }).then((res) => getResponseData(res))
}
//функция для установки лайка на карточку
const putLike = async (cardId) => {
    return fetch(config.baseUrl + `/cards/likes/${cardId}`, {
        method: 'PUT',
        headers: config.headers,
    }).then((res) => getResponseData(res))
}
//функция для удаления лайка с карточки.
const deleteLike = async (cardId) => {
    return fetch(config.baseUrl + `/cards/likes/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
    }).then((res) => getResponseData(res))
}
// функция для удаления карточки
const deleteCard = async (cardId) => {
    return fetch(config.baseUrl + `/cards/${cardId}`, {
        method: 'DELETE',
        headers: config.headers,
    }).then((res) => getResponseData(res))
}
//функция для обновления аватара пользователя
const updateUserAvatar = async (avatarLink) => {
    return fetch(config.baseUrl + '/users/me/avatar', {
        method: 'PATCH',
        headers: config.headers,
        body: JSON.stringify({
            avatar: avatarLink,
        }),
    }).then((res) => getResponseData(res))
}


export {
    getInitialCards,
    getUserInfo,
    getInitialInfo,
    updateUserProfile,
    postNewCard,
    putLike,
    deleteLike,
    deleteCard,
    updateUserAvatar,
}
