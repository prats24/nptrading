const { MongoClient } = require('mongodb');
exports.copy = async(sourceUri, targetUri) => {

    MongoClient.connect(sourceUri, function(err, clientSource) {
        if (err) throw err;
        
        // Connect to the destination MongoDB database
        MongoClient.connect(targetUri, function(err, clientDest) {
          if (err) throw err;
          
          // Select the source database
          const dbSource = clientSource.db('sourceDB');
          
          // Iterate over each collection in the source database
          dbSource.listCollections().toArray(function(err, collections) {
            if (err) throw err;
            
            collections.forEach(function(collection) {
              const colName = collection.name;
              const colSource = dbSource.collection(colName);
              
              // Retrieve all documents in the collection
              colSource.find().toArray(function(err, docs) {
                if (err) throw err;
                
                // Insert documents into the corresponding collection in the destination database
                const dbDest = clientDest.db('destDB');
                const colDest = dbDest.collection(colName);
                colDest.insertMany(docs, function(err, res) {
                  if (err) throw err;
                  
                  console.log(`Copied ${res.insertedCount} documents to ${colName}`);
                });
              });
            });
            
            // Close the MongoDB connections
            clientSource.close();
            clientDest.close();
          });
        });
      });
      
}

exports.deleteDb = async(url) => {

// Connect to the MongoDB database

console.log("in delete db")
// MongoClient.connect(url, function(err, client) {
//     if (err) throw err;
    
//     // Get the database object
//     const db = client.db('test');
    
//     console.log("db", db)
//     // Drop the entire database
//     db.dropDatabase(function(err, result) {
//       if (err) throw err;
      
//       console.log('Database dropped successfully');
      
//       // Close the MongoDB connection
//       client.close();
//     });
//   });


      // Create a new client for the destination cluster

      
}