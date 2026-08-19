import { useState,useEffect } from 'react'
import get_data from './read_excel'

function App() 
{
  //Excel data is stored as dictionary for easier column access.I care about access the exact column name.
  const [achievement_data, setAchievementData] = useState<Record<any,any>[]>([]);


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

  
  return (
    <>
      <h1>Steam Achievement Data</h1>      
    </>
  )
}

export default App
