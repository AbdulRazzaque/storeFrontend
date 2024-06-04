import React, { Fragment, useEffect, useState } from "react";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../components/Dashhead";
import Darkmode from "../components/Darkmode";
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from "@mui/material";
import { DataGrid } from '@mui/x-data-grid';
import { useForm } from 'react-hook-form' 
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from 'axios'
import Updateproduct from "../components/update/Updateproduct";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useDispatch } from "react-redux";
import { sendData } from "../components/app/socket/socketActions";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import Departmetnlils from "../components/Department list/Departmetnlils";
const Addproduct = () => {
  const [display, setDisplay] = React.useState(false);
  const [data,setData]=useState([])
  const [flag,setFlag] = React.useState(false)
  const [update,setUpdate]=useState([])
  const [showDialog,setShowDialog]=useState(false)
  const [alert, setAlert] = useState(false);
  const [selectedRows,setSelectedRows]= useState([])
  const [department, setDepartment] = React.useState('');
  const [selectedDepartment, setSelectedDepartment] = useState('');
  // ==============================================================================================
  const { register, handleSubmit, formState: { errors } } = useForm();
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"
  const dispatch = useDispatch();
  const history = useHistory();
// ===============================================================================================================
  const columns = [
    { field: 'id', headerName: 'S.N', width: 70 },
    { field: 'itemCode', headerName: 'item Code', width: 100, valueGetter:(params)=>params.row.itemCode.split(" ")[0]},
    { field: 'productName', headerName: 'Item description', width: 180 },
    { field: 'physicalLocation', headerName: 'Physical location', width: 130 },
    { field: 'sku', headerName: 'S.K.U', width: 130 },
    { field: 'lotNumber', headerName: 'Lot number', width: 130 },
    { field: 'manufacturer', headerName: 'Manufacturer', width: 130 },
    { field: 'supplierName', headerName: 'Supplier name', width: 130 },
    { field: 'unit', headerName: 'Unit', width: 100 },
    { field: 'addModel', headerName: 'Model', width: 130 },
    { field: 'department', headerName: 'Department', width: 130 },
    {
      title: "Action",
      field: "Action",
      width: 100,
      renderCell: (params) => (
        <Fragment>
          <Button   onClick={() => updateRowData(params.row)}>
            <EditIcon />
          </Button>
        </Fragment>
      ),
    },
    {
      title: "Delete",
      field: "Delete",
      width: 100,
      renderCell: () => (
        <Fragment>
          <Button color="error"  onClick={() => setAlert(true)}>
            <DeleteIcon />
          </Button>
        </Fragment>
      ),
    },
  
  ];
  
// =========================================Get Api===============================================================================================
console.log(selectedDepartment)

const departments = [
  { id: 8, name: 'All', },
  { id: 1, name: 'TCGC',  },
  { id: 2, name: 'MICROBIOLOGY'},
  { id: 3, name: 'BIOCHEMISTRY', },
  { id: 4, name: 'HPLC' },
  { id: 5, name: 'AAS',  },
  { id: 6, name: 'PARASITOLOGY', },
  { id: 7, name: 'GENERAL', },
  { id: 8, name: 'HEAMOTOLGY', },
  // Add more departments as needed
];
    // Callback function to handle department selection
    const handleDepartmentSelect = (department) => {
      setSelectedDepartment(department);
      getAlldata(department)
  }; 

  const getAlldata = (department)=>{
  
    axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/product/getAllProducts/${department?department:""}`)
    .then(res=>{
      let arr = res.data.result.map((item,index)=>{
        // const fieldsToCheck = ['supplierName', 'name', 'sku', 'lotNumber', 'manufacturer', 'physicalLocation', 'unit','addModel','productName'];
        // fieldsToCheck.forEach(field=>{
        //   if(item.itemCode.includes(item[field])){
        //     item.itemCode = item.itemCode.replace(item[field],'')
        //   }
        // })
        return {...item, id:index +1}
      })
      setData(arr)

    })

}
// =========================================Post Api======================================================================

const onSubmit = async(data,event) => {
 var obj={
    department:department,
        ...data,
  }
     
  try {
      const res= await axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/product/createProduct`, obj,
      {headers:{token:`${accessToken}`}})
      .then(response=>{
      console.log(response, 'res')
      toast(response.data.msg,{
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      })
      setFlag(!flag)
        event.target.reset(); 
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
    getAlldata(selectedDepartment)
  } catch (error) {
      alert(error)
      
  }
  
;
}
//=======================================================update code & api here =======================================

const updateRowData= async(params)=>{
  // console.log(params,'cheack in update data in Add Product')
 setUpdate(params)
   setShowDialog(true)
}
const changeRoweData=(e)=>{
  setUpdate({...update,[e.target.name]:e.target.value})
  console.log(update)

}
const updateRow = async() =>{

try {
   
  await  axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/product/updateProduct/${update._id}`,update,
  {headers:{token:`${accessToken}`}})
  .then(response=>{
  console.log('Response',response)
  // apiRef.current.updateRows([update])
  })
  getAlldata(selectedDepartment)
  
  setShowDialog(false)
  } catch (error) {
  console.log(error)
  } 
  
  
  }
 
//=======================================================Delete code & api here ==============================================================
const deleteRow = async (update) => {

  try {
    await axios
      .delete(
        `${process.env.REACT_APP_DEVELOPMENT}/api/product/deleteProduct/${update._id}`,update,
        {headers:{token:`${accessToken}`}})
        .then(response=>{
        console.log('Response',response)
        // apiRef.current.updateRows([update])
        })

        getAlldata(selectedDepartment)
      
    setAlert(false);
  } catch (error) {
    console.log(error);
  }
};
// ==================================================Call api==================================================================================
useEffect(()=>{
  getAlldata()
},[])

// console.log(update)
// ===================================================order code===============================================================================================================

const labName = 'General'
const handelClick = ()=>{
  const dataToSend = selectedRows.map(row=>({
    ...row,
    labName:labName
  }))
  if (dataToSend.length === 0){
    toast("Select Item first",{
      position: "top-center",
      autoClose: 5000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "light",

    })
  }else{
    dispatch(sendData(dataToSend));
    history.push('/Order')
      // console.log(dataToSend)
  }

}



// ===================================================JSx code===============================================================================================================

  // ===============================================Member=============================================================================================
  const handleChange = (event) => {
    setDepartment(event.target.value);
  };

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
      Add Product
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
              <Button variant="contained" onClick={() => deleteRow(update)}>
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

{/* =============================================Form code===================================================================================================================================== */}
      <form className="space-y-4 my-6" onSubmit={handleSubmit(onSubmit)}>
      <ToastContainer />

      <div className="container d-flex flex-column align-items-center">
        <div className="row my-2">
          <div className="col-md-6">
          <TextField
              id="outlined-basic"
              label="Item code"
              variant="outlined"
              {...register("itemCode", {
                required: "Item Code is required",
                pattern: {
                  value: /^[^\s]+$/,
                message: "Please enter a value without any spaces."
                }
              })}
              sx={{ width: 250 }}
              required
            />
            {errors.itemCode && <p style={{ color: 'red' }}>{errors.itemCode.message}</p>}

          </div>
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Enter product name"
              variant="outlined"
              sx={{ width: 250 }}
              required
              {...register("productName", { pattern: /^\S.*\S$/ })}
            />
          </div>
        </div>
        <div className="row my-2">
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Unit"
              variant="outlined"
              {...register("unit", { pattern: /^\S.*\S$/ })}
              sx={{ width: 250 }}
              required
            />
          </div>
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Physical location"
              variant="outlined"
              sx={{ width: 250 }}
              required
              {...register("physicalLocation", { pattern: /^\S.*\S$/ })}
            />
          </div>
        </div>
        <div className="row my-2">
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Lot number"
              variant="outlined"
              {...register("lotNumber", { pattern: /^\S.*\S$/ })}
              sx={{ width: 250 }}
            />
          </div>
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Manufacturer"
              variant="outlined"
              sx={{ width: 250 }}
              required
              {...register("manufacturer", { pattern: /^\S.*\S$/ })}
            />
          </div>
        </div>
        <div className="row my-2">
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Supplier name"
              variant="outlined"
              {...register("supplierName", { pattern: /^\S.*\S$/ })}
              sx={{ width: 250 }}
              required
            />
          </div>
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Add model"
              variant="outlined"
              sx={{ width: 250 }}
              // required
              {...register("addModel", { pattern: /^\S.*\S$/ })}
            />
          </div>
         
        </div>
        <div className="row my-2">
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="S.K.U"
              variant="outlined"
              sx={{ width: 250 }}
              required
              {...register("sku", { pattern: /^\S.*\S$/ })}
            />
          </div>
          <div className="col-md-6">
          <FormControl sx={{width:250}}>
        <InputLabel id="demo-simple-select-label">Department</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={department}
          label="department"
          onChange={handleChange}
        >

          <MenuItem value="TCGC">TCGC</MenuItem>
          <MenuItem value="MICROBIOLOGY">MICROBIOLOGY</MenuItem>
          <MenuItem value="HEAMOTOLGY">HEAMOTOLGY</MenuItem>
          <MenuItem value="BIOCHEMISTRY">BIOCHEMISTRY</MenuItem>
          <MenuItem value="HPLC">HPLC</MenuItem>
          <MenuItem value="AAS">AAS</MenuItem>
          <MenuItem value="PARASITOLOGY">PARASITOLOGY</MenuItem>
          <MenuItem value="GENERAL">GENERAL</MenuItem>
          {/* <MenuItem value="Parasitology">Histology</MenuItem> */}
        </Select>
      </FormControl>
          </div>
    
         
        </div>
        <Button variant="contained" type="submit" className="my-5">
          Submit
        </Button>
        <div>
{/* =======================================Department list=================================== */}
        <Departmetnlils 
        departments={departments} 
         onDepartmentSelect={handleDepartmentSelect}
          data={data}/>
 {/* =======================================Department list=================================== */}
        </div>
      </div>
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={data}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { psku: 0, pskuSize: 5 },
            },
          }}
          pskuSizeOptions={[5, 10]}
          onRowClick={(item)=>setUpdate(item.row)}
          checkboxSelection
          onSelectionModelChange={(ids)=>{
            const selectedIDs = new Set(ids);
            const selectedRows = data.filter((row)=>
            selectedIDs.has(row.id),
            )
            setSelectedRows(selectedRows)
          }}
        />
      </div>
      <div className="text-center my-5">
  <Button variant="contained" onClick={handelClick}> Order </Button> 
    </div>

    </form>

        <Darkmode/>
        </div>
        <Updateproduct
        showDialog={showDialog}
        update={update}
        department={department}
        handleChange={handleChange}
        setShowDialog={setShowDialog}
        changeRoweData={changeRoweData}
        updateRow={updateRow}
        />
        </div>
  )
}

export default Addproduct