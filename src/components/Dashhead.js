import React, { useState } from "react";
import "./Dashhead.scss";
import { withRouter } from "react-router";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import NoteAddOutlinedIcon from "@mui/icons-material/NoteAddOutlined";
import { connect } from "react-redux";
import DashboardIcon from "@mui/icons-material/Dashboard";
import logo from "../image/logo.png";
import { Button, Tooltip } from "@mui/material";
import InventoryIcon from "@mui/icons-material/Inventory";
import stockOut from "../image/stockOut.png";
import stockoutsearch from "../image/stockoutsearch.png";
import stockinsearch from "../image/stockinsearch.svg";
import orderdetails from "../image/orderdetails.png";
import LogoutIcon from "@mui/icons-material/Logout";
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import AddIcon from '@mui/icons-material/Add';
import AutoDeleteIcon from '@mui/icons-material/AutoDelete';
import { Link } from "react-router-dom/cjs/react-router-dom";
import { useHistory } from 'react-router-dom';
const Dashhead = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();
  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    history.push('/');
  };



  console.log(props);
  let { id, display } = props;
  return (
    <>
      <div
        className={
          display ? "shadow-lg dashhead" : "dashhead displayhidden min-vh-100 "
        }
        id="sidebar-wrapper"
      >

        <div className="py-3 ">
          <Tooltip title="Tharb">
            <img src={logo} alt="Tharb" className="logo " />
          </Tooltip>
        </div>

        {id === 1 ? (
          <div className="menu-container-active">
            <p>
              <DashboardIcon /> Dashboard
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("/Home")}
          >
            <p>
              <DashboardIcon /> Dashboard
            </p>
          </div>
        )}
    

        {id === 2 ? (
          <div className="menu-container-active">
            <p>
              <NoteAddIcon /> Add Product
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Addproduct")}
          >
            <p>
              <NoteAddOutlinedIcon />  Add Product
            </p>
          </div>
        )}
        {id === 3 ? (
          <div className="menu-container-active">
            <p>
              <PersonAddIcon /> Add Member
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Addmember")}
          >
            <p>
              <PersonAddIcon />  Add Member
            </p>
          </div>
        )}
        {id === 4 ? (
          <div className="menu-container-active">
            <p>
              <AddIcon /> Stock-in
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Stockin")}
          >
            <p>
              <AddIcon />  Stock-in
            </p>
          </div>
        )}
        {id === 5 ? (
          <div className="menu-container-active">
            <p>
            <img
                        src={stockOut}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      /> Stock-out
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Stockout")}
          >
            <p>
            <img
                        src={stockOut}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      /> Stock-out
            </p>
          </div>
        )}

{id === 6 ? (
          <div className="menu-container-active"
          onClick={() => props.history.push("Stock")}
          >
             
            <p>
              <InventoryIcon /> Stock
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Stock")}
          >
            <p>
              <InventoryIcon/>  Stock
            </p>
          </div>
        )}

{id === 7 ? (
          <div className="menu-container-active">
            <p>
            <img
                        src={stockoutsearch}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      /> Stock-Out Search
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("StockOutSearch")}
          >
            <p>
            <img
                        src={stockoutsearch}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      />  Stock-Out Search
            </p>
          </div>
        )}
{id === 8 ? (
          <div className="menu-container-active">
            <p>
            <img
                        src={stockinsearch}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      />  Stock-In Search
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("StockInSearch")}
          >
            <p>
            <img
                        src={stockinsearch}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      />  Stock-In Search
            </p>
          </div>
        )}
{id === 9 ? (
          <div className="menu-container-active">
            <p>
            <img
                        src={orderdetails}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      />  Order details
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Orderdetails")}
          >
            <p>
            <img
                        src={orderdetails}
                        alt="Genitic"
                        width={22}
                       
                        className="mx-1 stockout"
                      />  Order details
            </p>
          </div>
        )}
{id === 10 ? (
          <div className="menu-container-active">
            <p>
            < AutoDeleteIcon/>   Discard items
            </p>
          </div>
        ) : (
          <div
            className="menu-container"
            onClick={() => props.history.push("Discarditem")}
          >
            <p>
           < AutoDeleteIcon/> Discard items
            </p>
          </div>
        )}
        <div className="sticky-bottom fixed-bottom ml-1 bt">
       <Button variant="contained" color="error" style={{ width: "14%" }} onClick={logout}>
            Logout <LogoutIcon className="mx-3"  />
          </Button>
        </div>
      
      </div>
    </>
  );
};

const mapStateToProps = ({ EventUser }) => {
  return {
    user: EventUser,
  };
};

export default connect(mapStateToProps)(withRouter(Dashhead));
