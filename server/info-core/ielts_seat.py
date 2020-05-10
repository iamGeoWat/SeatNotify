# -*- coding: utf-8 -*-
"""
----------- dev by: ------------
@Author    Xikai Liu
@Github    iamGeoWat
--------------------------------------------------
"""
import sys
import random
import time
from datetime import datetime
from selenium import webdriver
import pandas as pd
import redis
import sentry_sdk
from sentry_sdk import capture_message

sentry_sdk.init("https://e87c6824373b41d1b4bd2eeadb579257@sentry.io/4993408")

Redis = redis.StrictRedis('127.0.0.1', 6379)

firefox = r'/usr/local/bin/geckodriver'
driver = webdriver.Firefox(executable_path=firefox)

driver.get('https://ielts.neea.cn/login')
time.sleep(80)  # 80 seconds to login

# 获取地址
provincesListCn = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁', '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽', '福建', '江西', '山东', '河南', '湖北',
                 '湖南', '广东', '广西', '海南', '重庆', '四川', '贵州', '云南', '陕西', '甘肃', '新疆']
provincesList = ['11', '12', '13', '14', '15', '21', '22', '23', '31', '32', '33', '34', '35', '36', '37', '41', '42',
                 '43', '44', '45', '46', '50', '51', '52', '53', '61', '62', '65']

# continuously fetching data
while True:
    # 获取考试日期
    try:
        monthsJSON = driver.execute_script('return $.getJSON("./querySeat?productId=IELTSPBT")')
        if 'months' not in monthsJSON:
            raise Exception
        monthsList = []
        for i in range(len(monthsJSON['months'])):
            monthsList.append(monthsJSON['months'][i]['adminMonth'])
    except Exception as e:
        print(str(e))
        print('IELTS core login session expired. Please re-login.')
        capture_message('IELTS core login session expired. Please re-login.')
        sys.exit(1)

    storage = pd.DataFrame()
    daysList = set()
    valid_data = True
    for province in provincesList:
        for month in monthsList:
            js = 'return $.getJSON("./queryTestSeats",{queryMonths: "%s", queryProvinces: "%s", productId: "%s"});' % (month, province, 'IELTSPBT')
            try:
                dataJSON = driver.execute_script(js)
                if dataJSON is None:
                    print(f"------------------ {month} Error!")
                    time.sleep(1)
                    continue
                elif ('msg' in dataJSON) and (dataJSON['msg'] == 'Error'):
                    print(province, month, "NO data")
                    time.sleep(0.5)
                    continue
                else:
                    print(province, month, "data fetched")
                for preciseTime, dataDetail in dataJSON.items(): # todo: error detection here
                    df = pd.DataFrame(dataDetail)
                    df = df.drop(['actionType', 'adminDateCn', 'adminDateEn', 'adminGuid', 'adminId', 'adminProvince',
                                  'centerGuid', 'cityCode', 'optStatus', 'optStatusCn', 'optStatusEn',
                                  'provinceCode', 'registerBeginTime', 'registerEndTimeDesc',
                                  'registerEndTimeDescCn', 'registerEndTimeDescEn', 'seatGuid', 'seatStatusCn',
                                  'seatStatusEn', 'srTime', 'testCode', 'transType'], axis=1)
                    df.rename(
                        columns={'registerEndTime': 'cancelDeadline', 'cityNameCn': 'cityCn', 'cityNameEn': 'cityEn',
                                 'provinceNameCn': 'provinceCn', 'provinceNameEn': 'provinceEn', 'fee': 'testFee'},
                        inplace=True)
                    df['lateReg'] = df['lateRegFlag']
                    df['rescheduleDeadline'] = df['cancelDeadline']
                    df['testTime'] = ''
                    df['date'] = ''
                    for index, row in df.iterrows():
                        if row['seatStatus'] == 1:
                            df.at[index, 'seatStatus'] = 1
                        elif row['seatStatus'] == 2:
                            df.at[index, 'seatStatus'] = 0
                        elif row['seatStatus'] == 3:
                            df.at[index, 'seatStatus'] = 2
                        elif row['seatStatus'] == 0:
                            df.at[index, 'seatStatus'] = 3
                        df.at[index, 'testTime'] = datetime.fromtimestamp(row['adminDate'] / 1000 + 28800).strftime('%H:%M')
                        date = datetime.fromtimestamp(row['adminDate'] / 1000 + 28800).strftime('%Y-%m-%d')
                        df.at[index, 'date'] = date
                        daysList.add(date)
                    df = df.drop(['adminDate'], axis=1)
                    df['seatBookStatus'] = df['seatStatus']
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
        print(storage)
        Redis.set('ielts_seat', str(storage.to_dict('records')))
        Redis.set('ielts_days_list', str(daysList))
        update_timestamp = time.time()
        Redis.set('ielts_update_timestamp', int(update_timestamp))
        Redis.publish('ielts_update_timestamp', int(update_timestamp))
    time.sleep(10)