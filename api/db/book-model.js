const db = require('./connection')
const ObjectID = require('mongodb').ObjectID

let Books
db.getInstance( (p_db) => {
  Books = p_db.collection('books')
})

const model = {
  create: async ({title = '', author = '', publishedDate = '', imageUrl = '', description = '', rating = null, peopleRated = 0} = {}) => {
    try {
      if (!title) return {status: 400, error: 'No title provided'};
      
      const book = await Books.insertOne({
        title,
        author,
        publishedDate,
        imageUrl,
        description,
        rating,
        peopleRated
      });
    
      return {status: 200, book};
    } catch (e) {
      console.error(e);
      return {status: 500};
    }
  },
  
  read: async ({id, search} = {}) => {
    try {
      if (id) return await Books.findOne({_id: new ObjectID(id)});
      
      let filter = {};
      if (search) filter = {$or: [{title: new RegExp(search, 'i')}, {author: new RegExp(search, 'i')}]};
      
      return await Books.find(filter).toArray();
    } catch (e) {
      console.error(e);
    }
  },
  
  update: async (_id, data) => {
    try {
      const book = await Books.findOne({_id: new ObjectID(_id)});
      
      let updateQuery = {};
      Object.keys(data).forEach(key => {
        if (Object.keys(book).includes(key) && book[key] !== data[key]) {
          updateQuery[key] = data[key];
        }
      });
      const query = Object.keys(updateQuery).length ? {$set: updateQuery} : null;
      
      await Books.updateOne({_id: new ObjectID(_id)}, query);
      const updated = await Books.findOne({_id: new ObjectID(_id)});
    
      return {status: 200, data: updated};
    } catch (e) {
      console.error(e);
      return {status: 500};
    }
  },
  
  delete: async (_id) => {
    try {
      await Books.deleteOne({_id: new ObjectID(_id)});
    } catch (e) {
      console.error(e);
    }
  },
}

module.exports = model;
