import React from "react";
import styles from "./Track.module.css";

function Track({ track, onAdd, onRemove, action }) {
  return (
    <div className={styles.track}>
      <div className={styles.info}>
        <p className={styles.name}>{track.name}</p>
        <p className={styles.artist}>{track.artist}</p>
      </div>
      <button
        className={`${styles.button} ${
          action === "add" ? styles.add : styles.remove
        }`}
        onClick={action === "add" ? () => onAdd(track) : () => onRemove(track)}
      >
        {action === "add" ? "+" : "-"}
      </button>
    </div>
  );
}

export default Track;
