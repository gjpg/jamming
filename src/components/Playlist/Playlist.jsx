import { useState } from "react";
import styles from "./Playlist.module.css";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";

export default function Playlist({
  tracks,
  onRemoveTrack,
  onSavePlaylist,
  loading,
}) {
  const [playlistName, setPlaylistName] = useState("");
  const [error, setError] = useState(false);
  if (loading) {
    return <div>Loading user data...</div>;
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!playlistName.trim()) {
      setError(true);
      return;
    }
    onSavePlaylist(playlistName);
  };

  return (
    <div className={styles.playlist}>
      <form onSubmit={handleSubmit} className={styles.playlistForm}>
        <input
          type="text"
          className={`${styles.playlistInput} ${error ? styles.error : ""}`}
          placeholder="New Playlist"
          value={playlistName}
          onChange={(e) => {
            setPlaylistName(e.target.value.slice(0, 100));
            setError(false);
          }}
        />
        <button
          type="submit"
          className={styles.saveButton}
          disabled={!playlistName.trim()}
        >
          Save Playlist to Spotify
        </button>
      </form>
      <div className={styles.playlistTracks}>
        {tracks.map((track) => (
          <TrackSearchResult
            key={track.uri}
            track={track}
            variant="remove"
            onButtonClick={() => onRemoveTrack(track)}
          />
        ))}
      </div>
    </div>
  );
}
