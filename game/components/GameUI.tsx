import { useState } from "react";
import {GET_USER_DATA_RESPONSE_PAYLOAD} from "../shared"
import { GameUIParams, Player } from "../systems/ContextManager";
import { param } from "motion/react-client";
import { animated } from "react-spring";




export function GameUI(params:GameUIParams&Player) {
    // Inline styles

  const teamNameStyle = {
    marginBottom: '5px',
    fontSize: '1.5em' as const,
  };

  const teamPointStyle = {
    margin: '5px 0',
    fontSize: '1.2em' as const,
  };

  
  return (
        <div style={{position:'absolute',zIndex:1000,backgroundColor:"#668811dd",width:'100%',padding:"4%", height:'10%', display: 'flex',flexDirection:'row', justifyContent:'space-between'}}>
            {/* Team B */}
            <div style={{userSelect:'none'}}>
                <h2 style={{...teamNameStyle, userSelect:'none'}}>{params.team1_name}</h2>
                <animated.text style={{...teamPointStyle,userSelect:'none'}}>{params.team1_points}</animated.text>
            </div>

            {/* Team B */}
            <div style={{userSelect:'none'}}>
                <h2 style={{...teamNameStyle,userSelect:'none'}}>{params.team2_name}</h2>
                <animated.text style={{...teamPointStyle,userSelect:'none'}}>{params.team2_points}</animated.text>
            </div>
            <div style={{userSelect:'none'}}>
                <h2 style={{...teamNameStyle,userSelect:'none'}}>my points</h2>
                <animated.text style={{...teamPointStyle,userSelect:'none'}}>{params.points}</animated.text>
            </div>
        </div>
    
  );
}