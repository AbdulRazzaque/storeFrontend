

import React, { useState } from 'react'
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
  TextareaAutosize,
} from "@mui/material";
import { DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";

import PrintIcon from "@mui/icons-material/Print";
import { Link, useHistory } from "react-router-dom/cjs/react-router-dom";
import { useForm } from "react-hook-form";
import axios from "axios";
import moment from "moment";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";

const Discarditem = () => {
  const [display, setDisplay] = React.useState(false);
  // const [selectedDate,setSelectedDate]= useState()
  const [selectedDate, setSelectedDate] = React.useState(new Date());
  const [showDialog, setShowDialog] = useState(false);
  const [allMember, setAllMember] = React.useState([]);
  const [update, setUpdate] = useState([]);
  // const [deleteRow,setDeleteRow]=useState([])
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
  const [deleteRow, setDeleteRow] = React.useState([]);
  const [comment, setComment] = useState([]);
  // ========================================================================================================================================================
  const history = useHistory();
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();
  const accessToken =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo";
  // console.log(selectedStock)
  // =========================================================Dempartment===============================================================================================
  const department = [
    { name: "TCGC" },
    { name: "MICROBIOLOGY" },
    { name: "HEAMOTOLGY" },
    { name: "BIOCHEMISTRY" },
    { name: "HPLC" },
    { name: "AAS" },
    { name: "PARASITOLOGY" },
    { name: "GENERAL" },
  ];

  // ================================================================get api =====================================================
  React.useEffect(() => {
    axios
      .get(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/getDiscartitemDocNo`, {
        headers: { token: accessToken },
      })
      .then((res) => {
        console.log(res);

        if (res.data.result.length > 0) {
          //setDocNo(res.data.result[0].docNo)
          setValue("docNo", res.data.result[0].docNo + 1);
        }
      });

    axios
      .get(`${process.env.REACT_APP_DEVELOPMENT}/api/member/getAllMember`, {
        headers: { token: accessToken },
      })
      .then((res) => {
        console.log(res);
        setAllMember(res.data.result);
      });
  }, [flag]);
  // ================================================================post api =====================================================
  // console.log(selectedProduct,'selectedProduct')
  // console.log(allProducts,'allProducts')
  console.log(stockOutData, "stockOutData");
  const onSubmit = (data) => {
    let obj = {
      productName: selectedProduct.productName,
      productId: selectedProduct._id,
      product: selectedProduct,
      memberName: selectedMember.memberName,
      department: selectedDepartment,
      quantity: data.quantity,
      date: selectedDate,
      comment: data.comment,
      expiry: selectedExpiry ? selectedExpiry.expiry : null,
      expiryObject: selectedExpiry ? selectedExpiry : null,
      docNo: parseInt(data.docNo),
    };
    console.log(obj);
    setSelectedProduct(null);
    setSelectedStock(null);

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

    // console.log(first)
    axios
      .post(
        `${process.env.REACT_APP_DEVELOPMENT}/api/stock/discardItems`,
        { ...obj },
        { headers: { token: accessToken } }
      )
      .then((res) => {
        // console.log(res);
        setStockOutData([
          ...stockOutData,
          { ...obj, _id: res.data.result._id },
        ]);
        //    window.location.reload(false);
        console.log(stockOutData, "stockOutData");

        getAllStocks(selectedDepartment);
      })

      .catch((err) => {
        if (err.response) {
          // setError(err.response.data)
          console.log("Stock out erorr");
        }
      });
  };
  // ================================================================open Dialog api & Update code here =====================================================

  const handleOpenDialog = (rowdata) => {
    setUpdate(rowdata);
    setShowDialog(true); // Open the dialog
  };
  const updateData = (e) => {
    setUpdate({ ...update, [e.target.name]: e.target.value });
  };
  // =======================================================================Delete Dialog and api code here ======================================================================
  const handleDeleteDialog = (rowdata) => {
    setDeleteRow(rowdata);
    setAlert(true);

    console.log(rowdata, "Delete");
  };

  const handelDeleterow = async (deleteRow) => {
    axios
      .post(
        `${process.env.REACT_APP_DEVELOPMENT}/api/stock/deleteDiscardItems`,
        {
          discardId: deleteRow._id,
          quantity: parseInt(deleteRow.quantity),
          expiry: deleteRow.expiry,
          productName: deleteRow.productName,
        },
        { headers: { token: accessToken } }
      )

      .then((res) => {
        console.log(res);
        console.log("deterow", deleteRow);
        console.log(stockOutData, "stockOutData");

        let arr = stockOutData.filter((i) => deleteRow._id !== i._id);
        console.log("arr", arr);
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
        headers: { token: accessToken },
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
        console.log(arr);
      });
  };

  const getAllStocks = (value) => {
    axios
      .get(
        `${process.env.REACT_APP_DEVELOPMENT}/api/stock/getAllStocks/${value}`,
        {
          headers: { token: accessToken },
        }
      )
      .then((res) => {
        console.log(res);
        setAllStocks(res.data.result);
        {
          console.log(allStocks, "allStocks");
        }
      });
  };
  // ===========================================Auto complete handel product==========================================================================================
  const handleProducts = (val) => {
    setSelectedProduct(val);
    const selectedStock = allStocks.find(
      (stock) => stock.name === val.productName
    );
    setSelectedExpiry(null); // Reset selected expiry when changing product
    setSelectedStock(selectedStock);
    setSelectedExpiry(null); // Reset selected expiry when changing product
  };

  // ===========================================Auto complete handel Deparment==========================================================================================


  const handelDepatment = (value) => {
    setSelectedDepartment(value);

    setSelectedProduct(null);
    setSelectedExpiry(null);
    console.log(value, "Here i am cheack");

    // getAllProducts(value)
    getAllStocks();
    console.log(value, "Here i am cheack");

    getAllProducts();
  };

  // ==========================================================send print button data ==========================================================================================

  const handelPrintData = () => {
    // if (stockOutData.length === 0) {
    //   toast("Discard items first", {
    //     position: "top-center",
    //     autoClose: 5000,
    //     hideProgressBar: false,
    //     closeOnClick: true,
    //     pauseOnHover: true,
    //     draggable: true,
    //     progress: undefined,
    //     theme: "light",
    //   });
    // } 
    // else {
      history.push("/Discardpdf", { data: stockOutData });
    // }
  };

  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={10} display={display} />
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
        <h1 className="my-5 title text-center">Discard item</h1>
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
                    setSelectedDepartment(val.department);
                    getAllProducts(val.department);
                    getAllStocks(val.department);
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
                  onChange={(e, value) => handelDepatment(value.department)}
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
                      // console.log(newValue);
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
                {/* <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                     options={[...allProducts]}
                     getOptionLabel={(name)=>name.name}
                    sx={{ width: 500 }}
                    renderInput={(params) => <TextField {...params} label="Select item code,Product name" required/>}
                    value={selectedProduct}
                    onChange={(ev, val) => {
                      console.log("inside first product selector",val)
                      setSelectedProduct(val)
                      let arr = allStocks.filter(i=>i.name===val.name)
                      if(arr.length>0){
                        setSelectedStock(arr[0])
                      }
                    }}
                    /> */}
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={[...allProducts]}
                  getOptionLabel={(e) => `${e.itemCode.split(" ")[0]} ${e.productName} ${e.lotNumber} ${e.physicalLocation}`}
                  isSearchable
                  value={selectedProduct}
                  // onChange={(e,val)=>handelproducts(val)}
                  onChange={(e, val) => handleProducts(val)}
                  // onChange={(ev, val) => {
                  //   console.log("inside first product selector",val)
                  //   setSelectedProduct(val)
                  //   let arr = allStocks.filter(i=>i.name === val.productName )
                  //   if(arr.length>0){
                  //     setSelectedStock(arr[0])
                  //   }
                  // }}
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
                  id="combo-box-demo"
                  value={selectedExpiry}
                  options={
                    selectedStock
                      ? selectedStock.expiryArray.filter(
                          (opt) => opt.quantity > 0
                        )
                      : []
                  }
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
          <div>
                <textarea 
                 {...register("comment")}
                value={comment}
                onChange={(e,val) => setComment(val)}

                  style={{
                    padding: "10px",
                    width: "60%",
                    marginLeft:'180px',
                    height: "80px",
                  }}
                  placeholder="Add commet"

                />
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
                <TableCell>Doc</TableCell>
                <TableCell>Department</TableCell>
                <TableCell>Member</TableCell>
                <TableCell>Item code</TableCell>
                <TableCell>Item description</TableCell>
                <TableCell>Quantity</TableCell>
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
                    <TableCell>{item.docNo}</TableCell>
                    <TableCell>{item.department}</TableCell>
                    <TableCell>{item.memberName}</TableCell>
                    <TableCell>{item.itemCode}</TableCell>
                    <TableCell>{item.productName}</TableCell>
                    <TableCell>{item.quantity}</TableCell>
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
      <Darkmode />
    </div>
  );
};

export default Discarditem;
