import requests
import os
from dotenv import load_dotenv
# Load variables from the .env file into the system environment
load_dotenv()

# Access the variables using os.getenv()
STEAM_API_KEY = os.getenv("STEAM_API_KEY")

import pandas as pd
import time

def main():
    game_df=pd.read_excel("Steam_Games.xlsx")
    for index,row in game_df.iterrows():
        game_id=row["game_id"]

        response=requests.get(f"https://api.steampowered.com/ISteamUserStats/GetGlobalAchievementPercentagesForApp/v0002/?gameid={game_id}&format=json",params={"key":STEAM_API_KEY})
        print(response.status_code)
        achievement_percents=response.json()
        print(achievement_percents)

        time.sleep(1)
        break

if __name__=="__main__":
    main()