const dbConn = require('./dbConn');
const queryString = require('./QueryString').ielts_subscription;

module.exports = class SubscriptionDao {
  async query () {
    let conn = await dbConn();
    try {
      let result = await conn.query(queryString.query);
      result = JSON.parse(JSON.stringify(result));
      return result
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await conn.release();
      await conn.destroy()
    }
  }
  async add (uid, city, date, notified, cancelled, has_seat) {
    let conn = await dbConn();
    try {
      await conn.query(queryString.add, [null, uid, city, date, notified, cancelled, has_seat]);
      return true
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await conn.release();
      await conn.destroy()
    }
  }
  async delBySubidUid (sub_id, uid) {
    let conn = await dbConn();
    try {
      await conn.query(queryString.delBySubidUid, [sub_id, uid]);
      return true
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await conn.release();
      await conn.destroy()
    }
  }
  async queryByUid (uid) {
    let conn = await dbConn();
    try {
      let result = await conn.query(queryString.queryByUid, uid);
      return result
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await conn.release();
      await conn.destroy()
    }
  }
  async queryByUidCityDate (uid, city, date) {
    let conn = await dbConn();
    try {
      let result = await conn.query(queryString.queryByUidCityDate, [uid, city, date]);
      return result
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await conn.release();
      await conn.destroy()
    }
  }
  async queryHotSubs () {
    let conn = await dbConn();
    try {
      let result = await conn.query(queryString.queryHotSubs);
      return result
    } catch (e) {
      console.log(e);
      throw e
    } finally {
      await conn.release();
      await conn.destroy()
    }
  }
  async modHasSeatBySubId (status, sub_id) {
    let conn = await dbConn()
    try {
      await conn.query(queryString.modHasSeatBySubId, [status, sub_id])
      return true
    } catch (e) {
      console.log(e)
      throw e
    } finally {
      await conn.release()
      await conn.destroy()
    }
  }
  async modHasSeatByUidCityDate (status, uid, city, date) {
    let conn = await dbConn()
    try {
      await conn.query(queryString.modHasSeatByUidCityDate, [status, uid, city, date])
      return true
    } catch (e) {
      console.log(e)
      throw e
    } finally {
      await conn.release()
      await conn.destroy()
    }
  }
  async modNotifiedByUidCityDate (status, uid, city, date) {
    let conn = await dbConn()
    try {
      await conn.query(queryString.modNotifiedByUidCityDate, [status, uid, city, date])
      return true
    } catch (e) {
      console.log(e)
      throw e
    } finally {
      await conn.release()
      await conn.destroy()
    }
  }
};