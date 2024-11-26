import { useContext, useDeferredValue, useEffect, useRef, useState } from "react";
import { ImageProps, View } from "react-native-web";
import {
  MapContext,
  MapRendererContext,
  PlayerContext,
  VisualContext,
} from "../systems/ContextManager";
import { CustomCell, DefaultCell } from "./RenderCells";
import { useSpring } from "react-spring";

import topImage from '../assets/walls/top.png';
import bottomImage from '../assets/walls/bottom.png';
import sidesImage from '../assets/walls/sides.png';
import tile_0_0 from '../assets/table/tile_0_0.png';
import tile_0_1 from '../assets/table/tile_0_1.png';
import tile_0_2 from '../assets/table/tile_0_2.png';
import tile_1_0 from '../assets/table/tile_1_0.png';
import tile_1_1 from '../assets/table/tile_1_1.png';
import tile_1_2 from '../assets/table/tile_1_2.png';
import tile_2_0 from '../assets/table/tile_2_0.png';
import tile_2_1 from '../assets/table/tile_2_1.png';
import tile_2_2 from '../assets/table/tile_2_2.png';
import grassImage from '../assets/grass.png';

// Define your images object using the imported variables
const images:im = {
  "walls/top.png": topImage,
  "walls/bottom.png": bottomImage,
  "walls/sides.png": sidesImage,
  "table/tile_0_0.png": tile_0_0,
  "table/tile_0_1.png": tile_0_1,
  "table/tile_0_2.png": tile_0_2,
  "table/tile_1_0.png": tile_1_0,
  "table/tile_1_1.png": tile_1_1,
  "table/tile_1_2.png": tile_1_2,
  "table/tile_2_0.png": tile_2_0,
  "table/tile_2_1.png": tile_2_1,
  "table/tile_2_2.png": tile_2_2,
  "grass": grassImage
};

interface im {
  [key: string]: ImageProps["source"];
}


export default function Map() {
  const [mapInfo] = useContext(MapContext);
  const currentMapRenderer = useContext(MapRendererContext);
  const playerPosition = useContext(PlayerContext);
  
  function RenderMap() {
    if(currentMapRenderer==undefined){
      return null
    }
    //gets map info from Photon and renders cells
    let mapCells: Array<JSX.Element> = []; //renders cells, but cell positions are changed with user input
    const deferredCounter = useDeferredValue<Array<JSX.Element>>(mapCells); //since we are rendering a lot of images we want to eventually render all of them so this helps it render whatever is updated
    currentMapRenderer.renderConfig.mapWidth = 45;
    currentMapRenderer.renderConfig.mapHeight =45;

    //custom map cells->
    let wallIndex = 1;
    for (let wallType in mapInfo.walls) {
      console.log(wallType);
      console.log(mapInfo.walls[wallType]);
      for (let wall of mapInfo.walls[wallType]) {
        currentMapRenderer.wholeMap.set(wall, wallIndex);
      }
      currentMapRenderer.addTypeCellRef(wallIndex);
      let cellRefs = currentMapRenderer.getTypeCellRef(wallIndex);
      console.log(images[wallType]);
      if (cellRefs) {
        for (let i = 0; i < 40; i++) {
          const [{ x, y }, set] = useSpring(() => ({
            x: 0,
            y: 0,
            config: { duration:1 }, // Custom spring config for smooth resizing
          }));
          const animatedValue = {x:x,y:y,setValue:set}

          //render walls and store their references
          const ref = useRef(animatedValue);
          mapCells.push(<CustomCell cellRef={ref} imgSrc={images[wallType]} backgroundImage={images["grass"]}/>);
          cellRefs.push(ref);
        }
      }
      wallIndex += 1;
    }
    for (let decorationType in mapInfo.decorations) {
      console.log(wallIndex)
      console.log(decorationType);
      console.log(mapInfo.decorations[decorationType]);
      for (let wall of mapInfo.decorations[decorationType]) {
        currentMapRenderer.decorationsMap.set(wall, wallIndex);
      }
      currentMapRenderer.addTypeCellRef(wallIndex);
      let cellRefs = currentMapRenderer.getTypeCellRef(wallIndex);
      console.log(images[decorationType]);
      if (cellRefs) {
        for (let i = 0; i < 5; i++) {
          const [{ x, y }, set] = useSpring(() => ({
            x: 0,
            y: 0,
            config: { tension: 170, friction: 26 }, // Custom spring config for smooth resizing
          }));
          const animatedValue = {x:x,y:y,setValue:set}

          //render walls and store their references
          const ref = useRef(animatedValue);
          mapCells.push(<CustomCell cellRef={ref} imgSrc={images[decorationType]} backgroundImage={images["grass"]} />);
          cellRefs.push(ref);
        }
      }
      wallIndex += 1;
    }

    let defaultCellRefs = currentMapRenderer.getTypeCellRef(0);
    if (defaultCellRefs) {
      for (let i = 0; i < 500; i++) {
        const [{ x, y }, set] = useSpring(() => ({
            x: 0,
            y: 0,
            config: { duration:1 }, // Custom spring config for smooth resizing
          }));
          const animatedValue = {x:x,y:y,setValue:set}

          //render walls and store their references
          const ref = useRef(animatedValue);
        mapCells.push(<DefaultCell cellRef={ref} />);
        defaultCellRefs.push(ref);
      }
    }
    // for(let wall of mazeData.wallVals){
    //   mapCells.push(<View style={{position:'absolute',top:blockSize*Math.floor(wall/mapInfo.width), left:blockSize*Math.floor(wall%mapInfo.width),backgroundColor:visuals.blockColor,width:blockSize,height:blockSize}}></View>)
    // }
    //**------------- end: render full map without optimization-------------------- **//

    useEffect(()=>{
      const initializer=async()=>{
        setTimeout(()=>{
          if(currentMapRenderer.hasRendered==false){
            currentMapRenderer.initializeRefs()
            currentMapRenderer.hasRendered=true
          }
        },2000)
        // setInterval(()=>{
        //   if(playerPosition){
        //     //currentMapRenderer.forceUpdateMapPosition(playerPosition.position.values)
        //     currentMapRenderer.updateMapPosition([1,-1],playerPosition.position,100)
        //     //currentMapRenderer.updateMapPosition([1,-1],playerPosition.position,100)
            
        //   }
        // },100)
        
      }
     initializer()
    },[])
    
    return deferredCounter
  }


  return (
    <View>
      <RenderMap />
    </View>
  );
}
