import React, { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import "../../pages/pdf.scss";
import header from "../../image/orderheader.png";
import "./orderpdf.css";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import moment from "moment";
import logo from '../../image/logo.png'

const Orderpdf = () => {
 

  const orderData = useSelector((state) => state.socket.messages?.map((i) => i.objArray))
  const orderDetailsData = useSelector((state) => state.socket.messages)
  const sku = useSelector((state) => state.socket.messages?.map((i) => i?.sku))
  const department = useSelector((state) => state.socket.messages[0]?.department)
  const history = useHistory()

  const [currentDateTime, setCurrentDateTime] = useState(moment());


  React.useEffect(() => {
    const timeoutId = setTimeout(() => {
      setCurrentDateTime(moment());
      window.print();

    }, 1000);
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
            <h1 className='text-center'>Tharb Lab Store Purchase Request ({orderDetailsData[0].objArray.orderType})</h1>
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
              Kindly approve and proceed this <b>{orderDetailsData[0].objArray.orderType}</b> purchase request from <b>{department}</b>. The requested items are listed below:
            </p>
          </div>
        </div>
      </div>
   
      <table className="table table-bordered ">
        <thead>
          <tr>
            <th className="table-bordered">ID</th>
            <th className="table-bordered">Item description</th>
            <th className="table-bordered">S.K.U</th>
            <th className="table-bordered">Quantity</th>
          </tr>
        </thead>
        <tbody>
          {
            orderData.map((item, id) => (
              <React.Fragment key={id}>
                {item?.productName.map((productName, index) => (
                  <tr key={`${id}-${index}`} className="table-bordered">
                    <td className="table-bordered">{index + 1}</td>
                    <td className="table-bordered">{productName}</td>
                    {sku?.map((skuItem, skuIndex) => (
                      <td className="table-bordered" key={`sku-${skuIndex}`}>{skuItem[0]}</td>
                    ))}
                    <td className="table-bordered">{item.requiredQuantity[index]}</td>
                  </tr>
                ))}
              </React.Fragment>
            ))

          }





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

export default Orderpdf;
