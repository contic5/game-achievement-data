import { useState,useEffect } from 'react'
import get_data from './read_excel'
import GameChart from './GameChart';
import { get_unique_values } from './support';
function App() 
{
  //Excel data is stored as dictionary for easier column access.I care about access the exact column name.
  const [achievement_data, setAchievementData] = useState<Record<any,any>[]>([]);
  const [game_charts,setGameCharts]=useState<React.JSX.Element[]>([]);

  //Load the mock participant data
  useEffect(()=>{
    async function load_data()
    {
      if(achievement_data==null||achievement_data.length==0)
      {
        let sample_data_temp=await get_data("Steam Achievements Stable.xlsx","Data");
        console.log(sample_data_temp);
        setAchievementData(sample_data_temp);
      }
    }
    load_data();
  },[]);

  useEffect(()=>{
    if(achievement_data!=null&&achievement_data.length>0)
    {
      let achievement_data_temp=[...achievement_data];
      let games=get_unique_values(achievement_data_temp,"Game");
      console.log(games);

      let game_charts_temp=[];
      for(let game of games)
      {
        let achivement_data_filtered=achievement_data_temp.filter(row=>row["Game"]==game&&row["Marker"]!=""&&row["Marker"]!=null);

        let game_chart_temp=<GameChart achievement_data={achivement_data_filtered}></GameChart>
        game_charts_temp.push(game_chart_temp);
      }
      setGameCharts(game_charts_temp);
    }
  },[achievement_data])

  
  return (
    <>
      <h1>Steam Achievement Data</h1>
      {game_charts}
    </>
  )
}

export default App
