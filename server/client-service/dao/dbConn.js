const mysql = require('promise-mysql')
const dbConf = require('../config/dbConfig')

module.exports = async () => {
  try {
    let pool
    let conn
    if (pool) {
      conn = pool.getConnection()
    } else {
      pool = await mysql.createPool(dbConf.mysql)
      conn = pool.getConnection()
    }
    return conn
  } catch (exception) {
    throw exception
  }
}