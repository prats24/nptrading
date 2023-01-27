function transactioncostcalculation(data){
// console.log("First Data"+data[0]);
let transactionCost = 0;
// let tcostarr = [];
let day = 4;

for(let j = data.length-1; j >= 0 ; j--){
    // console.log("Inside for loop");
    transactionCost += Number(data[j].brokerage);
}
// tcostarr.push(transactionCost);
// transactionCost = 0;

    // for(let i = 0; i<=day; i++)
    // {
    //     console.log("Inside for loop of calculating date")
    //     var date = new Date();
        
    //     console.log(date)
    //     var todayDate = `${(date.getFullYear())}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
    //     var day1 = new Date(todayDate);
    //     var filterDate = new Date(day1);
    //     filterDate.setDate(day1.getDate() - (day-i));
    //     var filterDayDate = `${(filterDate.getFullYear())}-${String(filterDate.getMonth() + 1).padStart(2, '0')}-${String(filterDate.getDate()).padStart(2, '0')}`
    //     // filterDate.setDate(dayDate.getDate() - i);
    //     console.log(filterDate);
    //     // let filteredarr = data.filter((elem)=>{
    //     //     console.log("Filtering Data",(elem.trade_time),filterDayDate, (elem.trade_time).includes(filterDayDate) )
    //     //     return (elem.trade_time).includes(filterDayDate) 
    //     // })
    //     // console.log("Setting FilterDate"+filterDate.setDate(dayDate.getDate() - i));
   
    //     console.log(filterDate);
    //     console.log("Filtered Data:"+filteredarr)
            
    // }       
// console.log(tcostarr)
return transactionCost
}

module.exports = transactioncostcalculation;