import { useState } from "react";
import {GET_USER_DATA_RESPONSE_PAYLOAD} from "../shared"
import { GameUIParams, Player } from "../systems/ContextManager";
import { param } from "motion/react-client";
import { animated } from "react-spring";




export function GameUI(params:GameUIParams&Player) {
    // Inline styles


  
  return (
        <div style={{position:'absolute',zIndex:1000,backgroundColor:"#668811dd",width:'100%',padding:"4%", height:'18%', display: 'flex',flexDirection:'row', justifyContent:'space-between'}}>
            {/* Team B */}
            <div style={{fontSize:"4vw", userSelect:'none'}}>
                <h2 style={{fontSize:"4vw", userSelect:'none'}}>{params.team1_name}</h2>
                <animated.text style={{fontSize:"2vw",userSelect:'none'}}>{params.team1_points}</animated.text>
            </div>

            {/* Team B */}
            <div style={{fontSize:"4vw", userSelect:'none'}}>
                <h2 style={{fontSize:"4vw",userSelect:'none'}}>{params.team2_name}</h2>
                <animated.text style={{fontSize:"2vw",userSelect:'none'}}>{params.team2_points}</animated.text>
            </div>
            <div style={{fontSize:"4vw", userSelect:'none'}}>
                <h2 style={{fontSize:"4vw",userSelect:'none'}}>Previous Best</h2>
                <animated.text style={{fontSize:"2vw",userSelect:'none'}}>{params.previousBest}</animated.text>
            </div>
            <div style={{fontSize:"4vw", userSelect:'none'}}>
                <h2 style={{fontSize:"4vw",userSelect:'none'}}>Current Points</h2>
                <animated.text style={{fontSize:"2vw",userSelect:'none'}}>{params.points}</animated.text>
            </div>
        </div>
    
  );
}