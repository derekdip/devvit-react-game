import { Devvit, useAsync, useState } from '@devvit/public-api';
import { DEVVIT_SETTINGS_KEYS } from './constants.js';
import { sendMessageToWebview } from './utils/utils.js';
import { WebviewToBlockMessage } from '../game/shared.js';
import { WEBVIEW_ID } from './constants.js';
import { Preview } from './components/Preview.js';
console.log("here!!!")

Devvit.addSettings([
  // Just here as an example
  {
    name: DEVVIT_SETTINGS_KEYS.SECRET_API_KEY,
    label: 'API Key for secret things',
    type: 'string',
    isSecret: true,
    scope: 'app',
  },
]);

Devvit.configure({
  redditAPI: true,
  http: true,
  redis: true,
  realtime: true,
});

Devvit.addMenuItem({
  // Please update as you work on your idea!
  label: 'Make my experience post',
  location: 'subreddit',
  forUserType: 'moderator',
  onPress: async (_event, context) => {
    const { reddit, ui } = context;
    const subreddit = await reddit.getCurrentSubreddit();
    const post = await reddit.submitPost({
      // Title of the post. You'll want to update!
      title: 'React Game',
      subredditName: subreddit.name,
      preview: <Preview />,
    });
    ui.showToast({ text: 'Created post!' });
    ui.navigateTo(post.url);
  },
});

