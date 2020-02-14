# -*- coding: utf-8 -*-
"""
-----------------------
@Author    Michael Wang
@GitHub    Michany
@Website   michany.xyz
-----------------------
Created on Tue Jun  1 13:24:27 2019
"""

import time
from selenium import webdriver
import pandas as pd

#%%
#firefox = r'C:\Users\70242\Downloads\Chrome Download\geckodriver.exe'
firefox = r'/usr/local/bin/geckodriver'
driver = webdriver.Firefox(executable_path = firefox)

#%%
driver.get('https://toefl.neea.edu.cn/')
time.sleep(35)  # 35秒时间手动登录

#%% 获取地址和日期
citiesJSON = driver.execute_script('return $.getJSON("/getTestCenterProvinceCity")')

citiesList = []
for i in range(len(citiesJSON)):
	cities = citiesJSON[i]['cities']
	for city in cities:
		citiesList.append(city['cityNameEn'])


daysJSON = driver.execute_script('return $.getJSON("testDays")')
daysList = list(daysJSON)

#%% 循环获取信息
storage = pd.DataFrame()
f = open("./res.txt", 'w+')

for city in citiesList:
	for date in daysList[0:11]:
		js = 'return $.getJSON("testSeat/queryTestSeats",{city: "%s",testDay: "%s"});' % (city, date)
		try:
			dataJSON = driver.execute_script(js)
			if dataJSON is None:
				print(f"------------------ {date} Error!")
				time.sleep(1)
				continue
			elif not dataJSON['status']:
				print(city, date, "NO data")
				time.sleep(0.5)
				continue
			else:
				print(city, date, "data fetched")
			for preciseTime, dataDetail in dataJSON['testSeats'].items():
				df = pd.DataFrame(dataDetail)
				df['date'] = date
				print(df.to_string(), file=f)
				storage = pd.concat([storage, df], ignore_index=True)
				print(storage)

			time.sleep(0.5)
		except Exception as e:
			print(str(e))
