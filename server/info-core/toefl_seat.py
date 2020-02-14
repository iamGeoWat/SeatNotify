# -*- coding: utf-8 -*-
"""
------- data fetching method developed by: -------
@Author    Michael Wang
@Website   michany.xyz
----------- optimized and modified by: ------------
@Author    Xikai Liu
@Github    iamGeoWat
--------------------------------------------------
"""

import time
from selenium import webdriver
import pandas as pd

import redis
Redis = redis.StrictRedis('127.0.0.1', 6379)

#%%
firefox = r'/usr/local/bin/geckodriver'
driver = webdriver.Firefox(executable_path = firefox)

#%%
driver.get('https://toefl.neea.edu.cn/')
time.sleep(30)  # 30 seconds to login

#%% 获取地址和日期
citiesJSON = driver.execute_script('return $.getJSON("/getTestCenterProvinceCity")')

citiesList = []
for i in range(len(citiesJSON)):
	cities = citiesJSON[i]['cities']
	for city in cities:
		citiesList.append(city['cityNameEn'])


daysJSON = driver.execute_script('return $.getJSON("testDays")')
daysList = list(daysJSON)

#continuously fetch data
#for develop record use
f = open("res.txt", 'w+')

while True:
	storage = pd.DataFrame()
	for city in citiesList:
		for date in daysList[0:9]:
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
					storage = pd.concat([storage, df], ignore_index=True)
					print(storage)
					#for develop record use
					f.seek(0)
					f.truncate()
					print(storage.to_dict('records'), file=f)
				time.sleep(1)
			except Exception as e:
				print(str(e))
				break
	# storage go to redis
	Redis.set('seat', str(storage.to_dict('records')))
	time.sleep(10)