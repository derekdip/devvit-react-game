import { createContext } from "react";
// import { PhotonPlayerController } from "./NetworkControllers/Player";
import { MapData, initialMapData } from "../map/maps";
import { MapRenderer } from "./MapRenderer";
import { SpringRef, SpringValue } from "react-spring";

export interface PositionValues {
  x: number;
  y: number;
}
export interface AnimatedValues{
  x:  SpringValue<number>;
  y: SpringValue<number>;
  setValue: SpringRef<{ x: number; y: number; }>
}
export interface Position{
  values: PositionValues,
  animatedValues: AnimatedValues,
}
export interface VisualProperties {
  face: number;
  balloonColor: string;
  blockColor: string;
}
export class PositionHandler {
  name: string = "";
  position: Position ;
  rotationAngle: number = 0;
  constructor(x:number,y:number,ax: SpringValue<number>, ay:SpringValue<number>,aSetValues:SpringRef<{ x: number; y: number; }>){
    let positionValues: PositionValues = {x:x,y:y}
    let animatedValues: AnimatedValues = {x:ax,y:ay,setValue:aSetValues}
    this.position = {
      values:positionValues,
      animatedValues
    }
  }
}
export interface WindowSizeInterface{
  windowWidth: number,
  windowHeight: number,
  updateWindowSize: Function
}

export interface GameUIParams {
  team1_name:string,
  team2_name:string, 
  team1_points:SpringValue<number>, 
  team2_points:SpringValue<number>,
}
export interface Player {
  team: string
  previousBest:number
  points: SpringValue<number>
}
export interface Team {
  name: string;
  totalPoints: number;
}



export const MapRendererContext = createContext<MapRenderer|undefined>(undefined) //Map renderer
export const MapContext = createContext<[MapData, Function]>([initialMapData, () => {}]); //Map information: size, walls, start, end

export const PlayerContext = createContext<PositionHandler|undefined>(undefined); //Local Player info, animation/network interface
export const VisualContext = createContext<[VisualProperties, Function]>([{ face: 0, balloonColor: "#FF0000FF", blockColor: "yellow" },() => {},]); //Local Player aesthetic

export const WindowSize = createContext<WindowSizeInterface>({windowWidth:0,windowHeight:0,updateWindowSize:Function})