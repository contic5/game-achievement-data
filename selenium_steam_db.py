import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup

import pandas as pd

def main():
    achievement_arr=[]
    # Initialize the Chrome WebDriver (Selenium Manager configures this automatically)
    driver = webdriver.Chrome()

    game_df=pd.read_excel("Steam_Games.xlsx")
    for index,row in game_df.iterrows():
        try:
            driver.get(row["game_link"])

            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.TAG_NAME, "body"))
            )
            
            page_source=driver.page_source

            soup=BeautifulSoup(page_source)
            achievements_holder=soup.find("div",class_="achievements_list")
            achievement_list_divs=achievements_holder.find_all("div",class_="achievement")
            for achievement_div in achievement_list_divs:
                achievement_dict={}
                achievement_dict["Game"]=row["Game"]
                achievement_dict["Name"]=achievement_div.find("div",class_="achievement_name").text

                description:str=achievement_div.find("div",class_="achievement_desc").text
                description=description.replace("\n","")
                description=description.replace("Hidden achievement:","")
                description=description.strip()
                achievement_dict["Description"]=description

                achievement_percent=achievement_div.find("div",class_="achievement_unlock").text
                achievement_percent=achievement_percent.replace("%","")
                achievement_percent=float(achievement_percent)
                achievement_dict["Percent"]=achievement_percent

                achievement_arr.append(achievement_dict)
            time.sleep(1)
        except:
            driver.quit()
        break

    driver.quit()
    achievement_df=pd.DataFrame.from_dict(achievement_arr)
    print(achievement_df.head())

    achievement_df.to_excel("Steam Achievements.xlsx")

if __name__=="__main__":
    main()