import { createDefaultPayloadBasedOnType, createDefaultPayloadGetUserData, Page, Payload } from './shared';
import { HomePage } from './pages/HomePage';
import { usePage } from './hooks/usePage';
import { useEffect, useRef, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { animated, useSpring } from 'react-spring';

const getPage = (page: Page, { postId }: { postId: string }) => {
  switch (page) {
    case 'home':
      return <HomePage postId={postId} />;
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  let page = usePage()
  // Function to handle touch events and prevent their default behavior
  const preventTouch = (e: TouchEvent) => {
    e.preventDefault(); // Disable default touch behavior
  };

  useEffect(() => {
    // Add event listeners to the document when the component mounts
    document.addEventListener("touchstart", preventTouch, { passive: false });
    document.addEventListener("touchmove", preventTouch, { passive: false });
    document.addEventListener("touchend", preventTouch, { passive: false });
    document.addEventListener("touchcancel", preventTouch, { passive: false });

    // Cleanup the event listeners when the component unmounts
    return () => {
      document.removeEventListener("touchstart", preventTouch);
      document.removeEventListener("touchmove", preventTouch);
      document.removeEventListener("touchend", preventTouch);
      document.removeEventListener("touchcancel", preventTouch);
    };
  }, []);


  return <div className="h-full">{getPage(page, { postId:"" })}</div>;
};
