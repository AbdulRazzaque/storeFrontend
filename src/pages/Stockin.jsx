import React, { useEffect, useState } from 'react'
import "../components/Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../components/Dashhead";
import Darkmode from '../components/Darkmode';
import { Autocomplete, Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, TextField } from '@mui/material';
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";

import DeleteIcon from "@mui/icons-material/Delete";


import { useForm } from 'react-hook-form';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import moment from 'moment'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const Stockin = () => {
 
    const [display, setDisplay] = React.useState(false);
    const [selectedExpiry,setSelectedExpiry]= useState()
    const [showDialog,setShowDialog]= useState(false)
    const [update,setUpdate]=useState([])
    const [allMember,setAllMember] = React.useState([])
    const [allLocation,setAllLocation] = React.useState([])
    const [alert,setAlert]= useState(false)
    const [docNo, setDocNo] = React.useState(1);
    const [selectedProduct,setSelectedProduct]=React.useState(null)
    const [selectedDepartment,setSelectedDepartment]=React.useState(null)
    const [flag,setFlag] = React.useState(false)
    const [allProducts,setAllProducts] = React.useState([])
    const [allStocks,setAllStocks] = React.useState([])
    const [deleteRow,setDeleteRow] = React.useState([])
    const [selectLocation,setSelectLocation] = React.useState([])
// ========================================================================================================================================================
const { register, handleSubmit, formState: { errors } } = useForm();
const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"

// ========================================================================================================================================================


    const department =[
      {name:'TCGC'},
      {name:"MICROBIOLOGY"},
      {name:"HEAMOTOLGY"},
      {name:"BIOCHEMISTRY"},
      {name:"HPLC"},
      {name:"AAS"},
      {name:"PARASITOLOGY"},
      {name:"GENERAL"},
    ]

    const handelDepatment = (value) => {
      setSelectedDepartment(value);
      setSelectedProduct(null);  // Clear the selected product when department changes
    
      console.log(value, "Here I am check");
    
      const getAllProducts = () => {
        axios
          .get(`${process.env.REACT_APP_DEVELOPMENT}/api/product/getAllProducts`, {
            headers: { token: accessToken },
          })
          .then((res) => {
            let arr = res.data.result.map((item, index) => {
              return { ...item, id: index + 1 };
            });
    
            let filteredProducts = arr;
            if (value) {
              console.log(value, 'selectedDepartment');
              filteredProducts = arr.filter((product) => product.department === value);
            }
    
            setAllProducts(filteredProducts);
            console.log(filteredProducts, 'filteredProducts');
          });
      };
    
      getAllProducts();
      getAllLocations();
    };
    

    // ================================================================post api code========================================================================================
    const onSubmit = async(data,event) => {

      var obj={
        department:selectedDepartment,
        productName:selectedProduct.productName,
        itemCode:selectedProduct.itemCode,
        productId:selectedProduct._id,
        expiry:selectedExpiry,
    location:selectLocation.locationName,
    docNo,
    ...data
  }
try {
    await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/stockIn`, {...obj},
   {headers:{token:`${accessToken}`}})
   .then(res=>{
 
   setAllStocks([...allStocks,{...obj,_id:res.data.result._id}])
   toast(res.data.msg,{
     position: "top-center",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "dark",
   })
  //  setFlag(!flag)
  //    event.target.reset();
 }).catch(error => {
   toast(error.response.data,{
     position: "top-right",
     autoClose: 5000,
     hideProgressBar: false,
     closeOnClick: true,
     pauseOnHover: true,
     draggable: true,
     progress: undefined,
     theme: "dark"
   })
 }
 );

} catch (error) {
   alert(error)
   
}

;
}
// ==================================================================Get api code=======================================================
const getAllMember = ()=>{
  axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/member/getAllMember/`,{headers:{token:`${accessToken}`}})
  .then(res=>{
    setAllMember(res.data.result)

  })
}
const getAllLocations = ()=>{
  axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/location/getAllLocations/`,{headers:{token:`${accessToken}`}})
  .then(res=>{
    setAllLocation(res.data.result)

  })
}


const getAllProducts = ()=>{
  axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/product/getAllProducts`,{headers:{token:`${accessToken}`}})
  .then(res=>{
    let arr = res.data.result.map((item,index)=>{
      // const fieldsToCheck = ['productName','lotNumber', 'manufacturer', 'physicalLocation', 'sku', 'supplierName', 'unit','addModel'];
      // fieldsToCheck.forEach(field=>{
      //   if(item.itemCode.includes(item[field])){
      //     item.itemCode = item.itemCode.replace(item[field],'')
      //   }
      // })
      return {...item, id:index +1}
    })
    setAllProducts(arr)
    console.log(arr)
  })
}

