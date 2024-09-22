import React, { useState } from "react";
import "./Dashhead.scss";
import { withRouter, useHistory } from "react-router";
import { connect } from "react-redux";
import { Button, Tooltip } from "@mui/material";
import { Dashboard, NoteAdd, PersonAdd, Add, Inventory, Logout, AutoDelete } from "@mui/icons-material";
import { Link } from "react-router-dom/cjs/react-router-dom";
import AddLocationIcon from '@mui/icons-material/AddLocation';
import logo from "../image/logo.png";
import stockOut from "../image/stockOut.png";
import stockoutsearch from "../image/stockoutsearch.png";
import stockinsearch from "../image/stockinsearch.svg";
import orderdetails from "../image/orderdetails.png";

const Dashhead = (props) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const history = useHistory();
  
  const menuItems = [
    { id: 1, label: "Dashboard", icon: <Dashboard />, path: "/Home" },
    { id: 2, label: "Add Product", icon: <NoteAdd />, path: "Addproduct" },
    { id: 3, label: "Add Member", icon: <PersonAdd />, path: "Addmember" },
    { id: 4, label: "Add Location", icon: <AddLocationIcon />, path: "AddLocation" },
    { id: 5, label: "Stock-in", icon: <Add />, path: "Stockin" },
    { id: 6, label: "Stock-out",  icon: <img src={stockOut} alt="Stock Out" width={22} className="image_brightnes" />,  path: "Stockout" },
    { id: 8, label: "Stock-Out Search", icon: <img src={stockoutsearch} alt="Stock-Out Search" width={22} className="image_brightnes"/>, path: "StockOutSearch" },
    { id: 9, label: "Stock-In Search", icon: <img src={stockinsearch} alt="Stock-In Search" width={22} className="image_brightnes" />, path: "StockInSearch" },
    { id: 10, label: "Order Details", icon: <img src={orderdetails} alt="Order Details" width={22} className="image_brightnes" />, path: "Orderdetails" },
    { id: 11, label: "Discard Items", icon: <AutoDelete />, path: "Discarditem" }
  ];

  const logout = () => {
    sessionStorage.removeItem('accessToken');
    setIsAuthenticated(false);
    history.push('/');
  };

  return (
    <div className={props.display ? "shadow-lg dashhead" : "dashhead displayhidden min-vh-100"} id="sidebar-wrapper">
      <div className="py-3">
        <Tooltip title="Tharb">
          <img src={logo} alt="Tharb" className="logo" />
        </Tooltip>
      </div>
      {menuItems.map((item) => (
        <div
          key={item.id}
          className={props.id === item.id ? "menu-container-active" : "menu-container"}
          onClick={() => props.history.push(item.path)}
          
        >
          <p>{item.icon} {item.label}</p>
        </div>
      ))}
      <div className="sticky-bottom fixed-bottom ml-1 bt">
        <Button variant="contained" color="error" style={{ width: "14%" }} onClick={logout}>
          Logout <Logout className="mx-3" />
        </Button>
      </div>
    </div>
  );
};

const mapStateToProps = ({ EventUser }) => ({ user: EventUser });

export default connect(mapStateToProps)(withRouter(Dashhead));
