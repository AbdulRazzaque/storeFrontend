import React, { useEffect, useState } from "react";
import "./Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "./Dashhead";
import { Box, Card, CardActionArea, CardContent, Grid, Typography } from "@mui/material";
import Darkmode from "./Darkmode";
import { Link } from "react-router-dom/cjs/react-router-dom.min";
import axios from "axios";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import TagIcon from "@mui/icons-material/LocalOffer";
import genetic from "../image/genetic.png"
import microbiology from "../image/microbiology.png"
import parasite from "../image/parasite.png"
import medicine from "../image/medicine.png"
import order from "../image/order.png"
import nomad from "../image/nomad.png"
function Home() {
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState([]);
  const url = process.env.REACT_APP_DEVELOPMENT;

 
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
      { name: "TCGC", icon:<img src={genetic } className="icon-image"/>, totalQuantity: data.find(item => item._id === "TCGC")?.totalQuantity || 0, path: "/Geneticstock", style: "card1" },
      { name: "MICROBIOLOGY",icon:<img src={microbiology } className="icon-image"/>,totalQuantity:data.find(item => item._id === "MICROBIOLOGY")?.totalQuantity || 0,  path: "/Microbiologystock", style: "card2" },
      { name: "Parasitology",icon:<img src={parasite } className="icon-image"/>, totalQuantity: data.find(item => item._id === "Parasitology")?.totalQuantity || 0, path: "/Parasitology", style: "card4" },
      { name: "General",icon:<img src={medicine } className="icon-image"/>, totalQuantity: data.find(item => item._id === "General")?.totalQuantity || 0, path: "/Generalstock", style: "card5" },
      { name: "Central", icon:<img src={nomad} className="icon-image"/> ,path: "/Centralsection", style: "card3" },
      { name: "All Order",icon:<img src={order} className="icon-image"/>, path: "/Orderdetails", style: "card6" },
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
        {/* <IconButton size="large" onClick={() => setDisplay(true)} className="iconbutton display-mobile">
          <MenuIcon fontSize="inherit" />
        </IconButton> */}
        <h1 className="my-5 title text-center">Dashboard</h1>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {departments.map((dept, idx) => (
            <Grid xs={4} key={idx}>
              <Box>
                <Link to={dept.path}>
                  <Card sx={{ maxWidth: 345, height: 194, my:3}} className={`cardStyle ${dept.style}`}>
                    <CardActionArea>
                      <h1 className="center-text">{dept.name}</h1>
                      <h5 className="center-text">Total Quantity: {dept.totalQuantity}</h5>
                    </CardActionArea>
                  </Card>
                </Link>
              </Box>
            </Grid>
          ))}
        </Grid>
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3, }} >
        {departments.map((dept, idx) => (
          <Link to={dept.path}>
        <Card sx={{ borderRadius: 4, padding: 2, boxShadow: 3 ,width:300, mx:3, my:3}}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          {/* <TagIcon sx={{ backgroundColor: '#e0e0e0', borderRadius: '50%', padding: '8px', fontSize: 32, color: '#7c4dff' }} /> */}
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
    </Link>
           ))}
           </Grid>
      </div>
      <Darkmode />
    </div>
  );
}

export default Home;
