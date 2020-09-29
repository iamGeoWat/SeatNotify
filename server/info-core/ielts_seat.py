# -*- coding: utf-8 -*-
"""
----------- dev by: ------------
@Author    Casey Liu, Dormitabnia
@Github    iamGeoWat
--------------------------------------------------
"""
import os
import sys
import random
import time
from datetime import datetime
from selenium import webdriver
import pandas as pd
import redis
import sentry_sdk
from sentry_sdk import capture_message
from selenium.webdriver.common.by import By
from captcha_break.recognization import captcha_break_from_url
from selenium.webdriver.common.action_chains import ActionChains

sentry_sdk.init("https://e87c6824373b41d1b4bd2eeadb579257@sentry.io/4993408")
Redis = redis.StrictRedis('127.0.0.1', 6379)
firefox = r'/usr/local/bin/geckodriver'
profile = webdriver.FirefoxProfile()
profile.set_preference("network.proxy.type", 0)
driver = webdriver.Firefox(executable_path=firefox, firefox_profile=profile)
driver.set_window_size(width=1024, height=768, windowHandle='current')
actions = ActionChains(driver)


# 重启爬虫，替换sys.exit()
def restart_program():
    driver.close()
    python = sys.executable
    os.execl(python, python, *sys.argv)


def login_prepare():
    time.sleep(10)
    driver.find_element(By.ID, 'userId').click()
    driver.find_element(By.ID, "userId").send_keys("ldsxxs@163.com")
    driver.find_element(By.ID, "userPwd").click()
    driver.find_element(By.ID, "userPwd").send_keys("Liuxikai1998")
    time.sleep(2)
    captcha_url = driver.find_element(By.ID, "chkImg").get_attribute("src")
    captcha = captcha_break_from_url(captcha_url)
    driver.find_element(By.ID, "checkImageCode").send_keys(captcha)
    driver.find_element(By.ID, "btn_log_goto").click()
    time.sleep(10)
    if driver.current_url == 'https://ielts.neea.cn/login':
        login_prepare()
    else:
        driver.execute_script("loadPage('querySeat?productId=IELTSPBT');")
        time.sleep(1)
        driver.find_element(By.ID, "months").find_elements_by_xpath(".//*")[0].find_element_by_xpath("//input").click()
        time.sleep(0.5)
        driver.find_element(By.ID, "mvfSiteProvinces211").click()
        time.sleep(1)
        query_button = driver.find_element(By.ID, "btnSearch")
        driver.execute_script("arguments[0].scrollIntoView();", query_button)
        time.sleep(1)
        actions.click(query_button).perform()
        query_button.click()


driver.implicitly_wait(20) # seconds
driver.get('https://ielts.neea.cn/login')
login_prepare()
print('-----------prepared for cycle start.--------------')
time.sleep(5)

# 雅思代码大同小异，只是省份和省份编号是写死的。
# 拿到的数据结构经过了一系列的增减、属性名mapping，以符合托福的考位信息表的数据结构，方便接口服务器以及通知服务器的复用。
provincesListCn = ['北京', '天津', '河北', '山西', '内蒙古', '辽宁',
                   '吉林', '黑龙江', '上海', '江苏', '浙江', '安徽',
                   '福建', '江西', '山东', '河南', '湖北', '湖南',
                   '广东', '广西', '海南', '重庆', '四川', '贵州',
                   '云南', '陕西', '甘肃', '新疆']
provincesList = ['11', '12', '13', '14', '15', '21', '22', '23',
                 '31', '32', '33', '34', '35', '36', '37', '41',
                 '42', '43', '44', '45', '46', '50', '51', '52',
                 '53', '61', '62', '65']

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
        restart_program()

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
                    time.sleep(1.5)
                    continue
                elif ('msg' in dataJSON) and (dataJSON['msg'] == 'Error'):
                    print(province, month, "NO data")
                    time.sleep(1.5)
                    continue
                else:
                    print(province, month, "data fetched")
                for preciseTime, dataDetail in dataJSON.items():  # todo: error detection here
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
                sleep_time = round(random.uniform(1, 2), 1)
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
