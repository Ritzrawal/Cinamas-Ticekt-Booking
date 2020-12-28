import React, { Component } from "react";
import screen from "../img/screen.png";
import nodata from "../img/nodata.png";
import menu from "../img/menu.png";
import reel from "../img/reel.png";
import Header from "../header"
import ChangeDate from "../actionSection/ChangeDate";
import {MyLoader} from "../MyLoader"
import {Button} from "react-bootstrap"
import classNames from 'classnames';


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
    // this.seatNum = 1;
    this.handleClick = e => {
      this.setState({ target: e.target, show: !this.state.show });
    };

  }
  
  componentWillReceiveProps=(nextProps)=>{
    if(JSON.stringify(nextProps.seats) !== JSON.stringify(this.props.seats) ){
      for(let key in this.inputs) {
        if(this.inputs[key]) {
          this.inputs[key].checked = false;
        }
      }
    }
  }

  // reset = () => {
  //   this.seatNum = 1;
  //   console.log("Tester me Reset==========>", this.seatNum);
  // };
  // increment = () => {
  //   this.seatNum = this.seatNum + 1;
  //   console.log("Tester me ==========>", this.seatNum);
  // };

  
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
// console.log("movie data to show ", movieData)
    let screen_info = movieData["screens"];
    let seat_info = movieData["seats"];
     let columns = this.props.newcolumns; 
     let rows = this.props.newrows;
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

  // getRowName = rowIndex => {
  //   const { orientation } = this.state;
  //   const { columns } = this.props;
  //   return orientation === "normal"
  //     ? String.fromCharCode(65 + rowIndex)
  //     : String.fromCharCode(66 + columns - rowIndex);
  // };

  render() {
    console.log("seatdetails", this.props)
    const { orientation } = this.state;
    console.log("movirEntry",this.props.movieEmpty)
    if(this.props.movieEmpty){
      return<div className="col-sm-8 seat-section"> 
          <div className="change-date">
            <div className="text-info">
              <div className="text-wrap">
                <p>There is no Movie available today.</p>
                <h1>Please Change the Date</h1>
              </div>
              <div className="date-wrap">
                <ChangeDate
                changeDate={this.props.changeDate}
                handleChangeDate={this.props.handleChangeDate}
                selected={this.props.selected}/>
              </div>
            </div>
            <div className="img-wrap">
              <img src={reel} alt="No Movie Available"/>
            </div>
          </div>
        </div>
    }

    // if(this.props.movieEmpty){
    //   return (
    //     <div className="col-sm-10 seat-section nomovie"> 
    //       <img src={} alt="" className="nomovie-img"/>
    //       <div className="slect-wrapper">
    //         <div className="logo">
    //           <img src={logo} className="logo" alt="logo" />
    //         </div>
    //         <h1>Please Change the Date </h1>

    //       </div>
    //     </div>
    //   )
    // }

    if (this.props.welcomePage === null) {
      return <div className={classNames({
                'col-sm-8 seat-section seat-section-next no-movie-select': (this.props.isToggleOn),
                'col-sm-8 seat-section': (!(this.props.isToggleOn))
              })}>
                <div className={classNames({
                'hamburger-menu': (this.props.isToggleOn),
                'hamburger-menu unsee': (!(this.props.isToggleOn))
              })} onClick={this.props.toggleMenu}>
                  <div className="img-wrap">
                    <img src={menu} alt="Menu"/>
                  </div>
                </div>
                <div className="img-wrap">
                  <img src={nodata} alt="No Movie Selected"/>
                </div>
              </div>
    }
    const { selectedMovie } = this.props;
    const { seats, columns, rows } = this.props;
    let added= this.props.toggleFullscreen ? " fullscreen ": "";
    let classadded =this.props.isToggleOn ? " col-sm-8 seat-section seat-section-next" : " col-sm-8 seat-section  " ;
    let mainstyle = [added ,classadded];
    let seatNames = {
      column: 0
    };
    
    if( this.props.MyLoading === false){
      return(
        <div className=" col-sm-8 seat-section  " style={{paddingTop:140}} > 
            {/* <div className="screen-box"> */}
         <MyLoader />
        {/* </div> */}
        </div>
        
      )
       
    }
    


    return (
      <div 
      className={mainstyle }
      >
        <div className={classNames({
                'hamburger-menu with-movie': (this.props.isToggleOn),
                'hamburger-menu with-movie unsee': (!(this.props.isToggleOn))
              })} onClick={this.props.toggleMenu}>
          <div className="img-wrap">
            <img src={menu} alt="Menu"/>
          </div>
        </div>

       <Header 
       movieEmpty={this.props.movieEmpty}
     selectedMovie={this.props.selectedMovie} />


      <div className="seat-tabs"> 
        <Button className={this.props.balconyStatus} onClick={this.props.balcony}>Platinum</Button>
        <Button className={this.props.specialStatus} onClick={this.props.special}>Gold</Button>
        <Button className={classNames({
            'active': (this.props.cabinStatus === "active"),
            'inactive': (this.props.cabinStatus === "inactive"),
            'show': (this.props.size > 2 ),
            'hide': !(this.props.size > 2 )
          })} onClick={this.props.cabin}>Cabin</Button>
      </div>


        <div className="screen-div">
           <div>
    <h2>{this.props.selectedMovie["movie_name"]} {this.props.selectedMovie["showTime"]}</h2>
           
           
          </div>
          <div className="screen-box">


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
                  {/* {this.getRowName(rowIndex)} */}
                </div>
                
                
               


                {row.map((seat, colIndex) => {
                  if (colIndex === 0) {
                    seatNames.column = 1;
                  }
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
                      <span onDoubleClick={() =>
                        this.props.seatDetails(rowIndex, colIndex)
                        } >
                      <Seat
                        screen={this.props.selectedMovie.screens}
                        column={seatNames.column++}
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
</div>





          <div>
            {/* <MyLoader /> */}
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
  unavailable: "unavailable-seat-image",
  complimentary:'complimentary-seat-image'

};
const Seat = props => (
  <div className="single-seat" onClick={props.onClick}>
    <img alt="seat" src={props.status} 
    className="small-img"
    />
    <div className="num-wrapper">
      <div className="seat-num">{props.column}</div>
    </div>
  </div>
);
