const MongoClient = require('mongodb').MongoClient
const url = process.env.MONGO_URL

function MongoPool(){}

var p_db

function initPool(cb){
    MongoClient.connect(url, { useUnifiedTopology: true }, function(err, db) {
        if (err) throw err

        p_db = db.db('ds-inno-assignment');
        if(cb && typeof(cb) == 'function')
            cb(p_db)
    })
    return MongoPool
}

MongoPool.initPool = initPool

function getInstance(cb){
    if(!p_db){
        initPool(cb)
    }
    else{
        if(cb && typeof(cb) == 'function')
            cb(p_db)
    }
}
MongoPool.getInstance = getInstance

module.exports = MongoPool
