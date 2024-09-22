

import React, { useEffect, useState } from "react";
import { Box, Card, CardContent, Grid, Typography } from "@mui/material";

import axios from "axios";
// import genetic from "../image/genetic.png";
import hematology from "../../image/hematology.png";
import biochemistry from "../../image/biochemistry.png";
import laboratory from "../../image/laboratory.png";
import aa from "../../image/aa.png";

import { useHistory } from "react-router-dom";
import Darkmode from "../Darkmode";
import Dashhead from "../Dashhead";

function Centralsection() {
  const [display, setDisplay] = useState(false);
  const [data, setData] = useState([]);
  const url = process.env.REACT_APP_DEVELOPMENT;
  const history = useHistory();

  const stockTotals = async () => {
    try {
      const res = await axios.get(`${url}/api/stock/stockTotals/`);
      setData(res.data.result.map((item, index) => ({ ...item, id: index + 1 })));
    } catch (error) {
      console.log(error);
    }
  };

  const departments = [
    { name: "HEAMOTOLGY", icon: hematology, id: "HEAMOTOLGY", path: "/Stock" },
    { name: "BIOCHEMISTRY",icon:biochemistry, id: "BIOCHEMISTRY", path: "/Stock" },
    { name: "HPLC", icon:laboratory, id: "HPLC", path: "/Stock" },
    { name: "AAS",icon:aa, id: "AAS", path: "/Stock" },

  ].map(dept => ({
    ...dept,
    totalQuantity: data.find(item => item._id === dept.id)?.totalQuantity || 0,
  }));

  useEffect(() => {
    stockTotals();
  }, []);

  return (
    <div className="row">
      <div className="col-md-2">
        <Dashhead id={1} display={display} />
      </div>
      <div className="col-md-10 dashboard-container" onClick={() => setDisplay(false)}>
        <h1 className="my-5 title text-center">Central section</h1>
        
        <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
          {departments.map((dept, idx) => (
            <Card 
              sx={{ borderRadius: 4, padding: 2, boxShadow: 3, width: 300, mx: 3, my: 3, cursor: "pointer" }}
              onClick={() => history.push(dept.path, { departmentName: dept.name })}
              key={idx}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <img src={dept.icon} alt={dept.name} className="icon-image" />
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

export default Centralsection;





