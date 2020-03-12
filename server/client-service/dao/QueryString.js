module.exports = {
  subscription: {
    add: 'INSERT INTO subscription VALUES ( ?, ?, ?, ?, ?, ?, ? )',
    query: 'SELECT * FROM subscription',
    queryByUid: 'SELECT * FROM subscription WHERE uid = ?',
    delBySubidUid: 'UPDATE subscription SET cancelled = 1 WHERE sub_id = ? AND uid = ?',
    queryByUidCityDate: 'SELECT * FROM subscription WHERE uid = ? AND city = ? AND date = ?',
    queryHotSubs: 'SELECT * FROM subscription WHERE cancelled = 0 AND notified = 0',
    modHasSeatBySubId: 'UPDATE subscription SET has_seat = ? WHERE sub_id = ?',
    modHasSeatByUidCityDate: 'UPDATE subscription SET has_seat = ? WHERE uid = ? AND city = ? AND date = ?',
    modNotifiedByUidCityDate: 'UPDATE subscription SET notified = ? WHERE uid = ? AND city = ? AND date = ?'
  },
  ielts_subscription: {
    add: 'INSERT INTO ielts_subscription VALUES ( ?, ?, ?, ?, ?, ?, ? )',
    query: 'SELECT * FROM ielts_subscription',
    queryByUid: 'SELECT * FROM ielts_subscription WHERE uid = ?',
    delBySubidUid: 'UPDATE ielts_subscription SET cancelled = 1 WHERE sub_id = ? AND uid = ?',
    queryByUidCityDate: 'SELECT * FROM ielts_subscription WHERE uid = ? AND city = ? AND date = ?',
    queryHotSubs: 'SELECT * FROM ielts_subscription WHERE cancelled = 0 AND notified = 0',
    modHasSeatBySubId: 'UPDATE ielts_subscription SET has_seat = ? WHERE sub_id = ?',
    modHasSeatByUidCityDate: 'UPDATE ielts_subscription SET has_seat = ? WHERE uid = ? AND city = ? AND date = ?',
    modNotifiedByUidCityDate: 'UPDATE ielts_subscription SET notified = ? WHERE uid = ? AND city = ? AND date = ?'
  }
}