import React from "react";
import styles from "./SearchBar.module.css";

function SearchBar({ searchTerm, onSearchChange, onSearchSubmit }) {
  return (
    <form onSubmit={onSearchSubmit} className={styles.SearchBar}>
      <input
        type="text"
        value={searchTerm}
        onChange={onSearchChange}
        placeholder="Search for a song to add"
        className={styles.input}
      />
      <button type="submit" className={styles.button}>
        Search
      </button>
    </form>
  );
}

export default SearchBar;
