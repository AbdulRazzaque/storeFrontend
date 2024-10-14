import React, { useEffect, useState } from 'react';
import './pdf.scss';

import moment from 'moment';
import logo from '../image/logo.png'
import { InputLabel, TextField } from '@mui/material';

const Discardpdf = (props) => {

  const [currentDateTime,setCurrentDateTime]=useState(moment())

  useEffect(()=>{
    setTimeout(()=>{
      
    //   window.print()
    },1000)
  },[])

  const TableData = props.location.state.data
  console.log(TableData,"print data")
  console.log(TableData[0]?.comment)
  // console.log(moment.parseZone(TableData[0]?.date).local().format("DD/MM/YYYY"))


  return (
    <div className='container'>
      <div className="row my-5">
        <table className=" table table-borderless">
          <thead>
            <tr>
              <th colSpan="10">
                <div className="">
                <div className="row">
                  <div className="col-4 text-left">
                    <div className="">
                     <h2>Tharb Camel Hospital Laboratory Division Laboratory Store</h2>
                    
                    </div>
                    
                    </div>
                  <div className="col-6">
                    <div className=" image-container text-right">
                      <img src={logo} alt="Thabr"  />
                    </div>
                    
                    </div>
                    <div className="col-12 empty_border mt-5"></div>
                    <div className='col-12'>
                      <h1 className='text-center'>Tharb Lab Store Discard Record</h1>
                    </div>
                    <div className="col-12 empty_border"></div>
                    {/* <div className="col-12 empty_border"></div> */}
                  </div>
                </div>
                <div className="row my-5 sideTitle">
                  <div className="col text-left"><p><b>Date:</b> <span>{moment.parseZone(TableData[0]?.date).local().format("DD/MM/YYYY")}</span></p></div>
                  <div className="col text-right mr-5"><p><b>Department:</b> <span>{TableData[0]?.department}</span></p></div>
                </div>
              </th>
            </tr>
            <tr className='table-bordered'>
              <th className='text-center table-bordered'>S.N</th>
              <th className='text-center table-bordered'>Item code</th>
              <th className='text-center table-bordered'>Item description</th>
              <th className='text-center table-bordered'>Unit</th>
              <th className='text-center table-bordered'>Quantity</th>
            </tr>
          </thead>
          <tbody className='table-bordered'>
            {TableData.map((row, index) => (
              <tr key={index + 1} className='table-bordered'>
                <td className='text-center table-bordered'>{index + 1}</td>
                <td className='text-center table-bordered'>{row.product.itemCode}</td>
                <td className='text-center table-bordered'>{row.productName}</td>
                <td className='text-center table-bordered'>{row.product.unit}</td>
                <td className='text-center table-bordered'>{row.quantity}</td>
              </tr>
            ))}
          </tbody>
   
          <tfoot>
            <tr>
                <td colSpan="11">
                <div className="">
            <InputLabel htmlFor="outlined-basic" className='text-dark sideTitle'><b>Reason of Discard </b> </InputLabel>
            <TextField
            className=' table-bordered sideTitle'
                variant='outlined'
                fullWidth
                multiline
                // inputProps={{
                //     readOnly: true
                // }}
                value= {TableData[0]?.comment}
                minRows={3}
                size='small'
                />
            
            </div>  
                </td>
            </tr>
         
    <tr >
      <td colSpan="10">
        <div className="row sideTitle">
          <div className="col text-left"><p><b>Requested by  <span>: {TableData[0]?.memberName}</span></b></p></div>
          <div className="col text-right mr-5"><p><b>Approved by :</b></p></div>
        </div>
        <div className="row sideTitle my-5">
          <div className="col text-left"><p><b>Discarded by :</b></p></div>
          {/* <div className="col text-right mr-5"><p><b>Store keeper</b></p></div> */}
        </div>
        <div className="row">
            <div className="col-12 empty_border"></div>
            <div className="col-6 text-left mt-5">
              <h3>Dokhan St, Exit 66-Tharb Area-Doha,Qatar</h3>
              <h3>TQ.S-DR-05 Version:01</h3>
            </div>
            <div className="col-6 text-right mt-5">
            <h3>e-mail: marwa@tharb.net</h3>
            <h3>Telephone No. 33528649</h3>
            </div>
            <div className="col-12 text-center mt-5">
              <h3>Print Date and time:{currentDateTime.format("DD/MM/YYYY h:mm A")} </h3>
            </div>
            </div>
      </td>
    </tr>
  </tfoot>
        </table>
      </div>
    
    </div>
  );
}

export default Discardpdf;


