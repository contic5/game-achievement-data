export function record_array_to_2d_array(record_array:Record<any,any>[])
{
    let res:any[][]=[];
    for(let row of record_array)
    {
        const keys=Object.keys(row);
        res.push([]);

        let column=0;
        for(let key of keys)
        {
            res[res.length-1][column]=row[key];
        }
    }
    return res;
}

export function get_unique_values(record_array:Record<any,any>[],target_column:string,ignore_blank=true)
{
    let unique_values=new Set();
    for(let row of record_array)
    {
        if(ignore_blank&&row[target_column])
        {
            unique_values.add(row[target_column]);
        }
        else if(!ignore_blank)
        {
            unique_values.add(row[target_column]);
        }
    }

    return [...unique_values];
}

//Randomly shuffle data
export function shuffle_values(arr:any[])
{
    for(let i=arr.length-1;i>0;i--)
    {
        let j=Math.floor(Math.random()*(i+1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
    }
    return arr;
}