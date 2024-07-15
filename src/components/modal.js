function toggleEscEventHandler(action) {
    if (action === 'add') {
        document.addEventListener('keydown', closeModalOnEsc)
        document.addEventListener('mousedown', closeModalOnOverlayClick)
    } else if (action === 'remove') {
        document.removeEventListener('keydown', closeModalOnEsc)
        document.removeEventListener('mousedown', closeModalOnOverlayClick)
    }
}

function closeModalOnOverlayClick(event) {
    if (event.target.classList.contains('popup_is-opened'))
        closeModal(event.target)
}

function closeModalOnEsc(event) {
    if (event.key === 'Escape')
        closeModal(document.querySelector('.popup_is-opened'))
}

export function openModal(popup) {
    popup.classList.add('popup_is-opened')
    popup.classList.remove('popup_is-animated')
    toggleEscEventHandler('add')
}

export function closeModal(popup) {
    popup.classList.remove('popup_is-opened')
    popup.classList.add('popup_is-animated')
    toggleEscEventHandler('remove')
}
