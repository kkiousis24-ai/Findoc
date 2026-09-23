import {
  useEffect,
  useState,
} from "react";

import {
  createPortal,
} from "react-dom";

import ForDoctorsSection
  from "./ForDoctorsSection";


function ForDoctorsMount() {
  const [
    mountNode,
    setMountNode,
  ] =
    useState<HTMLDivElement | null>(
      null
    );


  useEffect(() => {
    let observer:
      MutationObserver | null =
      null;

    let createdSlot:
      HTMLDivElement | null =
      null;

    let cancelled =
      false;


    function mountSection() {
      if (cancelled) {
        return;
      }


      const existing =
        document.querySelector(
          ".for-doctors-slot"
        );


      if (
        existing instanceof
        HTMLDivElement
      ) {
        setMountNode(
          existing
        );

        observer?.disconnect();

        return;
      }


      const howSection =
        document.getElementById(
          "how"
        );


      if (!howSection) {
        return;
      }


      const slot =
        document.createElement(
          "div"
        );


      slot.className =
        "for-doctors-slot";


      howSection.insertAdjacentElement(
        "afterend",
        slot
      );


      createdSlot =
        slot;


      setMountNode(
        slot
      );


      observer?.disconnect();
    }


    /* ================================================
       FIRST ATTEMPT
    ================================================ */

    mountSection();


    /* ================================================
       WAIT UNTIL "HOW IT WORKS" EXISTS
    ================================================ */

    if (!mountNode) {
      observer =
        new MutationObserver(
          () => {
            mountSection();
          }
        );


      observer.observe(
        document.body,
        {
          childList: true,
          subtree: true,
        }
      );
    }


    return () => {
      cancelled =
        true;


      observer?.disconnect();


      if (
        createdSlot &&
        createdSlot.isConnected
      ) {
        createdSlot.remove();
      }
    };
  }, []);


  if (!mountNode) {
    return null;
  }


  return createPortal(
    <ForDoctorsSection />,
    mountNode
  );
}


export default ForDoctorsMount;