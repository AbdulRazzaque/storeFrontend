

import React, { Fragment, useEffect, useState } from 'react'
// import "./Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from '../Dashhead';
import Darkmode from '../Darkmode';
import { Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle,TextField } from '@mui/material';
import { DataGrid } from '@mui/x-data-grid';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import UpdateLocation from '../update/UpdateLocation';

const AddLocation = () => {
  const [display, setDisplay] = React.useState(false);
  const [department, setDepartment] = React.useState('');
  const [data,setData]=useState([])
  const [flag,setFlag] = React.useState(false)
  const [update,setUpdate]=useState([])
  const [showDialog,setShowDialog]=useState(false)
  const [alert, setAlert] = useState(false);
  // ============================================================================================================================================
  const handleChange = (event) => {
    setDepartment(event.target.value);
  };
// ============================================================================================================================================
  const { register, handleSubmit, formState: { errors } } = useForm();
  const url= process.env.REACT_APP_DEVELOPMENT
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"
 
  // ============================================================================================================================================
  const columns=[
    {field:"id",headerName:"S.N",width:70},
    {field:"locationName",headerName:"locationName",width:200},

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
  
  ]
 

// =========================================Get Api===============================================================================================
const getAllLocations =async()=>{
  try {
    await axios.get(`${url}/api/location/getAllLocations/`,{
      headers: { token: accessToken }
    })
    .then(res=>{
      let arr = res.data.result.map((item,index)=>({...item,id:index+1}))
      setData(arr)
      console.log(arr)
    })

  } catch (error) {
    alert(error)
    
  }
}

// =========================================Post Api======================================================================

const onSubmit = async(data,event) => {
     

  try {
       await axios.post(`${url}/api/location/createLocation`, data,
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
    getAllLocations()
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
   
  await  axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/location/UpdateLocation/`,update,
  {headers:{token:`${accessToken}`}})
  .then(response=>{
  console.log('Response',response)
  // apiRef.current.updateRows([update])
  })
  getAllLocations()
  
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
        `${process.env.REACT_APP_DEVELOPMENT}/api/location/deleteLocation/${update._id}`,
        {headers:{token:`${accessToken}`}})
        .then(response=>{
        console.log('Response',response)
        // apiRef.current.updateRows([update])
        })

        getAllLocations();
      
    setAlert(false);
  } catch (error) {
    console.log(error);
  }
};
// =========================================By Default api cal===============================================================================================
useEffect(()=>{

  getAllLocations()
},[])

  return (
    <div className="row">
    <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
      <Dashhead id={4} display={display} />
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
          Add Location 
        
        </h1>
        <ToastContainer />
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
{/* =============================================Form Code==================================================================================================================================== */}

        <form onSubmit={handleSubmit(onSubmit)}>
        <div className="container d-flex flex-column align-items-center">
          <div className="row">
            <div className="col">
            <TextField id="outlined-basic" label="Location Name" variant="outlined"  sx={{width:500}}  required
            {...register("locationName", { pattern: /^\S.*\S$/ })}
            />

            </div>
          </div>
         
          <Button variant="contained" type="submit" className='my-3' >
          submit
          </Button>
        </div>
        </form>
        
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
        
      />
    </div>
        </div>
       <UpdateLocation
            showDialog={showDialog}
            update={update}
            setShowDialog={setShowDialog}
            changeRoweData={changeRoweData}
            updateRow={updateRow}
            department={department}
       />
        <Darkmode/>
        </div>
  )
}

export default AddLocation