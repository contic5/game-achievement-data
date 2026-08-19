import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup

import pandas as pd

default_values={"Name":"NAME_MISSING","Description":"DESCRIPTION_MISSING","Percent":-1,"Image_Link":"IMAGE_MISSING"}

def save_data(achievement_arr):
    achievement_df=pd.DataFrame.from_dict(achievement_arr)
    print(len(achievement_df))
    print(achievement_df.tail(1),end="\n\n")
    achievement_df.to_excel("Steam Achievements.xlsx")

def get_page_data(achievement_arr,game,page_source):
    soup=BeautifulSoup(page_source,features="lxml")
    achievements_holder=soup.find("div",class_="achievements_list")
    achievement_list_divs=achievements_holder.find_all("div",class_="achievement")
    for achievement_div in achievement_list_divs:
        achievement_dict={}
        achievement_dict["Game"]=game
        try:
            achievement_dict["Name"]=achievement_div.find("div",class_="achievement_name").text

            description:str=achievement_div.find("div",class_="achievement_desc").text
            description=description.replace("\n","")
            description=description.replace("Hidden achievement:","")
            description=description.strip()
            achievement_dict["Description"]=description

            achievement_percent=achievement_div.find("div",class_="achievement_unlock").text
            achievement_percent=achievement_percent.replace("%","")
            achievement_percent=float(achievement_percent)/100
            achievement_dict["Percent"]=achievement_percent

            img_element=achievement_div.find("img",class_="achievement_image")
            achievement_dict["Image_Link"]=img_element.get("data-src") or img_element.get("src")

        except Exception:
            for key in default_values:
                if not key in achievement_dict:
                    achievement_dict[key]=default_values[key]
        finally:
            achievement_arr.append(achievement_dict)
    save_data(achievement_arr)

def main():
    achievement_arr=[]

    game_df=pd.read_excel("Steam_Games.xlsx")
    start_row=11
    for index,row in game_df.iterrows():
        if index<start_row:
            continue

        # Initialize the Chrome WebDriver (Selenium Manager configures this automatically)
        driver = webdriver.Chrome()
        print(row["Game"])
        try:
            driver.get(row["game_link"])

            WebDriverWait(driver, 10).until(
                EC.presence_of_element_located((By.CLASS_NAME, "achievements_list"))
            )
            WebDriverWait(driver, 10).until(
                EC.presence_of_all_elements_located((By.CLASS_NAME, "achievement_image"))
            )
            
            page_source=driver.page_source
            get_page_data(achievement_arr,row["Game"],page_source)
        except Exception as e:
            print(e)
        finally:
            driver.quit()
            time.sleep(2)
    
    save_data(achievement_arr)

if __name__=="__main__":
    main()