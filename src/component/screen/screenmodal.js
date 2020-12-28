import React, { Component } from "react";
import screen from "../img/screen.png";
import {findDOMNode} from 'react-dom'
import ReactTooltip from 'react-tooltip';

export default class Screen extends Component {
  constructor() {
    super();
    this.inputs = {};
    this.state = {
      seats: [],
      rows: 0,
      columns: 0,
      orientation: "normal",
      seatOrientation: "normal",
      rowStatus: [],
      show: false
    };
    this.handleClick = e => {
      this.setState({ target: e.target, show: !this.state.show });
    };

  }
  test=()=>console.log("clikkkkkkk")

  componentWillReceiveProps=(nextProps)=>{
    if(JSON.stringify(nextProps.seats) !== JSON.stringify(this.props.seats) ){
      for(let key in this.inputs) {
        if(this.inputs[key]) {
          this.inputs[key].checked = false;
        }
      }
    }
  }



  formatSeats = (rows, cols, seats) => {
    let seat_details = [];
    let index = 0;
    for (let i = 0; i < rows; i++) {
      let row = [];
      for (let j = 0; j < cols; j++) {
        let seat = seats[index];
        row.push(seat);
        index++;
      }
      seat_details.push(row);
    }
    return seat_details;
  };

  setup = props => {
    let movieData = this.props.selectedMovie;

    let screen_info = movieData["screens"];
    let seat_info = movieData["seats"];
    let columns = screen_info["number-of-columns"];
    let rows = screen_info["number-of-rows"];

    let seats = this.formatSeats(rows, columns, seat_info);
    let orientation =
      screen_info["alphabet-orientation"] === "bottom to top"
        ? "reverse"
        : "normal";
    let seatOrientation =
      screen_info["seat-orientation"] === "right to left"
        ? "reverse"
        : "normal";
    let rowStatus = [];
    for (let i = 0; i < seats.length; i++) {
      let obj = {
        index: i,
        isActive: false
      };
      rowStatus.push(obj);
    }
    this.setState({
      seats,
      rows,
      columns,
      orientation,
      seatOrientation,
      rowStatus
    });
  };

  render() {
    const { orientation } = this.state;
   console.log("index",this.props.global) 

    if (this.props.selectedMovie === null) {
      return <div className="col-sm-8 seat-section ">Select a movie</div>;
    }
    const { selectedMovie } = this.props;
    const { seats, columns, rows } = this.props;
    let added= this.props.toggleFullscreen ? " fullscreen ": "";
    let classadded =this.props.isToggleOn ? " col-sm-8 seat-section-next" : " col-sm-8 seat-section  " ;
    let mainstyle = [added ,classadded];
    
    return (
      <div 
      className={mainstyle }
      >
        <div className="screen-div">
          <div>
            <h2>{this.props.selectedMovie["movie_name"]} {this.props.selectedMovie["showTime"]}</h2>
           
           
          </div>
          {seats.map((row, rowIndex) => {
            return (
              <div className="seat-row" key={rowIndex}>
                <div className="label-tag">
                  <input
              
                    type="checkbox"
                    ref={ref => (this.inputs[rowIndex] = ref)}
                    onClick={r =>
                      this.props.onRowSelect(
                        rowIndex,
                        this.inputs[rowIndex].checked
                      )
                    }
                  />
                   {/* <p >Tooltip</p> */}
                  {orientation === "normal"
                    ? String.fromCharCode(65 + rowIndex)
                    : String.fromCharCode(66 + columns - rowIndex)}
                </div>
                
                
               


                {row.map((seat, colIndex) => { 
                  if (Object.keys(seat).length === 0) {
                    return (
                      <Seat
                        status="empty"
                        screen={this.props.selectedMovie.screens}
                        isToggleOn={this.props.isToggleOn}
                         className={this.props.isToggleOn ? "small-img-fullscreen" : "small-img  " }
                        status={require("../img/none.png")}
                      />     
                    ); // If no seat is present
                  } else {
                    return (
                      <span  data-tip data-for='glol' data-event='dblclick' >
                      <Seat
                        screen={this.props.selectedMovie.screens}
                        status={this.props.selectedMovie.screens[mapper[seat["seat-status"]]]}
                        onClick={() =>
                          this.props.selectSeat(rowIndex, colIndex)
                        }
                       
                      />
                      </span>
                    );
                  }
                })}
                
              </div>
            );
          })}


 <ReactTooltip id='glol' aria-haspopup='true' role='example' type="light" >
 {/* <ul> 
 <li>{this.props.globle["customer_name"]}</li>
       
       
<ul> */}

<p>Name:{this.props.name}</p>
<p>Email:{this.props.email}</p>
<p>Mobile:{this.props.mobile}</p>
<p>source:{this.props.source}</p>
<p>Date:{this.props.date}</p>
{/* onClick={() => this.props.seatDetails(rowIndex, colIndex)} */}
<p className="btn " onClick={()=>this.test()}>click</p>
 
 
   
</ReactTooltip>



          <div>
            <img className="screen-img" src={screen} alt="screen" />
          </div>
        </div>
  
      </div>
    );
  }
}

const mapper = {
  available: "available-seat-image",
  reserved: "reserved-seat-image",
  selected: "selected-seat-image",
  hold: "hold-seat-image",
  sold: "sold-seat-image",
  unavailable: "unavailable-seat-image"
};
const Seat = props => (
  <div className="single-seat" onClick={props.onClick}>
    <img alt="seat" src={props.status} 
    className="small-img"
    />
   
  </div>
);
