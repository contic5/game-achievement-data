import requests
from bs4 import BeautifulSoup

def main():
    response=requests.get("https://steamdb.info/app/1627720/stats/")
    print(response.status_code)
    soup=BeautifulSoup(response.content)

    achievements_list_div=soup.find("div",class_="achievements_list")
    print(achievements_list_div)

if __name__=="__main__":
    main()