const { MongoClient } = require('mongodb');


exports.dbBackup = async() => {

    // const destinationUri = "mongodb+srv://vvv201214:vvv201214@development.tqykp6n.mongodb.net/?retryWrites=true&w=majority";
    const sourceUri = "mongodb+srv://vvv201214:5VPljkBBPd4Kg9bJ@cluster0.j7ieec6.mongodb.net/admin-data?retryWrites=true&w=majority";
    const destinationUri = "mongodb+srv://anshuman:ninepointerdev@cluster1.iwqmp4g.mongodb.net/?retryWrites=true&w=majority";
    // const destinationUri = "mongodb+srv://forStagingPurpose:ninepointer@cluster0.snsb6wx.mongodb.net/?retryWrites=true&w=majority";
    let client, destinationClient;
    async function backup() {
    try {
        // Connect to the source cluster
        client = await MongoClient.connect(sourceUri, { useNewUrlParser: true });
        // console.log(client); 

        // Get the list of collections in the source cluster
        const collections = await client.db().collections();

        // console.log(collections);
        
        // Create a new client for the destination cluster
        destinationClient = await MongoClient.connect(destinationUri, { useNewUrlParser: true });
        const destCollections = await destinationClient.db().collections();

        destCollections.forEach(async collection => {
            if(await client.db().listCollections({name: collection.s.namespace.collection}).hasNext()){
                console.log('dropping' + collection.s.namespace.collection);
                await destinationClient.db().collection(collection.s.namespace.collection).drop();
            }
        });
        

        // Iterate through the collections and copy the data
        for (const collection of collections) {
        // Get the data from the source collection
        const cursor = await collection.find({});
        //   console.log(cursor);
        //   console.log('s is', collection.s.namespace.collection);
        // Insert the data into the destination collection
        if(await cursor.count() > 0){
        await destinationClient.db().collection(collection.s.namespace.collection).insertMany(await cursor.toArray(),{ ordered: false });
            }
        }
        console.log('Backup completed successfully');
    } catch (err) {
        console.log('to err is to err')
        console.error(err);
    } finally {
        if(client) client.close();
        if(destinationClient) destinationClient.close();
    }
    }

    backup().then(()=>{
        console.log('ok');
    });
}