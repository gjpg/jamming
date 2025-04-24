import styles from "./TrackSearchResult.module.css";

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
      <button
        className={variant === "add" ? styles.addButton : styles.removeButton}
        onClick={onButtonClick}
      >
        {variant === "add" ? "+" : "-"}
      </button>
    </div>
  );
}
