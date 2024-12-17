import {  View } from "react-native";
import { Visible } from "../systems/UserInputManager";
import { AnimatedValues, PositionValues } from "../systems/ContextManager";
import { animated } from "react-spring";

interface JoyStickParams {
  currentTouch:AnimatedValues
  joyStickOrigin: Visible & PositionValues;
}

export function JoyStick({ currentTouch, joyStickOrigin }: JoyStickParams) {
  // const joyStickHorizontalMax = 10;
  // const joyStickVerticalMax = 10;

  return (
    <>
      <animated.div
        style={{
          position: "absolute",
          left: joyStickOrigin.x,
          top: joyStickOrigin.y,
          height: "5%",
          width: "5%",
          borderRadius: 20,
          backgroundColor: `rgba(0,10,110,${joyStickOrigin.visible})`,
          zIndex: 4,
        }}></animated.div>
      <animated.div
        style={{
          position: "absolute",
           left: 0,
           top: 0,
           x:currentTouch.x,
           y:currentTouch.y,
          //transform: {translateX:currentTouch.x},{translateY:currentTouch.y},
          width: "5%",
          borderRadius: 20,
          backgroundColor: `rgba(200,10,0,${joyStickOrigin.visible})`,
          zIndex: 40,
        }}></animated.div>
    </>
  );
}
