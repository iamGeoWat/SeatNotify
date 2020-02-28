module.exports = {
  subscription: {
    add: 'INSERT INTO subscription VALUES ( ?, ?, ?, ?, ?, ?, ? )',
    query: 'SELECT * FROM subscription',
    queryByUid: 'SELECT * FROM subscription WHERE uid = ?',
    delBySubidUid: 'UPDATE subscription SET cancelled = 1 WHERE sub_id = ? AND uid = ?',
    queryByUidCityDate: 'SELECT * FROM subscription WHERE uid = ? AND city = ? AND date = ?'
  }
}