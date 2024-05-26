import React, { useEffect } from 'react';
import './pdf.scss';

import header from '../image/Discardlogo.png';
import foot from '../image/foot.png';
import moment from 'moment';
import { InputLabel, TextField } from '@mui/material';

const Discardpdf = (props) => {
  useEffect(()=>{
    setTimeout(()=>{
      
    //   window.print()
    },1000)
  },[])

  const TableData = props.location.state.data
  console.log(TableData,"print data")
  console.log(TableData[0].comment)
  console.log(moment.parseZone(TableData[0].date).local().format("DD/MM/YYYY"))


  return (
    <div className='container'>
      <div className="row my-5">
        <table className=" table table-borderless">
          <thead>
            <tr>
              <th colSpan="10">
                <div className="">
                  <div className="row">
                    <div className="col-12">
                    <div className=" image-container">
                      <img src={header} alt="Thabr" className='full-width-image' />
                    </div>
                    </div>
                 
                    
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
                value= {TableData[0].comment}
                minRows={3}
                size='small'
                />
            
            </div>  
                </td>
            </tr>
         
    <tr >
      <td colSpan="10">
        <div className="row sideTitle">
          <div className="col text-left"><p><b>Requested by  <span>: {TableData[0].memberName}</span></b></p></div>
          <div className="col text-right mr-5"><p><b>Approved by :</b></p></div>
        </div>
        <div className="row sideTitle my-5">
          <div className="col text-left"><p><b>Discarded by :</b></p></div>
          {/* <div className="col text-right mr-5"><p><b>Store keeper</b></p></div> */}
        </div>
    <img src={foot} alt="Thabr" className='full-width-image' />
      </td>
    </tr>
  </tfoot>
        </table>
      </div>
    
    </div>
  );
}

export default Discardpdf;


