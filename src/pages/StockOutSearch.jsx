
import React, { useEffect, useState } from 'react'
import "../components/Home.scss";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import Dashhead from "../components/Dashhead";
import Darkmode from '../components/Darkmode';
import { Autocomplete, Checkbox, Container, FormControlLabel, FormGroup, Stack,  TextField, Tooltip } from '@mui/material';
import {  DesktopDatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import moment from 'moment'
import axios from 'axios';
import { DataGrid } from '@mui/x-data-grid';
import * as XLSX from 'xlsx'
import { saveAs } from 'file-saver';
import GetAppIcon from '@mui/icons-material/GetApp';

const StockOutSearch = () => {
    const [display, setDisplay] = React.useState(false);
    const [allProducts,setAllProducts] = React.useState([])
    const [selectedDate,setSelectedDate]= useState()
    const [selectedDate2,setSelectedDate2]= useState()
    const [product,setProduct] = React.useState([])
    // const [deleteRow,setDeleteRow]=useState([])
    const [data,setData]=useState([])
    const [selectAll, setSelectAll] = useState(false);
    const [selectedDepartment,setSelectedDepartment]=useState([])

  // =====================================================================================================================================================
    const url = process.env.REACT_APP_DEVELOPMENT
  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"

// ========================================================================================================================================================
const department =[
  {name:'TCGC'},
  {name:"MICROBIOLOGY"},
  {name:"HEAMOTOLGY"},
  {name:"BIOCHEMISTRY"},
  {name:"HPLC"},
  {name:"AAS"},
  {name:"PARASITOLOGY"},
  {name:"GENERAL"},
     
  
]

 
    const columns = [
      { field: 'id', headerName:'No' , width: 70 },
      { field: 'name', headerName:'Products Name' , width: 150 },
      { field: 'department', headerName:'Department' , width: 150 },
      { field: 'quantity', headerName: 'Quantity' ,width: 150 },
      { field: 'location', headerName: 'Location' ,width: 150 },
        {field: "createdAt",headerName: "Date", type:'date',width: 150,valueGetter:(rowData)=>moment(rowData.createdAt).format("DD/MM/YYYY")},
        {field: "expiry",headerName: "Expiry Date", type:'date',width: 150,valueGetter:(rowData)=>moment(rowData.expiry).format("DD/MM/YYYY")},
        { field: 'memberName', headerName:'Request by' , width: 150 },
    ]; 


    const handleSelectAll = (event) => {
      if (event.target.checked) {
        setProduct(allProducts);
      } else {
        setProduct([]);
      }
    };
  
    const handleProductChange = (event, newSelectedProducts) => {
      setProduct(newSelectedProducts);
    };
// =======================================================================get api ======================================================================

    const getAllProduct=async()=>{
      try {
        axios.get(`${url}/api/product/getAllProducts`,{headers:{token:accessToken}})
        .then(res=>{
          setAllProducts(res.data.result)
          console.log(res.data.result)
        })
      } catch (error) {
        console.log(error)
        
      }
    }

// =======================================================================Post api ======================================================================

const handleSubmit = ()=>{
  axios.post(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/getPrevStockOutInfo`,{start:selectedDate,end:selectedDate2,department:selectedDepartment,productId:product.map(i=>i._id)},{headers:{token:accessToken}})
  .then(res=>{
    console.log(res)
    // setTotal(res.data.result)
    let arr = res.data.result.map((item,index)=>({...item,id:index+1}))
    setData(arr)
   
    // console.log(Mytotal,"Geting  Price Only");
  })

}
const handleExport = () => {
  const filteredData = data.map(({ name, department, quantity, date, expiry, memberName }) => ({
    name,
    department,
    quantity,
    date,
    expiry,
    memberName
  }));

  const worksheet = XLSX.utils.json_to_sheet(filteredData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
  saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Stock-out search stock.xlsx');
};
// =======================================================================by Defaul api call======================================================================

    useEffect(()=>{
      getAllProduct()
    },[])
// =======================================================================End======================================================================

    return (
        <div className="row">
        <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
          <Dashhead id={8} display={display} />
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
              stock-out search
            
            </h1>



{/* ==================================================================Form code here ===================================================== */}

<Container>
        <Stack direction="row" spacing={2} justifyContent="center">
    <section>
        <LocalizationProvider 
        
        dateAdapter={AdapterDateFns} >
        <DesktopDatePicker
        label="Start Date"
        inputFormat="dd/MM/yyyy"
        value={selectedDate}
        onChange={(newValue) => {
          console.log(newValue)
          setSelectedDate(newValue)
        }}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
      </LocalizationProvider>
      </section>
      <section>
        <LocalizationProvider 
        
        dateAdapter={AdapterDateFns} >
        <DesktopDatePicker
        label="End Date"
        inputFormat="dd/MM/yyyy"
        value={selectedDate2}
        onChange={(newValue) => {
          console.log(newValue)
          setSelectedDate2(newValue)
        }}
        renderInput={(params) => <TextField fullWidth {...params} />}
      />
      </LocalizationProvider>
      </section>
      <section>
   <Autocomplete
                    disablePortal
                    id="combo-box-demo"
                    getOptionLabel={(member)=>member?.name}
                      options={department}
                     onChange={(event,value)=>{
                      setSelectedDepartment(value?.name)
                     }}
                    sx={{ width: 180 }}
                    renderInput={(params) => <TextField {...params} label="Department" />}
                    />
   </section>
      <section>

   
      <FormGroup>
        <FormControlLabel
          control={
            <Checkbox
              checked={selectAll}
              onChange={handleSelectAll}
              color="primary"
            />
          }
          label="Select All"
        />
      </FormGroup>
      </section>

      <section>
      <Autocomplete
        multiple
        id="tags-outlined"
        // options={allProducts.filter(product => product.department === selectedDepartment)}
        options={allProducts}
        value={product}
        sx={{ width: 400 }}
        onChange={handleProductChange}
        // getOptionLabel={(option) => option.productName}
        getOptionLabel={(product) =>` ${product.itemCode.split(" ")[0]} ${product.productName} ${product.lotNumber}`}

        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Products"
            placeholder="Select Product"
          />
        )}
      />
   </section>

          <section>

 <button type="button" class="btn btn-primary" onClick={()=>handleSubmit()}>Submit</button>
          </section>
          <section>

          <div className='icondiv'>
      <Tooltip title="Export in xl"> <GetAppIcon className='exporticon'  onClick={handleExport} /></Tooltip> 
        </div>
          </section>

    </Stack>
 
    <div className='mt-3 ali'>

    </div>

        </Container>
{/* ==================================================================Table ===================================================== */}

<DataGrid
          rows={data}
          columns={columns}
          initialState={{
             pagination: {
              paginationModel: { psku: 0, pskuSize: 5 },
            },
          }}
          pskuSizeOptions={[5, 10]}
          // onRowClick={(item)=>setUpdate(item.row)}
        />
            </div>
            <Darkmode/>
            </div>
      )
}

export default StockOutSearch