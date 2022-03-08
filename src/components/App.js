import Header from "./Header";
import Main from "./Main";
import Footer from "./Footer";
import { useState, useEffect } from "react";
import ImagePopup from "./ImagePopup";

import { CurrentUserContext } from "../contexts/CurrentUserContext";
import api from "../utils/api";
import EditProfilePopup from "./EditProfilePopup";
import EditAvatarPopup from "./EditAvatarPopup";
import AddPlacePopup from "./AddPlacePopup";

function App() {
    const [isEditProfilePopupOpen, setIsEditProfilePopupOpen] = useState(false);
    const [isAddPlacePopupOpen, setIsAddPlacePopupOpen] = useState(false);
    const [isEditAvatarPopupOpen, setIsEditAvatarPopupOpen] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const [currentUser, setCurrentUser] = useState({});
    const [cards, setCards] = useState([]);

    useEffect((() => {
        Promise.all([api.getInitialCards(), api.getUserInfo()])
            .then(([card, userInfo]) => {
                setCards(card);
                setCurrentUser(userInfo);
            })
            .catch((err) => {
                console.error("Что-то пошло не так: " + err);
            });
    }), []);

    function handleUpdateUser(data) {
        api.updateUserInfo(data)
            .then((newInfoUser) => {
                setCurrentUser(newInfoUser);
                closeAllPopups();
            })
            .catch((err) => {
                console.error("Ошибка обновления данных о пользователе: " + err)
            })
    }

    function handleUpdateAvatar(data) {
        api.updateUserAvatar(data)
            .then((newInfoUser) => {
                setCurrentUser(newInfoUser);
                closeAllPopups();
            })
            .catch((err) => {
                console.error("Ошибка обновления данных о пользователе: " + err)
            })
    }

    function handleNewCard(data) {
        api.addNewCard(data)
            .then((res) => {
                setCards([res, ...cards,]);
                closeAllPopups();
            })
            .catch(err => {
                console.error('Ошибка добавления новой карточки: ' + err)
            })
    }

    function handleCardLike(card) {
        const isLiked = card.likes.some(i => i._id === currentUser._id);

        if (!isLiked) {
            api.addCardLike(card._id)
                .then((newCard) => {
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                })
                .catch(err => {
                    console.error('Ошибка установки лайка: ' + err)
                })
        } else {
            api.deleteCardLike(card._id)
                .then((newCard) => {
                    setCards((state) => state.map((c) => c._id === card._id ? newCard : c));
                })
                .catch(err => {
                    console.error('Ошибка установки лайка: ' + err)
                })
        }
    }

    function handleCardDelete(card) {
        api.deleteCard(card._id)
            .then(() => {
                setCards((cards) => cards.filter((c) => c._id !== card._id));
            })
            .catch((err) => {
                console.error("Ошибка удаления карточки " + err);
            });
    }

    function handleEditAvatarClick() {
        setIsEditAvatarPopupOpen(true);
    }

    function handleEditProfileClick() {
        setIsEditProfilePopupOpen(true);
    }

    function handleAddPlaceClick() {
        setIsAddPlacePopupOpen(true);
    }

    function handleCardClick(card) {
        setSelectedCard(card);
    }

    function closeAllPopups() {
        setIsAddPlacePopupOpen(false);
        setIsEditProfilePopupOpen(false);
        setIsEditAvatarPopupOpen(false);
        setSelectedCard(null);
    }

    return (
        <CurrentUserContext.Provider value={currentUser}>
            <div className="root__block">
                <Header />
                <Main
                    onEditProfile={handleEditProfileClick}
                    onAddPlace={handleAddPlaceClick}
                    onEditAvatar={handleEditAvatarClick}
                    onCardClick={handleCardClick}
                    onLikeCard={handleCardLike}
                    onCardDelete={handleCardDelete}
                    cards={cards}
                />
                <Footer />
            </div>

            <EditProfilePopup isOpen={isEditProfilePopupOpen} onClose={closeAllPopups} onUpdateUser={handleUpdateUser} />
            <EditAvatarPopup isOpen={isEditAvatarPopupOpen} onClose={closeAllPopups}
                onUpdateAvatar={handleUpdateAvatar} />
            <AddPlacePopup isOpen={isAddPlacePopupOpen} onClose={closeAllPopups} onAddNewCard={handleNewCard} />

            <ImagePopup
                card={selectedCard}
                onClose={closeAllPopups}
            />

            <div className="popup popup_card-delete">
                <div className="popup__container">
                    <h2 className="popup__title">Вы уверены?</h2>
                    <form name="profile-form" action="#" className="popup__form">
                        <button className="popup__submit-btn popup__delete-btn" type="submit">Да</button>
                    </form>
                    <button className="popup__close-btn" type="button" />
                </div>
            </div>
        </CurrentUserContext.Provider>
    );
}

export default App;
