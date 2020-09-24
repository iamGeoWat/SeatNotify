# -*- coding: utf-8 -*-
"""
----------- dev by: ------------
@Author    Casey Liu, Dormitabnia
@Github    iamGeoWat
--------------------------------------------------
"""
import sys
import os
import random
import time
from selenium import webdriver
import selenium.common.exceptions as sce
import pandas as pd
import redis
import sentry_sdk
from selenium.webdriver.common.by import By
from selenium.webdriver.common.action_chains import ActionChains
from selenium.webdriver.support.ui import Select
from captcha_break.recognization import captcha_break_from_url

# settings
sentry_sdk.init("https://e87c6824373b41d1b4bd2eeadb579257@sentry.io/4993408")  # 监控插件sentry
Redis = redis.StrictRedis('127.0.0.1', 6379)
firefox = r'/usr/local/bin/geckodriver'  # 目录下的geckodriver解压后放在这个位置
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


# 登录态失去时的处理方法
def handle_expire():
    print('TOEFL core login session expired. Please re-login.')
    # sentry 错误上报，邮件提醒管理员后手动重启爬虫
    sentry_sdk.capture_message('TOEFL core login session expired. Please re-login.', level='error')
    restart_program()


# login procedure
def login_prepare():
#     time.sleep(5)
    driver.find_element(By.ID, "userName").click()
    if driver.find_element(By.ID, "userName").get_attribute("value") != "8399558":
        driver.find_element(By.ID, "userName").send_keys("8399558")
    driver.find_element(By.ID, "textPassword").click()
    driver.find_element(By.ID, "textPassword").send_keys("LKX@666")
    driver.find_element(By.ID, "verifyCode").click()
#     time.sleep(2)
    captcha_url = driver.find_element(By.ID, "chkImg").get_attribute("src")
    captcha = captcha_break_from_url(captcha_url)
    driver.find_element(By.ID, "verifyCode").send_keys(captcha)
    driver.find_element(By.ID, "btnLogin").click()
#     time.sleep(5)
    if driver.current_url == 'https://toefl.neea.cn/login':
        login_prepare()
    else:
        driver.get(driver.current_url + "#!/testSeat")
#         time.sleep(1)
        driver.find_element(By.ID, "centerProvinceCity").click()
#         time.sleep(0.5)
        select = Select(driver.find_element(By.ID, "centerProvinceCity"))
        select.select_by_index(2)
        driver.find_element(By.ID, "testDays").click()
        time.sleep(0.5)
        select = Select(driver.find_element(By.ID, "testDays"))
        select.select_by_index(2)
#         time.sleep(1)
        query_button = driver.find_element(By.ID, "btnQuerySeat")
        actions.move_to_element_with_offset(query_button, 5, 5).perform()
        time.sleep(1)
        actions.click(query_button).perform()
        time.sleep(1)


driver.implicitly_wait(20) # seconds
driver.get('https://toefl.neea.cn/login')
login_prepare()
print('-----------prepared for cycle start.--------------')

# 获取考试城市
time.sleep(10)
citiesJSON = driver.execute_script('return $.getJSON("/getTestCenterProvinceCity")')  # 通过接口拿到考试城市数据

# 形成考试城市数组
citiesList = []
for i in range(len(citiesJSON)):
    cities = citiesJSON[i]['cities']
    for city in cities:
        citiesList.append(city['cityNameEn'])

# 获取考试日
time.sleep(5)
daysList = None
try:
    daysJSON = driver.execute_script('return $.getJSON("testDays")')
    print('daysJSON is fetched.')
    daysList = list(daysJSON)
    if not str.isdigit(daysList[0][0]):
        handle_expire()
except Exception as e:
    print(str(e))
    sentry_sdk.capture_exception(e)

time.sleep(5)
# while循环里持续请求考位信息
while True:
    storage = pd.DataFrame()  # 用 pandas dataframe 存储一个考位信息表
    valid_data = True
    # 可用数据标签，现在未启用。
    # 目的是，如果在获取考位信息的途中登录态掉了，为了不让掉登录态后形成的不完整的考位信息表覆盖掉redis中上一个完整的考位信息表，
    # valid_data设为false，来避免对redis写入。
    print('A new round of data fetching started.')
    for city in citiesList:
        for date in daysList[0:29]:  # 只拿最近的30个考试日信息
            print('Fetching data from ' + city + ' at ' + date)
            js = 'return $.getJSON("testSeat/queryTestSeats",{city: "%s",testDay: "%s"});' % (city, date)
            try:
                dataJSON = driver.execute_script(js)
                print('raw data:', dataJSON)
                # 错误处理
                if dataJSON is None:
                    print(f"------------------ {date} Error!")
                    time.sleep(1)
                    continue
                # 考位不存在
                elif not dataJSON['status']:
                    print(city, date, "NO data")
                    print('status:', dataJSON['status'])
                    time.sleep(round(random.uniform(1, 2), 1))
                    continue
                # 成功拿到数据
                print(city, date, "data fetched successfully!")
                for preciseTime, dataDetail in dataJSON['testSeats'].items():
                    df = pd.DataFrame(dataDetail)
                    df['date'] = date
                    storage = pd.concat([storage, df], ignore_index=True)
                    print(storage)
                sleep_time = round(random.uniform(1, 2), 1)  # 请求间隔一个随机时间，反爬
                time.sleep(sleep_time)
            # 有时候登录之后如果不通过鼠标主动地点击按钮，发起一次考位查询，就会一直在这里报错。应该是反爬策略
            # 手动退出登录也会产生该异常，目前无法分辨，出现该异常时作为登录态消失处理
            except sce.JavascriptException as e:
                print(str(e))
                handle_expire()
                # print('A manual request needed!')
                # valid_data = True  # 本来这里是False，但是实际使用里会有问题，有的考场本来就没考位信息，一个这样的考场就导致Redis不写入了
                # time.sleep(2)
                # continue
            except Exception as e:
                print('Exception occur!', e.__class__)
                print(str(e))
                sentry_sdk.capture_exception(e)
        if not valid_data:
            break

    # 判断登录态是否存在
    try:
        daysJSON = driver.execute_script('return $.getJSON("testDays")')
        # print(daysJSON)
        if not str.isdigit(list(daysJSON)[0][0]):
            handle_expire()
    except Exception as e:
        print(str(e))
        sentry_sdk.capture_exception(e)

    # 数据存入 Redis
    # if valid_data:
    Redis.set('seat', str(storage.to_dict('records')))
    Redis.set('days_list', str(daysList[0:9]))
    update_timestamp = time.time()
    Redis.set('update_timestamp', int(update_timestamp))
    Redis.publish('update_timestamp', int(update_timestamp))
    time.sleep(5)
