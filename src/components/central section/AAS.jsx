

import React, { useEffect, useState } from 'react'

import axios from 'axios';
import moment from 'moment';
import { Button, IconButton, TextField, Tooltip } from '@mui/material';
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

const AAS = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [data, setData] = useState([]);
  const [currentPage, setCurrentPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSettings, setRowSettings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [clickedSuggestion, setClickedSuggestion] = useState(false);

  const filteredData = data.filter(item =>
    item.product && item.product.productName && (
      `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.product.productName.toLowerCase().includes(searchQuery.toLowerCase())
    )
  );
  
  console.log(filteredData, 'filteredData');
  
  // Adjust the unique item codes to include necessary details
  const uniqueItemCodes = [...new Set(filteredData.map(item => `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}`))];
  

  const handleSuggestionClick = (code) => {
    // Extract the productName from the code by finding the item in filteredData
    const selectedItem = filteredData.find(item =>
      `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}` === code
    );
  
    if (selectedItem) {
      setSearchQuery(selectedItem.product.productName);
      setClickedSuggestion(true); // Set the flag to indicate a suggestion has been clicked
    }
  };
  const url = process.env.REACT_APP_DEVELOPMENT


  const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"


  console.log(data,'data')



  
  // Columns setup
  const columns = [
    { label: "S.N", prop: "id" },
    { label: "Item Code", prop: "itemCode" },
    { label: "Expiry Dates", prop: "expiry" },
    { label: "Total Quantity", prop: "totalQuantity" },
    { label: "Product Name", prop: "product.productName" },
    { label: "S.K.U", prop: "product.sku" },
    { label: "Lot Number", prop: "product.lotNumber" },
    { label: "Manufacturer", prop: "product.manufacturer" },
    { label: "Range"},
    // { label: "Final Quantity", prop: "finalQuantity" }, // Adjusted prop name
  ];
  

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${url}/api/stock/getAllStocksByDepartment/AAS`, {
          headers: { token: accessToken }
        });
  
        const newData = response.data.result.map((item, index) => {
          // Check if expiryArray exists and is an array before using it
          const totalQuantity = Array.isArray(item.expiryArray) 
            ? item.expiryArray.reduce((acc, curr) => acc + curr.quantity, 0)
            : 0;
          const expiryDates = Array.isArray(item.expiryArray) 
            ? item.expiryArray.map(e => e.expiry).join(', ')
            : 'No expiry info';
  
          // Replace supplierName with **** in itemCode
          let cleanItemCode = item.product && item.product.itemCode ? item.product.itemCode : 'ProductDeleted';
          if (item.product && item.product.supplierName) {
            cleanItemCode = cleanItemCode.replace(item.product.supplierName, '****');
          }
  
          return {
            ...item,
            id: index + 1,
            totalQuantity,
            expiry: expiryDates,
            itemCode: cleanItemCode
          };
        });
  
        setData(newData);
        sortData(newData); // Sorting newData by itemCode after setting the state
      } catch (error) {
        console.error('Error fetching AAS stock data:', error);
      }
    };
  
    fetchData();
  }, [url, accessToken]);
  
  
  
  useEffect(() => {
    const updatedRowSettings = data.map(item => {
      const existingSetting = rowSettings.find(setting => setting.id === item._id);
      return existingSetting || { id: item._id, start: item.start, end: item.end, startColor: item.startColor, endColor: item.endColor };
    });
    setRowSettings(updatedRowSettings);
  }, [data]); // Only run this effect when `data` changes
  
  
  const sortData = (dataToSort) => {
    let sortedData = [...dataToSort]; // Creating a copy of the original array
    sortedData = sortedData.sort((a, b) => {
      const codeA = parseInt((a.itemCode.match(/\d+/) || [0])[0], 10);
      const codeB = parseInt((b.itemCode.match(/\d+/) || [0])[0], 10);
      return codeA - codeB;
    });
    setData(sortedData); // Updating the state with the sorted array
  };
  
  
  
  

  const handleRowSelectionChange = (event, row) => {
    const isChecked = event.target.checked;
    setSelectedRows(prev => {
      if (isChecked) {
        return [...prev, row];
      } else {
        return prev.filter(r => r.id !== row.id);
      }
    });
  };
 
  const handleExport = () => {
    
    const worksheet = XLSX.utils.json_to_sheet(data);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
    const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
    saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'AAS stock.xlsx');
  };

  
  // Calculate total number of pages
  const totalPages = Math.ceil(filteredData.length / rowsPerPage);

  // Calculate the indices for the current page
  const indexOfLastRow = currentPage * rowsPerPage + rowsPerPage;
  const indexOfFirstRow = indexOfLastRow - rowsPerPage;
  const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);



  console.log(currentData,'currentData')

  


  const handleSendData = () => {
    const dataToSend = selectedRows.map(row => ({
      ...row,
      labName: 'AAS Lab'
    }));
    dispatch(sendData(dataToSend));
    history.push('/Order');
  };



  const calculateTotalsByCode = (data) => {
    const totals = {};
    data.forEach((item) => {
      const codeMatch = item.itemCode.match(/\d+/);
  
      if (codeMatch) {
        const code = codeMatch[0];
        totals[code] = (totals[code] || 0) + item.totalQuantity;
      }
    });
    return totals;
  };
  
  const totalsByCode = calculateTotalsByCode(currentData);
  
  const calculateLastIndexes = (data) => {
    const lastIndex = {};
    data.forEach((item, index) => {
      const codeMatch = item.itemCode.match(/\d+/);
      if (codeMatch) {
        const code = codeMatch[0];
        lastIndex[code] = index; // Update to the current index as last index
      }
    });
    return lastIndex;
  };
  
  const lastIndexes = calculateLastIndexes(currentData);

  const handleSettingsChange = (index, start, end, startColor, endColor) => {
    setRowSettings(prevSettings => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = {
        start: start,
        end: end,
        startColor: startColor,
        endColor: endColor
      };
      return updatedSettings;
    });
  };

  const getColorForIndex = (index, quantity) => {
    const settings = rowSettings[index];
    if (settings && quantity <= settings.start && quantity >= settings.end) {
        return settings.startColor || 'transparent';
    } else if (settings && quantity <= settings.start) {
        return settings.endColor || 'transparent';
    } else {
        return 'transparent'; // Default color if no range matches
    }
};

