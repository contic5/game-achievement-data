import { CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Chart as ChartJS } from 'chart.js';
import { Line } from 'react-chartjs-2';
//import { get_unique_values } from './support';

// Register the scales and elements you need
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip);

//const border_colors=["red","blue","green"];
//const background_colors=["darkred","darkblue","darkgreen"];

function GameChart(props: any)
{
    const achievement_data=props.achievement_data;
    const achievement_percents: number[]=new Array(7);
    const labels=["Game Start","First Boss","Early Game","Mid Game","Final Boss","DLC First Boss","DLC Final Boss"];
    for(let row of achievement_data)
    {
        const label_index=labels.indexOf(row["Category"])
        achievement_percents[label_index]=100*row["Percent"];
    }
    const game_title=achievement_data[0]["Game"];

    let datasets=[];
    const dataset={
    label:"Achievement Percent",
    data: achievement_percents,
    borderColor:"blue",
    backgroundColor:"darkblue",
    tension:0.3
    }
    datasets.push(dataset);

    const data = {
    labels: labels,
    datasets: datasets
    };

    const options = {
        scales: {
            y: {
                min: 0,   // Optional: Force scale to start at 0%
                max: 100, // Optional: Force scale to end at 100%
                ticks: {
                    // Append a percentage sign to the Y-axis tick values
                    callback: function(value: string | number) {
                      return `${Number(value)}%`;
                    }
                }
            }
        },
        plugins: {
          title: {
            display: true,
            // Pass an array of strings for multiple lines
            text: `${game_title} Achievement Data`,
            font: {
              size: 16
            },
            padding: {
              top: 10,
              bottom: 30
            }
          }
        }
    };

    const trs=achievement_data.map((row: any)=><tr>
    <td>{row["Category"]}</td>
    <td>{row["Name"]}</td>
    <td>{Math.round(row["Percent"]*100)}%</td>
    </tr>)
    return (<>
    <h3>
    {game_title} Achievement Data
    </h3>
    <Line
    data={data}
    options={options}
    />

    <table className="table">
    <thead>
    <tr>
    <th>Category</th>
    <th scope="col">Achievement</th>
    <th scope="col">Percent</th>
    </tr>
    </thead>
    <tbody>
    {trs}
    </tbody>
    </table>
    </>);
}

export default GameChart;