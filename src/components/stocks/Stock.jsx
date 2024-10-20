import React, { useEffect, useState } from 'react'
import './stock.css';
import axios from 'axios';
import moment from 'moment';
import { Button,  Pagination,  TextField, Tooltip } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GetAppIcon from '@mui/icons-material/GetApp';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
import { sendData } from '../app/socket/socketActions';
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import Dashhead from '../Dashhead';
import Darkmode from '../Darkmode';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useLocation } from 'react-router-dom/cjs/react-router-dom';

const Stock = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const location = useLocation();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowSettings, setRowSettings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const url = process.env.REACT_APP_DEVELOPMENT
  const departmentName = location.state?.departmentName;
// ================================================================Stock get api===============================================================
  const fetchData = async()=>{
      try {
         
        const response = await axios.get(`${url}/api/stock/getAllStocksByDepartment/${departmentName}`, {
        });
        // console.log(response.data.result)
        setData(response.data.result)
        setCurrentPage(1); // Reset to page 1 when new data is fetched
      } catch (error) {
        console.log(error)
      }
  }

  useEffect(()=>{
fetchData()
  },[])
// ================================================================Color code===============================================================


console.log(rowSettings, 'Current Row Settings');
useEffect(() => {
  const updatedRowSettings = data.flatMap(item => 
    item.productDetails.map(product => {
      const existingSetting = rowSettings.find(setting => setting.id === product._id); // Match by product _id
      return existingSetting || {
        id: product._id,                      // Use product _id as the unique key
        start: parseInt(product.start) || 0,  // Start range (ensure it's a number)
        end: parseInt(product.end) || 0,      // End range (ensure it's a number)
        startColor: product.startColor || '#ffffff', // Default start color
        endColor: product.endColor || '#ffffff',     // Default end color
      };
    })
  );
  setRowSettings(updatedRowSettings);
}, [data]); // Re-run this effect whenever data changes


  const updateStockSettings = async (id, start, end, startColor, endColor) => {
    const obj = { id, start, end, startColor, endColor };
    try {
      const response = await axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/updateStockSettings`, { ...obj });
      return response.data;
    } catch (error) {
      console.error(error);
      throw error;
    }
  };

  const handleUpdateSettings = async (id, start, end, startColor, endColor) => {
    try {
      await updateStockSettings(id, start, end, startColor, endColor);
      toast("Range updated successfully", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    } catch (error) {
      toast("Something went wrong", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  };

  
  const handleSettingsChange = (index, _id, start, end, startColor, endColor) => {
    setRowSettings(prevSettings => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = {
        id: _id,
        start,
        end,
        startColor,
        endColor,
      };
      return updatedSettings;
    });
  };
  

  const getColorForIndex = (id, totalQuantity) => {
    const settings = rowSettings.find(setting => setting.id === id);

if (settings && totalQuantity <= settings.start && totalQuantity >= settings.end) {
  return settings.startColor || 'transparent';
} else if (settings && totalQuantity <= settings.start) {
  return settings.endColor || 'transparent';
} else {
  return 'transparent'; // Default color if no range matches
}

};


  
  
// ================================================================Xl export code===============================================================

  const handleExport = () => {
    const exportData = data.flatMap(item => 
      item.productDetails.map(product => ({
        itemCode: product.itemCode?.split(" ")[0],
        ProductName: product.name,
        Sku: product.sku,
        LotNumber: product.lotNumber,
        Manufacturer: product.manufacturer,
        Location: product.physicalLocation,
        ExpiryData: moment.parseZone(product.expiry).format("DD/MM/YYYY"),
        Quantity: product.quantity,
      }))
    );
  
    // Exporting the data to Excel
    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${departmentName} Stock.xlsx`);
  };
  
// ================================================================Search Code ===============================================================


 // Function to handle search query change
 const handleSearchChange = (e) => {
  const query = e.target.value;
  setSearchQuery(query);

  // Generate suggestions based on the query
  if (query.length > 0) {
    const filteredSuggestions = data.flatMap(item =>
      item.productDetails.filter(product =>
        product.itemCode?.toLowerCase().includes(query.toLowerCase()) ||
        product.name?.toLowerCase().includes(query.toLowerCase()) ||
        product.physicalLocation?.toLowerCase().includes(query.toLowerCase()) ||
        product.sku?.toLowerCase().includes(query.toLowerCase())
      )
    );

    // Limit suggestions to 5 or fewer
    setSuggestions(filteredSuggestions.slice(0, 10));
  } else {
    setSuggestions([]);
  }
};

// Function to handle clicking on a suggestion
const handleSuggestionClick = (suggestion) => {
  // Populate search query with the clicked suggestion's name
  setSearchQuery(suggestion.name || suggestion.itemCode.split(' ')[0] || suggestion.sku || '');
  setSuggestions([]); // Clear suggestions after selection
};

// Filter logic for displaying products
const filteredStocks = data.filter(item =>
  item.productDetails.some(product =>
    product.itemCode?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.physicalLocation?.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.sku?.toLowerCase().includes(searchQuery.toLowerCase())
  )
);

// =================================pagintaion code===============================================================
const itemsPerPage = 50;

 // Calculate total pages for filtered stocks
 const totalPages = Math.ceil(filteredStocks.length / itemsPerPage);


 // Calculate start index for the current page
const startIndex = (currentPage - 1) * itemsPerPage;

 // Get the stocks for the current page
const paginatedData = filteredStocks.slice(
  startIndex,
  startIndex + itemsPerPage
);

 const handleNext = () => {
   if (currentPage < totalPages) {
     setCurrentPage(prevPage => prevPage + 1);
   }
 };

 const handlePrevious = () => {
   if (currentPage > 1) {
     setCurrentPage(prevPage => prevPage - 1);
   }
 };
