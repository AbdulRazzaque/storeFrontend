import React, { useEffect, useState } from "react";
import "./Home.scss";

import Dashhead from "./Dashhead";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";
import Darkmode from "./Darkmode";
import axios from "axios";
import genetic from "../image/genetic.png"
import microbiology from "../image/microbiology.png"
import parasite from "../image/parasite.png"
import medicine from "../image/medicine.png"
import order from "../image/order.png"
import nomad from "../image/nomad.png"
import { useHistory } from "react-router-dom/cjs/react-router-dom";
function Home() {
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState([]);
  const url = process.env.REACT_APP_DEVELOPMENT;
  const history = useHistory();
 
    const stockTotals = async () => {
      try {
        const res = await axios.get(`${url}/api/stock/stockTotals/`);
        setData(res.data.result.map((item, index) => ({ ...item, id: index + 1 })));
        console.log(data)
      } catch (error) {
        console.log(error);
      }
    };

    const departments = [
      { name: "TCGC", icon:<img src={genetic } alt="genetic" className="icon-image"/>, totalQuantity: data.find(item => item._id === "TCGC")?.totalQuantity || 0, path: "/Stock" },
      { name: "MICROBIOLOGY",icon:<img src={microbiology } alt="microbiology" className="icon-image"/>,totalQuantity:data.find(item => item._id === "MICROBIOLOGY")?.totalQuantity || 0,  path: "/Stock"},
      { name: "PARASITOLOGY",icon:<img src={parasite } alt="parasite"  className="icon-image"/>, totalQuantity: data.find(item => item._id === "PARASITOLOGY")?.totalQuantity || 0, path: "/Stock" },
      { name: "GENERAL",icon:<img src={medicine } alt="medicine" className="icon-image"/>, totalQuantity: data.find(item => item._id === "GENERAL")?.totalQuantity || 0, path: "/Stock"},
      { name: "CENTRAL", icon:<img src={nomad} alt="nomad" className="icon-image"/>, path: "/Centralsection", },
      { name: "ALL ORDER",icon:<img src={order} alt="order"   className="icon-image"/>, path: "/Orderdetails",  },
    ];


  useEffect(()=>{
    stockTotals()
  },[])
  return (
    <div className="row">
      <div className="col-md-2">
        <Dashhead id={1} display={display} />
      </div>
      <div className="col-md-10 dashboard-container" onClick={() => setDisplay(false)}>
       
        <h1 className="my-5 title text-center">Dashboard</h1>
        
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, }}  >
          
        {departments.map((dept, idx) => (
          <Card  sx={{ borderRadius: 4, padding: 2, boxShadow: 3 ,width:300, mx:3, my:3,cursor:"pointer"}}
          onClick={() => history.push(dept.path,{departmentName: dept.name })}
         key={idx}
          >
        
      <CardContent className ={url === "http://192.168.1.98:3002"?"bg-dark":"bg-white"}>

        <Box display="flex" alignItems="center" mb={2}>
          {dept.icon}
        </Box>
        <Typography variant="h6" color="textSecondary">
        {dept.name}
        </Typography>
        <Typography variant="h4" sx={{ fontWeight: 'bold', marginY: 1 }}>
        {dept.totalQuantity}
        </Typography>
      </CardContent>
    </Card>
    
           ))}
           </Grid>
      </div>
      <Darkmode />
    </div>
  );
}

export default Home;
