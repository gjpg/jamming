import styles from "./TrackSearchResult.module.css";

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

export default function TrackSearchResult({
  track,
  variant = "add",
  onButtonClick,
}) {
  return (
    <div className={styles.track}>
      <img src={track.albumUrl} className={styles.albumArt} alt="Album cover" />
      <div className={styles.trackInfo}>
        <div className={styles.title}>{track.title}</div>
        <div className={styles.artist}>{track.artist}</div>
      </div>
      <div className={styles.trackControls}>
        <div className={styles.duration}>{formatDuration(track.duration)}</div>
        <button
          className={variant === "add" ? styles.addButton : styles.removeButton}
          onClick={onButtonClick}
        >
          {variant === "add" ? "+" : "-"}
        </button>
      </div>
    </div>
  );
}
