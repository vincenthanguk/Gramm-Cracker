import React, { useState, useEffect, useContext } from 'react';
import { UserContext } from '../../context/UserContext';
import StudyFlashcard from '../studyFlashcard/studyFlashcard-component';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheck } from '@fortawesome/free-solid-svg-icons';
import { faTimes } from '@fortawesome/free-solid-svg-icons';
import { faSync } from '@fortawesome/free-solid-svg-icons';

import './study-styles.css';

function Study(props) {
  const { deck, deckName, deckId } = props;

  const [userContext, setUserContext] = useContext(UserContext);
  const [studyDeck, setStudyDeck] = useState(deck);
  const [currentCard, setCurrentCard] = useState([]);
  const [correct, setCorrect] = useState([]);
  const [wrong, setWrong] = useState([]);
  const [cardIsRevealed, setCardIsRevealed] = useState(false);
  const [timerSeconds, setTimerSeconds] = useState(0);
  const [timerIsActive, setTimerIsActive] = useState(true);

  useEffect(() => setCurrentCard(generateRandomCard()), [studyDeck]);

  useEffect(() => {
    let interval = null;
    if (timerIsActive) {
      interval = setInterval(() => {
        setTimerSeconds((seconds) => seconds + 1);
      }, 1000);
    } else if (!timerIsActive && timerSeconds !== 0) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [timerIsActive, timerSeconds]);

  useEffect(() => {
    if (studyDeck.length === 0) {
      console.log(`Total Cards Studied: ${correct.length} + ${wrong.length}`);
      console.log(`Total Time Elapsed: ${timerSeconds}`);
      console.log('deactivating timer');
      setTimerIsActive(false);
      submitSession();
      return;
    } else {
      return;
    }
  }, [studyDeck]);

  // everytime the studydeck is changed, a new random card is selected as currentCard
  const generateRandomCard = () => {
    const ranNum = Math.floor(Math.random() * studyDeck.length);
    const card = studyDeck[ranNum];
    return card;
  };

  const submitSession = async () => {
    await fetch(process.env.REACT_APP_API_ENDPOINT + 'studysession', {
      method: 'POST',
      credentials: 'include',
      // SameSite: 'none',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userContext.token}`,
      },
      body: JSON.stringify({
        totalCards: correct.length + wrong.length,
        correctCards: correct.length,
        wrongCards: wrong.length,
        totalTime: timerSeconds,
        user: userContext.details._id,
        deck: deckId,
      }),
    });
  };

  const cardCorrect = (card) => {
    setCorrect((oldState) => [...oldState, card]);
    removeCard(card);
    hideCard();
  };

  const cardWrong = (card) => {
    setWrong((oldState) => [...oldState, card]);
    removeCard(card);
    hideCard();
  };

  const removeCard = (card) => {
    setStudyDeck(studyDeck.filter((item) => item._id !== card._id));
  };

  const resetDecks = () => {
    setStudyDeck(deck);
    setCorrect([]);
    setWrong([]);
    hideCard();
    setTimerSeconds(0);
    setTimerIsActive(true);
  };

  const revealCard = () => {
    setCardIsRevealed(true);
  };

  const hideCard = () => {
    setCardIsRevealed(false);
  };

  return (
    <div className="Study">
      <h1>Studying Deck "{deckName}"</h1>
      <div className="overview">
        <table>
          <tbody>
            <tr>
              <td>???: {timerSeconds}</td>
              <td>????: {studyDeck.length}</td>
              <td>???: {correct.length}</td>
              <td>???: {wrong.length}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div className="card">
        {currentCard && timerIsActive ? (
          <StudyFlashcard
            cardId={currentCard.cardId}
            front={currentCard.cardFront}
            back={currentCard.cardBack}
            reveal={cardIsRevealed}
          />
        ) : (
          'Finished Deck!'
        )}
      </div>
      <div className="buttons">
        {!cardIsRevealed && currentCard && (
          <button onClick={() => revealCard()}>Show!</button>
        )}
        {cardIsRevealed && (
          <>
            <button onClick={() => cardCorrect(currentCard)}>
              <FontAwesomeIcon icon={faCheck} />
            </button>
            <button onClick={() => cardWrong(currentCard)}>
              <FontAwesomeIcon icon={faTimes} />
            </button>
          </>
        )}
        {!currentCard && (
          <button onClick={() => resetDecks()}>
            <FontAwesomeIcon icon={faSync} />
          </button>
        )}
      </div>
    </div>
  );
}

export default Study;
