import React, { useState, useEffect } from "react";
import SearchBar from "../SearchBar/SearchBar";
import Track from "../Track/Track";
import Playlist from "../Playlist/Playlist";
import styles from "./App.module.css";

function App() {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]); // No more mock data
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("New Playlist");
  const [isSearching, setIsSearching] = useState(false); // Loading state
  const [searchAttempted, setSearchAttempted] = useState(false); // Track if search was tried
  const [nameError, setNameError] = useState(false); // Add this line
  const [emptyPlaylistError, setEmptyPlaylistError] = useState(false); // New state

  const handleSearchSubmit = async (e) => {
    e.preventDefault();
    if (!searchTerm.trim()) return;
    setSearchAttempted(true); // Mark that a search was attempted

    setIsSearching(true);

    try {
      // Mock API call (replace with real Spotify API later)
      const mockResults = await new Promise((resolve) => {
        setTimeout(
          () =>
            resolve([
              { id: "1", name: "Song 1", artist: "Artist 1" },
              { id: "2", name: "Song 2", artist: "Artist 2" },
            ]),
          500
        ); // Simulate network delay
      });

      setSearchResults(mockResults);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setIsSearching(false);
    }
  };

  const addTrack = (track) => {
    // Add to playlist
    setPlaylistTracks([...playlistTracks, track]);
    // Remove from search results
    setSearchResults(searchResults.filter((t) => t.id !== track.id));
  };

  const removeTrack = (track) => {
    // Remove from playlist
    setPlaylistTracks(playlistTracks.filter((t) => t.id !== track.id));
    // Add back to search results (if not already there)
    if (!searchResults.some((t) => t.id === track.id)) {
      setSearchResults([...searchResults, track]);
    }
  };

  const handleSavePlaylist = () => {
    const isNameEmpty = !playlistName.trim();
    const isPlaylistEmpty = playlistTracks.length === 0;

    setNameError(isNameEmpty);
    setEmptyPlaylistError(isPlaylistEmpty);

    if (isNameEmpty || isPlaylistEmpty) return;

    console.log("Saving to Spotify:", playlistName, playlistTracks);
    // API logic here
  };

  // Add this handler
  const handleNameChange = (e) => {
    setPlaylistName(e.target.value);
    if (nameError) setNameError(false); // Reset error on typing
  };

  useEffect(() => {
    if (emptyPlaylistError && playlistTracks.length > 0) {
      setEmptyPlaylistError(false);
    }
  }, [playlistTracks]);

  return (
    <div className={styles.app}>
      <SearchBar
        searchTerm={searchTerm}
        onSearchChange={(e) => setSearchTerm(e.target.value)}
        onSearchSubmit={handleSearchSubmit}
      />

      <div className={styles.content}>
        {/* Search Results */}
        <div className={styles.section}>
          <h2>Results</h2>
          {isSearching ? (
            <p>Searching...</p>
          ) : // Only show tracks or "No results" AFTER first search
          searchResults.length > 0 ? (
            searchResults.map((track) => (
              <Track
                key={track.id}
                track={track}
                onAdd={addTrack}
                action="add"
              />
            ))
          ) : (
            // Only show "No results" if search was attempted
            searchAttempted && <p>No results found</p>
          )}
        </div>
        <div className={styles.section}>
          {/* Playlist */}
          <Playlist
            playlistName={playlistName}
            onNameChange={handleNameChange} // Updated handler
            onSave={handleSavePlaylist}
            tracks={playlistTracks}
            onRemove={removeTrack}
            nameError={nameError} // Pass error state
            emptyPlaylistError={emptyPlaylistError}
          />
        </div>
      </div>
    </div>
  );
}

export default App;
