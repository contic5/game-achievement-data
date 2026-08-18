import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC

from bs4 import BeautifulSoup

def main():
    # Initialize the Chrome WebDriver (Selenium Manager configures this automatically)
    driver = webdriver.Chrome()

    try:
        driver.get("https://steamdb.info/app/1627720/stats/")

        WebDriverWait(driver, 10).until(
            EC.presence_of_element_located((By.TAG_NAME, "body"))
        )
        
        page_source=driver.page_source

        soup=BeautifulSoup(page_source)
        achievements_list_div=soup.find("div",class_="achievements_list")
        print(achievements_list_div)

    finally:
        driver.quit()

if __name__=="__main__":
    main()