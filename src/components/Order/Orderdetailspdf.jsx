

import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../pages/pdf.scss";
import logo from '../../image/logo.png'
import header from "../../image/orderheader.png";
import "./orderpdf.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import moment from 'moment';
const Orderdetailspdf = () => {
  
  



  const orderData  = useSelector((state) => state.socket.messages)
  const history = useHistory()
  const [currentDateTime, setCurrentDateTime] = useState(moment());
  console.log(orderData,'orderData')



  useEffect(() => {
    setTimeout(()=>{

      window.print()
    },1000)

  },[]);
  const getOrderTypeCode = (type) => {
    switch (type) {
      case "Urgent":
        return { code: "UPR", num: "2" };
      case "Regular":
        return { code: "RPR", num: "3" };
      case "New":
        return { code: "NPR", num: "4" };
      default:
        return { code: "Unknown", num: "Unknown" };
    }
  };
  
  const orderType = orderData?.[0]?.orderType || "Unknown";
  const { code, num } = getOrderTypeCode(orderType);

  return (
    <div className="container">
     <div className="headerOrder">


        <div className="row">
          <div className="col-4 text-left">
            <div className="">
              <h2>Tharb Camel Hospital Laboratory Division Laboratory Store</h2>

            </div>

          </div>
          <div className="col-6">
            <div className=" image-container text-right">
              <img src={logo} alt="Thabr" />
            </div>

          </div>
          <div className="col-12 empty_border mt-5"></div>
          <div className='col-12'>
            <h1 className='text-center'>Tharb Lab Store Purchase Request ({orderData[0].orderType})</h1>
          </div>
          <div className="col-12 empty_border"></div>
          {/* <div className="col-12 empty_border"></div> */}
        </div>
        <div className="row my-5 sideTitle">
          <div className="col text-left">
            <p>
              <b>Ref.No:</b> <span>{orderData[0].itemnumber}</span>
            </p>
          </div>
          <div className="col text-right mr-5">
            <p>
              <b>Date:</b> <span>{moment.parseZone(orderData[0].createdAt).local().format("DD/MM/YYYY")}</span>
    
            </p>
          </div>
        </div>
        <div className="row ">
          <div className="col-4">
            <h2>Topic</h2>

          </div>
          <div className="col-8">

            <h2>Request of Purchase Tharb Lab Stroe <span className="text-lowercase">{orderData.orderType}</span> </h2>
          </div>



        </div>
        <div className="row my-5 sideTitle">
          <div className="col text-left">
            <p>
              <b>Dear Dr.Ashraf: </b>
            </p>
          </div>
        </div>
        <div className="row my-5  ml-5 sideTitle">
          <div className="col text-left">
            <p>
              {/* Kindly apporve and proceed for this purchase request from{" "}
            <b>{department}.</b> The list of request items is
            listed below: */}
              Kindly approve and proceed this <b>{orderData[0].orderType}</b> purchase request from <b>{orderData[0].memberId.department}</b>. The requested items are listed below:
            </p>
          </div>
        </div>
      </div>
   
      <table className="table table-bordered">
  <thead>
    <tr>
      <th className="table-bordered">ID</th>
      <th className="table-bordered">Item description</th>
      <th className="table-bordered">S.K.U</th>
      <th className="table-bordered">Quantity</th>
    </tr>
  </thead>
  <tbody>
  

  {orderData.map((item, id) => (
          <React.Fragment key={id}>
            {item?.products?.map((product, index) => (
              <tr key={`${id}-${index}`}>
                <td className="table-bordered">{index + 1}</td>
                <td className="table-bordered">{product?.productId?.productName}</td>
            
                <td className="table-bordered">{product.productId?.sku}</td>
                <td className="table-bordered">{item.requiredQuantity[index]}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
  


</tbody>

</table>


<footer>
          <div className="row mt-5 container sideTitle footerOrder ">
        <div className="col-12 text-left">
          <p>
            <b>Thank you</b>
          </p>
        </div>
        <div className="col-12 text-left my-5">
          <p>
            <b>Best Regards</b>
          </p>
        </div>
        <div className="col-12 text-left my-5">
          <p>
            <b>Requested by {orderData[0].memberName}</b>
          </p>
        </div>
        <div className="row">
          <div className="col-12 empty_border"></div>
          <div className="col-6 text-left mt-5">
            <h3>Dokhan St, Exit 66-Tharb Area-Doha,Qatar</h3>
            <h3>TQ.S-{code}-{num} Version:01</h3>

          </div>
          <div className="col-6 text-right mt-5">
            <h3>e-mail: marwa@tharb.net</h3>
            <h3>Telephone No. 33528649</h3>
          </div>
          <div className="col-12 text-center mt-5">
            <h3>Print Date and time:{currentDateTime.format("DD/MM/YYYY h:mm A")} </h3>
   
          </div>
        </div>
      </div>
          </footer>
    </div>
  );
};

export default Orderdetailspdf;
