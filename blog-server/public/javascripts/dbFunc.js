exports.dbFind = function(db) {
  // Find some documents
    db.collection('Posts').find({}).toArray(function(err, docs) {
    assert.equal(err, null);
    console.log("Found the following records");
    console.log(docs)
    // callback(docs);
  });
}