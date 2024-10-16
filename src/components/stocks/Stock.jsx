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
  const [rowsPerPage, setRowsPerPage] = useState(30);
  const [selectedRows, setSelectedRows] = useState([]);
  const [rowSettings, setRowSettings] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [clickedSuggestion, setClickedSuggestion] = useState(false);
  const [page, setPage] = useState(1);

//   const filteredData = data.filter(item =>
//     item.product && item.product.productName && (
//       `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.product.productName.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );
  
//   // console.log(filteredData, 'filteredData');
  
//   // Adjust the unique item codes to include necessary details
//   const uniqueItemCodes = [...new Set(filteredData.map(item => `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}`))];
  

//   const handleSuggestionClick = (code) => {
//     // Extract the productName from the code by finding the item in filteredData
//     const selectedItem = filteredData.find(item =>
//       `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}` === code
//     );
  
//     if (selectedItem) {
//       setSearchQuery(selectedItem.product.productName);
//       setClickedSuggestion(true); // Set the flag to indicate a suggestion has been clicked
//     }
//   };
  const url = process.env.REACT_APP_DEVELOPMENT


//   const accessToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VyTmFtZSI6ImFkbWluIiwiX2lkIjoiNjVlODZiNzZmOTk0ZmQzZTdmNDliMjJiIiwiaWF0IjoxNzA5NzkzMDcwfQ.siBn36zIBe_WmmIfuHMXI6oq4KMJ4dYaWQ6rDyBBtEo"


//   // console.log(data,'data')



  

  
  const departmentName = location.state?.departmentName;

  
  
//   useEffect(() => {
//     const updatedRowSettings = data.map(item => {
//       const existingSetting = rowSettings.find(setting => setting.id === item._id);
//       return existingSetting || { id: item._id, start: item.start, end: item.end, startColor: item.startColor, endColor: item.endColor };
//     });
//     setRowSettings(updatedRowSettings);
//   }, [data]); // Only run this effect when `data` changes
  
  
//   const sortData = (data) => {
//     const sortedData = data.sort((a, b) => {
//       const codeA = a.itemCode.split(' ')[0].toUpperCase(); // Case-insensitive comparison
    
//       const codeB = b.itemCode.split(' ')[0].toUpperCase();
//       // console.log(codeA,"codeA",codeB,"codeB")

//       return codeA.localeCompare(codeB);
//     });
//     setData(sortedData);
//   };
  
//   const handleRowSelectionChange = (event, row) => {
//     const isChecked = event.target.checked;
//     setSelectedRows(prev => {
//       if (isChecked) {
//         return [...prev, row];
//       } else {
//         return prev.filter(r => r.id !== row.id);
//       }
//     });
//   };
 
//   const handleExport = () => {
//   const exportData = data.map(item=>({
//     itemCode:item.itemCode.split(" ")[0],
//     ProductName:item.name,
//     Sku :item.product?.sku,
//     LotNumber:item.product?.lotNumber,
//     Manufacturer:item.product?.manufacturer,
//     Location:item.locationQuantityName,
//     ExpiryData: moment.parseZone(item.expiry).format("DD/MM/YYYY") ,
//     Quantity:item.totalQuantity,

//   }))
    
//     // console.log(exportData,"exportDAta")
//     const worksheet = XLSX.utils.json_to_sheet(exportData);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), `${departmentName} Stock.xlsx`);
//   };

  
//   // Calculate total number of pages
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   // Calculate the indices for the current page
//   const indexOfLastRow = currentPage * rowsPerPage + rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);



//   // console.log(currentData,'currentData')

  


//   const handleSendData = () => {
//     const dataToSend = selectedRows.map(row => ({
//       ...row,
//       labName: 'Genetic Lab'
//     }));
//     dispatch(sendData(dataToSend));
//     history.push('/Order');
//   };



//   const calculateTotalsByCode = (data) => {
//     const totals = {};
//     data.forEach((item) => {
//       const codeMatch = item.itemCode.match(/\d+/);
  
//       if (codeMatch) {
//         const code = codeMatch[0];
//         totals[code] = (totals[code] || 0) + item.totalQuantity;
//       }
//     });
//     return totals;
//   };
  
//   const totalsByCode = calculateTotalsByCode(currentData);
  
//   const calculateLastIndexes = (data) => {
//     const lastIndex = {};
//     data.forEach((item, index) => {
//       const codeMatch = item.itemCode.match(/\d+/);
//       if (codeMatch) {
//         const code = codeMatch[0];
//         lastIndex[code] = index; // Update to the current index as last index
//       }
//     });
//     return lastIndex;
//   };
  
//   const lastIndexes = calculateLastIndexes(currentData);

