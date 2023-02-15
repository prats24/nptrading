const RetreiveOrder = require("../models/TradeDetails/retreiveOrder");

exports.deleteDuplicateData = async(date) => {
    console.log("in dup data")
        let cursor = await RetreiveOrder.aggregate([
         {$group: {
           _id: { order_timestamp: "$order_timestamp", guid: "$guid", order_id: "$order_id", exchange_order_id: "$exchange_order_id" },
           dups: { $addToSet: "$_id" },
           count: { "$sum": 1 }
         }},
         { $match: { 
          count: { "$gt": 1 },
          "_id.order_timestamp" : {$regex: date}
          } }
       ])
       console.log("cursur", cursor)
       for (let i = 0; i < cursor.length; i++) {
        const doc = cursor[i];
        console.log(doc.dups[0], i);
        await RetreiveOrder.deleteMany({ _id: { $in: doc.dups[0] } });
        console.log("deleted");
      }
  
  }


    
    
    
    
    
    
    
    
    
    
    
    
    
    
    

    
    
    
    
    
    
    

    
    