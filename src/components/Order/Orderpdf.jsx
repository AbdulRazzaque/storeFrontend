import React, { useEffect } from "react";
import { useSelector } from "react-redux";
import "../../pages/pdf.scss";
import header from "../../image/orderheader.png";
import "./orderpdf.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import moment from "moment";
const Orderpdf = () => {
  ;
  


  const orderData  = useSelector((state) => state.socket.messages?.map((i)=>i.objArray))
  const orderDetailsData  = useSelector((state) => state.socket.messages)
  const sku  = useSelector((state) => state.socket.messages?.map((i)=>i?.sku))
  const department  = useSelector((state) => state.socket.messages[0]?.department)
  const history = useHistory()
  

  console.log(department, "department");
  console.log(orderDetailsData,'orderDetailsData')

 

  React.useEffect(() => {
    setTimeout(()=>{

      // window.print()
    },1000)
    const handleBackButton = (event) => {
      event.preventDefault();
      history.push('/Addproduct');
    };

    window.history.pushState(null, null, window.location.pathname);
    window.addEventListener('popstate', handleBackButton);

    return () => {
      window.removeEventListener('popstate', handleBackButton);
    };
  }, [history]);

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
            <b>Ref.No:</b> <span>{orderData[0].itemnumber}</span>
          </p>
        </div>
        <div className="col text-right mr-5">
          <p>
            <b>Date:</b> <span>{moment.parseZone(orderData[0].createdAt).local().format("DD/MM/YYYY") }</span>
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
            <b>{department}.</b> The list of request items is
            listed below: */}
            Kindly approve and proceed this <b>{orderDetailsData[0].objArray.orderType}</b> purchase request from <b>{department}</b>. The requested items are listed below:
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
{
  orderData.map((item, id) => (
    <React.Fragment key={id}>
      {item?.productName.map((productName, index) => (
        <tr key={`${id}-${index}`}>
          <td>{index + 1}</td>
          <td>{productName}</td>
          {sku?.map((skuItem, skuIndex) => (
            <td key={`sku-${skuIndex}`}>{skuItem[0]}</td>
          ))}
          <td>{item.requiredQuantity[index]}</td> 
        </tr>
      ))}
    </React.Fragment>
  ))

}


  


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
            <b>Requested by {orderData[0].memberName}</b>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Orderpdf;
