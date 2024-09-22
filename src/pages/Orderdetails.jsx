import React, { useEffect, useState } from "react";
// import "./Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../components/Dashhead";
import Darkmode from "../components/Darkmode";
import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import axios from "axios";
import moment from 'moment'
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { sendData } from "../components/app/socket/socketActions";
import { useDispatch } from "react-redux";
const Orderdetails = () => {
  const [display, setDisplay] = React.useState(false);
  const [department, setDepartment] = React.useState("");
  const [data, setData] = React.useState([]);

    const history = useHistory()
    const dispatch = useDispatch()
  const handleChange = (event) => {
    setDepartment(event.target.value);
  };

  console.log(data,'data')

  const fetchData = async () => {
    await axios.get(`${process.env.REACT_APP_DEVELOPMENT}/api/order/getDetailsOrders`).then((res) => {
      let arr = res.data.result.map((item,index)=>({...item,id:index+1}))
      setData(arr);
  
    });
  };

  const handelclick =(item)=>{
    dispatch(sendData(item));
     history.push('/Orderdetailspdf')
  
    // console.log(item,"item")
  }

  useEffect(()=>{
   fetchData()

  },[])
  console.log(data,'datagg')


  const StatusDropdown = ({ value, onChange }) => {
    return (
      <Select value={value} onChange={onChange}>
        <MenuItem   style={{ color: "green" }} value="Completed">Completed</MenuItem>
        <MenuItem   style={{ color: "red" }} value="In Progress">In Progress</MenuItem>
      </Select>
    );
  };

  const columns = [
    { field: "id", headerName: "S.N", width: 70 },
    { field: "itemnumber", headerName: "Ref no", width: 150 },
    { field: "department", headerName: "Department",valueGetter:(params)=>params.row.memberId?.department ,width: 150 },
    { field: "orderType", headerName: "order type", width: 150  },
    { field: "createdAt", headerName: "Order issue date", width: 150 ,valueGetter:(rowData)=> moment(rowData.createdAt).format('DD/MM/YYYY') },
    
    {
      field: "status",
      headerName: "Status",
      width: 180,
      renderCell: (params) => (
        <StatusDropdown
          value={params.value}
          onChange={(e) => handleStatusChange(e, params.row._id)}
        />
      ),
    },
  ];


  const handleStatusChange = async (event, id) => {
    const newStatus = event.target.value;
    const newData = data.map(row => {
      if (row._id === id) {
        return { ...row, status: newStatus };
      }
      return row;
    });
  
    // Check if the status actually changed
    if (data.find(row => row._id === id)?.status !== newStatus) {
      try {
        await axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/order/updateOrder/${id}`, {
          status: newStatus
        });
        setData(newData);
      } catch (error) {
        console.error('Error updating order:', error);
        // You can handle the error here
      }
    }
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
        <h1 className="my-5 title text-center">Order Details</h1>

        <div style={{ height: 800, width: "100%" }}>
          <DataGrid
            rows={data}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { psku: 0, pskuSize: 5 },
              },
            }}
            pskuSizeOptions={[5, 10]}
            onRowClick={(item,ev)=>handelclick(item.row)}
          />
        </div>
      </div>

      <Darkmode />
    </div>
  );
};

export default Orderdetails;
