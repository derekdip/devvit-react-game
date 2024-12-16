import { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useDevvitListenerAnimated } from "../hooks/useDevvitListener";
import { createDefaultPayloadGetUserData } from "../shared";
import { sendToDevvit } from "../utils";

export function Example(){
    const tempPayload = createDefaultPayloadGetUserData()
    const [data,setData] = useSpring(() => (
        {...tempPayload, config: { duration:1 }}
    ))
    useDevvitListenerAnimated('GET_USER_DATA_RESPONSE',setData);
    
    useEffect(() => {
        sendToDevvit({ type: 'GET_USER_DATA_REQUEST' });
    }, []);
    return(
        <>
        <div>
            <animated.text style={{color:"yellow"}} >
                {data.name}
            </animated.text>
            
           
        </div>
        <div>
        <animated.text style={{color:"yellow"}} >
                {data.team1_name}
            </animated.text>
            {/* <animated.text style={{color:"yellow"}} >
                {data.team1_points}
            </animated.text> */}
        </div>
        <div>
        <animated.text style={{color:"yellow"}} >
                {data.team2_name}
            </animated.text>
            {/* <animated.text style={{color:"yellow"}} >
                {data.team2_points}
            </animated.text> */}
        </div>
       </>
    )
}