export type Page =
  | "home";

export type WebviewToBlockMessage = 
{ type: "GET_USER_DATA_REQUEST" }|
{ type: "GAME_ENDED", payload:{player_points_earned:number}}|
{ type: "INCREASE_POINTS", payload: { team:string , point_count: number, user_ID: string }}
;

export type BlocksToWebviewMessage =  
{
  type: "GET_USER_DATA_RESPONSE";
  payload: GET_USER_DATA_RESPONSE_PAYLOAD;
}|
{
  type: "GET_GAME_ENDED_RESPONSE";
  payload: GET_GAME_ENDED_RESPONSE_PAYLOAD;
}
 ;

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};


export type GET_USER_DATA_RESPONSE_PAYLOAD = { 
    team1_name: string;
    team2_name: string;
    team1_points: number;
    team2_points: number;
    my_team:string;
    previous_player_points: number ;
    number: number; 
    name: string; 
    error?: string 
}
export type GET_GAME_ENDED_RESPONSE_PAYLOAD = {
  team1_points: number;
  team2_points: number;
  player_point_difference: number,
}




//create Defaults objects based on type
export const createDefaultPayloadGetGameEnded = ():GET_GAME_ENDED_RESPONSE_PAYLOAD=> {
  return {
    team1_points: 0,
    team2_points: 0,
    player_point_difference: 10,
  }
}


export const createDefaultPayloadGetUserData = ():GET_USER_DATA_RESPONSE_PAYLOAD=> {
    return{
      team1_name: "unknown",
      team2_name: "unknown",
      team1_points: 0,
      team2_points: 0,
      my_team:"unkown",
      previous_player_points: 0 ,
      name: "unknown",
      number: 0,
      error: "" 
     }  
};

//typescript cant define return type before compiling
//would use but type errors would be annoying
export const createDefaultPayloadBasedOnType = (type: "INIT_RESPONSE"|"GET_USER_DATA_RESPONSE" ):  GET_USER_DATA_RESPONSE_PAYLOAD => {
    return {
      team1_name: "unknown",
      team2_name: "unknown",
      team1_points: 0,
      team2_points: 0,
      my_team:"unkown",
      previous_player_points: 0 ,
      name: "",
      number: 0,
      error: "" 
     }
};

export type Payload =  GET_USER_DATA_RESPONSE_PAYLOAD