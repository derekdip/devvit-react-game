export type Page =
  | "home";

export type WebviewToBlockMessage = { type: "INIT" } |{
  type: "GET_USER_DATA_REQUEST";
 }
;

export type BlocksToWebviewMessage = {
  type: "INIT_RESPONSE";
  payload: INIT_RESPONSE_PAYLOAD;
} | {
  type: "GET_USER_DATA_RESPONSE";
  payload: GET_USER_DATA_RESPONSE_PAYLOAD;
 };

export type DevvitMessage = {
  type: "devvit-message";
  data: { message: BlocksToWebviewMessage };
};

export type  INIT_RESPONSE_PAYLOAD = {postId: string};

export type GET_USER_DATA_RESPONSE_PAYLOAD = { 
    number: number; 
    name: string; 
    error?: string 
}




//create Defaults objects based on type
export const createDefaultPayloadGetUserData = ():GET_USER_DATA_RESPONSE_PAYLOAD=> {
    return{
      number: 0,
      name: "unknown",
      error: "" 
     }  
};

//typescript cant define return type before compiling
//would use but type errors would be annoying
export const createDefaultPayloadBasedOnType = (type: "INIT_RESPONSE"|"GET_USER_DATA_RESPONSE" ):INIT_RESPONSE_PAYLOAD | GET_USER_DATA_RESPONSE_PAYLOAD => {
  if (type == 'INIT_RESPONSE') {
    return { postId: ""};  
  } else {
    return {
      number: 0,
      name: "",
      error: "" 
     }
  }
};

export type Payload = INIT_RESPONSE_PAYLOAD | GET_USER_DATA_RESPONSE_PAYLOAD