//   const handleSettingsChange = (index, start, end, startColor, endColor) => {
//     setRowSettings(prevSettings => {
//       const updatedSettings = [...prevSettings];
//       updatedSettings[index] = {
//         start: start,
//         end: end,
//         startColor: startColor,
//         endColor: endColor
//       };
//       return updatedSettings;
//     });
//   };

//   const getColorForIndex = (index, quantity) => {
//     const settings = rowSettings[index];
//     if (settings && quantity <= settings.start && quantity >= settings.end) {
//         return settings.startColor || 'transparent';
//     } else if (settings && quantity <= settings.start) {
//         return settings.endColor || 'transparent';
//     } else {
//         return 'transparent'; // Default color if no range matches
//     }
// };

// const updateStockSettings = async (id, start, end, startColor, endColor) => {
//   const obj ={
//     id:id,
//     start: start,
//     end: end,
//     startColor: startColor,
//     endColor: endColor
//   }
//   try {
//     const response=  await axios.put(`${process.env.REACT_APP_DEVELOPMENT}/api/stock/updateStockSettings`, {...obj},
//     {headers:{token:`${accessToken}`}})
//       return response.data;
//   } catch (error) {
//       console.error(error);
//       throw error;
//   }
// };

// const handleUpdateSettings = async (id, start, end, startColor, endColor) => {
//   try {
//     await updateStockSettings(id, start, end, startColor, endColor);

//   toast("Range update successfully", {
//     position: "top-center",
//     autoClose: 5000,
//     hideProgressBar: false,
//     closeOnClick: true,
//     pauseOnHover: true,
//     draggable: true,
//     progress: undefined,
//     theme: "dark",
//   });
 
 


 
//   } catch (error) {
//     toast("Something went wrong", {
//       position: "top-center",
//       autoClose: 5000,
//       hideProgressBar: false,
//       closeOnClick: true,
//       pauseOnHover: true,
//       draggable: true,
//       progress: undefined,
//       theme: "light",
//     });
//   }
// };





//   // const filteredData = currentData.filter(item => item.itemCode.toLowerCase().includes(searchQuery.toLowerCase()));
// // Filter data based on search query

  
//   return (

//     <div className="row">
//       <div className="col-xs-12 col-sm-12 col-md-2 col-lg-2 col-xl-2">
//         <Dashhead id={1} />
//       </div>
//       <div className="col-xs-12 col-sm-12 col-md-10 col-lg-10 col-xl-10 dashboard-container">
//         <h1 className="my-5 title text-center">{departmentName} Stock</h1>
//         <ToastContainer/>
//         <div className='icondivright'>
//           <Tooltip title="Back">
//             <ArrowBackIcon className='exporticon' onClick={() => {  history.goBack()}} />
//           </Tooltip>
//         </div>
//         <div className='icondiv'>
//           <Tooltip title="Export in Excel">
//             <GetAppIcon className='exporticon' onClick={handleExport} />
//           </Tooltip>
//         </div>


//         <div>
//           <div className='text-center my-4'>
//           <TextField
//              type="text"
//              placeholder="Search by item code"
//              sx={{width:800}}
//              value={searchQuery}
//              onChange={(e) => {
//                setSearchQuery(e.target.value);
//                setCurrentPage(0); // Reset to first page on search
//              }}
     
//       />
//           </div>
 
//           <div>
//     {searchQuery.length > 0 && !clickedSuggestion && (
//       <div className="suggestions">
//         {uniqueItemCodes
//           .filter(code => code.toLowerCase().includes(searchQuery.toLowerCase()))
//           .map(code => (
//             <div
//               key={code}
//               className="suggestion"
//               onClick={() => handleSuggestionClick(code)}
//             >
//               {code}
//             </div>
//           ))}
//       </div>
//     )}
//     {clickedSuggestion && filteredData.length > 0 && (
//       <div className="filtered-results">
//         {/* Display filtered data here */}
//       </div>
//     )}
//   </div>

//     </div>
// <div className='text-right my-3'>
// <b>Note: After adding the range, don't forget to update the Range button</b>

// </div>
       

//         <table className="table">
//           <thead>
//             <tr>
//               {columns.map(col => (
//                 <th key={col.prop}>{col.label}</th>
//               ))}
              
//             </tr>
//           </thead>
          
         
//          <tbody>
//           {currentData.map((item, index) => {
//             const codeMatch = item.itemCode.match(/\d+/);
//             const code = codeMatch ? codeMatch[0] : null;
//             const showExtraRow = index === lastIndexes[code];
//             const rowColor = getColorForIndex(index, item.totalQuantity);

//             return (
//               <React.Fragment key={index}>
//                 <tr style={{ backgroundColor: rowColor }}>
//                   <th scope="row">{index + 1 + indexOfFirstRow}</th>
//                   <td>{item.itemCode.split(' ')[0]}</td>
//                   <td>{item.product?.sku}</td>
//                   <td>{item.product?.productName}</td>
//                   <td>{item.totalQuantity}</td>
                
