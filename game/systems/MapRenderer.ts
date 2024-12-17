import { userDisplacement, blockSize } from "../settings";
import { sendToDevvit } from "../utils";
import { Position, AnimatedValues, PositionValues } from "./ContextManager";

//Map renderer renders a piece of the map surrounding the player by pooling initialized assets then moving them in front of the player
/**
 * The instance of this class manages the partial rendering of the whole map
 */

export class MapRenderer {
  public hasRendered=false
  private startingPlayerPos: PositionValues;
  private currentPlayerPos: PositionValues;
  renderConfig = {
    renderViewWidth: 0,
    renderViewHeight: 0,
    mapWidth: 0,
    mapHeight: 0,
    xOffset: -8,
    yOffset: -5,
  };
  wholeMap = new Map<number, number>(); //whole map, hashmap {key:cellNum,val:Render Type} render type renders different asset associated to type value
  decorationsMap =new Map<number, number>();
  private isDropping =false
  private renderedMapSection = new Map<number, React.MutableRefObject<AnimatedValues> | undefined>(); //piece of map
  private cellTypes = new Map<number, Array<React.MutableRefObject<AnimatedValues>>>();
  private cellTypeReferences = new Map<number, Array<React.MutableRefObject<AnimatedValues>>>(); // array of rendered asset references used to update the asset's position
  private pointMap = new Map<number,boolean>()
  public pointsEarned =0;
  private incidentPoint = [{x:0,y:0},{x:0,y:0}]
  public increasePoints:Function
  mapRenderRef: AnimatedValues;
  constructor(initialPlayerPos: PositionValues, rendererViewWidth: number, rendererViewHeight: number, mapRenderRef: AnimatedValues, increasePoints:Function) {
    this.startingPlayerPos = initialPlayerPos;
    this.currentPlayerPos = initialPlayerPos
    this.renderConfig.renderViewWidth = rendererViewWidth;
    this.renderConfig.renderViewHeight = rendererViewHeight;
    this.mapRenderRef = mapRenderRef;
    this.cellTypeReferences.set(0, []); //**default background rendering
    this.increasePoints = increasePoints
  }
  addTypeCellRef(key: number) {
    this.cellTypeReferences.set(key, []);
  }
  getTypeCellRef(key: number) {
    return this.cellTypeReferences.get(key);
  }
  /**
   * Call this function once wholeMap
   * has been configured.
   * This renders piece of map around the player's position
   */
  async initializeRefs() {
    console.log("initializing map")

    for (let [key, value] of this.cellTypeReferences) {
      this.cellTypes.set(key, value);
    }
    this.renderedMapSection = new Map<number, React.MutableRefObject<AnimatedValues> | undefined>(); //important for local development, maybe even in production builds
    console.log("cells initialized to render")
    for (let y = this.renderConfig.yOffset; y < this.renderConfig.renderViewHeight; y++) {
      for (let x = this.renderConfig.xOffset; x < this.renderConfig.renderViewWidth; x++) {
        let cellNumAdd = Math.floor(this.startingPlayerPos.x) + x + (y + Math.floor(this.startingPlayerPos.y)) * this.renderConfig.mapWidth;
        this.addCellToRender(cellNumAdd);

      }
    }
    // setTimeout(()=>{
    //   this.renderConfig.mapWidth=45
    // },10000)
  }
  updatePosition(pos: PositionValues){
    this.currentPlayerPos=pos
  }
  deleteWall(num:number){
    this.resetCellXYRef(num)
    this.wholeMap.delete(num)
    this.addCellToRender(num)
  }
  swapImage(num:number,cellType:number){
    this.resetCellXYRef(num)
        this.decorationsMap.set(num,cellType)
        this.addCellToRender(num)
  }
  swapRefType(num:number,cellType:number){
    this.resetCellXYRef(num)
    this.decorationsMap.set(num,cellType)
    this.wholeMap.set(num,cellType)
    this.addCellToRender(num)
  }
  forceUpdateMapPosition(currentPlayerPosRef: PositionValues){
    this.mapRenderRef.setValue({ x: userDisplacement.x - currentPlayerPosRef.x * blockSize, y: userDisplacement.y - currentPlayerPosRef.y * blockSize });
    this.teleportRenderedMap(currentPlayerPosRef);
  }
  dash(angle:number){
    
  }
  startGame(){
    let gameOverID =setInterval(()=>{
    console.log(this.incidentPoint)
    let nextPosInts = { x: Math.floor(this.currentPlayerPos.x), y: Math.floor(this.currentPlayerPos.y) }; 
    if(this.isDropping==false){
      for(let i =0;i<3;i++){
        let randomNumX = Math.floor(Math.random()*4.9)-2
        let randomNumY = Math.floor(Math.random()*4.9)-2
        this.swapImage(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,24)
        this.incidentPoint[i] ={x:nextPosInts.x+randomNumX,y:nextPosInts.y+randomNumY} 
        // this.resetCellXYRef(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth)
        // this.decorationsMap.set(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,2)
        // this.addCellToRender(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth)
        setTimeout(()=>{
          this.swapRefType(nextPosInts.x+randomNumX-2  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX-1  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX+1  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX+2  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY+2) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY+1) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY-1) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY-2) * this.renderConfig.mapWidth,25)
          this.swapRefType(nextPosInts.x+randomNumX  + (nextPosInts.y+randomNumY) * this.renderConfig.mapWidth,25)
          if(this.wholeMap.get(this.positionToCellNum({x:this.currentPlayerPos.x,y:this.currentPlayerPos.y}))!=undefined ){
            console.log("game has ended")
            clearInterval(gameOverID)
            sendToDevvit({ type: 'GAME_ENDED',payload: {player_points_earned:this.pointsEarned} });
          }
          this.isDropping=false
        },2000)
      }
      this.isDropping=true
    }
  },3000)
  }
  updateMapPosition(direction: Array<number>, currentPlayerPosRef: Position,deltaTime?:number, dashDistance?:number) {
    //----------player position is broadcast to other photon players at the end of this function ----------------//
    let newX = currentPlayerPosRef.values.x;
    let newY = currentPlayerPosRef.values.y;
    let oldX = newX;
    let oldY = newY;
    const speed = .007 
    
    let deltaDistance = 0
    if(deltaTime){
      deltaDistance= speed*deltaTime;
    }
    if(dashDistance){
      deltaDistance=dashDistance
    }
    
    function roundToDecimal( value:number , decimals:number) {
      const factor = Math.pow(10, decimals);
      return Math.round(value * factor) / factor;
    }
    if (newX != 0 && newY != 0) {
      newX = roundToDecimal(currentPlayerPosRef.values.x + deltaDistance * direction[0] * 0.7,10);
      newY = roundToDecimal(currentPlayerPosRef.values.y + deltaDistance * direction[1] * 0.7,10);
    } else {
      newX = roundToDecimal(currentPlayerPosRef.values.x + deltaDistance * direction[0],10);
      newY =roundToDecimal( currentPlayerPosRef.values.y + deltaDistance * direction[1],10);
    }
    console.log(newX)
    console.log(newY)

    let isValid = this.checkPlayerBounds(oldX, oldY, newX, newY);
    if (!isValid.validX && !isValid.validY) {
      return false;
    }
    if (isValid.validX) {
      currentPlayerPosRef.values.x = newX;
    }
    if (isValid.validY) {
      currentPlayerPosRef.values.y = newY;
    }
    ////blockSize * Math.floor(cell / this.renderConfig.mapWidth)
    this.mapRenderRef.setValue({ x: roundToDecimal(userDisplacement.x - currentPlayerPosRef.values.x * blockSize,0), y: roundToDecimal(userDisplacement.y - currentPlayerPosRef.values.y * blockSize,0)  })
    // Animated.spring(this.mapRenderRef, {
    //   toValue: { x: userDisplacement.x - currentPlayerPosRef.values.x * blockSize, y: userDisplacement.y - currentPlayerPosRef.values.y * blockSize  },
    //   useNativeDriver: false,
    //   bounciness:2
    // }).start();
    //this.mapRenderRef.setValue({ x: userDisplacement.x - currentPlayerPosRef.values.x * blockSize, y: userDisplacement.y - currentPlayerPosRef.values.y * blockSize });
    this.moveRenderedMap(currentPlayerPosRef.values);
    return true;
  }
  private checkPlayerBounds(oldX: number, oldY: number, newX: number, newY: number) {
    let validityX = true;
    let validityY = true;

    if (
      !(
        this.renderConfig.mapWidth > Math.ceil(newX) - 1 &&
        Math.floor(newX) >= 0 &&
        this.wholeMap.get(
          this.positionToCellNum({
            x: Math.floor(newX),
            y: Math.floor(oldY),
          }),
        ) == undefined
      )
    ) {
      validityX = false;
    }
    if (
      !(
        this.renderConfig.mapHeight > Math.ceil(newY) - 1 &&
        Math.floor(newY) >= 0 &&
        this.wholeMap.get(
          this.positionToCellNum({
            x: Math.floor(oldX),
            y: Math.floor(newY),
          }),
        ) == undefined
      )
    ) {
      validityY = false;
    }

    if (!validityX || !validityY) {
      return { validX: validityX, validY: validityY };
    }
    return { validX: validityX, validY: validityY };
  }
  private teleportRenderedMap(nextPos:PositionValues){
    let nextPosInts = { x: Math.floor(nextPos.x), y: Math.floor(nextPos.y) }; // the -3 and -2 are to center the render on screen
    if (Math.abs(nextPosInts.x - Math.floor(this.startingPlayerPos.x)) == 0 && Math.abs(nextPosInts.y - Math.floor(this.startingPlayerPos.y)) == 0) {
      return;
    }
    for (let [key, value] of this.renderedMapSection) {
      this.resetCellXYRef(key);
    }
    for (let y = this.renderConfig.yOffset; y < this.renderConfig.renderViewHeight; y++) {
      for (let x = this.renderConfig.xOffset; x < this.renderConfig.renderViewWidth; x++) {
        let cellNumAdd = nextPosInts.x + x + (y + nextPosInts.y) * this.renderConfig.mapWidth;
        this.addCellToRender(cellNumAdd);
      }
    }
  }
  public moveRenderedMap(nextPos: PositionValues) {
    //this should be called every time the player moves a certain amount
    let nextPosInts = { x: Math.floor(nextPos.x), y: Math.floor(nextPos.y) }; // the -3 and -2 are to center the render on screen
    if (Math.abs(nextPosInts.x - Math.floor(this.startingPlayerPos.x)) == 0 && Math.abs(nextPosInts.y - Math.floor(this.startingPlayerPos.y)) == 0) {
      return;
    }
    let inViewCells = [];
    for (let y = this.renderConfig.yOffset; y < this.renderConfig.renderViewHeight; y++) {
      for (let x = this.renderConfig.xOffset; x < this.renderConfig.renderViewWidth; x++) {
        let cellNumAdd = nextPosInts.x + x + (y + nextPosInts.y) * this.renderConfig.mapWidth;
        inViewCells.push(cellNumAdd);
        if (this.renderedMapSection.get(cellNumAdd)) {
          continue;
        } else {
          this.addCellToRender(cellNumAdd);
        }
      }
    }
    if(this.decorationsMap.has(this.positionToCellNum({x:nextPosInts.x,y:nextPosInts.y}))!=true){
      if( this.pointMap.get(this.positionToCellNum({x:nextPosInts.x,y:nextPosInts.y}))!=true){
        this.pointsEarned+=1
        this.increasePoints(this.pointsEarned)
        this.pointMap.set(this.positionToCellNum({x:nextPosInts.x,y:nextPosInts.y}),true)
      }
    }


    //incident handling
    let isOnAPoint =false
    for(let point of this.incidentPoint){
      if(point.x==nextPosInts.x  && point.y==nextPosInts.y){
        isOnAPoint=true
      }
    }
    if(!isOnAPoint && this.decorationsMap.has(this.positionToCellNum({x:nextPosInts.x,y:nextPosInts.y}))!=true){
      this.pointMap.set(this.positionToCellNum({x:nextPosInts.x,y:nextPosInts.y}),true)
      this.swapImage(nextPosInts.x + (nextPosInts.y) * this.renderConfig.mapWidth,6)
    }
    for (let [key, value] of this.renderedMapSection) {
      if (!inViewCells.includes(key)) {
        // console.log("mapWidth: "+this.renderConfig.mapWidth+" value:  "+key+" x: "+this.cellNumToPosition(key).x+" y: "+this.cellNumToPosition(key).y)
        this.resetCellXYRef(key);
      }
    }
  }
  cellNumToPosition(cell: number) {
    return {
      y: blockSize * Math.floor(cell / this.renderConfig.mapWidth),
      x: blockSize * Math.floor(cell % this.renderConfig.mapWidth),
    };
  }
  positionToCellNum(pos: PositionValues) {
    return this.renderConfig.mapWidth * Math.floor(pos.y) + Math.floor(pos.x);
  }
  private getCellRefArr(cellNum: number) {
    //returns an cellsXYRefArr of the specified cellNum
    let cellWallType = this.wholeMap.get(cellNum); //returns render cell type
    let cellDecorationType =this.decorationsMap.get(cellNum)
    let cellsXYRefArr;

    if (cellWallType) {
      cellsXYRefArr = this.cellTypes.get(cellWallType);
    } 
    if (cellDecorationType){
      cellsXYRefArr = this.cellTypes.get(cellDecorationType);
    }
    if(!cellWallType && !cellDecorationType) {
      cellsXYRefArr = this.cellTypes.get(-1); //default background rendering
    }
    if (cellsXYRefArr == undefined) {
      return [];
    }
    return cellsXYRefArr;
  }
  private addCellToRender(cellNum: number) {
    //repositions rendered out of view cells to cellNum's translated position
    if (this.renderedMapSection.get(cellNum) != undefined) {
      return;
    }
    let cellsXYRefArr = this.getCellRefArr(cellNum);
    let cellXYRef = cellsXYRefArr.pop();
    if (cellXYRef == undefined) {
      return;
    }
    if (cellNum >= this.renderConfig.mapWidth * this.renderConfig.mapHeight || cellNum < 0) { //check if cell is in bounds
      cellsXYRefArr.push(cellXYRef);
      return;
    }
    if (this.renderedMapSection.get(cellNum) == undefined) {
      cellXYRef.current.setValue(this.cellNumToPosition(cellNum))
      this.renderedMapSection.set(cellNum, cellXYRef);
    } else {
      cellsXYRefArr.push(cellXYRef);
    }
  }
  private resetCellXYRef(cellNum: number) {
    //doesn't unrender just positions asset to unviewable position
    let cellsXYRefArr = this.getCellRefArr(cellNum);
    let cellXYRef = this.renderedMapSection.get(cellNum);
    if (cellXYRef == undefined) {
      return;
    }
    if(cellNum==0){
      console.log("resetting default")
    }
    cellXYRef.current.setValue({ x: 0, y: 0 })
    // Animated.timing(cellXYRef.current, {
    //   toValue: { x: 0, y: 0 },
    //   useNativeDriver: false,
    //   duration: 3,
    // }).start();
    cellsXYRefArr.push(cellXYRef);
    this.renderedMapSection.delete(cellNum);
  }
}
