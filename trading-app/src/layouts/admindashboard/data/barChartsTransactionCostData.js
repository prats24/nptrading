import axios from "axios";
import { useEffect } from "react";


export function TransactionCostData() {

  let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5001/"


  
  // const [tcost, setTCost] = useState();

  useEffect(()=>{
    axios.get(`${baseUrl}api/v1/tcmocktradecompanylastfivedays`)
    // axios.get(`${baseUrl}api/v1/readmocktradecompany`)
    .then((res)=>{
        // setTCost(res.data);
        Tdata = res.data
    }).catch((err)=>{
        //window.alert("Server Down");
        return new Error(err);
    })
  },[])


}

