import React from 'react';
import './SearchResult.css';

function SearchResult({ result }) {
  const [docName, similarity] = result;

  return (
    <tr>
      
      <td>{docName}</td>
      <td>{similarity}</td>
    </tr>
  );
}

export default SearchResult;
