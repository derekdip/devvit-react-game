import { useEffect, useRef, useState } from 'react';

import { useSpring, animated } from 'react-spring';
import {  MapRendererContext, PositionHandler, PlayerContext, PositionValues, Player, Team } from '../systems/ContextManager';
import MapView from "../map/Map";
import { MapRenderer } from '../systems/MapRenderer';
import { userDisplacement, blockSize } from '../settings';
import UserInputManager from '../systems/UserInputManager';
import { GameUI } from '../components/GameUI';
import { GET_USER_DATA_RESPONSE_PAYLOAD } from '../shared';

export const HomePage = ({initData}:{initData:GET_USER_DATA_RESPONSE_PAYLOAD}) => {
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
      overflow: 'hidden',
    }}
  >
      <GameUserInputHandler initData={initData}/>
  </animated.div>
);
};


// let userDisplacement={
//   x:100,
//   y:100
// }
// let blockSize =40

function GameUserInputHandler({initData}:{initData:GET_USER_DATA_RESPONSE_PAYLOAD}) {
  
  //---start gameUI initializing----
  // Initialize state with React Spring useSpring for animated total points
  const [tempTeamA, setTeamA] = useSpring(() => ({
    totalPoints: initData.team1_points,
    config:{duration:1}
  }));

  const [tempTeamB, setTeamB] = useSpring(() => ({
    totalPoints: initData.team2_points,
    config:{duration:1}
  }));


  const [tempPlayer, setPlayer] = useSpring(()=>({
    points: 0,
    config:{duration:1}
  }));

  const teamA = {
    name:initData.team1_name,
    totalPoints :tempTeamA.totalPoints
  }
  const teamB = {
    name:initData.team2_name,
    totalPoints:tempTeamB.totalPoints
  }
  const player = {
    team:initData.my_team,
    points:tempPlayer.points
  }

  const incrementTeamPoints = (team:string,amount:number) => {
    if (team == initData.team1_name) {
      setTeamA((prev) => ({
        totalPoints: amount,
      }));
    } else {
      setTeamB((prev) => ({
        totalPoints: amount,
      }));
    }
  };

  const incrementIndividualPoints = (amount:number) => {
    setPlayer({points:amount});

    if (player.team == initData.team1_name) {
      incrementTeamPoints(initData.team1_name,initData.team1_points+amount);
    } else {
      incrementTeamPoints(initData.team2_name,initData.team2_points+amount);
    }
  };

// Increment individual points for a user in the team
//---end gameUI initializing----
  
  
  //---start position map initializing----
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
      incrementIndividualPoints
    );
  //---end position map initializing----


  return (
   <PlayerContext.Provider value={playerPosition}>
      <MapRendererContext.Provider value={mapRenderer}>
        {/* <MainGameTimer /> */}
        {/* <UserInputManager /> */}
        <UserInputManager/>
        <GameUI team1_name={teamA.name} team2_name={teamB.name} team1_points={teamA.totalPoints} team2_points={teamB.totalPoints} team={player.team} points={player.points} ></GameUI>
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