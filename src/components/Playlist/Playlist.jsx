import React from "react";
import Track from "../Track/Track";
import styles from "./Playlist.module.css";

function Playlist({
  playlistName,
  onNameChange,
  onSave,
  tracks,
  onRemove,
  nameError,
  emptyPlaylistError, // Receive new prop
}) {
  return (
    <div className={styles.playlist}>
      <input
        type="text"
        value={playlistName}
        onChange={onNameChange}
        placeholder="Playlist Name"
        className={`${styles.input} ${nameError ? styles.error : ""}`}
      />

      {tracks.map((track) => (
        <Track
          key={track.id}
          track={track}
          onRemove={onRemove}
          action="remove"
        />
      ))}

      <button onClick={onSave} className={styles.saveButton}>
        Save to Spotify
      </button>

      {/* Priority: Empty playlist error overrides name error */}
      {emptyPlaylistError ? (
        <p className={styles.errorMessage}>Your playlist is empty</p>
      ) : nameError ? (
        <p className={styles.errorMessage}>Your playlist needs a name</p>
      ) : null}
    </div>
  );
}

export default Playlist;