useEffect(() => {
  axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/getStockInDocNo`,{headers:{token:`${accessToken}`}})
  .then(res=>{

    if(res.data.result.length>0){
      setDocNo(res.data.result[0].docNo+1)
    }
    
    
  })
  .catch(err=>{
    if(err.response){
      if(err.response.data){

      }
    }
  })
 getAllMember()
 getAllProducts()
 handelDepatment()
}, [flag]);


// ================================================================open Dialog api & Update code here =====================================================
   const  handleOpenDialog =(rowdata)=>{
    setUpdate(rowdata)
    setShowDialog(true); // Open the dialog

   }
    const updateData=(e)=>{
        setUpdate({...update,[e.target.name]:e.target.value});
    }
// =======================================================================Delete Dialog and api code here ======================================================================
  const handleDeleteDialog = (rowdata)=>{
    // setDeleteRow(rowdata)
    setAlert(true)
    setDeleteRow(rowdata)
    console.log(rowdata,'row Data')
}

const handelDeleterow = async(deleteRow)=>{
  axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/deleteStockIn`,{stockInId:deleteRow._id,quantity:parseInt(deleteRow.quantity),expiry:deleteRow.expiry,productName:deleteRow.productName},{headers:{token:accessToken}})

  .then(res=>{
    console.log(res)
    let arr = allStocks.filter((i)=> deleteRow._id !== i._id)
    console.log(allStocks.filter((i)=> deleteRow._id !== i._id),'Hellostockin')

    setAllStocks(arr)
    setAlert(false)

  })
  
}



