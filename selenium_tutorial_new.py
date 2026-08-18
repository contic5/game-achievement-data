import time
from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.common.keys import Keys

# Initialize the Chrome WebDriver (Selenium Manager configures this automatically)
driver = webdriver.Chrome()

try:
    # 1. Open a website
    driver.get("https://www.google.com")
    
    # 2. Locate the search box using its name attribute
    search_box = driver.find_element(By.NAME, "q")
    
    # 3. Type text and hit Enter
    search_box.send_keys("Selenium Python")
    search_box.send_keys(Keys.RETURN)
    
    # Wait 3 seconds to see the results
    time.sleep(3)
    
    # Print the new page title
    print("Page Title is:", driver.title)

finally:
    # 4. Clean up and close the browser windows safely
    driver.quit()