const updateStockSettings = async (id, start, end, startColor, endColor) => {
  const obj ={
    id:id,
    start: start,
    end: end,
    startColor: startColor,
    endColor: endColor
  }
  try {
    const response=  await axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/updateStockSettings`, {...obj},
    {headers:{token:`${accessToken}`}})
      return response.data;
  } catch (error) {
      console.error(error);
      throw error;
  }
};

const handleUpdateSettings = async (id, start, end, startColor, endColor) => {
  try {
    await updateStockSettings(id, start, end, startColor, endColor);

  toast("Range update successfully", {
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





  // const filteredData = currentData.filter(item => item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()));
// Filter data based on search query

  
  return (
    <div className="row">
      <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
        <Dashhead id={6} />
      </div>
      <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container">
        <h1 className="my-5 title text-center">AAS Stock</h1>
        <ToastContainer/>
        <div className='icondivright'>
          <Tooltip title="Back">
            <ArrowBackIcon className='exporticon' onClick={() => { history.push("/stock") }} />
          </Tooltip>
        </div>
        <div className='icondiv'>
          <Tooltip title="Export in Excel">
            <GetAppIcon className='exporticon' onClick={handleExport} />
          </Tooltip>
        </div>


        <div>
          <div className='text-center my-4'>
          <TextField
             type="text"
             placeholder="Search by item code"
             sx={{width:800}}
             value={searchQuery}
             onChange={(e) => {
               setSearchQuery(e.target.value);
               setCurrentPage(0); // Reset to first page on search
             }}
     
      />
          </div>
 
          <div>
    {searchQuery.length > 0 && !clickedSuggestion && (
      <div className="suggestions">
        {uniqueItemCodes
          .filter(code => code.toLowerCase().includes(searchQuery.toLowerCase()))
          .map(code => (
            <div
              key={code}
              className="suggestion"
              onClick={() => handleSuggestionClick(code)}
            >
              {code}
            </div>
          ))}
      </div>
    )}
    {clickedSuggestion && filteredData.length > 0 && (
      <div className="filtered-results">
        {/* Display filtered data here */}
      </div>
    )}
  </div>

    </div>
<div className='text-right my-3'>
<b>Note: After adding the range, don't forget to update the Range button</b>

</div>
       

        <table className="table">
          <thead>
            <tr>
              {columns.map(col => (
                <th key={col.prop}>{col.label}</th>
              ))}
              
            </tr>
          </thead>
          
         
         <tbody>
          {currentData.map((item, index) => {
            const codeMatch = item.itemCode.match(/\d+/);
            const code = codeMatch ? codeMatch[0] : null;
            const showExtraRow = index === lastIndexes[code];
            const rowColor = getColorForIndex(index, item.totalQuantity);

            return (
              <React.Fragment key={index}>
                <tr style={{ backgroundColor: rowColor }}>
                  <th scope="row">{index + 1 + indexOfFirstRow}</th>
                  <td>{item.itemCode.split(' ')[0]}</td>
                  <td>{new Date(item.expiryArray[0].expiry).toLocaleDateString('en-GB')}</td>
                  <td>{item.totalQuantity}</td>
                  <td>{item.product?.productName}</td>
                  <td>{item.product?.sku}</td>
                  <td>{item.product?.lotNumber}</td>
                  <td>{item.product?.manufacturer}</td>
                  <td>
                    <input
                      type="number"
                      style={{ width: "100px", borderRadius: "50px" }}
                      placeholder="Start Range"
                      value={rowSettings[index]?.start || ''}
                      onChange={(e) => handleSettingsChange(index, parseInt(e.target.value), rowSettings[index]?.end, rowSettings[index]?.startColor, rowSettings[index]?.endColor)}
                    />
                    <input
                      className='mr-3'
                      type="color"
                      value={rowSettings[index]?.startColor || ''}
                      onChange={(e) => handleSettingsChange(index, rowSettings[index]?.start, rowSettings[index]?.end, e.target.value, rowSettings[index]?.endColor)}
                    />
                    <input
                      style={{ width: "100px", borderRadius: "50px" }}
                      type="number"
                      placeholder="End Range"
                      value={rowSettings[index]?.end || ''}
                      onChange={(e) => handleSettingsChange(index, rowSettings[index]?.start, parseInt(e.target.value), rowSettings[index]?.startColor, rowSettings[index]?.endColor)}
                    />
                    <input
                      type="color"
                      value={rowSettings[index]?.endColor || ''}
                      onChange={(e) => handleSettingsChange(index, rowSettings[index]?.start, rowSettings[index]?.end, rowSettings[index]?.startColor, e.target.value)}
                    />
                    <Button variant='contained' size="small" className='ml-3' onClick={() => handleUpdateSettings(item._id, rowSettings[index]?.start, rowSettings[index]?.end, rowSettings[index]?.startColor, rowSettings[index]?.endColor)}>Update Range</Button>
                  </td>
                </tr>
                {showExtraRow && (
                  <tr>
                    <td colSpan="9">Total Quantity for item code <span className="badge badge-primary tabel_itemcode">{item.itemCode.split(' ')[0]}</span>: <span className="badge badge-success tabel_itemcode_total">{totalsByCode[code]}</span></td>
                  </tr>
                )}
              </React.Fragment>
            );
          })}
        </tbody>

        </table>
        <div className="pagination justify-content-center my-5">
        <button
          className="btn btn-primary mr-2"
          onClick={() => setCurrentPage(prev => (prev > 0 ? prev - 1 : 0))}
        >
          Prev
        </button>
        <button
          className="btn btn-primary"
          onClick={() =>
            setCurrentPage(prev =>
              prev < totalPages - 1 ? prev + 1 : prev
            )
          }
        >
          Next
        </button>
      </div>

      </div>
      <Darkmode />
    </div>
  );
};

export default AAS;



