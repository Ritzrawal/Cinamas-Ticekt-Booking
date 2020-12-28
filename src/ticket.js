import React, { Component } from "react";
import Barcode from "react-barcode";
import QRCode from "qrcode.react";

import { cdc } from "./utils";

class Ticket extends Component {
  movie_nationality = () => {
    console.log("thisticket price", this.props);
  };

  render() {
    this.movie_nationality();
    let loadingticket = this.props.loadingticket;

    if (loadingticket === true) {
      return (
        <div>
          <a className="logo-ticket">
            <img src={cdc} alt="LCM" />
          </a>
        </div>
      );
    } else {
      let ticketData = this.props.ticketData;
      return (
        <div>
          {console.log("ticketi")}
          {ticketData.map(item => (
            <div className="ticket-wrapper">
              <header
                id="header"
                className="ticket-header"
                style={{ marginBottom: "20px" }}
              >
                <div className="header-wrap">
                  <img src={cdc} alt="LCM" />
                  <div className="header-text pull-right">
                    <h4>Abbreviated Tax Invoice</h4>
                    <h5>{item["company_name"]}</h5>
                    <p>{item["company_address"]}</p>
                  </div>
                </div>
              </header>
              <div className="">
                <span className="pull-left vat-no ">
                  VAT No.{item["company_vat"]}
                </span>
                <span className="pull-right inv-no">
                  Inv No. {item.invoice}
                </span>
              </div>
              <div className="clear" style={{ marginBottom: "20px" }}>
                <p> Inv Date. {item["invoice_date_time"]} </p>
              </div>

              <div className="seat clear">
                <span className="pull-left bold">
                  <b>{item["category_name"]}</b>
                </span>
                <span className="pull-right bold">
                  <b style={{ fontSize: "14px" }}>{item.screen}</b>
                </span>
              </div>
              <div className="seat clear">
                <span className="pull-left bold">
                  <b>{item["movie"]}</b>
                </span>
                <span className="pull-right bold">
                  <b style={{ fontSize: "14px" }}>Seat No. {item.seat}</b>
                </span>
              </div>
              <div className="price-content" style={{ width: "100%" }}>
                <div className="qr-content bold" style={{ width: "100%" }}>
                  {/* <p className="movie-name pull-left" style={{ clear: "both" }}>
                    <b>{item["movie"]}</b>
                  </p> */}
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      width: "100%"
                    }}
                  >
                    <div>
                      <p>Payment Mode : {item["payment_mode"]}</p>
                      <p>{item["show_date_time"]}</p>
                    </div>
                    <div>
                      <p className={item.luxury == 0 ? " visibility" : ""}>
                        Luxury(Inc. VAT): Rs.{item.luxury}{" "}
                      </p>
                      <p className={item["3DCharge"] == 0 ? " visibility" : ""}>
                        3D(Inc. VAT): Rs.{item["3DCharge"]}{" "}
                      </p>
                      <p className={item.net == 0 ? " visibility" : ""}>
                        Entrance Fee: Rs.{item.ticket_price}
                      </p>
                      <p className="pull-right">Total Price: Rs.{item.gross}</p>
                    </div>
                  </div>
                </div>

                {/* <div className="qr-thumb">
                  <span className="qrcoder">
                    <QRCode value={item.code} />,
                  </span>
                </div> */}
              </div>

              {/*                    
                       <table className="table">
                           <thead>
                               <tr>
                                   <th className={item.ticket_price== 0 ?" visibility" :"" }>
                                   
                                   {(item.movie_nationality == "nepali") ? "Price(Inc. VAT)" : "Price(Inc. VAT & FDF)"}</th>
                                  
                                   
                                   <th className={item.luxury== 0 ?" visibility" :"" }>Luxury (Inc. VAT)</th>
                                
                                   
                                   <th className={item["3DCharge"]== 0 ?" visibility" :"" }  >3D (Inc. VAT)</th> 

                               </tr>
                           </thead>
                           <tbody>
                               <tr>
                                   <td className={item.net== 0 ?" visibility" :"" }>Rs.{item.ticket_price}</td>
                                   <td className={item.luxury== 0 ?" visibility" :"" }>Rs.{item.luxury} </td>
                                   <td className={item["3DCharge"]== 0 ?" visibility" :"" }>Rs.{item["3DCharge"]} </td>
                                 
                               </tr>
                           </tbody>
                       </table> */}

              <div className="barcode-content clear">
                <div className="row">
                  <span className="barcode">
                    <Barcode width="4" value={item.code} />,
                  </span>
                </div>
              </div>

              <div className="site-footer">
                Keep the ticket until the end of the show ! Please follow the
                internal rules of Theatre . Please check the Date and Time of
                the show.
              </div>
              <div className="footer-btm">
                Enjoy your movie experience at LCM.
                <div> Printed by:{this.props.user} </div>
              </div>
            </div>
          ))}
        </div>
      );
    }
  }
}

export default Ticket;
