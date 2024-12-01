import { useEffect } from "react";
import { useSpring, animated } from "react-spring";
import { useDevvitListenerAnimated } from "../hooks/useDevvitListener";
import { createDefaultPayloadGetUserData } from "../shared";
import { sendToDevvit } from "../utils";

function Example(){
    const tempPayload = createDefaultPayloadGetUserData()
    const [data,setData] = useSpring(() => (
        {...tempPayload, config: { duration:1 }}
    ))
    useDevvitListenerAnimated('GET_USER_DATA_RESPONSE',setData);
    
    useEffect(() => {
        sendToDevvit({ type: 'GET_USER_DATA_REQUEST' });
    }, []);
    return(
        <animated.text style={{color:"yellow"}} >
        {data.name}
       </animated.text>
    )
}