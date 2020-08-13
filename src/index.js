import Card from './components/Card.js'; // Класс card для создания карточек
import FormValidator from './components/FormValidator.js'; //Класс для валидации формы
import initialCards from './utils/startupCardsArray.js'; // Модуль с первичными карточками
import PopupWithForm from './components/PopupWithForm.js';
import PopupWithImage from './components/PopupWithImage.js';
import Section from './components/Section.js';
import UserInfo from './components/UserInfo.js';

function createCard(cardData) {
    const popupImage = new PopupWithImage(".popup_type-imgZoom", { title: cardData.title, src: cardData.src })
    return new Card({ title: cardData.title, src: cardData.src }, '#card-template', () => {
        popupImage.open();
    }).generateCard();
}

const cardsContainer = new Section({items: initialCards, renderer: (itemData) => {
    return createCard(itemData);
}}, ".cards");

cardsContainer.renderItems();

const popupCard = new PopupWithForm('.popup-card', (inputData) => {
    cardsContainer.addItem(createCard(inputData))
});

const profileUserInfo = new UserInfo({ userNameSelector: ".profile__title", userInfoSelector: ".profile__subtitle" });

const popupProfile = new PopupWithForm('.popup-profile', (inputData) => {
    profileUserInfo.setUserInfo(inputData);
    popupProfile.close();
});

const popupArray = Array.from(document.querySelectorAll('.popup'));//массив со всеми popup

const cardsArea = document.querySelector(".cards");

const profile = document.querySelector(".profile");

const profileContent = {
    btnEdit: profile.querySelector(".profile__button_type_edit"),
    btnAdd: profile.querySelector(".profile__button_type_add"),
    title: profile.querySelector(".profile__title"),
    subtitle: profile.querySelector(".profile__subtitle")
};


const popupFormClasses = {
    formSelector: '.popup__window',
    inputSelector: '.popup__input',
    submitButtonSelector: '.popup__button_type_save',
    inactiveButtonClass: 'popup__button_state-disabled',
    inputErrorClass: 'popup__input_validity-invalid',
};

// const popupCardFormValidator = new FormValidator(popupFormClasses, popupCardContent.form);
// const popupProfileFormValidator = new FormValidator(popupFormClasses, popupProfileContent.form);

// popupCardFormValidator.enableValidation();
// popupProfileFormValidator.enableValidation();

//Проверка что popup запущен
function isPopupActive(popup) {
    return !popup.classList.contains('popup_visibility-hidden')
}

//Переключить состояние popup
function togglePopup(popup) {
    popup.classList.toggle('popup_visibility-hidden');
    popup.addEventListener('keydown', keyClosePopup);
}

//Установка новых данных profile
function setProfileData(event) {
    event.preventDefault();
    profileContent.title.textContent = popupProfileContent.firstInput.value;
    profileContent.subtitle.textContent = popupProfileContent.secondInput.value;
    togglePopup(popupProfile);
}

//Заполнение popup для profile
function fillProfilePopup() {
    popupProfileContent.firstInput.value = profileContent.title.textContent;
    popupProfileContent.secondInput.value = profileContent.subtitle.textContent;
}

//Отображение popup для profile
function createProfilePopup() {
    fillProfilePopup();
    popupProfileFormValidator.hideAllValidationMessages();//Перед показом карточки, прячем все срообщения об ошибке    
    togglePopup(popupProfile);
}

//Заполнить приближение изображения
function fillImageZoom(img) {
    const alt = img.getAttribute("alt");
    popupImageZoomContent.subtitle.textContent = alt;
    popupImageZoomContent.image.alt = alt;
    popupImageZoomContent.image.src = img.src;
}

//Приблизить изображение
function zoomImage(event) {
    if (event.target.classList.contains('card__image')) {
        fillImageZoom(event.target);
        togglePopup(popupImageZoom);
    }
}

//Добавление карты в грид на первую позицию
function appendCardFirst(Card) {
    cardsArea.insertBefore(Card, cardsArea.firstChild)
}

//Отображения popup для card
function createCardPopup() {
    popupCardFormValidator.hideAllValidationMessages();//Перед показом карточки, прячем все срообщения об ошибке
    togglePopup(popupCard);
}

//Добавление новой карточки в блок карт
function addNewCard(event) {
    event.preventDefault()
    appendCardFirst(new Card({ title: popupCardContent.firstInput.value, src: popupCardContent.secondInput.value }, '#card-template').generateCard());
    togglePopup(popupCard);
    popupCardContent.form.reset();//Очистка формы
}

function closePopupCard(e) {
    e.preventDefault();
    togglePopup(popupCard);
}

function closePopupProfile(e) {
    e.preventDefault();
    togglePopup(popupProfile);
}

function closePopupImgZoom(e) {
    e.preventDefault();
    togglePopup(popupImageZoom);
}

//Закрыть popup клавишей
function keyClosePopup(evt) {
    if (evt.key === "Escape") {
        popupArray.forEach((popupElement) => {
            if (isPopupActive(popupElement)) {
                togglePopup(popupElement);
                document.removeEventListener('keydown', keyClosePopup);
                return;
            }
        });
    }
}

profileContent.btnAdd.addEventListener("click", () => { popupCard.open() });

profileContent.btnEdit.addEventListener("click", () => {
    const userInfo = profileUserInfo.getUserInfo();
    popupProfile.popup.querySelector('.popup__input-title').value = userInfo.userName;
    popupProfile.popup.querySelector('.popup__input-subtitle').value = userInfo.userInfo;
    popupProfile.open();
});

// popupProfileContent.btnExit.addEventListener("click", closePopupProfile);
// popupProfile.addEventListener('submit', setProfileData);

// popupCardContent.btnExit.addEventListener("click", closePopupCard);
// popupCard.addEventListener('submit', addNewCard);

// popupImageZoomContent.btnExit.addEventListener('click', closePopupImgZoom);

// cardsArea.addEventListener('click', zoomImage);

// popupArray.forEach((popupElement) => {
//     popupElement.addEventListener('click', backgrndClosePopup);
// });
