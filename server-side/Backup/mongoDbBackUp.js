const { MongoClient } = require('mongodb');
exports.backupDatabase = async(sourceUri, targetUri) => {

    try {
        const sourceClient = await MongoClient.connect(sourceUri, { useUnifiedTopology: true });
        const targetClient = await MongoClient.connect(targetUri, { useUnifiedTopology: true });
    
        const sourceDb = sourceClient.db();
        const targetDb = targetClient.db();
    
        const collections = await sourceDb.collections();
    
        for (const collection of collections) {
        let i = 0;
        const documents = await collection.find({}).toArray();
        for (const document of documents) {
            console.log(`Backing up document ${i++} from collection ${collection.collectionName}`);
            await targetDb.collection(collection.collectionName).updateOne({ _id: document._id }, { $set: document }, { upsert: true });
        }
        }
    
        sourceClient.close();
        targetClient.close();
    } catch (error) {
        console.error(`Error while backing up the database: ${error.message}`);
    }
      
}