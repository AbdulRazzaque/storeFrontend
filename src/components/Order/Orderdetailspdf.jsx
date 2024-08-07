

import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "../../pages/pdf.scss";
import header from "../../image/orderheader.png";
import "./orderpdf.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

import moment from 'moment';
const Orderdetailspdf = () => {
  
  



  const orderDetailsData  = useSelector((state) => state.socket.messages)
  const history = useHistory()

  console.log(orderDetailsData,'orderDetailsData')



  useEffect(() => {
    setTimeout(()=>{

      window.print()
    },1000)

  },[]);

  return (
    <div className="container">
      <div className="row container d-flex justify-content-center text-center">
        <div className="col-12">
          <div className=" image-container">
            <img src={header} alt="Thabr" className="full-width-image" />
          </div>
        </div>
      </div>
      <div className="row my-5 sideTitle">
        <div className="col text-left">
          <p>
            <b>Ref.No:</b> <span>{orderDetailsData[0]?.itemnumber}</span>
          </p>
        </div>
        <div className="col text-right mr-5">
          <p>
            <b>Date:</b> <span>{moment.parseZone(orderDetailsData[0].createdAt).local().format("DD/MM/YYYY") }</span>
          </p>
        </div>
      </div>
      <div className="row my-5 sideTitle">
        <div className="col text-left">
          <p>
            <b>Topic: </b>
            <span>
              Request of purchase<b> Tharb lab store</b>
            </span>
          </p>
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
            <b>{orderDetailsData[0]?.memberId?.department}.</b> The list of  requested items is
            listed below: */}
             Kindly approve and proceed this <b>{orderDetailsData[0].orderType}</b> purchase request from <b>{orderDetailsData[0]?.memberId?.department}</b>. The requested items are listed below:
          </p>
        </div>
      </div>
      <table className="table table-bordered">
  <thead>
    <tr>
      <th scope="col">ID</th>
      <th scope="col">Item description</th>
      <th scope="col">S.K.U</th>
      <th scope="col">Quantity</th>
    </tr>
  </thead>
  <tbody>
  

  {orderDetailsData.map((item, id) => (
          <React.Fragment key={id}>
            {item?.products?.map((product, index) => (
              <tr key={`${id}-${index}`}>
                <td>{index + 1}</td>
                <td>{product?.productId?.productName}</td>
            
                <td>{product.productId?.sku}</td>
                <td>{item.requiredQuantity[index]}</td>
              </tr>
            ))}
          </React.Fragment>
        ))}
  


</tbody>

</table>


      <div className="row my-5 sideTitle  fixed-bottom orderfooter">
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
            <b>Requested by {orderDetailsData[0]?.memberId?.memberName}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Orderdetailspdf;
