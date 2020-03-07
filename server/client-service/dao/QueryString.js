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
  }
}