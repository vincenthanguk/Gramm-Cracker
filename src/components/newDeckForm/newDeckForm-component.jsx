import React, { useState, useContext } from 'react';
import axios from 'axios';
import { UserContext } from '../../context/UserContext';

function NewDeckForm(props) {
  const [userContext, setUserContext] = useContext(UserContext);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [deckName, setDeckName] = useState('');
  const { fetchData, handleFlash, toggle } = props;

  const handleSubmit = async (e) => {
    try {
      e.preventDefault();
      setIsSubmitting(true);
      // make axios post request
      const response = await axios.post('http://localhost:8000/api/v1/decks', {
        name: deckName,
        user: userContext.details._id,
      });
      console.log(response);
      // change of state most come before toggle (toggle unmounts the component)
      await fetchData();
      handleFlash('success', 'Deck created!', 2000);
      setIsSubmitting(false);
      toggle();
    } catch (err) {
      console.log(err);
      handleFlash('error', 'Oops, something went wrong!', 2000);
      setIsSubmitting(false);
      setDeckName('');
    }
  };

  return (
    <>
      <form onSubmit={handleSubmit}>
        <label htmlFor="deckName">Deck Name:</label>
        <input
          type="text"
          name="deckName"
          id="deckName"
          required
          value={deckName}
          onChange={(e) => setDeckName(e.target.value)}
        ></input>
        <button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Submit'}
        </button>
      </form>
    </>
  );
}

export default NewDeckForm;
