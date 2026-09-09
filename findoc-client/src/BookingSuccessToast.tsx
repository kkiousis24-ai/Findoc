import {
  useEffect,
  useRef,
  useState,
} from "react";

function BookingSuccessToast() {
  const [
    visible,
    setVisible,
  ] = useState(false);

  const [
    message,
    setMessage,
  ] = useState(
    "Το ραντεβού έκλεισε επιτυχώς!"
  );

  const timerRef =
    useRef<number | null>(
      null
    );

  const successWasVisibleRef =
    useRef(false);

  useEffect(() => {
    function checkBookingSuccess() {
      const successMessage =
        document.querySelector(
          ".booking-message.success"
        );

      if (!successMessage) {
        successWasVisibleRef.current =
          false;

        return;
      }

      const text =
        successMessage.textContent
          ?.trim();

      if (
        !text ||
        successWasVisibleRef.current
      ) {
        return;
      }

      successWasVisibleRef.current =
        true;

      setMessage(text);

      setVisible(true);

      if (
        timerRef.current !==
        null
      ) {
        window.clearTimeout(
          timerRef.current
        );
      }

      timerRef.current =
        window.setTimeout(
          () => {
            setVisible(false);
          },
          3500
        );
    }

    checkBookingSuccess();

    const observer =
      new MutationObserver(
        checkBookingSuccess
      );

    observer.observe(
      document.body,
      {
        childList: true,
        subtree: true,
        characterData: true,
      }
    );

    return () => {
      observer.disconnect();

      if (
        timerRef.current !==
        null
      ) {
        window.clearTimeout(
          timerRef.current
        );
      }
    };
  }, []);

  if (!visible) {
    return null;
  }

  return (
    <div
      className="booking-success-toast"
      role="status"
      aria-live="polite"
    >
      <div className="booking-success-toast-icon">
        ✓
      </div>

      <div className="booking-success-toast-content">
        <strong>
          {message}
        </strong>

        <small>
          Η κράτηση καταχωρήθηκε
          επιτυχώς στο Findoc.
        </small>
      </div>
    </div>
  );
}

export default BookingSuccessToast;