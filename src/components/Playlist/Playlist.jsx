import { useState } from "react";
import styles from "./Playlist.module.css";
import TrackSearchResult from "../TrackSearchResult/TrackSearchResult";

function formatDuration(ms) {
  const totalSeconds = Math.floor(ms / 1000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  const parts = [];
  if (hours) parts.push(`${hours} ${hours === 1 ? "hour" : "hours"}`);
  if (minutes) parts.push(`${minutes} ${minutes === 1 ? "minute" : "minutes"}`);
  if (seconds) parts.push(`${seconds} ${seconds === 1 ? "second" : "seconds"}`);
  return parts.join(", ");
}

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

  const totalDurationMs = tracks.reduce((sum, track) => sum + track.duration, 0);
  const totalDurationText = formatDuration(totalDurationMs);

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
        <div className={styles.totalDuration}>{totalDurationText}</div>
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
