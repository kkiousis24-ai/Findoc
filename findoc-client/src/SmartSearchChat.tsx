import {
  useEffect,
  useRef,
  useState,
} from "react";
import type {
  FormEvent,
} from "react";

/* =====================================================
   TYPES
===================================================== */

interface Doctor {
  id: number;
  firstName: string;
  lastName: string;
  specialty: string;
  subspecialty: string;
  city: string;
  area: string;
  address: string;
  consultationPrice: number;
  yearsOfExperience: number;
  rating: number;
  reviewCount: number;
  acceptsInsurance: boolean;
  insuranceProviders: string;
  offersOnlineConsultation: boolean;
  isVerified: boolean;
  languages: string;
}

interface SmartSearchInterpretation {
  specialty: string | null;
  city: string | null;
  area: string | null;
  maxPrice: number | null;
  minRating: number | null;
  acceptsInsurance: boolean | null;
  insurance: string | null;
  online: boolean | null;
  language: string | null;
  verified: boolean | null;
  sort: string;
}

interface SmartSearchResponse {
  originalQuery: string;

  interpreted:
    SmartSearchInterpretation;

  resultCount: number;

  doctors: Doctor[];
}

interface ChatMessage {
  id: string;

  role:
    | "assistant"
    | "user";

  text: string;

  doctors?: Doctor[];
}

/* =====================================================
   CONFIG
===================================================== */

const API_URL =
  import.meta.env.VITE_API_URL ??
  "http://localhost:5087";

/* =====================================================
   LABELS
===================================================== */

const specialtyLabels:
  Record<string, string> = {
  Cardiologist: "Καρδιολόγος",
  Dermatologist: "Δερματολόγος",
  Neurologist: "Νευρολόγος",
  Pediatrician: "Παιδίατρος",
  Orthopedic: "Ορθοπαιδικός",
};

const cityLabels:
  Record<string, string> = {
  Athens: "Αθήνα",
  Thessaloniki: "Θεσσαλονίκη",
  Patras: "Πάτρα",
  Ioannina: "Ιωάννινα",
};

/* =====================================================
   HELPERS
===================================================== */

function createMessageId() {
  return `${Date.now()}-${Math.random()}`;
}

function getSpecialtyLabel(
  specialty: string
) {
  return (
    specialtyLabels[specialty] ??
    specialty
  );
}

function getCityLabel(
  city: string
) {
  return (
    cityLabels[city] ??
    city
  );
}

/* =====================================================
   COMPONENT
===================================================== */

