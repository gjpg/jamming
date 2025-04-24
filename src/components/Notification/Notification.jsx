import { useEffect } from "react";
import styles from "./Notification.module.css";

export default function Notification({ message, isError, onClose }) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(), 3000);
    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <div
      className={`${styles.notification} ${
        isError ? styles.error : styles.success
      }`}
    >
      {message}
    </div>
  );
}
