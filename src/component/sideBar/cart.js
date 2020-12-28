import React, { Component } from "react";
import Sellmodal from "./sellmodal";

class Cart extends Component {

  include =(arr, obj) => {
    for(var i=0; i<arr.length; i++) {
        if (arr[i] == obj) return true;
    }
  }

  handleHide=()=>{
    console.log("handle")
  }


  render() {
      let sellroles=this.include(this.props.roles.split(","), "sell")

      // let selectedSeat = this.props.selectedSeat;

      let myObj = this.props.count;

      // let newArr = Object.keys(myObj);
      let totalval = this.props.totalprice || 0;

      let countValue = Object.values(myObj);

      if (this.props.seatCatagory.length == 0 || totalval == 0 || !sellroles) {
        return (
          <div>
            <h1> TICKET MINI CART</h1>
          </div>
        );
      } else {
        return (
          <div>
            <h1> TICKET MINI CART</h1>
            <p>Ticket Type</p>

            <ul className="padding-none">
              {countValue.map(i => (
                <p>{`${i["name"]} x ${i["count"]}  = ${i["price"] *
                  i["count"]}`}</p>
              ))}
            </ul>

            <h1> Total Price </h1>

            <p className="price">
              {" "}
              Rs. {Number.isNaN((totalval).toFixed(2))
                ? 0
                : totalval.toFixed(2)}{" "}
            </p>

            {/* <div className="btn" onClick={()=>{this.props.soldClicked()}}
                > PAY </div> */}

            {/* pay modal */}

            <Sellmodal
              //  onSubmit={fields => this.props.bookedclicked(fields)}
              banklist={this.props.banklist}
              handleHide={this.handleHide}
              fields={this.props.fields}
              soldClicked={this.props.soldClicked}
              totalprice={this.props.totalprice}
            />
          </div>
        );
      }
    }
}

export default Cart;
