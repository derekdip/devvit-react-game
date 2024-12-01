import { useEffect, useRef } from 'react';

import { useSpring, animated } from 'react-spring';
import {  MapRendererContext, PositionHandler, PlayerContext, PositionValues } from '../systems/ContextManager';
import MapView from "../map/Map";
import { MapRenderer } from '../systems/MapRenderer';
import { userDisplacement, blockSize } from '../settings';
import UserInputManager from '../systems/UserInputManager';

export const HomePage = ({ postId }: { postId: string }) => {
 // Step 1: Use a ref to store the window dimensions
 const windowDimensions = useRef({
  width: window.innerWidth,
  height: window.innerHeight,
});

// Step 2: Use react-spring for smooth resizing
const [{ width, height }, set] = useSpring(() => ({
  width: window.innerWidth,
  height: window.innerHeight,
  config: { tension: 170, friction: 26 }, // Custom spring config for smooth resizing
}));

return (
  <animated.div
    style={{
      width: width.to(w => `${w}px`),
      height: height.to(h => `${h}px`),
      border: '1px solid black',
      padding: '20px',
      overflow: 'hidden',
    }}
  >
      <GameUserInputHandler/>
  </animated.div>
);
};


// let userDisplacement={
//   x:100,
//   y:100
// }
// let blockSize =40

function GameUserInputHandler() {
  const playerPositionValue= {x:12.5,y:12.5}
  const [{ x, y }, set] = useSpring(() => ({
    x: userDisplacement.x - playerPositionValue.x * blockSize,
    y: userDisplacement.y - playerPositionValue.y * blockSize,
    config: { duration:1 }, // Custom spring config for smooth resizing
  }));
  const animatedValue = {x:x,y:y,setValue:set}
  const playerPosition = new PositionHandler(playerPositionValue.x,playerPositionValue.y,animatedValue.x,animatedValue.y,animatedValue.setValue)
  const playerPreviousPosition:PositionValues = {x:playerPositionValue.x,y:playerPositionValue.y,}
  //render walls and store their references
  const mapPositionRef = useRef(animatedValue).current;
  const mapRenderer =  new MapRenderer(
      playerPreviousPosition,
      14,
      7,
      mapPositionRef,
    );

  return (
   <PlayerContext.Provider value={playerPosition}>
      <MapRendererContext.Provider value={mapRenderer}>
        {/* <MainGameTimer /> */}
        {/* <UserInputManager /> */}
        <UserInputManager/>
        <div style={{position:'absolute'}}>
        <text style={{backgroundColor:"yellow"}}>x: </text>
        <animated.text  style={{backgroundColor:"yellow"}}>
            {mapPositionRef.x}
          </animated.text>
          <text style={{backgroundColor:"yellow"}}>y: </text>
        <animated.text  style={{backgroundColor:"yellow"}}>
            {mapPositionRef.y}
          </animated.text>
        </div>
        <div style={{position:'absolute',zIndex:1000, width:30,height:30,backgroundColor:"green", left:window.innerWidth/2+15, top:window.innerHeight/2+15}}></div>
        <animated.div
         style={{
          position:'absolute',
          backgroundColor: "orange",
          x: mapPositionRef.x,
          y: mapPositionRef.y
        }}>
          <MapView />
        </animated.div>
      </MapRendererContext.Provider>
    </PlayerContext.Provider>
  );
}