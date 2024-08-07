
import React, { useEffect, useState } from 'react'
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
// import Dashhead from "./Dashhead";
import Dashhead from "../components/Dashhead";

import { Autocomplete, Button, TextField } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux'
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import { sendData } from '../components/app/socket/socketActions';

import {  useHistory } from 'react-router-dom/cjs/react-router-dom';
import axios from 'axios';
import { useForm } from 'react-hook-form';
const Order = () => {
    const [display, setDisplay] = React.useState(false);
    const data = useSelector(state => state.socket.messages)
    // const chackdata = useSelector(state => state)
    // console.log(data,'Chack lab name')
    const [allMember,setAllMember] = React.useState([])
    const [quantities, setQuantities] = useState({});
    const [orderData,setOrderData] = useState('')
    const [refNo,setRefNo]= useState(2)
    const [member,setMember]=useState([])
    const [itemArray,seItemArray]=useState([])
    const [orderType,setOrderType]=useState([])
    //======================================================= ========================================================================
    const dispatch = useDispatch()
    
    const history = useHistory()
  const { register, handleSubmit, formState: { errors } } = useForm();
    const [itemcode,setItemcode]=useState('')
    const [itemnumber,setitemnumber]=useState(1)

  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"
    //======================================================= ========================================================================


const handleQuantityChange =(id,value)=>{
  setOrderData(prevData =>({
    ...prevData,
  [id]:+value
  }))
}


 
const onSubmit = async () => {
  const array = Object.values(orderData);
console.log(array);
  console.log(array, 'llll');

  // Assuming `data` is an array of arrays containing product objects
  const productIds = data.flat().map(item => item._id);
  const productNames = data.flat().map(item => item.productName);
  const sku =  data.flat().map(item => item.sku)
  const department =  data.flat().map(item => item.department)
  console.log(sku,'sku')

  const objArray = {
    memberId: member._id,
    memberName: member.memberName,
    productId: productIds,  // Now dynamically set from the `data`
    requiredQuantity: array,
    productName: productNames,
    itemnumber: itemcode+itemnumber,
    orderType:orderType

  };

  try {
    const res = await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/order/CreateOrder`, objArray, {
      headers: { token: `${accessToken}` }
    });
    setitemnumber(objArray.itemnumber);
    console.log(res.data);
    const requestData = {
      objArray,
      sku,
      department:member.department
    };
    dispatch(sendData(requestData));
     history.push('/Orderpdf')
  } catch (error) {
    console.error('Error:', error);
  }

  console.log(objArray, 'ObjArray');
};

const fetchData = async () => {
  try {
    const res = await axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/order/getDetailsOrders`);
    const data = res.data.result;

    // Extract numeric values from 'itemnumber' strings and filter out NaN values
    const numericValues = data.map((item) => parseInt(item.itemnumber.split("_").pop())).filter((value) => !isNaN(value));

    // Calculate the highest numeric value
    const highestNumber = Math.max(...numericValues, 0);

    // Set the 'itemnumber' state based on the highest numeric value found
    setitemnumber(highestNumber === -Infinity ? 1 : highestNumber + 1);
  } catch (error) {
    console.error("Error fetching data:", error);
    // Handle error as needed (e.g., display error message)
  }
};





// ===============================================Member api=============================================================
// const getAllMember = ()=>{
//   axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/member/getAllMember/`,{headers:{token:`${accessToken}`}})
//   .then(res=>{
//     setAllMember(res.data.result)

//     console.log(allMember)
    
//   })
// }


