import React, { useContext, useEffect, useRef, useState } from "react";
import { JoyStick } from "../components/JoyStick";
import { MapRendererContext, PlayerContext, PositionHandler, PositionValues } from "./ContextManager";
import { useSpring } from "react-spring";
interface Layout {
  x: number;
  y: number;
  width: number;
  height: number;
}
export interface Visible {
  visible: number;
}

//handles player, joystick, fire button because Touchevents couldn't be turned into separate layered componets
//
export default function UserInputManager() {
  const playerData = useContext(PlayerContext);
  if(playerData==undefined){
    return
  }

  const mapRenderer = useContext(MapRendererContext);
//-----------start player movement setup-------------
  const lastMove = useRef({ x: 0, y: 0 });//merge these two
  let lastMessageSent = { x: 0, y: 0 };//merge
  const currentPlayerPosRef = useRef({
    x: playerData.position.values.x,
    y: playerData.position.values.y,
  }).current;

  const [joyStickOriginState,setJoyStickOrigin]:[PositionValues & Visible,Function]= useState({
    visible: 0,
    x: 0,
    y: 0,
  });
  const joyStickOrigin=
    useRef<PositionValues & Visible>({
      visible: 0,
      x: 0,
      y: 0,
    });
  const currentTouch = useRef<PositionValues>({x:0,y:0})
  const [{  x, y }, set] = useSpring(() => ({
    x: 0,
    y: 0,
    config: { duration:1 }, // Custom spring config for smooth resizing
  }));
  const joystickPosition = new PositionHandler(currentTouch.current.x,currentTouch.current.y,x,y,set)
  const [playerEnabled, setPlayerEnabled] = useState(true);
  const [intervalId, setIntervalId] = useState(0);
  const isMoving = useRef(false);
  const lastTimestamp = useRef(Date.now());
  const [isDragging, setIsDragging] = useState(false);
//-----------end player movement setup-------------



  function updateTouchState(touchLocX: number, touchLocY: number,deltaTime:number) {
    if (!playerEnabled) {
      joyStickOrigin.current=({ visible: 0, x: 0, y: 0 });
      setJoyStickOrigin({ visible: 0, x: 0, y: 0 })
      return;
    }
    if(playerData==undefined|| mapRenderer==undefined){
        return
    }
    currentTouch.current=({ x: touchLocX, y: touchLocY });
    joystickPosition.position.animatedValues.setValue({x:touchLocX,y:touchLocY})
    // joystickAnimatedRenderingX.current.setValue(touchLocX)
    // joystickAnimatedRenderingY.current.setValue(touchLocY)
    const dx = touchLocX - joyStickOrigin.current.x; //map is built left to right
    const dy = -1 * (touchLocY - joyStickOrigin.current.y); //map is built from top to bottom so need to make it negative
    let angle = Math.atan2(dy, dx) * (180 / Math.PI); // Calculate angle in radians and convert to degrees
    angle = angle >= 0 ? angle : 360 + angle; // Convert negative angles to positive
    playerData.rotationAngle = angle;
    let direction = [0, 0];
    console.log(currentTouch.current.x)
    console.log(currentTouch.current.x - joyStickOrigin.current.x)
    if (
      Math.abs(currentTouch.current.x - joyStickOrigin.current.x) > 10 &&
      currentTouch.current.x - joyStickOrigin.current.x > 10
    ) {
      direction[0] = 1;
    } else if (currentTouch.current.x - joyStickOrigin.current.x < -10) {
      direction[0] = -1;
    }
    if (
      Math.abs(currentTouch.current.y - joyStickOrigin.current.y) > 10 &&
      currentTouch.current.y - joyStickOrigin.current.y > 10
    ) {
      direction[1] = 1;
    } else if (currentTouch.current.y - joyStickOrigin.current.y < -10) {
      direction[1] = -1;
    }
    console.log(direction)
    let isUpdated = mapRenderer.updateMapPosition(
      direction,
      playerData?.position,
      deltaTime
    );
    console.log(lastMessageSent)
      console.log(currentPlayerPosRef)
    if (isUpdated) {
      console.log("updating pos")
      
      if (
        Math.abs(lastMessageSent.x - currentPlayerPosRef.x) > 0.01 ||
        Math.abs(lastMessageSent.y - currentPlayerPosRef.y) > 0.01
      ) {
        lastMessageSent = {
          x: currentPlayerPosRef.x,
          y: currentPlayerPosRef.y,
        };
        playerData.position.values = currentPlayerPosRef;
      }
    }
  }


  const handleTouchEnd = (e:React.TouchEvent<HTMLDivElement>|React.MouseEvent) => {
    //if (e.touches.length === 0 && playerEnabled) {
      setIsDragging(false)
      joyStickOrigin.current = { visible: 0, x: 0, y: 0 };
      setJoyStickOrigin({ visible: 0, x: 0, y: 0 });
      isMoving.current = false;
      clearInterval(intervalId);
    //}
  };
  const handlePanResponderMove = (
    event:  React.TouchEvent<HTMLDivElement>|React.MouseEvent,
  ) => {
    console.log(isDragging)
    if(isDragging==false
    ){
        return
    }
    let pageX = 0
    let pageY = 0
    if('touches' in event){
        pageX = event.nativeEvent.touches[0].pageX
        pageY = event.nativeEvent.touches[0].pageY
    }
    else if('clientX' in event){
        pageX =event.clientX
        pageY = event.clientY
    }
    clearInterval(intervalId);
    
      console.log("setting move true")
      isMoving.current=true;
      event.persist();
      lastMove.current={x:pageX,y:pageY}
    
  };
  function hitButton(event: React.TouchEvent|React.MouseEvent) {
    let pageX = 0
    let pageY = 0
    setIsDragging(true)
    if('touches' in event){
        pageX = event.nativeEvent.touches[0].pageX
        pageY = event.nativeEvent.touches[0].pageY
    }
    else if('clientX' in event){
        pageX =event.clientX
        pageY = event.clientY
    }
    //if(typeof event React.TouchEvent)
      console.log(pageX)
      //the first touch that is not a button is the joystick start
      if (playerEnabled && !isMoving.current) {
        joyStickOrigin.current=({
          visible: 1,
          x: pageX,
          y: pageY,
        });
        setJoyStickOrigin({
          visible: 1,
          x: pageX,
          y: pageY,
        })
        currentTouch.current=({
          x: pageX,
          y: pageY,
        });
        joystickPosition.position.animatedValues.setValue({x: pageX,y:pageY})
      }
  }
  const animationFrame = useRef<number|null>(null);

  const animateMovement = () => {
    const currentTimestamp = Date.now();
    const deltaTime = currentTimestamp - lastTimestamp.current;
    lastTimestamp.current = currentTimestamp;

    if (isMoving.current) {
      console.log("ismoving")
      updateTouchState(
        lastMove.current.x,
        lastMove.current.y,
        deltaTime
      );
    } 
    animationFrame.current = requestAnimationFrame(animateMovement);
  };

  useEffect(() => {
    animationFrame.current = requestAnimationFrame(animateMovement);
    //return () => cancelAnimationFrame(animationFrame.current);
  }, []);

  return (
    <div
      onTouchStart={hitButton}
      onTouchMove={handlePanResponderMove}
      onTouchEnd={handleTouchEnd}
      onMouseDown={hitButton}
      onMouseMove={handlePanResponderMove}
      onMouseUp={handleTouchEnd}
      style={{flex: 1,
        alignItems: "center",
        justifyContent: "center",
        position: "absolute",
        width: "100%",
        height: "100%",
        zIndex: 5}}
      >
        <JoyStick joyStickOrigin={joyStickOriginState} currentTouch={joystickPosition.position.animatedValues}  />
      {/* <LocalPlayer /> */}
    </div>
  );
}

// const styles = StyleSheet.create({
//   container: {
//     //backgroundColor:'yellow',
    // flex: 1,
    // alignItems: "center",
    // justifyContent: "center",
    // position: "absolute",
    // width: "100%",
    // height: 1000,
    // zIndex: 5,
//   },
// });
