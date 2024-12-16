import { createDefaultPayloadBasedOnType, createDefaultPayloadGetUserData, GET_USER_DATA_RESPONSE_PAYLOAD, Page, Payload } from './shared';
import { HomePage } from './pages/HomePage';
import { usePage } from './hooks/usePage';
import { useEffect, useRef, useState } from 'react';
import { sendToDevvit } from './utils';
import { useDevvitListener } from './hooks/useDevvitListener';
import { animated, useSpring } from 'react-spring';
import { Example } from './components/AnimatedAPIData';
import { data } from 'motion/react-client';
import { GameUI } from './components/GameUI';

const getPage = (page: Page,{initData}:{initData:GET_USER_DATA_RESPONSE_PAYLOAD}) => {
  switch (page) {
    case 'home':
      return <HomePage initData={initData} />;
    default:
      throw new Error(`Unknown page: ${page satisfies never}`);
  }
};

export const App = () => {
  let page = usePage()
  // Function to handle touch events and prevent their default behavior
  
  const [initialData,setInitialData] = useState<GET_USER_DATA_RESPONSE_PAYLOAD>(createDefaultPayloadGetUserData())

  const initData = useDevvitListener('GET_USER_DATA_RESPONSE');
  useEffect(() => {
    sendToDevvit({ type: 'GET_USER_DATA_REQUEST' });
  }, []);
  useEffect(() => {
    // Disable scrolling
    document.body.style.overflow = 'hidden';

    // Clean up: Enable scrolling when the component unmounts
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  // useEffect(() => {
  //   if (initData!=undefined) {
  //     //setInitialData(initData);
  //   }
  // }, [initData]);
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


  return <div className="h-full">
    {/* <text style={{color:"orange"}}> {initialData.name} </text>
    <text style={{color:"orange"}}> {initialData.team1_name} </text>
    <text style={{color:"orange"}}> {initialData.team2_name} </text>
    <text style={{color:"orange"}}> {initialData.team1_points }</text>
    <text style={{color:"orange"}}> {initialData.team2_points} </text> */}

    {/* <Example/> */}
    {getPage(page,{initData:initialData})}
    {/* {initData && getPage(page,{initData:initData})} */}
    </div>;
};
