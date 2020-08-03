# -*- coding: utf-8 -*-
"""
----------- dev by: ------------
@Author    Casey Liu, Dormitabnia
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

sentry_sdk.init("https://e87c6824373b41d1b4bd2eeadb579257@sentry.io/4993408") # 监控插件sentry

Redis = redis.StrictRedis('127.0.0.1', 6379)

firefox = r'/usr/local/bin/geckodriver' # 目录下的geckodriver解压后放在这个位置
driver = webdriver.Firefox(executable_path = firefox)

driver.get('https://toefl.neea.cn/login')
time.sleep(80)  # 80秒时间，在弹出的firefox浏览器登录

# 获取考试城市
citiesJSON = driver.execute_script('return $.getJSON("/getTestCenterProvinceCity")') # 通过接口拿到考试城市数据

# 形成考试城市数组
citiesList = []
for i in range(len(citiesJSON)):
	cities = citiesJSON[i]['cities']
	for city in cities:
		citiesList.append(city['cityNameEn'])


# while循环里持续请求考位信息
while True:
	# 获取考试日
	daysList = None
	try:
		daysJSON = driver.execute_script('return $.getJSON("testDays")')
		daysList = list(daysJSON)
	except Exception as e:
		print(str(e))
		print('TOEFL core login session expired. Please re-login.')
		capture_message('TOEFL core login session expired. Please re-login.') # sentry 错误上报，邮件提醒管理员后手动重启爬虫
		sys.exit(1)

	storage = pd.DataFrame() # 用 pandas dataframe 存储一个考位信息表
	valid_data = True
	# 可用数据标签，现在未启用。
	# 目的是，如果在获取考位信息的途中登录态掉了，为了不让掉登录态后形成的不完整的考位信息表覆盖掉redis中上一个完整的考位信息表，
	# valid_data设为false，来避免对redis写入。
	print('A new round of data fetching started.')
	for city in citiesList:
		for date in daysList[0:9]: # 只拿最近的10个考试日信息
			print('Fetching data from ' + city + ' at ' + date)
			js = 'return $.getJSON("testSeat/queryTestSeats",{city: "%s",testDay: "%s"});' % (city, date)
			try:
				dataJSON = driver.execute_script(js)
				if dataJSON is None: # 错误处理
					print(f"------------------ {date} Error!")
					time.sleep(1)
					continue
				elif not dataJSON['status']: # 错误处理
					print(city, date, "NO data")
					time.sleep(0.5)
					continue
				else: # 拿到数据
					print(city, date, "data fetched")
				for preciseTime, dataDetail in dataJSON['testSeats'].items():
					df = pd.DataFrame(dataDetail)
					df['date'] = date
					storage = pd.concat([storage, df], ignore_index=True)
					print(storage)
				sleep_time = round(random.uniform(2, 3), 1) # 请求间隔一个随机时间，反爬
				time.sleep(sleep_time)
			except Exception as e: # 有时候登录之后如果不通过鼠标主动地点击按钮，发起一次考位查询，就会一直在这里报错。应该是反爬策略
				print(str(e))
				print('Something went wrong.')
				valid_data = True #本来这里是False，但是实际使用里会有问题，有的考场本来就没考位信息，一个这样的考场就导致Redis不写入了
				time.sleep(2)
				continue
		if not valid_data:
			break
	# 数据存入 Redis
	if valid_data:
		Redis.set('seat', str(storage.to_dict('records')))
		Redis.set('days_list', str(daysList[0:9]))
		update_timestamp = time.time()
		Redis.set('update_timestamp', int(update_timestamp))
		Redis.publish('update_timestamp', int(update_timestamp))
	time.sleep(10)
