

// import React, { useEffect, useState } from 'react'
// import './stock.css';
// import axios from 'axios';
// import moment from 'moment';
// import { Button, IconButton, TextField, Tooltip } from '@mui/material';
// import ArrowBackIcon from '@mui/icons-material/ArrowBack';
// import GetAppIcon from '@mui/icons-material/GetApp';
// import { useDispatch } from 'react-redux';
// import { useHistory } from 'react-router-dom';
// import { sendData } from '../app/socket/socketActions';
// import { saveAs } from 'file-saver';
// import * as XLSX from 'xlsx';
// import Dashhead from '../Dashhead';
// import Darkmode from '../Darkmode';
// import { ToastContainer, toast } from 'react-toastify';
// import 'react-toastify/dist/ReactToastify.css';
// import { useLocation } from 'react-router-dom/cjs/react-router-dom';

// const Stock = () => {
//   const dispatch = useDispatch();
//   const history = useHistory();
//   const location = useLocation();
//   const [data, setData] = useState([]);
//   const [currentPage, setCurrentPage] = useState(0);
//   const [rowsPerPage, setRowsPerPage] = useState(10);
//   const [selectedRows, setSelectedRows] = useState([]);
//   const [rowSettings, setRowSettings] = useState([]);
//   const [searchQuery, setSearchQuery] = useState('');
//   const [clickedSuggestion, setClickedSuggestion] = useState(false);

//   // ==============================================search=====================================================================
//   const filteredData = data.map((item,index)=>item.productDetails.filter(item =>
//     item.product && item.product.productName && (
//       `${item.itemCode.split(" ")[0]} ${item.name} ${item.product.lotNumber}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
//       item.product.productName.toLowerCase().includes(searchQuery.toLowerCase())
//     )
//   );
//   // console.log(data[1].productDetails,'data')
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
//   // ==============================================url=====================================================================
//   //
//   const url = process.env.REACT_APP_DEVELOPMENT
//   const departmentName = location.state?.departmentName;
//   // console.log(departmentName,"DepartMane")
//   // ==============================================Get api====================================================================
  

//   const getAllStocksByDepartment =async()=>{
//     try {
//     const response = await axios.get(`${url}/api/stock/getAllStocksByDepartment/${departmentName}`, {
  
//         });
//         setData(response.data.result)
//     } catch (error) {
//       console.log(error)
//     }
//   }


//   const getColorChange =()=>{
//     const updatedRowSettings = data.map(item => {
//       const existingSetting = rowSettings.find(setting => setting.id === item._id);
//       return existingSetting || { id: item._id, start: item.start, end: item.end, startColor: item.startColor, endColor: item.endColor };
//     });
//     setRowSettings(updatedRowSettings);
//   }
  
//   useEffect(()=>{
//     getAllStocksByDepartment()
//     getColorChange()
//   },[])
  
  

  
  
//   // =====================================================Xl Export Data========================================================================
  
//   const handleExport = () => {
    
//     const worksheet = XLSX.utils.json_to_sheet(data);
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, 'Sheet1');
//     const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type: 'array' });
//     saveAs(new Blob([excelBuffer], { type: 'application/octet-stream' }), 'Genetic stock.xlsx');
//   };

//   // =================================================Pagination Code========================================================================
//   // Calculate total number of pages
//   const totalPages = Math.ceil(filteredData.length / rowsPerPage);

//   // Calculate the indices for the current page
//   const indexOfLastRow = currentPage * rowsPerPage + rowsPerPage;
//   const indexOfFirstRow = indexOfLastRow - rowsPerPage;
//   const currentData = filteredData.slice(indexOfFirstRow, indexOfLastRow);

  
//   // const totalsByCode = calculateTotalsByCode(currentData);
  

//   // =================================================Color Code========================================================================
  
//   // const lastIndexes = calculateLastIndexes(currentData);

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

//   )
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



// // **************************************************End*****************************************************************************************************

// // console.log(
// //   data.map((item,index)=>item.productDetails
// // .map((val,i)=>val))

// // )

  
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
 
//           {/* <div>
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
     
//       </div>
//     )}
//   </div> */}

//     </div>
// <div className='text-right my-3'>
// <b>Note: After adding the range, don't forget to update the Range button</b>

// </div>
       

//         <table className="table">
//           <thead>
//             <tr>S.N</tr>
//             <tr>Item Code</tr>
//             <tr>Total Quantity</tr>
//             <tr>Product Name</tr>
//             <tr>S.K.U</tr>
//             <tr>Lot Number</tr>
//             <tr>Manufacturer</tr>
//             <tr>Range</tr>
//           </thead>
          
         
//          <tbody>
//           {
//           currentData.map((item, index) => {
//             const codeMatch = item.itemCode.match(/\d+/);
//             const code = codeMatch ? codeMatch[0] : null;
//             // const showExtraRow = index === lastIndexes[code];
//             const rowColor = getColorForIndex(index, item.totalQuantity);

//             return (
//               <React.Fragment key={index}>
//                 <tr style={{ backgroundColor: rowColor }}>
//                   <th scope="row">{index + 1 + indexOfFirstRow}</th>
//                   <td>{item.itemCode.split(' ')[0]}</td>
//                   <td>{new Date(item.expiryArray[0].expiry).toLocaleDateString('en-GB')}</td>
//                   <td>{item.totalQuantity}</td>
//                   <td>{item.product?.productName}</td>
//                   <td>{item.product?.sku}</td>
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