//                   <td> {item.product.physicalLocation}</td>
//                   <td>{moment.parseZone(item.expiry).format("DD/MM/YYYY")}</td>
//                   <td>{item.product?.lotNumber}</td>
//                   <td>{item.product?.manufacturer}</td>
//                   <td>
//                     <input
//                       type="number"
//                       style={{ width: "100px", borderRadius: "50px" }}
//                       placeholder="Start Range"
//                       value={rowSettings[index]?.start || ''}
//                       onChange={(e) => handleSettingsChange(index, parseInt(e.target.value), rowSettings[index]?.end, rowSettings[index]?.startColor, rowSettings[index]?.endColor)}
//                     />
//                     <input
//                       className='mr-3'
//                       type="color"
//                       value={rowSettings[index]?.startColor || ''}
//                       onChange={(e) => handleSettingsChange(index, rowSettings[index]?.start, rowSettings[index]?.end, e.target.value, rowSettings[index]?.endColor)}
//                     />
//                     <input
//                       style={{ width: "100px", borderRadius: "50px" }}
//                       type="number"
//                       placeholder="End Range"
//                       value={rowSettings[index]?.end || ''}
//                       onChange={(e) => handleSettingsChange(index, rowSettings[index]?.start, parseInt(e.target.value), rowSettings[index]?.startColor, rowSettings[index]?.endColor)}
//                     />
//                     <input
//                       type="color"
//                       value={rowSettings[index]?.endColor || ''}
//                       onChange={(e) => handleSettingsChange(index, rowSettings[index]?.start, rowSettings[index]?.end, rowSettings[index]?.startColor, e.target.value)}
//                     />
//                     <Button variant='contained' size="small" className='ml-3' onClick={() => handleUpdateSettings(item._id, rowSettings[index]?.start, rowSettings[index]?.end, rowSettings[index]?.startColor, rowSettings[index]?.endColor)}>Update Range</Button>
//                   </td>
//                 </tr>
//                 {showExtraRow && (
//                   <tr>
//                     <td colSpan="9">Total Quantity for item code <span className="badge badge-primary tabel_itemcode">{item.itemCode.split(' ')[0]}</span>: <span className="badge badge-success tabel_itemcode_total">{totalsByCode[code]}</span></td>
//                   </tr>
//                 )}
//               </React.Fragment>
//             );
//           })}
//         </tbody>

//         </table>
//         <div className="pagination justify-content-center my-5">
//         <button
//           className="btn btn-primary mr-2"
//           onClick={() => setCurrentPage(prev => (prev > 0 ? prev - 1 : 0))}
//         >
//           Prev
//         </button>
//         <button
//           className="btn btn-primary"
//           onClick={() =>
//             setCurrentPage(prev =>
//               prev < totalPages - 1 ? prev + 1 : prev
//             )
//           }
//         >
//           Next
//         </button>
//       </div>

//       </div>
//       <Darkmode />
//     </div>
//   );
// };

// export default Stock;


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

  const handleSettingsChange = (index, start, end, startColor, endColor) => {
    setRowSettings(prevSettings => {
      const updatedSettings = [...prevSettings];
      updatedSettings[index] = { start, end, startColor, endColor };
      return updatedSettings;
    });
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
  {paginatedData.map((item, index) => (
    <React.Fragment key={index}>
      {item.productDetails && item.productDetails.length > 0 ? (
        item.productDetails.map((product, i) => (
          <tr key={`${index}-${i}`}>
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
      {/* Total Quantity Row with Dynamic Color */}
<tr>
  <td colSpan="5" style={{ fontWeight: 'bold' }}>
    Total Quantity: 
    <span style={{ color: (item.totalQuantity >= rowSettings[index]?.start && item.totalQuantity <= rowSettings[index]?.end) ? rowSettings[index]?.startColor : 'black' }}>
      {item.totalQuantity}
    </span>
  </td>
  <td colSpan="5" style={{ textAlign: 'right' }}>
    {/* Range Inputs */}
    <input
      type="number"
      style={{ width: "100px", borderRadius: "50px" }}
      placeholder="Start Range"
      value={rowSettings[index]?.start || ''}
      onChange={(e) => handleSettingsChange(index, parseInt(e.target.value), rowSettings[index]?.end, rowSettings[index]?.startColor, rowSettings[index]?.endColor)}
    />
    <input
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
    <Button variant='contained' size="small" className='ml-3' onClick={() => handleUpdateSettings(item._id, rowSettings[index]?.start, rowSettings[index]?.end, rowSettings[index]?.startColor, rowSettings[index]?.endColor)}>
      Update Range
    </Button>
  </td>
</tr>

    </React.Fragment>
  ))}
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