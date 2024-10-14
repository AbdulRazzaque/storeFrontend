import React, { useState } from "react";
import "../components/Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../components/Dashhead";
import Darkmode from "../components/Darkmode";
import {

  Autocomplete,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";


import PrintIcon from "@mui/icons-material/Print";
import {  useHistory } from "react-router-dom/cjs/react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import LoginModal from '../components/model/LoginModal';

const Stockout = () => {
  const [display, setDisplay] = React.useState(false);

  const [selectedDate, setSelectedDate] = React.useState(new Date());
 
  const [allMember, setAllMember] = React.useState([]);

  const [deleteRow, setDeleteRow] = React.useState([]);
  const [alert, setAlert] = useState(false);
  const [allProducts, setAllProducts] = React.useState([]);
  const [flag, setFlag] = React.useState(false);
  const [allStocks, setAllStocks] = React.useState([]);
  const [selectedProduct, setSelectedProduct] = React.useState(null);
  const [selectedMember, setSelectedMember] = React.useState(null);
  const [selectedDepartment, setSelectedDepartment] = React.useState(null);
  const [stockOutData, setStockOutData] = React.useState([]);
  const [selectedExpiry, setSelectedExpiry] = React.useState(null);
  const [selectedStock, setSelectedStock] = React.useState(null);
  const [isModalOpen, setIsModalOpen] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [allLocation,setAllLocation] = React.useState([])
  const [selectedLocation, setSelectedLocation] = React.useState(null)
  // ========================================================================================================================================================

  const history = useHistory();
  const {
    register,
    handleSubmit,
    setValue,
  
  } = useForm();
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo";


  
//=======================logim model==============================================================


const handleLogin = () => {
  setIsAuthenticated(true);
  setIsModalOpen(false);
};





  // ================================================================get api =====================================================
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/getStockOutDocNo`, {
        headers: { token: accessToken },
      })
      .then((res) => {
     

        if (res.data.result.length > 0) {
          setValue("docNo", res.data.result[0].docNo + 1);
        }
      });

    axios
      .get(`${process.env.REACT_APP_DEVELOPMENT}/api/member/getAllMember`, {
        headers: { token: accessToken },
      })
      .then((res) => {
 
        setAllMember(res.data.result);
      });
      setIsModalOpen(true);
  }, [flag]);
  // ================================================================post api =====================================================


  const onSubmit = (data) => {
    let obj = {
      productName: selectedProduct.productName,
      productId: selectedProduct._id,
      product: selectedProduct,
      memberName: selectedMember.memberName,
      department: selectedDepartment,
      quantity: data.quantity,
      location:selectedLocation,
      date: selectedDate,
      expiry: selectedExpiry ? selectedExpiry.expiry : null,
      expiryObject: selectedExpiry ? selectedExpiry : null,
      docNo: parseInt(data.docNo),
    };

    setSelectedProduct(null);
    setSelectedStock(null);
    setSelectedLocation(null)
    // setSelectedMember(null)
    setSelectedExpiry(null);

    setValue("quantity", "");
    // setValue("price","")

    if (obj.quantity > obj.expiryObject.quantity) {
      toast.error(
        `${obj.quantity} This Quantity is Greater Than Your Available Quantity! ${obj.expiryObject.quantity}`,
        {
          position: "top-center",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "dark",
          className: "red-toast", // Apply the custom class here
        }
      );
      return; // Exit the function and prevent adding to stockOutData
    }


    axios
      .post(
        `${process.env.REACT_APP_DEVELOPMENT}/api/stock/stockOuts`,
        { ...obj },
        { headers: { token: accessToken } }
      )
      .then((res) => {
     
        setStockOutData([
          ...stockOutData,
          { ...obj, _id: res.data.result._id },
        ]);
        //    window.location.reload(false);
    

        getAllStocks(selectedDepartment);
      })

      .catch((err) => {
        if (err.response) {
          // setError(err.response.data)
          console.log("Stock out erorr" ,err);
        }
      });
  };
  // ================================================================open Dialog api & Update code here =====================================================

  // const handleOpenDialog = (rowdata) => {
  //   setUpdate(rowdata);
  //   setShowDialog(true); // Open the dialog
  // };
  // const updateData = (e) => {
  //   setUpdate({ ...update, [e.target.name]: e.target.value });
  // };
  // =======================================================================Delete Dialog and api code here ======================================================================
  const handleDeleteDialog = (rowdata) => {
    setDeleteRow(rowdata);
    setAlert(true);


  };

  const handelDeleterow = async (deleteRow) => {

    const locationValue = deleteRow.location ? deleteRow.location : "";
    axios
      .post(
        `${process.env.REACT_APP_DEVELOPMENT}/api/stock/deleteStockOut`,
        {
          stockOutId: deleteRow._id,
          quantity: parseInt(deleteRow.quantity),
          expiry: deleteRow.expiry,
          location:locationValue,
          productName: deleteRow.productName,
        },
        { headers: { token: accessToken } }
      )

      .then((res) => {
 

        let arr = stockOutData.filter((i) => deleteRow._id !== i._id);
        
        setStockOutData(arr);
        setAllStocks(arr);
        setAlert(false);
        handelDepatment(deleteRow.department);
      });
  };

  // ===========================================All product & All stock api ==========================================================================================
  const getAllProducts = () => {
    axios
      .get(`${process.env.REACT_APP_DEVELOPMENT}/api/product/getAllProducts`, {
        headers: { token: `${accessToken}` },
      })
      .then((res) => {
        let arr = res.data.result.map((item, index) => {
          const fieldsToCheck = [
            "productName",
            "lotNumber",
            "manufacturer",
            "physicalLocation",
            "sku",
            "supplierName",
            "unit",
            "addModel",
          ];
          fieldsToCheck.forEach((field) => {
            if (item.itemCode.includes(item[field])) {
              item.itemCode = item.itemCode.replace(item[field], "");
            }
          });

          return { ...item, id: index + 1 };
        });
        setAllProducts(arr);
 
      });
  };

  const getAllStocks = () => {
    axios
      .get(
        `${process.env.REACT_APP_DEVELOPMENT}/api/stock/getAllStocks`,
        {
          headers: { token: accessToken },
        }
      )
      .then((res) => {
       
        setAllStocks(res.data.result);
        {
      
        }
      });
  };

  const getAllLocations = ()=>{
    axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/location/getAllLocations/`,{headers:{token:`${accessToken}`}})
    .then(res=>{
      setAllLocation(res.data.result)
  
    })
  }

  // ===========================================Auto complete handel product==========================================================================================
  const handleProducts = (val) => {
    setSelectedProduct(val);
    const selectedStock = allStocks?.find(
      (stock) => stock?.product?._id === val?._id
    );
    setSelectedLocation(selectedStock?.product?.physicalLocation)

    
    getAllLocations()
    setSelectedExpiry(null); // Reset selected expiry when changing product
    setSelectedStock(selectedStock);
    setSelectedExpiry(null); // Reset selected expiry when changing product

  
  };

  // ===========================================Auto complete handel Deparment==========================================================================================

  const handelDepatment = (value) => {
    setSelectedDepartment(value);

    setSelectedProduct(null);
    setSelectedExpiry(null);


    // getAllProducts(value)
    getAllStocks();
  

    getAllProducts();


  };


  // ==========================================================send print button data==========================================================================================

  const handelPrintData = () => {
    if (stockOutData.length === 0) {
      toast("Stock-Out items first", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    } else {
      history.push("/Stockoutpdf", { data: stockOutData });
    }
  };
      // useEffect(() => {
      //   // Reset selectedLocation if selectedStock has no location
      //   if (!selectedStock?.expiryArray?.[0]?.location) {
      //     setSelectedLocation(null); // Clear the location if stock has no location field
      //   }
      // }, [selectedStock]);

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={6} display={display} />
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
         
     


        <h1 className="my-5 title text-center">stock-out</h1>
        {/* ==================================================================open Dialog code here ===================================================== */}
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
              <Button
                variant="contained"
                onClick={() => handelDeleterow(deleteRow)}
              >
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


        <>
       <LoginModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onLogin={handleLogin}
      />
        {isAuthenticated ? (
        <div>
           <form onSubmit={handleSubmit(onSubmit)}>
          <ToastContainer />
          <div className="d-flex flex-column align-items-center">
            <div className="row">
              <div className="col-auto">
                <TextField
                  id="outlined-basic"
                  label="Doc"
                  type="number"
                  sx={{ width: 100 }}
                  {...register("docNo", { required: true })}
                  defaultValue={1}
                  InputProps={{
                    readOnly: true,
                  }}
                />
              </div>

              <div className="col-auto">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  getOptionLabel={(e) => `${e.memberName}  ${e.department}`}
                  options={allMember}
                  onChange={(e, val) => {
                    setSelectedMember(val);
                    setSelectedDepartment(val?.department);
                    getAllProducts();
                    getAllStocks();
                  }}
                  sx={{ width: 250 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Members" required />
                  )}
                />
              </div>
              <div className="col-auto">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={allMember.filter(
                    (member) => member.memberName === selectedMember?.memberName
                  )}
                  getOptionLabel={(e) =>
                    e.department == undefined ? e : e.department
                  }
                  value={selectedDepartment}
                  onChange={(e, value) => handelDepatment(value?.department)}
                  sx={{ width: 300 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Department" />
                  )}
                />
              </div>
              <div className="col-auto">
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DesktopDatePicker
                    label="Date"
                    inputFormat="dd/MM/yyyy"
                    value={selectedDate}
                    onChange={(newValue) => {

                      setSelectedDate(newValue);
                    }}
                    renderInput={(params) => (
                      <TextField sx={{ width: 200 }} {...params} />
                    )}
                  />
                </LocalizationProvider>
              </div>
            </div>
            <div className="row my-3 d-flex flex-row ">
              <div className="col-auto">
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={allProducts}
                  getOptionLabel={(e) => `${e.itemCode.split(" ")[0]} ${e.productName} ${e.lotNumber} `}
                  isSearchable
                  value={selectedProduct}
                  onChange={(e, val) => handleProducts(val)}
                  sx={{ width: 580 }}
                  renderInput={(params) => (
                    <TextField {...params} label="Product List" />
                  )}
                />
              </div>
              <div className="col-auto">
                <TextField
                  id="outlined-basic"
                  label="Quantity"
                  type="number"
                  sx={{ width: 120 }}
                  required
                 
                  {...register("quantity", { required: true })}
                ></TextField>
              </div>
              <div className="col-auto">
                        <Autocomplete
                    disablePortal
                    id="location-autocomplete"
                    sx={{ width: 200 }}
                    value={selectedLocation}
                 getOptionLabel={(option) => (option ? option : "")}
        options={
          [selectedStock?.product?.physicalLocation]
        }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Select Location"
                        required
                      />
                    )}
                                                                  
                    onChange={(event, newValue) => {
                      setSelectedLocation(newValue); 
            
                    }}
          />

                {/* {selectedStock && (
                  selectedStock?.expiryArray[0]?.location ? (
                    <Alert severity="success" className="my-2" sx={{ height: "40px" }}>
                      Location Field Exists.
                    </Alert>
                  ) : (
                    <Alert severity="info" className="my-2" sx={{ height: "40px" }}>
                      Location Field Does Not Exist.
                    </Alert>
                  )
                )} */}

              </div>
              <div className="col-auto">
                <Autocomplete
                  disablePortal
            
                  id="combo-box-demo"
                  value={selectedExpiry}
              
              options={
              selectedStock
              ? selectedStock.expiryArray.filter((opt) => opt.quantity > 0)
              : []
          }
          // =========================Ye code mai ne stock expiryArray k ander Arrlocation ka hai ager array k under loction na mily to sotok k loction dikho===================================
          //     options={
          //     selectedStock
          //     ? selectedStock.expiryArray.filter((opt) => opt.quantity > 0 &&
          //     opt.location?.trim() === selectedLocation?.trim()

          //   )
          //     : 
                  

          //     selectedStock
          //     ? selectedStock.expiryArray.filter((opt) => opt.quantity > 0)
          //     : []
   
          // }
              
                  getOptionLabel={(opt) => {
                    // Assuming opt is an object with 'expiry' property
                    return moment
                      .parseZone(opt.expiry)
                      .local()
                      .format("DD/MM/YY");
                  }}
                  onChange={(e, val) => {
                    setSelectedExpiry(val);
                  }}
                  sx={{ width: 200 }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Select expiry date"
                      required
                    />
                  )}
                />
                {selectedExpiry && (
                  <p>
                    <b>Available Quantity {selectedExpiry.quantity}</b>
                  </p>
                )}
              </div>
            </div>
          </div>
          <div className="text-center my-5">
            <Button variant="contained" type="submit" className="">
              Add
            </Button>
          </div>
        </form>
        {/* ==================================================================Table ===================================================== */}

        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 650 }} aria-label="simple table">
            <TableHead>
              <TableRow>
                <TableCell>SNO</TableCell>
                <TableCell>Doc</TableCell>
                {/* <TableCell>_id</TableCell> */}
                <TableCell>Department</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Item code</TableCell>
                <TableCell>Item description</TableCell>
                <TableCell>Quantity</TableCell>
                <TableCell>Location</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Expiry date</TableCell>
                {/* <TableCell >Edit</TableCell> */}
                <TableCell>Delete</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {
                // rows.map((row)=>(
                stockOutData.map((item, index) => (

                  <TableRow key={item.index}>
                    <TableCell>{index+1}</TableCell>
                    <TableCell>{item.docNo}</TableCell>
                    {/* <TableCell >{item._id}</TableCell> */}
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.memberName}</TableCell>
                    <TableCell>{item.product.itemCode.split(" ")[0]}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
                    <TableCell>{item?.location || ""}</TableCell>
                    <TableCell>
                      {" "}
                      {moment.parseZone(item.date).local().format("DD/MM/YY")}
                    </TableCell>
                    <TableCell>
                      {moment.parseZone(item.expiry).local().format("DD/MM/YY")}
                    </TableCell>
                    {/* <TableCell ><IconButton onClick={()=>{handleOpenDialog(item)}}  ><EditIcon color='primary'  /></IconButton> </TableCell> */}
                    <TableCell>
                      <IconButton>
                        {" "}
                        <DeleteIcon
                          color="error"
                          onClick={() => {
                            handleDeleteDialog(item);
                          }}
                        />{" "}
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))
              }
            </TableBody>
          </Table>
        </TableContainer>
        <div className="text-center my-3">
          {/* <Link to ="/Stockoutpdf"><Button variant='contained' type='button' color='success'>Print  <PrintIcon className='mx-2' /></Button> </Link> */}
          <Button
            variant="contained"
            type="button"
            color="success"
            onClick={() => handelPrintData()}
          >
            Print <PrintIcon className="mx-2" />
          </Button>
        </div>
        </div>
      ) : (
        <div className="warninig">Please log in to view the stockout data.</div>
      )}
       
       </>


       
      </div>
      <Darkmode />
    </div>
  );
};

export default Stockout;
