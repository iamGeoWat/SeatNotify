# -*- coding: utf-8 -*-
"""
------- data fetching method by: -------
@Author    Michael Wang
@Website   michany.xyz
----------- optimized and modified by: ------------
@Author    Xikai Liu
@Github    iamGeoWat
--------------------------------------------------
"""
import sys
import random
import time
from selenium import webdriver
import pandas as pd
import redis
import sentry_sdk
from sentry_sdk import capture_message

sentry_sdk.init("https://e87c6824373b41d1b4bd2eeadb579257@sentry.io/4993408")

Redis = redis.StrictRedis('127.0.0.1', 6379)

firefox = r'/usr/local/bin/geckodriver'
driver = webdriver.Firefox(executable_path = firefox)

driver.get('https://toefl.neea.edu.cn/login')
time.sleep(80)  # 80 seconds to login

# 获取地址
citiesJSON = driver.execute_script('return $.getJSON("/getTestCenterProvinceCity")')

citiesList = []
for i in range(len(citiesJSON)):
	cities = citiesJSON[i]['cities']
	for city in cities:
		citiesList.append(city['cityNameEn'])


#continuously fetching data

while True:
	# 获取考试日期
	daysList = None
	try:
		daysJSON = driver.execute_script('return $.getJSON("testDays")')
		daysList = list(daysJSON)
	except Exception as e:
		print(str(e))
		print('TOEFL core login session expired. Please re-login.')
		capture_message('TOEFL core login session expired. Please re-login.')
		sys.exit(1)

	storage = pd.DataFrame()
	valid_data = True
	print('A new round of data fetching started.')
	for city in citiesList:
		for date in daysList[0:9]:
			print('Fetching data from ' + city + ' at ' + date)
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
				sleep_time = round(random.uniform(2, 3), 1)
				time.sleep(sleep_time)
			except Exception as e:
				print(str(e))
				print('Something went wrong.')
				valid_data = True
				time.sleep(2)
				continue
		if not valid_data:
			break
	# storage go to redis
	if valid_data:
		Redis.set('seat', str(storage.to_dict('records')))
		Redis.set('days_list', str(daysList[0:9]))
		update_timestamp = time.time()
		Redis.set('update_timestamp', int(update_timestamp))
		Redis.publish('update_timestamp', int(update_timestamp))
	time.sleep(10)