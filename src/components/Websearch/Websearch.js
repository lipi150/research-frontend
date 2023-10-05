import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import './Websearch.css';
import { BsGlobe2 } from 'react-icons/bs';
import { MdOpenInNew } from 'react-icons/md';
import { copyToClipboard } from '../Copytoclipboard/Cpytoclipboard';

const Websearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isRateLimited, setIsRateLimited] = useState(false);
  const [isOpen, setIsOpen] = useState(true);

  const inputRef = useRef(null);

  const toggleBar = () => {
    setIsOpen(!isOpen);
    console.log(isOpen)
  };
  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      // Call your onEnter function here
      makeRequest();
      console.log('ENTER KEY IS PRESSED')
    }
  };
  useEffect(() => {
    const inputElement = inputRef.current;

    if (inputElement) {
      inputElement.addEventListener('keydown', handleKeyDown);
    }

    // Cleanup: Remove the event listener when the component unmounts
    return () => {
      if (inputElement) {
        inputElement.removeEventListener('keydown', handleKeyDown);
      }
    };
  }, [handleKeyDown]);

 
  const apiUrl = 'https://api.gyanibooks.com/search_publication/';

  const handleInputChange = (e) => {
    setInputValue(e.target.value);
  };

  const makeRequest = async () => {
    if (isRateLimited) {
      return; // Do not make a request if rate-limited
    }

    try {
      const response = await axios.post(apiUrl, {
        keyword: inputValue,
        limit: 10,
      });
      console.log(response.data);
      setSearchResults(response.data);
    } catch (error) {
      if (error.response && error.response.status === 429) {
        setIsRateLimited(true); // Set rate limit flag
        const retryAfter = parseInt(error.response.headers['retry-after'], 10) || 1;
        console.log(`Rate limited. Retrying after ${retryAfter} seconds...`);
        setTimeout(() => {
          setIsRateLimited(false); // Reset rate limit flag after waiting
          makeRequest(); // Retry the request
        }, retryAfter * 1000);
      } else {
        console.error('An error occurred:', error.message);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent the default form submission behavior
    await makeRequest(); // Call the makeRequest function to initiate the API request
  };
  

  const handleCopyClick = (textToCopy) => {
    copyToClipboard(textToCopy);
    alert('Text copied to clipboard from OtherComponent');
  };

  return (

    <div className={`web ${isOpen ? 'close' : 'open'}`}>
      <div className='web-icon' onClick={toggleBar}>
        <BsGlobe2 />
        
      </div>
      <div className='research'>Research</div>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          placeholder='Search...'
          value={inputValue}
          onChange={handleInputChange}
          ref={inputRef}
        />
        <button type='submit'>Search</button>
      </form>

      {/* Display search results */}
      <div >
        <h2>Search Results:</h2>
        <div className='main--search'>
        <ul>
  {Array.isArray(searchResults.data) && searchResults.data.length > 0 ? (
    searchResults.data.map((result) => (
      <div key={result.paperId}>
        <div className='search--result'>
          <div className='url'>{result.url}
            <a href={result.url}><i><MdOpenInNew /></i></a>
          </div>
          <div className='border'></div>
          <li className='title'>{result.title}</li>
          <li>{result.abstract}</li>
        </div>
        <div className='copy--btn'>
          <button onClick={() => handleCopyClick(result.abstract)}>Copy content</button>
        </div>
      </div>
    ))
  ) :(
    null
  )    
}
{!Array.isArray(searchResults.data) || searchResults.data.length === 0 ? (
  <li id='no--result'>No results found <span>!</span></li>
) : null}


</ul>

        </div>
      </div>
    </div>
  );

};

export default Websearch;
