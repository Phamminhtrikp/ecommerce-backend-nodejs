const { Types: { ObjectId } } = require('mongoose');

const toObjectId = (id) => {
  if (!id) return null;
  return id instanceof ObjectId ? id : new ObjectId(id);
};

module.exports = { toObjectId };