const getAllMember = () => {
  axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/member/getAllMember/`, { headers: { token: `${accessToken}` } })
    .then(res => {
      const allMembers = res.data.result;
      // Filter member names
      const filteredMembers = allMembers.filter(member => 
        member.memberName === "DR. HASSEB" || 
        member.memberName === "REDA ALI" || 
        member.memberName === "DR. MUTHU" ||
        member.memberName === "DR. MARWA" ||
        member.memberName === "DR. SHIMOS" 
      );
      setAllMember(filteredMembers);
    })
    .catch(error => {
      console.error('Error fetching members:', error);
    });
}

console.log(member?.department,'llll')

useEffect(() => {
  fetchData()
  getAllMember()
  if (member?.department) {
    if (member.department === 'MICROBIOLOGY') {
      setItemcode('Mic_');
    } else if (member.department === 'PARASITOLOGY') {
      setItemcode('P_');
    } else if (member.department === 'TCGC') {
      setItemcode('TCGC_');
    }  else if (member.department === 'GENERAL') {
      setItemcode('G_');
    }  else if (member.department === 'AAS' || member.department === 'BIOCHEMISTRY' ||  member.department === 'HEAMOTOLGY' || member.department === 'HPLC') {
      setItemcode('Main_');
    }
  }
}, [member?.department]);

const orderCategory =[
  {type:'Regular'},
  {type:"Urgent"},
  {type:"New"},
 
]

console.log(orderType,'orderType')

  return (
    <div className="row">
    <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
      <Dashhead id={2} display={display} />
    </div>

    <div
      className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container"
      onClick={() => display && setDisplay(false)}
    >
      <span className="iconbutton display-mobile">
        <IconButton
          size="large"
          aria-label="Menu"
          onClick={() => setDisplay(true)}
        >
          <MenuIcon fontSize="inherit" />
        </IconButton>
      </span>
      <h1 className="my-5 title text-center">
          order list </h1>


          {member?.department && (
    <h4> itemCode :{itemcode} {itemnumber}</h4>
  )}
    





        
    
        <div>
<form onSubmit={handleSubmit(onSubmit)}>
<div className="d-flex justify-content-center my-5 ">
<Autocomplete
                    disablePortal
                    id="combo-box-demo"
                     options={allMember}
                    sx={{width:350, mx:5}}
                    getOptionLabel={(memberName)=>`${memberName.memberName} ${memberName.department}`}
                   onChange={(ev,val)=>{
                    setMember(val)
                    setItemcode(member?.department)
                   }}
                    renderInput={(params) => <TextField {...params} label="Select member" required/>}

                    
                    />


<Autocomplete
                    disablePortal
                    id="combo-box-demo"
                     options={orderCategory}
                    sx={{width:300}}
                    getOptionLabel={(orderType)=>orderType.type}
                   onChange={(ev,val)=>{
                    setOrderType(val.type)
                    // setItemcode(member?.department)
                   }}
                    renderInput={(params) => <TextField {...params} label="Select order type" required/>}

                    
                    />
</div>


<table className="table table-bordered">
  <thead>
    <tr>
      <th scope="col">S.N</th>
      {/* <th scope="col">Expiry</th> */}
      {/* <th scope="col">Item Code</th> */}
      <th scope="col">Lot Number</th>
      <th scope="col">Manufacturer</th>
      <th scope="col">Product Name</th>
      {/* <th scope="col">Quantity</th> */}
      <th scope="col">SKU</th>
      <th scope="col">Required Quantity</th> {/* Assuming you want to add actions */}
    </tr>
  </thead>
  <tbody>
  {data.map((itemGroup, groupIndex) => {   
    if (Array.isArray(itemGroup)) {
      return itemGroup.map((item, itemIndex) => (
        <tr key={itemIndex}>
          <td>{item.id}</td>
          {/* <td>{item.expiry}</td> */}
          {/* <td>{item.itemcode}</td> */}
          <td>{item.lotNumber}</td>
          <td>{item.manufacturer}</td>
          <td>{item.productName}</td>
          {/* <td>{item.quantity}</td> */}
          <td>{item.sku}</td>
          <td>
            <input
              type="number"
              className='form-control' id="exampleInputEmail1" aria-describedby="emailHelp"
              // value={}
              required
              onChange={e =>handleQuantityChange(item.id,e.target.value) }
           
              placeholder="Enter quantity"
            />
          </td>
        </tr>
      ));
    } else {
      return null; // Handle case where itemGroup is not an array
    }
  })}
</tbody>

</table>
<div className='text-center my-5'>
{/* <Button variant='contained' type='submit' onClick={handleOrderSubmit} > Print PDF <PictureAsPdfIcon className='mx-2'/> </Button> */}
<Button variant='contained' type='submit' > Print PDF <PictureAsPdfIcon className='mx-2'/> </Button>
</div>
</form>
  </div>
        </div>
        </div>
  )
}

export default Order