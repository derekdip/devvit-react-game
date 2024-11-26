import {  ImageBackground, Image, ImageProps } from "react-native-web";
import { AnimatedValues } from "../systems/ContextManager";
import { useSpring, animated } from 'react-spring';
import grass from '../assets/grass.png';
import { blockSize } from "../settings";


// const grass = require("../assets/grass.png");

interface DefaultCellInterface {
  cellRef?: React.MutableRefObject<AnimatedValues>;
}
interface CustomCellInterface {
  cellRef?: React.MutableRefObject<AnimatedValues>;
  imgSrc:ImageProps["source"]
  backgroundImage?:ImageProps["source"]
}

export function DefaultCell(params: DefaultCellInterface) {
  return (
    <animated.div
      style={{
        position: "absolute",
        backgroundColor: "#6bfc03",
        zIndex: 10,
        left: 0,
        top: 0,
        x: params.cellRef
        ? params.cellRef.current.x
        : undefined,
        y: params.cellRef
        ? params.cellRef.current.y
        : undefined,
        // transform: params.cellRef
        //   ? params.cellRef.current.getTranslateTransform()
        //   : undefined,
        width: blockSize,
        height: blockSize,
      }}>
      <Image
        source={grass}
        style={{ width: "100%", height: undefined, aspectRatio: 1 }}></Image>
    </animated.div>
  );
}

export function CustomCell(params: CustomCellInterface) {
  console.log(params.imgSrc);
  return (
    <animated.div
      style={{
        position: "absolute",
        backgroundColor: "green",
        zIndex: 10,
        left: 0,
        top: 0,
        x: params.cellRef
        ? params.cellRef.current.x
        : undefined,
        y: params.cellRef
        ? params.cellRef.current.y
        : undefined,
        // transform: params.cellRef
        //   ? params.cellRef.current.getTranslateTransform()
        //   : undefined,
        width: blockSize,
        height: blockSize,
      }}>
        {params.backgroundImage && 
        <ImageBackground
        //source={params.backgroundImage}
        style={{
          width: "100%",
          height: undefined,
          aspectRatio: 1,
          alignItems: "center",
          justifyContent: "center",
        }}
        >
          <Image
            source={params.imgSrc}
            style={{ width: "100%", height: undefined, aspectRatio: 1 }}></Image>
        </ImageBackground>
        }
        {!params.backgroundImage &&
        <Image
          source={params.imgSrc}
          style={{ width: "100%", height: undefined, aspectRatio: 1 }}></Image>
        }
    </animated.div>
  );
}