// =================================================================End===============================================================


  return (

    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={1} />
      </div>
      <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container">
        <h1 className="my-5 title text-center">{departmentName} Stock</h1>
      <ToastContainer/>

            <div className='icondivright'>          
               <Tooltip title="Back">
            <ArrowBackIcon className='exporticon' onClick={() => {  history.goBack()}} />
          </Tooltip>
     </div>
       <div className='icondiv'>
          <Tooltip title="Export in Excel">
            <GetAppIcon className='exporticon' onClick={handleExport} />
          </Tooltip>
        </div>


        <div>
      
      <div className='text-center'>
      <TextField
             type="text"
             placeholder="Search by Item Code, Product Name, and SKU"
             sx={{width:800}}
             value={searchQuery}
             onChange={handleSearchChange}
     
      />

        {suggestions.length > 0 && (
        <div className='suggestions'>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              onClick={() => handleSuggestionClick(suggestion)}
              style={{
                padding: '10px',
                cursor: 'pointer',
                borderBottom: '1px solid #ddd',
              }}
            >
              {/* {suggestion.name || suggestion.itemCode || suggestion.sku} */}
              {suggestion.itemCode && <strong>{suggestion.itemCode.split(" ")[0]}</strong>} - {suggestion.name} - {suggestion.sku}   {suggestion.LotNumber|| ""}
            </div>
          ))}
        </div>
      )}

      </div>
    
    </div> 
    <div className='text-right my-3'> <b>Note: After adding the range, don't forget to update the Range button</b>
 </div>
 <table className="table table-bordered my-5">
  <thead>
    <tr>
      <th scope="col">S.N</th>
      <th scope="col">Item Code</th>
      <th scope="col">S.K.U</th>
      <th scope="col">Product Name</th>
      <th scope="col">Quantity</th>
      <th scope="col">Location</th>
      <th scope="col">Expiry Date</th>
      <th scope="col">Lot Number</th>
      <th scope="col">Manufacturer</th>
    </tr>
  </thead>
  <tbody>
    {paginatedData.map((item, index) => {
      const firstProduct = item.productDetails[0];
      const rowColor = getColorForIndex(firstProduct?._id, item.totalQuantity);

      return (
        <React.Fragment key={index}>
          {item.productDetails && item.productDetails.length > 0 ? (
            item.productDetails.map((product, i) => (
              <tr
                key={`${index}-${i}`}
                style={{
                  backgroundColor: rowColor // Apply the same color to all rows for the product
                }}
              >
                {i === 0 && (
                  <th scope="row" rowSpan={item.productDetails.length}>
                    {startIndex + index}
                  </th>
                )}
                <td>{product?.itemCode?.split(" ")[0]}</td>
                <td>{product.sku}</td>
                <td>{product.name}</td>
                <td>{product.quantity}</td>
                <td>{product.physicalLocation}</td>
                <td>{product.expiry ? moment(product.expiry).format("DD/MM/YYYY") : "-"}</td>
                <td>{product.LotNumber}</td>
                <td>{product.Manufacturer}</td>
              </tr>
            ))
          ) : (
            <tr>
              <th scope="row">{startIndex + index}</th>
              <td colSpan="9">No product details available</td>
            </tr>
          )}

          {/* Total Quantity Row with Dynamic Color */}
          <tr>
            <td colSpan="5" style={{ fontWeight: 'bold' }}>
              Total Quantity:
              {item.totalQuantity}
            </td>
            <td colSpan="5" style={{ textAlign: 'right' }}>
              {/* Range Inputs */}
              <input
                type="number"
                style={{ width: "100px", borderRadius: "50px" }}
                placeholder="Start Range"
                value={rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.start || ''}
                onChange={(e) =>
                  handleSettingsChange(
                    index,
                    item.productDetails[0]?._id,
                    parseInt(e.target.value),
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.end,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.startColor,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.endColor
                  )
                }
              />
              <input
                type="color"
                value={rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.startColor || ''}
                onChange={(e) =>
                  handleSettingsChange(
                    index,
                    item.productDetails[0]?._id,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.start,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.end,
                    e.target.value,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.endColor
                  )
                }
              />
              <input
                style={{ width: "100px", borderRadius: "50px" }}
                type="number"
                placeholder="End Range"
                value={rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.end || ''}
                onChange={(e) =>
                  handleSettingsChange(
                    index,
                    item.productDetails[0]?._id,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.start,
                    parseInt(e.target.value),
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.startColor,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.endColor
                  )
                }
              />
              <input
                type="color"
                value={rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.endColor || ''}
                onChange={(e) =>
                  handleSettingsChange(
                    index,
                    item.productDetails[0]?._id,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.start,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.end,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.startColor,
                    e.target.value
                  )
                }
              />
              <Button
                variant="contained"
                size="small"
                className="ml-3"
                onClick={() =>
                  handleUpdateSettings(
                    item.productDetails[0]?._id,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.start,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.end,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.startColor,
                    rowSettings.find(setting => setting.id === item.productDetails[0]?._id)?.endColor
                  )
                }
              >
                Update Range
              </Button>
            </td>
          </tr>
        </React.Fragment>
      );
    })}
  </tbody>
</table>


       {/* Simple Next and Previous Buttons */}
       <div className='p-5 text-center '>
        <button  type="button" class="btn btn-primary mx-5" onClick={handlePrevious} disabled={currentPage === 1}>
          Previous
        </button>
        <button  type="button" class="btn btn-primary" onClick={handleNext} disabled={currentPage === totalPages}>
          Next
        </button>
      </div>

    </div>
    </div>
  )
}

export default Stock