// Add a post type definition
Devvit.addCustomPostType({
  name: 'Experience Post',
  height: 'tall',
  render: (context) => {
    const [launched, setLaunched] = useState(false);
    const [myTeam, setMyTeam] = useState("")
    const [team1Points,setTeam1Points] = useState("0");
    const [team2Points,setTeam2Points] = useState("0"); 
    const dataBaseStructure = {
      redditUserID_points: "0",
      redditUserID_team: "teamName",
      team1:"teamName1",
      team2:"teamName2",
      teamName_pointe:"0"
    }
    async function lockInTeam (teamName:string){
      const { redis, reddit } = context;
      const redditUser = await reddit.getAppUser()
      let previousTeamName = await redis.get(redditUser+"_team")
      if(previousTeamName){
        if(previousTeamName!=teamName){//case where your switching teams, we remove points added from previous team
          let previousPointOnOtherTeam =  await redis.get(redditUser.id+"_points")
          let totalPointsOnOtherTeam  = await redis.get(previousTeamName+"_points")
          console.log(previousPointOnOtherTeam)
          console.log(totalPointsOnOtherTeam)
          console.log(previousTeamName)
          await redis.set((redditUser.id+"_points"),"0")
          await redis.set((redditUser+"_team"),teamName)
          if(previousPointOnOtherTeam && totalPointsOnOtherTeam){
            //await redis.set((redditUser.id+"_points"),"0")
            await redis.set((previousTeamName+"_points"),(parseInt(totalPointsOnOtherTeam)-parseInt(previousPointOnOtherTeam)).toString())
          }
        }
      }else{
         await redis.set((redditUser+"_team"),teamName)
      }
      setMyTeam(teamName)
    }
    async function resetGame(){
      const { redis } = context;
      let teamName1 = await redis.get("team1")
      let teamName2 = await redis.get("team2")
      await redis.del(teamName1+"_points")
      await redis.del(teamName2+"_points")
      await redis.set("team1","new Team 1")
      await redis.set("team2","new Team 2")
    }
    async function renderTeamPoints(){
      await getTeam1Points()
      await getTeam2Points()
    }
    async function getTeam1Points (){
      const { redis } = context;
      let teamName = await redis.get("team1")
      let result =await redis.get((teamName+"_points"))
      if(result){
        setTeam1Points(result)
      }
    }
    async function getTeam2Points (){
      const { redis } = context;
      let teamName = await redis.get("team2")
      let result =await redis.get((teamName+"_points"))
      if(result){
        setTeam2Points(result)
      }
    }

    return (
      <vstack height="100%" width="100%" alignment="center middle">
        {launched ? (
          <webview
            id={WEBVIEW_ID}
            url="index.html"
            width={'100%'}
            height={'100%'}

            onMessage={async (event) => {
              console.log('Received message', event);
              const data = event as unknown as WebviewToBlockMessage;
              const { reddit, ui, redis } = context;
              const redditUser = await reddit.getAppUser()

              switch (data.type) {
                case 'GET_USER_DATA_REQUEST':
                  console.log("get_user_data?")
                  let teamNames = ["team1","team2",]
                  let team1_name = await redis.get("team1")
                  let team2_name = await redis.get("team2")

                  let team1_points =await redis.get(team1_name+"_points")
                  let team2_points =await redis.get(team2_name+"_points")
                  if(team1_name==undefined){
                    team1_name = teamNames[0]
                    team1_points = "0"
                  }
                  if(team2_name==undefined){
                    team2_name = teamNames[1]
                    team2_points = "0"
                  }

                  let previousPlayerPoints = await redis.get((redditUser.id+"_points"))
                  if(previousPlayerPoints==undefined){
                    previousPlayerPoints = "0"
                    await redis.set((redditUser.id+"_points"),'0')
                  }
                  // let team1_name = await redis.get("team1")
                  // let team1_points =await redis.get("team1_points")
                  let team1 = {
                    name: (team1_name?team1_name:""),
                    points: parseInt( team1_points?team1_points: "0")
                  }
                  // let team2_name = await redis.get("team2")
                  // let team2_points =await redis.get("team2_points")
                  let team2 = {
                    name: (team2_name?team2_name:""),
                    points: parseInt( team2_points?team2_points: "0")
                  }
                  // redisTeamNames.push(await redis.mGet(["team1","team1_points"]))
                  // redisTeamNames.push(await redis.mGet(["team2","team2_points"]))
                 
                  //console.log(redisTeamNames)
                  console.log("sending data: "+redditUser.username)
                  sendMessageToWebview(context, {
                    type: 'GET_USER_DATA_RESPONSE',
                    payload: {
                      team1_name: team1.name,
                      team2_name: team2.name,
                      team1_points: team1.points,
                      team2_points: team2.points,
                      my_team: myTeam,
                      previous_player_points: 0 ,
                      name:`${redditUser.username}`,
                      number: 1,
                    },
                  });
                  break;
                case 'GAME_ENDED':
                  console.log("game ended switch case")
                  let previousPoints = await redis.get((redditUser.id+"_points"))
                  let previousTotalTeamPoints = await redis.get((myTeam+"_points"))
                  let ge_team1_name = await redis.get("team1")
                  let ge_team2_name = await redis.get("team2")
                  console.log("previous Team points = "+previousPoints)
                  console.log("previous Team points = "+myTeam+"_points")
                  if(previousPoints){
                    if( data.payload.player_points_earned > parseInt(previousPoints)){
                      let difference = data.payload.player_points_earned - parseInt(previousPoints)
                      await redis.set((redditUser.id+"_points"),data.payload.player_points_earned.toString())
                      if(myTeam==ge_team1_name){
                        await redis.incrBy(myTeam+"_points",difference)
                        previousTotalTeamPoints = await redis.get(myTeam+"_points")
                        console.log("increased Team points = "+previousTotalTeamPoints)
                      }else{
                        await redis.incrBy(myTeam+"_points",difference)
                        previousTotalTeamPoints = await redis.get(myTeam+"_points")
                        console.log("increased Team points = "+previousTotalTeamPoints)
                      }
                    }
                  }else{
                    console.log("here previousPoints==undefined")
                    let difference = data.payload.player_points_earned 
                    console.log("here previousPoints==undefined2")
                    await redis.set((redditUser.id+"_points"),data.payload.player_points_earned.toString())
                    console.log("here previousPoints==undefined3")
                    console.log(myTeam)
                    // console.log(ge_team1_name)
                    // if(myTeam==ge_team1_name){
                      let currentPoints = await redis.get(myTeam+"_points")
                      await redis.set(myTeam+"_points",(parseInt(currentPoints?currentPoints:'0')+difference).toString())
                      previousTotalTeamPoints = await redis.get(myTeam+"_points")
                      console.log("increased Team points = "+previousTotalTeamPoints)
                    //}
                  }
                  setLaunched(false)
                  await renderTeamPoints()
                  
                  break;
                case 'INCREASE_POINTS':
                  console.log("increase points")
                  break;

                default:
                  console.log("????")
                  console.error('Unknown message type', data satisfies never);
                  break;
              }
            }}
          />
        ) : (
          <>
          <button
            onPress={async() => {
              const { redis } = context;
              let team1_name = await redis.get("team1")
              await lockInTeam(team1_name?team1_name:"")
              setLaunched(true);
            }}
          >Team 1
          </button>
          <button
            onPress={async() => {
              const { redis } = context;
              let team2_name = await redis.get("team2")
              await lockInTeam(team2_name?team2_name:"")
              setLaunched(true);
            }}
          >
            Team 2
          </button>
          <button onPress={async()=>{
            await renderTeamPoints()
          }} >show stats</button>
           <button onPress={async()=>{
            const {reddit} = context
            let user = (await reddit.getAppUser())
            if(user.id && user.id =="t2_1do6npno0v"){
              await resetGame()
            }
          }} >developer reset button</button>
          <text>team1:{team1Points}</text>
          <text>team2:{team2Points}</text>
          </>
        )}
      </vstack>
    );
  },
});

export default Devvit;
