import React, { useState } from 'react';
import FlashcardsContainer from '../flashcards-container/flashcards-container.component';
import deckData from '../../data/data';
import './grammCracker-styles.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCookieBite } from '@fortawesome/free-solid-svg-icons';

function GrammCracker() {
  const [deck, setDeck] = useState(deckData);

  const deckContainers = deck.map((deck, i) => {
    return (
      <li key={i}>
        <FlashcardsContainer
          deck={deck.cards}
          deckNumber={i}
          deckName={deck.name}
        />
      </li>
    );
  });

  return (
    <div className="GrammCracker">
      <h1>
        Gramm-Cracker <FontAwesomeIcon icon={faCookieBite} />
      </h1>
      <p>Number of Decks: {deck.length}</p>
      <div className="mainContainer">
        <ul>{deckContainers}</ul>
      </div>
    </div>
  );
}

export default GrammCracker;