// =============================================================================================================================
    return (
        <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <Dashhead id={5} display={display} />
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
              stock-in 
            
            </h1>


{/* =============================================Delete Modal code===================================================================================================================================== */}
{alert && (
          <Dialog open={alert} style={{ height: 600 }}>
            <DialogTitle>Delete Row</DialogTitle>
            <DialogContent>
              <DialogContentText id="alert-dialog-description">
                Are You sure You want to delete this.
              </DialogContentText>
            </DialogContent>
            <DialogActions>
              <Button variant="contained" onClick={() => handelDeleterow(deleteRow)}>
                Yes
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                   setAlert(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
{/* ==================================================================Form code here ===================================================== */}

            <form onSubmit={handleSubmit(onSubmit)}>
          <ToastContainer/>
            <div className="d-flex flex-column align-items-center ">
                <div className="row">
                    <div className="col-auto"><TextField id='outlined-basic' label="Doc" type='number' sx={{width:50}} 
                    value={docNo}
                       onChange={(e) => {
                        setDocNo(e.target.value);
                      }} 
                      InputProps={{
                        readOnly: true,
                      }} 
                    /></div>
                    <div className="col-auto"> 
                    <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={department}
                  getOptionLabel={(e)=>e.name}
                  onChange={(e,value)=>handelDepatment(value?.name)}
                  sx={{ width: 150 }}
                  renderInput={(params) => <TextField {...params} label="Department" />}
                />

                    </div>
                    <div className="col-auto">
                    <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    // getOptionLabel={(product)=>product.itemCode}
                    getOptionLabel={ (product)=>product? `${product.itemCode.split(" ")[0]} ${product.productName} ${product.lotNumber} ${product.physicalLocation}`:""}
                    // getOptionLabel={ (product)=> console.log(product,"chaeck")}
                  
                    options={allProducts.filter(product => product.department === selectedDepartment)}
                    // options={allProducts}
                    sx={{ width: 400 }}
                    value={selectedProduct}
                    renderInput={(params) => <TextField {...params} label="Select item code,Product name" required/>}
                    onChange={(event, newValue) => {
                      setSelectedProduct(newValue);
                      }}
                    />
                    </div>
                    <div className="col-auto">
                      <TextField id='outlined-basic' label="Quantity" type='number' sx={{width:120}} required 
                        {...register("quantity", { required: true, })}
                      />
                      </div>
                      <div className="col-auto">
                    <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(location)=>location?location?.locationName:""}
                    // getOptionLabel={(product)=>`${product.itemCode.split(" ")[0]} ${product.productName} ${product.lotNumber} ${product.physicalLocation}`}
                    // options={allProducts.filter(product => product.department === selectedDepartment)}
                    options={allLocation}
                    sx={{ width: 200 }}
                    renderInput={(params) => <TextField {...params} label="Select Location" required/>}
                    onChange={(event, newValue) => {
                      setSelectLocation(newValue);
                      }}
                    />
                    </div>
                    <div className="col-auto"> 
                    <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    sx={{ width: 200 }}
                    label="Choose expiry date"
                    value={selectedExpiry}
                    format="dd-MM-yyy"
                    views={["year", "month", "day"]}
                    onChange={(newValue) => {
                      setSelectedExpiry(newValue);
                    }}
                    required
                    renderInput={(params) => (
                      <TextField name="date" {...params} />
                    )}
                    
                  />
                </LocalizationProvider>
                </div>
                </div>
            </div>
            <div className='text-center my-5'>

                <Button variant="contained" type= "submit" className=''>Add</Button>
            </div>
            </form>
{/* ==================================================================Table ===================================================== */}

            <TableContainer component={Paper}>
      <Table sx={{ minWidth: 650 }} aria-label="simple table">
        <TableHead>
          <TableRow>
            <TableCell>Doc</TableCell>
            <TableCell >Department</TableCell>
            <TableCell >Item code</TableCell>
            <TableCell >Item description</TableCell>
            <TableCell >Quantity</TableCell>
            <TableCell >Location name</TableCell>
            <TableCell >Expiry date</TableCell>
            {/* <TableCell >Edit</TableCell> */}
            <TableCell >Delete</TableCell>
          </TableRow>
        </TableHead>
        <TableBody> 
            {
                allStocks.map((row,id)=>(
                    <TableRow key={row.id}>
                    <TableCell >{row.docNo}</TableCell>
                    <TableCell >{row.department}</TableCell>
                    <TableCell>{row.itemCode.split(" ")[0]}</TableCell>
                    <TableCell >{row.productName}</TableCell>
                    <TableCell >{row.quantity}</TableCell>
                    <TableCell >{row.location}</TableCell>
                    <TableCell >{moment.parseZone(row.expiry).local().format("DD/MM/YY")}</TableCell>
                    {/* <TableCell >{row.expiry}</TableCell> */}
                    {/* <TableCell ><IconButton onClick={()=>{handleOpenDialog(row)}}  ><EditIcon color='primary'  /></IconButton> </TableCell> */}
                    <TableCell ><IconButton > <DeleteIcon color='error'onClick={()=>{handleDeleteDialog(row)}} /> </IconButton></TableCell>
                    </TableRow>
                ))
            }


        </TableBody>
      </Table>
    </TableContainer>
            </div>
            <Darkmode/>
            </div>
      )
}

export default Stockin