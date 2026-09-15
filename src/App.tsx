import { useState,useEffect } from 'react'
import get_data from './read_excel'
import GameChart from './GameChart';
import { get_unique_values } from './support';
function App() 
{
  //Excel data is stored as dictionary for easier column access.I care about access the exact column name.
  const [achievement_data, setAchievementData] = useState<Record<any,any>[]>([]);
  const [game_charts,setGameCharts]=useState<React.JSX.Element[]>([]);
  const [sort_by,setSortBy]=useState("Game");
  const [sort_ascending,setSortAscending]=useState(true);

  const categories=["Game Start","First Boss","Early Game","Mid Game","Final Boss","DLC First Boss","DLC Final Boss"];

  function update_sort_by(e: React.ChangeEvent<HTMLSelectElement>)
  {
    setSortBy(e.target.value);
  }
  function update_sort_ascending(new_value:boolean)
  {
    console.log("Make sort "+new_value);
    setSortAscending(new_value);
  }
  function sort_filtered_achievements(a: Record<any, any>[], b: Record<any, any>[])
  {
    let a_percent=0;
    let b_percent=0;
    for(let achievement of a)
    {
      if(achievement["Category"]==sort_by)
      {
        a_percent=achievement["Percent"];
        break;
      }
    }
    for(let achievement of b)
    {
      if(achievement["Category"]==sort_by)
      {
        b_percent=achievement["Percent"];
        break;
      }
    }

    return a_percent-b_percent;
  }
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

  useEffect(()=>
  {
    console.log(sort_by);
    let achievement_data_temp=[...achievement_data];

    if(sort_by=="Game")
    {
      achievement_data_temp.sort((a,b)=>a[sort_by].localeCompare(b[sort_by]));
    }
    else
    {
      achievement_data_temp.sort((a,b)=>a[sort_by]-b[sort_by]);
    }

    if(sort_ascending==false)
    {
      achievement_data_temp=achievement_data_temp.reverse();
    }
    setAchievementData(achievement_data_temp);
  },[sort_ascending,sort_by]);

  useEffect(()=>{
    if(achievement_data!=null&&achievement_data.length>0)
    {
      let achievement_data_temp=[...achievement_data];
      let games=get_unique_values(achievement_data_temp,"Game");
      console.log(games);

      let game_charts_temp=[];
      let achivement_data_filtered_arr=[];
      for(let game of games)
      {
        let achivement_data_filtered=achievement_data_temp.filter(row=>row["Game"]==game&&row["Category"]!=""&&row["Category"]!=null);
        achivement_data_filtered_arr.push(achivement_data_filtered) 
      }

      if(categories.includes(sort_by))
      {
        achivement_data_filtered_arr.sort(sort_filtered_achievements);
        if(sort_ascending==false)
        {
          achivement_data_filtered_arr=achivement_data_filtered_arr.reverse();
        }
      }

      for(let achivement_data_filtered of achivement_data_filtered_arr)
      {
        let game_chart_temp=<GameChart achievement_data={achivement_data_filtered}></GameChart>
        game_charts_temp.push(game_chart_temp);
      }

      setGameCharts(game_charts_temp);
    }
  },[achievement_data])

  
  return (
    <>
      <h1>Steam Achievement Data</h1>
      <h2>About</h2>
      <p>This project tracks Steam Achivement Pecents for some achievement categories.</p>
      <ul className="list-group">
      <li className="list-group-item"><b>Game Start:</b> The player achieved the earliest possible achivement. This is often the during the prologue.</li>
      <li className="list-group-item"><b>First Boss:</b> The player beat the first boss.</li>
      <li className="list-group-item"><b>Early Game:</b> The player beat the early game (about 1/3 of the way through the game). This was determined by me.</li>
      <li className="list-group-item"><b>Mid Game:</b> The player beat the mid game (about 2/3 of the way through the game). This was determined by me.</li>
      <li className="list-group-item"><b>Final Boss:</b> The player beat the final boss and finished the game.</li>
      <li className="list-group-item"><b>DLC First Boss:</b> The player beat the first boss in a DLC. This is absent if the game does not have DLC achivements.</li>
      <li className="list-group-item"><b>DLC Final Boss:</b> The player beat the final boss in the last DLC. This is absent if the game does not have DLC achivements.</li>
      </ul>

      <h2>Results</h2>
      <div className="container d-inline-block bg-light border" id="settings_grid">
      <div className="row">
      <div className="col border">
      Sort By
      </div>
      <div className="col border">
      Direction
      </div>
      </div>
      <div className="row">
      <div className="col border">
      <select id="sort_by" value={sort_by} onChange={update_sort_by}>
      <option value="Game">Game</option>
      <option value="Year">Year</option>
      <option value="Game Start">Game Start</option>
      <option value="First Boss">First Boss</option>
      <option value="Early Game">Early Game</option>
      <option value="Mid Game">Mid Game</option>
      <option value="Final Boss">Final Boss</option>
      <option value="DLC First Boss">DLC First Boss</option>
      <option value="DLC Final Boss">DLC Final Boss</option>
      </select>
      </div>
      <div className="col border">
      <button id="asc_button" onClick={()=>update_sort_ascending(true)}>↑</button>
      <button id="desc_button" onClick={()=>update_sort_ascending(false)}>↓</button>
      </div>
      </div>
      </div>
      {game_charts}
    </>
  )
}

export default App
