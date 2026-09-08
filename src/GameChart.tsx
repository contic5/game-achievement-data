import { CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip, Chart as ChartJS } from 'chart.js';
import { Line } from 'react-chartjs-2';
import { get_unique_values } from './support';

// Register the scales and elements you need
ChartJS.register(CategoryScale, LinearScale, LineElement, PointElement, Title, Tooltip);

//const border_colors=["red","blue","green"];
//const background_colors=["darkred","darkblue","darkgreen"];

function GameChart(props: any)
{
    const achievement_data=props.achievement_data;
    const achievement_percents: number[]=get_unique_values(achievement_data,"Percent") as number[];
    const labels=get_unique_values(achievement_data,"Marker");
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
                max: 1, // Optional: Force scale to end at 100%
                ticks: {
                    // Append a percentage sign to the Y-axis tick values
                    callback: function(value: string | number) {
                      return `${100 * Number(value)}%`;
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

    return (<>
    <h2>
    {game_title} Achievement Data
    </h2>
    <Line
    data={data}
    options={options}
    />
    </>);
}

export default GameChart;