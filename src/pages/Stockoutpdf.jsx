import React, { useState } from 'react';
import './pdf.scss';

import logo from '../image/logo.png';

import moment from 'moment';

const Stockoutpdf = (props) => {


  const TableData = props.location.state.data
  console.log(TableData,"print data")
  // console.log(TableData[0].department)
  console.log(moment.parseZone(TableData[0].date).local().format("DD/MM/YYYY"))
  const [currentDateTime,setCurrentDateTime]=useState(moment())



  React.useEffect(()=>{
    const timeoutId = setTimeout(() => {
      setCurrentDateTime(moment()) ;        
      window.print();   
  }, 1000);
  //Cleare the timeout when the componet unouts to prevet memory
  return ()=>clearTimeout(timeoutId)
  },[])


  return (
    <div className='container'>
      <div className="row my-5 print-content">
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
                      <h1 className='text-center'>Tharb Lab Store Release Form</h1>
                    </div>
                    <div className="col-12 empty_border"></div>
                    {/* <div className="col-12 empty_border"></div> */}
                  </div>
              
                </div>
                <div className="row my-5 sideTitle">
                  <div className="col text-left"><p><b>Date:</b> <span>{moment.parseZone(TableData[0].date).local().format("DD/MM/YYYY")}</span></p></div>
                  <div className="col text-right mr-5"><p><b>Department:</b> <span>{TableData[0].department}</span></p></div>
                </div>
              </th>
            </tr>
            <tr className='table-bordered'>
              <th className='text-center table-bordered'>S.N</th>
              <th className='text-center table-bordered'>Item code</th>
              <th className='text-center table-bordered'>Item description</th>
              <th className='text-center table-bordered'>Unit</th>
              <th className='text-center table-bordered'>Quantity</th>
              <th className='text-center table-bordered'>Expiry</th>
            </tr>
          </thead>
          <tbody className='table-bordered tbody'>
            {TableData.map((row, index) => (
              <tr key={index + 1} className='table-bordered'>
                <td className='text-center table-bordered'>{index + 1}</td>
                <td className='text-center table-bordered'>{row.product.itemCode.split(" ")[0]}</td>
                <td className='text-center table-bordered'>{row.productName}</td>
                <td className='text-center table-bordered'>{row.product.unit}</td>
                <td className='text-center table-bordered'>{row.quantity}</td>
                <td className='text-center table-bordered'>{moment.parseZone(row.expiryObject.expiry).local().format("DD/MM/YYYY")}</td>
              </tr>
            ))}
          </tbody>
     
          <tfoot className=''>
            <tr>
              <td></td>
            </tr>
    <tr >
      <td colSpan="10">
        <div className="row sideTitle">
          <div className="col text-left"><p><b>Requested by  <span>: {TableData[0].memberName}</span></b></p></div>
          <div className="col text-right mr-5"><p><b>Approved by</b></p></div>
        </div>
        <div className="row sideTitle my-5">
          <div className="col text-left"><p><b>Released by</b></p></div>
          <div className="col text-right mr-5"><p><b>Store keeper</b></p></div>
        </div>
    {/* <img src={foot} alt="Thabr" className='full-width-image' /> */}
            <div className="row">
            <div className="col-12 empty_border"></div>
            <div className="col-6 text-left mt-5">
              <h3>Dokhan St, Exit 66-Tharb Area-Doha,Qatar</h3>
              <h3>TQ.S-RR-01 Version:01</h3>
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

export default Stockoutpdf;
