import React, { useState } from "react";
import { useEffect } from "react";
import Select from 'react-select'; 
import axios from "axios"
import uniqid from "uniqid";

export default function UserList({addUser, setAddUser, setPermissionData, algoName, reRender}) {
    let baseUrl = process.env.NODE_ENV === "production" ? "/" : "http://localhost:5000/"
    const [data, setData] = useState([]);
    const [permissionArr, setPermission] = useState([]);
    // const {setReRender, reRender} = Render;
    const _id = uniqid();

    useEffect(()=>{
        axios.get(`${baseUrl}api/v1/readuserdetails`)
        .then((res)=>{
            setData(res.data);
            //console.log(res.data);

        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

        axios.get(`${baseUrl}api/v1/readpermission`)
        .then((res)=>{
            setPermission(res.data);
            setPermissionData(res.data);

        }).catch((err)=>{
            window.alert("Server Down");
            return new Error(err);
        })

    },[reRender])
    //console.log(data, permissionArr)

    // permissionArr.map((elem, index)=>{
    //     data.map((subElem, subIndex)=>{
    //         if(subElem.email === elem.userId && elem.algoName === algoName){
    //             data.splice(subIndex, 1);
                
    //         }
    //     })
    // })

    if(data.length !== 0 && permissionArr.length !== 0){
        for(let i = 0; i < data.length; i++){
            for(let j = 0; j < permissionArr.length; j++){
                if(data[i].email === permissionArr[j].userId && permissionArr[j].algoName === algoName){
                    data.splice(i, 1);
                    j = -1;
                }
            }
        }
    }


    //console.log("data", data, permissionArr);

    let options = [];
    if(data.length !== 0){
        for(let elem of data){
            //console.log(elem);
            options.push({value: elem.email, label: elem.name, userId: elem.email, userName: elem.name, _id:_id});
            //console.log(options);
        }
    }
    console.log(data);
    console.log(options);


    //console.log(addUser);

    return (
        <div>
            <Select
                placeholder="Select User"
                onChange={setAddUser}
                isMulti
                options={options}
                className="primary"
            />
        </div>
    )
}