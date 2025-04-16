import React from 'react';

function SearchBar({ searchTerm, onSearchChange, onSearchSubmit }) {
    return (
      <form onSubmit={onSearchSubmit}>
        <input
          type="text"
          value={searchTerm}
          onChange={onSearchChange}
          placeholder="Search for a song to add"
        />
        <button type="submit">Search</button>
      </form>
    );
  }

export default SearchBar;