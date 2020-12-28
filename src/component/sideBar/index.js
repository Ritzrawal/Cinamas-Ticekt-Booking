import React, { Component } from "react";
import Cart from "./cart";
export default class SideBar extends Component {


  
  render() {
    
    // <ul className={selectedSeat.length > 0 ?"seat-selected-list": ''}>
    //   {selectedSeat.map((seat,index)=> 
    //   <li key={index}>{seat['seat-name']}</li> )}
    // </ul>
    
    if(this.props.movieEmpty){
      return<div className=" " > 
       
        </div>
    }

    let selectedSeat= this.props.selectedSeat;
    let seats=this.props.seats;
    let seatsInfo= this.props.toSellSeatsInfo;
   
      console.log("seats=========>>>>>>>>>",seats)
   
   let sold= seats.map(o => o["seat-status"]).filter(i => i==="sold").length;
   let bookedSeat= seats.map(o => o["seat-status"]).filter(i => i==="reserved").length;
   let available= seats.map(o => o["seat-status"]).filter(i => i==="available").length
   let hold= seats.map(o => o["seat-status"]).filter(i => i==="hold").length
  
    return (
      <div className="col-sm-2 side-bar">
        
        <h1>SELECTED SEAT</h1>


        {
          seatsInfo[0].length > 0 &&
            <div className="seat-detail">
              <div className="head">Platinum</div>
              <ul className="seat-selected-list">
                {seatsInfo[0].map((seat,index)=>
                  <li key={index}>{seat}</li> )}
              </ul>
            </div>
        }
        {
          seatsInfo[1].length > 0 &&
            <div className="seat-detail">
              <div className="head">Gold</div>
              <ul className="seat-selected-list">
                {seatsInfo[1].map((seat,index)=>
                  <li key={index}>{seat}</li> )}
              </ul>
            </div>
        }
        {
          seatsInfo[2].length > 0 &&
            <div className="seat-detail">
              <div className="head">Cabin</div>
              <ul className="seat-selected-list">
                {seatsInfo[2].map((seat,index)=>
                  <li key={index}>{seat}</li> )}
              </ul>
            </div>
        }
     
        <h1>SUMMARY</h1>
        <p> Sold seat : {sold} </p>
        <p> Booked Seat : {bookedSeat} </p>
        <p> Available Seat: {available} </p>

        <p> Hold :{hold}  </p>

        <Cart 
        banklist={this.props.banklist}
        roles={this.props.roles}
        selectedSeat={this.props.selectedSeat}
        count={this.props.count}
        totalprice={this.props.totalprice}
        seatCatagory={this.props.seatCatagory}
        fields={this.props.fields}
        soldClicked={this.props.soldClicked}/>
      </div>
    );
  }
}