function SmartSearchChat() {
  const [
    isOpen,
    setIsOpen,
  ] = useState(false);

  const [
    input,
    setInput,
  ] = useState("");

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([
    {
      id: createMessageId(),

      role: "assistant",

      text:
        "Γεια σου! 👋 Είμαι ο Findoc Assistant. Πες μου τι γιατρό ψάχνεις, σε ποια περιοχή και ό,τι άλλο σε ενδιαφέρει.",
    },
  ]);

  const messagesEndRef =
    useRef<HTMLDivElement | null>(
      null
    );

  /* ===================================================
     AUTO SCROLL
  =================================================== */

  useEffect(() => {
    messagesEndRef.current
      ?.scrollIntoView({
        behavior: "smooth",
      });
  }, [
    messages,
    loading,
    isOpen,
  ]);

  /* ===================================================
     SEARCH
  =================================================== */

  async function sendMessage(
    event?: FormEvent
  ) {
    event?.preventDefault();

    const query =
      input.trim();

    if (
      !query ||
      loading
    ) {
      return;
    }

    const userMessage:
      ChatMessage = {
      id: createMessageId(),

      role: "user",

      text: query,
    };

    setMessages(
      current => [
        ...current,
        userMessage,
      ]
    );

    setInput("");
    setLoading(true);

    try {
      const response =
        await fetch(
          `${API_URL}/api/doctors/smart-search?query=${encodeURIComponent(
            query
          )}`
        );

      if (!response.ok) {
        throw new Error(
          "Smart search request failed"
        );
      }

      const data:
        SmartSearchResponse =
        await response.json();

      if (
        data.resultCount === 0
      ) {
        setMessages(
          current => [
            ...current,

            {
              id:
                createMessageId(),

              role:
                "assistant",

              text:
                "Δεν βρήκα γιατρό που να ταιριάζει ακριβώς σε αυτά τα κριτήρια. Δοκίμασε να αλλάξεις περιοχή, τιμή ή κάποια άλλη προϋπόθεση.",
            },
          ]
        );

        return;
      }

      const resultText =
        data.resultCount === 1
          ? "Βρήκα 1 γιατρό που ταιριάζει σε αυτό που ζήτησες:"
          : `Βρήκα ${data.resultCount} γιατρούς που ταιριάζουν σε αυτό που ζήτησες:`;

      setMessages(
        current => [
          ...current,

          {
            id:
              createMessageId(),

            role:
              "assistant",

            text:
              resultText,

            doctors:
              data.doctors,
          },
        ]
      );
    } catch (error) {
      console.error(
        "Findoc Assistant error:",
        error
      );

      setMessages(
        current => [
          ...current,

          {
            id:
              createMessageId(),

            role:
              "assistant",

            text:
              "Δεν κατάφερα να επικοινωνήσω με το Findoc αυτή τη στιγμή. Έλεγξε ότι το backend είναι ενεργό και δοκίμασε ξανά.",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================
     NEW CHAT
  =================================================== */

  function resetChat() {
    setInput("");

    setMessages([
      {
        id:
          createMessageId(),

        role:
          "assistant",

        text:
          "Νέα αναζήτηση! Πες μου τι γιατρό χρειάζεσαι.",
      },
    ]);
  }

  /* ===================================================
     UI
  =================================================== */

  return (
    <>
      <style>
        {`
          .findoc-chat-launcher {
            position: fixed;
            right: 28px;
            bottom: 28px;
            z-index: 9998;

            width: 64px;
            height: 64px;

            display: grid;
            place-items: center;

            border: 0;
            border-radius: 22px;

            background:
              linear-gradient(
                135deg,
                #64e2ca,
                #43c3ad
              );

            color: #07352d;

            cursor: pointer;

            font-size: 27px;
            font-weight: 900;

            box-shadow:
              0 18px 50px
              rgba(
                0,
                0,
                0,
                0.36
              );

            transition:
              transform 0.18s ease,
              box-shadow 0.18s ease;
          }

          .findoc-chat-launcher:hover {
            transform:
              translateY(-3px)
              scale(1.03);

            box-shadow:
              0 22px 60px
              rgba(
                0,
                0,
                0,
                0.45
              );
          }

          .findoc-chat-window {
            position: fixed;
            right: 28px;
            bottom: 104px;
            z-index: 9999;

            width: min(
              410px,
              calc(
                100vw - 32px
              )
            );

            height: min(
              650px,
              calc(
                100vh - 145px
              )
            );

            display: flex;
            flex-direction: column;

            overflow: hidden;

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.08
              );

            border-radius: 28px;

            background: #081c18;

            box-shadow:
              0 30px 90px
              rgba(
                0,
                0,
                0,
                0.55
              );

            font-family:
              -apple-system,
              BlinkMacSystemFont,
              "Segoe UI",
              Inter,
              Arial,
              sans-serif;
          }

          .findoc-chat-header {
            min-height: 82px;

            display: flex;
            align-items: center;
            justify-content:
              space-between;

            gap: 14px;

            padding:
              16px 18px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.06
              );

            background:
              linear-gradient(
                135deg,
                #0d3029,
                #0a241f
              );
          }

          .findoc-chat-identity {
            display: flex;
            align-items: center;

            gap: 12px;
          }

          .findoc-chat-avatar {
            width: 46px;
            height: 46px;

            flex: 0 0 46px;

            display: grid;
            place-items: center;

            border-radius: 15px;

            background: #56d8bf;

            color: #07352d;

            font-size: 21px;
            font-weight: 900;
          }

          .findoc-chat-title {
            margin: 0;

            color: #ffffff;

            font-size: 15px;
            font-weight: 800;
          }

          .findoc-chat-status {
            display: flex;
            align-items: center;

            gap: 6px;

            margin-top: 4px;

            color:
              rgba(
                224,
                245,
                239,
                0.56
              );

            font-size: 11px;
          }

          .findoc-chat-status-dot {
            width: 7px;
            height: 7px;

            border-radius: 50%;

            background: #5de0c7;

            box-shadow:
              0 0 0 4px
              rgba(
                93,
                224,
                199,
                0.08
              );
          }

          .findoc-chat-header-actions {
            display: flex;
            align-items: center;

            gap: 6px;
          }

          .findoc-chat-header-button {
            width: 34px;
            height: 34px;

            display: grid;
            place-items: center;

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.07
              );

            border-radius: 11px;

            background:
              rgba(
                255,
                255,
                255,
                0.04
              );

            color:
              rgba(
                255,
                255,
                255,
                0.78
              );

            cursor: pointer;

            font-size: 15px;
          }

          .findoc-chat-messages {
            flex: 1;

            overflow-y: auto;

            padding:
              20px 16px;

            background:
              radial-gradient(
                circle at 20% 0%,
                rgba(
                  83,
                  214,
                  189,
                  0.055
                ),
                transparent 35%
              ),
              #071713;
          }

          .findoc-chat-message-row {
            display: flex;

            margin-bottom: 14px;
          }

          .findoc-chat-message-row.user {
            justify-content:
              flex-end;
          }

          .findoc-chat-message-row.assistant {
            justify-content:
              flex-start;
          }

          .findoc-chat-bubble {
            max-width: 86%;

            padding:
              12px 14px;

            border-radius: 17px;

            font-size: 13px;
            line-height: 1.55;
          }

          .findoc-chat-message-row.assistant
          .findoc-chat-bubble {
            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.055
              );

            border-bottom-left-radius:
              6px;

            background:
              #0e2923;

            color:
              rgba(
                242,
                252,
                249,
                0.9
              );
          }

          .findoc-chat-message-row.user
          .findoc-chat-bubble {
            border-bottom-right-radius:
              6px;

            background: #56d8bf;

            color: #062d26;

            font-weight: 600;
          }

          .findoc-chat-doctors {
            width: 100%;

            display: grid;

            gap: 9px;

            margin-top: 12px;
          }

          .findoc-chat-doctor {
            padding:
              12px;

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.065
              );

            border-radius: 15px;

            background:
              rgba(
                255,
                255,
                255,
                0.035
              );
          }

          .findoc-chat-doctor-top {
            display: flex;
            justify-content:
              space-between;

            gap: 12px;
          }

          .findoc-chat-doctor h4 {
            margin:
              0 0 3px;

            color: #ffffff;

            font-size: 13px;
          }

          .findoc-chat-doctor-specialty {
            color: #5edbc4;

            font-size: 11px;
            font-weight: 700;
          }

          .findoc-chat-rating {
            white-space: nowrap;

            color: #ffd16d;

            font-size: 11px;
            font-weight: 750;
          }

          .findoc-chat-doctor-meta {
            margin-top: 9px;

            color:
              rgba(
                224,
                244,
                238,
                0.58
              );

            font-size: 10.5px;
            line-height: 1.6;
          }

          .findoc-chat-doctor-footer {
            display: flex;
            align-items: center;
            justify-content:
              space-between;

            gap: 10px;

            margin-top: 10px;
          }

          .findoc-chat-price {
            color: #ffffff;

            font-size: 13px;
            font-weight: 800;
          }

          .findoc-chat-tags {
            display: flex;
            flex-wrap: wrap;
            justify-content:
              flex-end;

            gap: 5px;
          }

          .findoc-chat-tag {
            padding:
              4px 7px;

            border-radius: 999px;

            background:
              rgba(
                83,
                214,
                189,
                0.09
              );

            color: #69dfca;

            font-size: 8.5px;
            font-weight: 700;
          }

          .findoc-chat-typing {
            display: inline-flex;
            align-items: center;

            gap: 4px;
          }

          .findoc-chat-typing span {
            width: 6px;
            height: 6px;

            border-radius: 50%;

            background:
              rgba(
                255,
                255,
                255,
                0.55
              );

            animation:
              findocTyping
              1.1s infinite ease-in-out;
          }

          .findoc-chat-typing span:nth-child(2) {
            animation-delay:
              0.14s;
          }

          .findoc-chat-typing span:nth-child(3) {
            animation-delay:
              0.28s;
          }

          @keyframes findocTyping {
            0%,
            60%,
            100% {
              transform:
                translateY(0);

              opacity: 0.4;
            }

            30% {
              transform:
                translateY(-4px);

              opacity: 1;
            }
          }

          .findoc-chat-suggestions {
            display: flex;
            gap: 7px;

            overflow-x: auto;

            padding:
              11px 14px 5px;

            background: #081c18;
          }

          .findoc-chat-suggestion {
            flex: 0 0 auto;

            max-width: 210px;

            padding:
              7px 10px;

            border:
              1px solid
              rgba(
                83,
                214,
                189,
                0.13
              );

            border-radius: 999px;

            background:
              rgba(
                83,
                214,
                189,
                0.04
              );

            color:
              rgba(
                224,
                249,
                243,
                0.76
              );

            cursor: pointer;

            font-size: 9.5px;
          }

          .findoc-chat-form {
            display: flex;
            align-items: flex-end;

            gap: 9px;

            padding:
              10px 12px 12px;

            background: #081c18;
          }

          .findoc-chat-input {
            min-width: 0;
            min-height: 45px;

            flex: 1;

            padding:
              0 14px;

            border:
              1px solid
              rgba(
                255,
                255,
                255,
                0.075
              );

            border-radius: 15px;

            outline: 0;

            background:
              rgba(
                255,
                255,
                255,
                0.04
              );

            color: #ffffff;

            font-size: 12px;
          }

          .findoc-chat-input::placeholder {
            color:
              rgba(
                226,
                243,
                239,
                0.34
              );
          }

          .findoc-chat-input:focus {
            border-color:
              rgba(
                83,
                214,
                189,
                0.35
              );
          }

          .findoc-chat-send {
            width: 45px;
            height: 45px;

            flex: 0 0 45px;

            display: grid;
            place-items: center;

            border: 0;
            border-radius: 15px;

            background: #56d8bf;

            color: #07352d;

            cursor: pointer;

            font-size: 17px;
            font-weight: 900;
          }

          .findoc-chat-send:disabled {
            cursor:
              not-allowed;

            opacity: 0.45;
          }

          .findoc-chat-footer-note {
            padding:
              0 14px 10px;

            background: #081c18;

            color:
              rgba(
                226,
                243,
                239,
                0.28
              );

            text-align: center;

            font-size: 8.5px;
          }

          @media (
            max-width: 600px
          ) {
            .findoc-chat-launcher {
              right: 16px;
              bottom: 16px;

              width: 58px;
              height: 58px;

              border-radius: 19px;
            }

            .findoc-chat-window {
              right: 12px;
              bottom: 86px;

              width:
                calc(
                  100vw - 24px
                );

              height:
                min(
                  670px,
                  calc(
                    100vh - 105px
                  )
                );

              border-radius: 24px;
            }
          }
        `}
      </style>

      {/* FLOATING BUTTON */}

      <button
        type="button"
        className="findoc-chat-launcher"
        aria-label={
          isOpen
            ? "Κλείσιμο Findoc Assistant"
            : "Άνοιγμα Findoc Assistant"
        }
        onClick={() =>
          setIsOpen(
            current =>
              !current
          )
        }
      >
        {isOpen
          ? "×"
          : "✦"}
      </button>

      {/* CHAT WINDOW */}

      {isOpen && (
        <section
          className="findoc-chat-window"
          aria-label="Findoc Assistant"
        >

          {/* HEADER */}

          <header className="findoc-chat-header">

            <div className="findoc-chat-identity">

              <div className="findoc-chat-avatar">
                ♡
              </div>

              <div>
                <h3 className="findoc-chat-title">
                  Findoc Assistant
                </h3>

                <div className="findoc-chat-status">

                  <span className="findoc-chat-status-dot" />

                  Διαθέσιμος τώρα

                </div>
              </div>

            </div>

            <div className="findoc-chat-header-actions">

              <button
                type="button"
                className="findoc-chat-header-button"
                title="Νέα συνομιλία"
                onClick={resetChat}
              >
                ↻
              </button>

              <button
                type="button"
                className="findoc-chat-header-button"
                title="Κλείσιμο"
                onClick={() =>
                  setIsOpen(false)
                }
              >
                ×
              </button>

            </div>

          </header>

          {/* MESSAGES */}

          <div className="findoc-chat-messages">

            {messages.map(
              message => (
                <div
                  key={message.id}
                  className={
                    `findoc-chat-message-row ${message.role}`
                  }
                >

                  <div className="findoc-chat-bubble">

                    {message.text}

                    {message.doctors &&
                      message.doctors.length >
                        0 && (
                        <div className="findoc-chat-doctors">

                          {message.doctors
                            .slice(
                              0,
                              5
                            )
                            .map(
                              doctor => (
                                <article
                                  key={
                                    doctor.id
                                  }
                                  className="findoc-chat-doctor"
                                >

                                  <div className="findoc-chat-doctor-top">

                                    <div>
                                      <h4>
                                        {
                                          doctor.firstName
                                        }{" "}
                                        {
                                          doctor.lastName
                                        }

                                        {doctor.isVerified &&
                                          " ✓"}
                                      </h4>

                                      <div className="findoc-chat-doctor-specialty">
                                        {getSpecialtyLabel(
                                          doctor.specialty
                                        )}
                                      </div>
                                    </div>

                                    <div className="findoc-chat-rating">
                                      ★{" "}
                                      {doctor.rating.toFixed(
                                        1
                                      )}
                                    </div>

                                  </div>

                                  <div className="findoc-chat-doctor-meta">

                                    {getCityLabel(
                                      doctor.city
                                    )}

                                    {doctor.area
                                      ? ` · ${doctor.area}`
                                      : ""}

                                    <br />

                                    {
                                      doctor.yearsOfExperience
                                    }{" "}
                                    χρόνια εμπειρίας

                                    {doctor.acceptsInsurance &&
                                      doctor.insuranceProviders
                                      ? (
                                        <>
                                          <br />

                                          Ασφάλιση:{" "}
                                          {
                                            doctor.insuranceProviders
                                          }
                                        </>
                                      )
                                      : null}

                                  </div>

                                  <div className="findoc-chat-doctor-footer">

                                    <div className="findoc-chat-price">
                                      €
                                      {
                                        doctor.consultationPrice
                                      }
                                    </div>

                                    <div className="findoc-chat-tags">

                                      {doctor.offersOnlineConsultation && (
                                        <span className="findoc-chat-tag">
                                          ONLINE
                                        </span>
                                      )}

                                      {doctor.isVerified && (
                                        <span className="findoc-chat-tag">
                                          VERIFIED
                                        </span>
                                      )}

                                    </div>

                                  </div>

                                </article>
                              )
                            )}

                        </div>
                      )}

                  </div>

                </div>
              )
            )}

            {loading && (
              <div className="findoc-chat-message-row assistant">

                <div className="findoc-chat-bubble">

                  <div className="findoc-chat-typing">
                    <span />
                    <span />
                    <span />
                  </div>

                </div>

              </div>
            )}

            <div
              ref={
                messagesEndRef
              }
            />

          </div>

          {/* QUICK PROMPTS */}

          <div className="findoc-chat-suggestions">

            <button
              type="button"
              className="findoc-chat-suggestion"
              onClick={() =>
                setInput(
                  "Θέλω καρδιολόγο στην Αθήνα με ΕΟΠΥΥ μέχρι 50€"
                )
              }
            >
              Καρδιολόγος Αθήνα
            </button>

            <button
              type="button"
              className="findoc-chat-suggestion"
              onClick={() =>
                setInput(
                  "Θέλω δερματολόγο που κάνει online consultation"
                )
              }
            >
              Online δερματολόγος
            </button>

            <button
              type="button"
              className="findoc-chat-suggestion"
              onClick={() =>
                setInput(
                  "Βρες μου τον γιατρό με την καλύτερη αξιολόγηση"
                )
              }
            >
              Καλύτερη αξιολόγηση
            </button>

          </div>

          {/* INPUT */}

          <form
            className="findoc-chat-form"
            onSubmit={
              sendMessage
            }
          >

            <input
              type="text"
              className="findoc-chat-input"
              placeholder="Πες μου τι γιατρό ψάχνεις..."
              value={input}
              disabled={loading}
              onChange={event =>
                setInput(
                  event.target.value
                )
              }
            />

            <button
              type="submit"
              className="findoc-chat-send"
              disabled={
                loading ||
                !input.trim()
              }
            >
              ↑
            </button>

          </form>

          <div className="findoc-chat-footer-note">
            Findoc Assistant · Smart doctor search
          </div>

        </section>
      )}
    </>
  );
}

export default SmartSearchChat;