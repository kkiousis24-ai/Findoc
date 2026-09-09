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
  interpreted: SmartSearchInterpretation;
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

  contextSummary?: string;
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

const languageLabels:
  Record<string, string> = {
  Greek: "Ελληνικά",
  English: "Αγγλικά",
  French: "Γαλλικά",
  German: "Γερμανικά",
};

/* =====================================================
   HELPERS
===================================================== */

function createMessageId() {
  return `${Date.now()}-${Math.random()}`;
}

function createEmptyContext():
  SmartSearchInterpretation {
  return {
    specialty: null,
    city: null,
    area: null,
    maxPrice: null,
    minRating: null,
    acceptsInsurance: null,
    insurance: null,
    online: null,
    language: null,
    verified: null,
    sort: "rating",
  };
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

function getLanguageLabel(
  language: string
) {
  return (
    languageLabels[language] ??
    language
  );
}

function hasInterpretation(
  interpretation:
    SmartSearchInterpretation
) {
  return Boolean(
    interpretation.specialty ||
    interpretation.city ||
    interpretation.area ||
    interpretation.maxPrice !== null ||
    interpretation.minRating !== null ||
    interpretation.acceptsInsurance !==
      null ||
    interpretation.insurance ||
    interpretation.online !== null ||
    interpretation.language ||
    interpretation.verified !== null ||
    interpretation.sort !== "rating"
  );
}

function hasContext(
  context:
    SmartSearchInterpretation
) {
  return Boolean(
    context.specialty ||
    context.city ||
    context.area ||
    context.maxPrice !== null ||
    context.minRating !== null ||
    context.acceptsInsurance !== null ||
    context.insurance ||
    context.online !== null ||
    context.language ||
    context.verified !== null ||
    context.sort !== "rating"
  );
}

/* =====================================================
   MERGE CONVERSATION CONTEXT
===================================================== */

function mergeContext(
  previous:
    SmartSearchInterpretation,

  incoming:
    SmartSearchInterpretation
):
  SmartSearchInterpretation {
  const nextInsurance =
    incoming.insurance ??
    previous.insurance;

  const nextAcceptsInsurance =
    incoming.acceptsInsurance ??
    previous.acceptsInsurance ??
    (
      nextInsurance
        ? true
        : null
    );

  return {
    specialty:
      incoming.specialty ??
      previous.specialty,

    city:
      incoming.city ??
      previous.city,

    area:
      incoming.area ??
      previous.area,

    maxPrice:
      incoming.maxPrice ??
      previous.maxPrice,

    minRating:
      incoming.minRating ??
      previous.minRating,

    acceptsInsurance:
      nextAcceptsInsurance,

    insurance:
      nextInsurance,

    online:
      incoming.online ??
      previous.online,

    language:
      incoming.language ??
      previous.language,

    verified:
      incoming.verified ??
      previous.verified,

    sort:
      incoming.sort !== "rating"
        ? incoming.sort
        : previous.sort,
  };
}

/* =====================================================
   BUILD SEARCH QUERY
===================================================== */

function buildDoctorSearchParams(
  context:
    SmartSearchInterpretation,

  freeText?: string
) {
  const params =
    new URLSearchParams();

  if (freeText?.trim()) {
    params.append(
      "q",
      freeText.trim()
    );
  }

  if (context.specialty) {
    params.append(
      "specialty",
      context.specialty
    );
  }

  if (context.city) {
    params.append(
      "city",
      context.city
    );
  }

  if (context.area) {
    params.append(
      "area",
      context.area
    );
  }

  if (
    context.maxPrice !== null
  ) {
    params.append(
      "maxPrice",
      String(
        context.maxPrice
      )
    );
  }

  if (
    context.minRating !== null
  ) {
    params.append(
      "minRating",
      String(
        context.minRating
      )
    );
  }

  if (context.insurance) {
    params.append(
      "insurance",
      context.insurance
    );
  } else if (
    context.acceptsInsurance ===
    true
  ) {
    params.append(
      "acceptsInsurance",
      "true"
    );
  }

  if (
    context.online === true
  ) {
    params.append(
      "online",
      "true"
    );
  }

  if (context.language) {
    params.append(
      "language",
      context.language
    );
  }

  if (
    context.verified === true
  ) {
    params.append(
      "verified",
      "true"
    );
  }

  params.append(
    "sort",
    context.sort || "rating"
  );

  return params;
}

/* =====================================================
   CONTEXT SUMMARY
===================================================== */

function buildContextSummary(
  context:
    SmartSearchInterpretation
) {
  const items: string[] =
    [];

  if (context.specialty) {
    items.push(
      getSpecialtyLabel(
        context.specialty
      )
    );
  }

  if (context.city) {
    items.push(
      getCityLabel(
        context.city
      )
    );
  }

  if (context.area) {
    items.push(
      context.area
    );
  }

  if (context.insurance) {
    items.push(
      context.insurance
    );
  } else if (
    context.acceptsInsurance ===
    true
  ) {
    items.push(
      "Με ασφάλιση"
    );
  }

  if (
    context.maxPrice !== null
  ) {
    items.push(
      `έως €${context.maxPrice}`
    );
  }

  if (
    context.minRating !== null
  ) {
    items.push(
      `rating ${context.minRating}+`
    );
  }

  if (
    context.online === true
  ) {
    items.push(
      "Online"
    );
  }

  if (context.language) {
    items.push(
      getLanguageLabel(
        context.language
      )
    );
  }

  if (
    context.verified === true
  ) {
    items.push(
      "Verified"
    );
  }

  if (
    context.sort ===
    "price_asc"
  ) {
    items.push(
      "φθηνότεροι πρώτα"
    );
  }

  if (
    context.sort ===
    "price_desc"
  ) {
    items.push(
      "ακριβότεροι πρώτα"
    );
  }

  if (
    context.sort ===
    "experience"
  ) {
    items.push(
      "περισσότερη εμπειρία"
    );
  }

  if (
    context.sort ===
    "reviews"
  ) {
    items.push(
      "περισσότερες κριτικές"
    );
  }

  return items.join(" · ");
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
    searchContext,
    setSearchContext,
  ] =
    useState<SmartSearchInterpretation>(
      createEmptyContext()
    );

  const [
    messages,
    setMessages,
  ] = useState<ChatMessage[]>([
    {
      id: createMessageId(),

      role: "assistant",

      text:
        "Γεια σου! 👋 Είμαι ο Findoc Assistant. Πες μου τι γιατρό ψάχνεις και θα σε βοηθήσω να βρεις την καλύτερη επιλογή.",
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
     SMART PARSER
  =================================================== */

  async function interpretMessage(
    query: string
  ) {
    const response =
      await fetch(
        `${API_URL}/api/doctors/smart-search?query=${encodeURIComponent(
          query
        )}`
      );

    if (!response.ok) {
      throw new Error(
        "Smart search failed"
      );
    }

    const data:
      SmartSearchResponse =
      await response.json();

    return data.interpreted;
  }

  /* ===================================================
     FETCH DOCTORS
  =================================================== */

  async function searchDoctors(
    context:
      SmartSearchInterpretation,

    freeText?: string
  ) {
    const params =
      buildDoctorSearchParams(
        context,
        freeText
      );

    const response =
      await fetch(
        `${API_URL}/api/doctors?${params.toString()}`
      );

    if (!response.ok) {
      throw new Error(
        "Doctor search failed"
      );
    }

    const data: Doctor[] =
      await response.json();

    return data;
  }

  /* ===================================================
     SEND MESSAGE
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

    /* -------------------------------------------------
       SPECIAL RESET COMMANDS
    ------------------------------------------------- */

    const normalizedQuery =
      query
        .toLocaleLowerCase(
          "el-GR"
        )
        .trim();

    if (
      normalizedQuery ===
        "reset" ||
      normalizedQuery ===
        "clear" ||
      normalizedQuery.includes(
        "νέα αναζήτηση"
      ) ||
      normalizedQuery.includes(
        "ξεκίνα από την αρχή"
      )
    ) {
      resetChat();

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
      /* -----------------------------------------------
         1. INTERPRET CURRENT MESSAGE
      ----------------------------------------------- */

      const interpretation =
        await interpretMessage(
          query
        );

      const recognized =
        hasInterpretation(
          interpretation
        );

      /* -----------------------------------------------
         2. MERGE WITH PREVIOUS MEMORY
      ----------------------------------------------- */

      let nextContext =
        searchContext;

      if (recognized) {
        nextContext =
          mergeContext(
            searchContext,
            interpretation
          );

        setSearchContext(
          nextContext
        );
      }

      /* -----------------------------------------------
         3. NORMAL TEXT FALLBACK
      ----------------------------------------------- */

      const useFreeText =
        !recognized
          ? query
          : undefined;

      /* -----------------------------------------------
         4. SEARCH WITH ALL REMEMBERED FILTERS
      ----------------------------------------------- */

      const doctors =
        await searchDoctors(
          nextContext,
          useFreeText
        );

      const contextSummary =
        buildContextSummary(
          nextContext
        );

      /* -----------------------------------------------
         5. RESPONSE
      ----------------------------------------------- */

      if (
        doctors.length === 0
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
                "Δεν βρήκα γιατρό που να καλύπτει όλα αυτά τα κριτήρια. Μπορείς να μου πεις να αλλάξω κάποια από τις προϋποθέσεις.",

              contextSummary:
                contextSummary ||
                undefined,
            },
          ]
        );

        return;
      }

      const resultText =
        doctors.length === 1
          ? "Βρήκα 1 γιατρό που ταιριάζει με όσα μου έχεις ζητήσει:"
          : `Βρήκα ${doctors.length} γιατρούς που ταιριάζουν με όσα μου έχεις ζητήσει:`;

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

            doctors,

            contextSummary:
              contextSummary ||
              undefined,
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
              "Δεν μπόρεσα να επικοινωνήσω με το Findoc αυτή τη στιγμή. Έλεγξε ότι το backend λειτουργεί και δοκίμασε ξανά.",
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  }

  /* ===================================================
     RESET MEMORY
  =================================================== */

  function resetChat() {
    setInput("");

    setSearchContext(
      createEmptyContext()
    );

    setMessages([
      {
        id:
          createMessageId(),

        role:
          "assistant",

        text:
          "Ξεκινάμε νέα αναζήτηση. Πες μου τι γιατρό χρειάζεσαι.",
      },
    ]);
  }

  /* ===================================================
     CURRENT MEMORY
  =================================================== */

  const currentContextSummary =
    buildContextSummary(
      searchContext
    );

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
              rgba(0, 0, 0, 0.36);

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
              rgba(0, 0, 0, 0.45);
          }

          .findoc-chat-window {
            position: fixed;
            right: 28px;
            bottom: 104px;
            z-index: 9999;

            width: min(
              410px,
              calc(100vw - 32px)
            );

            height: min(
              650px,
              calc(100vh - 145px)
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
              rgba(0, 0, 0, 0.55);

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

          .findoc-chat-memory {
            padding:
              9px 14px;

            border-bottom:
              1px solid
              rgba(
                255,
                255,
                255,
                0.05
              );

            background:
              rgba(
                83,
                214,
                189,
                0.04
              );

            color:
              rgba(
                223,
                247,
                241,
                0.63
              );

            font-size: 9px;

            white-space: nowrap;
            overflow-x: auto;
          }

          .findoc-chat-memory strong {
            color: #62dcc5;
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

            background: #0e2923;

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

          .findoc-chat-context-summary {
            margin-top: 10px;

            padding:
              7px 9px;

            border-radius: 10px;

            background:
              rgba(
                86,
                216,
                191,
                0.07
              );

            color:
              rgba(
                119,
                231,
                210,
                0.82
              );

            font-size: 9px;
            line-height: 1.45;
          }

          .findoc-chat-doctors {
            width: 100%;

            display: grid;

            gap: 9px;

            margin-top: 12px;
          }

          .findoc-chat-doctor {
            padding: 12px;

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

                  Μνήμη συνομιλίας ενεργή

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

          {/* MEMORY BAR */}

          {hasContext(
            searchContext
          ) && (
            <div className="findoc-chat-memory">
              <strong>
                Θυμάμαι:
              </strong>
              {" "}
              {currentContextSummary}
            </div>
          )}

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

                    {message.contextSummary && (
                      <div className="findoc-chat-context-summary">
                        ✦{" "}
                        {
                          message.contextSummary
                        }
                      </div>
                    )}

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
                  "Θέλω καρδιολόγο στην Αθήνα"
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
                  "μόνο με ΕΟΠΥΥ"
                )
              }
            >
              + ΕΟΠΥΥ
            </button>

            <button
              type="button"
              className="findoc-chat-suggestion"
              onClick={() =>
                setInput(
                  "και μέχρι 50€"
                )
              }
            >
              + μέχρι 50€
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
              placeholder="Συνέχισε τη συζήτηση..."
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
            Findoc Assistant · Conversational smart search
          </div>

        </section>
      )}
    </>
  );
}

export default SmartSearchChat;