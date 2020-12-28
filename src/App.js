import React, { Component } from "react";

import "./App.css";
import errorbg  from  './component/img/404.png';
import ActionSection from "./component/actionSection";
import Screen from "./component/screen";
// import Header from "./component/header";
import SideBar from "./component/sideBar";
import moment from 'moment';
import {Thumbnail}  from 'react-bootstrap';
import Login from './login';
import PrintProvider, { Print , NoPrint} from 'react-easy-print';
import Ticket from './ticket';
import './login.css';
import Slider from "react-slick";
import socketIOClient from 'socket.io-client'
 import { AlertList, Alert, AlertContainer } from "react-bs-notifier";
 import Modal from 'react-responsive-modal';

import SingleSeatDetails from './singleseatdetails';
const { ipcRenderer } = window.require('electron');


 
window.moment = moment;
function* group(alist, index, cols) {
  yield alist.slice(index, index + cols);
  yield* group(alist, index + cols, cols);
}

function* flatten(args) {
  for(let arg of args) {
    yield* arg;
  }
}
class  App extends Component {
  state = {
    hall:"Platinum",
    category_name:"Platinum",
    //  error:true,
    pcname:"LCM",
    sideBarSeat:[],
    newSeatData:[],
    MyLoading:true,
    open: false,
    openseat: false,
    movieEmpty:false,
    testmovieEmpty:null,
    user:"LCM",
    isAuthenticated: false,
    selectedSeats: [],
    data:{},
    bookedSeat: [],
    holdSeat:[],
    unavailableseats:[],
    loading: true,
    selectedMovie: {},
    movies: [],
    startDate: moment(),
    showTime:[],
    fields: {},
    Sellfields:{},
    tableData:{},
    seatCatagory:[],
    totalprice:0,
    position: "center",
    alerts: [],
    loadingticket:true,
    timeout: 0,
    isToggleOn: true,
    dateToggle: false,
    isFull:false,
    loader:false,
    timeout: 10000,
    toggleseats:{},
    movielength:2,
    balconyStatus: "active",
    specialStatus: "inactive",
    cabinStatus: "",
    welcomePage: null,
    toSellSeats: [
                    [],
                    [],
                    []
                 ],
    toSellSeatsInfo: [
                    [],
                    [],
                    []
                 ],
    toSellCategory: [
                      ['Platinum'],
                      ['Gold'],
                      ['Cabin']
                    ],
    
    endpoint: "http://192.168.1.253:5000" ,
    // main_url:'http://www.cdcnepal.com.np/',

    main_url: "http://192.168.1.253/",
    // main_url: "http://esigntech.com.au/2019/laxmi-cinemas/public/",
    // for local replace main_url by: "http://192.168.1.253/"
    // "https://www.meroshows.com/gk/public/",
    // main_url:"http://192.168.0.75/gk/public/",
    count:{
      age: 27,
      height: 511,
      roles: 'sell,reserve,hold,complementary,cancellation',
    },
    global:{},
  	newMessage: "This is a test of the Emergency Broadcast System.... This is only a test.",
    allSeats: {
      balconySeats: {
        seats: [],
        rows: 0,
        columns: 0
      },
      specialSeats: {
        seats: [],
        rows: 0,
        columns: 0
      },
      cabinSeats: {
        seats: [],
        rows: 0,
        columns: 0
      }
    },
    seats: {
      seats: [],
      rows: 0,
      columns: 0,
      orientation: 'normal',
      seatOrientation: 'normal',
      rowStatus: []
    } 
  
}
// seatSelected



 


// current time 

//  Ctime = new Date();
// currenttime= Ctime.toLocaleString('en-US', { hour: 'numeric', hour12: true })

  

// ALERT=========================================================================
generate(type) {
  const newAlert ={
    id: (new Date()).getTime(),
    type: type,
    message: this.state.newMessage,
    // headline: `${type}!`,
   
  };

  this.setState({
    alerts: [...this.state.alerts, newAlert]
  });
}

onAlertDismissed(alert) {
  const alerts = this.state.alerts;

  // find the index of the alert that was dismissed
  const idx = alerts.indexOf(alert);

  if (idx >= 0) {
    this.setState({
      // remove the alert from the array
      alerts: [...alerts.slice(0, idx), ...alerts.slice(idx + 1)]
    });
  }``
}

clearAlerts() {
  this.setState({
    alerts: []
  });
}

onTimeoutChange({ target: { value } }) {
  this.setState({ timeout: (+value) * 1000 });
}

onNewMessageChange({ target: { value } }) {
  this.setState({ newMessage: value });
}

onPositionChange({ target: { value } }) {
  this.setState({
    position: value
  });
}



// ALERT============================================================================

// input fields

change =e =>{
        
  this.setState({
      [e.target.name]:e.target.value
  });
};

onSubmit=(e)=>{
  e.preventDefault();
 
  this.setState({
     reason:'',
    
      
  })
  
};


Sidebartoggle=(a)=>{
  
  this.setState({
    isToggleOn: a,
    isFull:false
   
  })
  
}
onPrint=()=>{
     ipcRenderer.send('update-notify-value', "hello print")
    //  console.log("ipc")
  }

toggleFullscreen=(a)=>{

  this.setState({
    isFull: a,
    isToggleOn: false,
  })
}


handleLogin=(auth)=>{
  console.log(`${this.state.main_url}api/counter/login`)
  fetch(`${this.state.main_url}api/counter/login`, {
  method: 'post',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    
  },

  body: JSON.stringify({
    password:auth.password,
    email:auth.email,
   
  }),
}).then(function(response) {
  return response.json();
}).then((data) => { 
 console.log("data====>", data)
 if(data.error) {
  this.setState({
 
    message:data.message,
    isAuthenticated: false,

  })
 }else{
  this.setState({
    isAuthenticated: true,
    loadingticket: true,
    id:data.data.id,
    roles:data.data.roles,
    key:data.data.api_key,
    userName:data.data.name,
    user:data.data.name
  })
  this.bookeddata();
  this.holdDataTable();

  this.banklist();
  {this.componentfirst()}
  
  
 }
})
.catch(error => {
console.log(error)
this.setState({
  isAuthenticated: false,
  loading: false,
  
})
}) 
}

// console.log(this.state.roles)


// booking modal app 
onOpenModal = () => {
  this.setState({ open: true });
};

onCloseModal = () => {
  this.setState({ open: false });
};

onSeatModal = () => {
  this.setState({ openseat: true });
};

onSeatModalClose = () => {
  this.setState({ openseat: false });
};






// login end here!!!!!!
  unavailableseats =(s)=>{

    const { seats } = this.state.seats;
    const newSeats = seats.map(rowSeats => {
      return rowSeats.map(seat => {
         if(seat["seat-name"] === s.seat_name){
            seat['seat-status'] ="unavailable"
         }else {
           return seat;
         }
      });
    })
    this.setState({
      seats: {
        ...this.state.seats,
      },
    });
  }

  soldseatssocket=(s)=>{
    
     const { seats } = this.state.seats;
    const newSeats = seats.map(rowSeats => {
      return rowSeats.map(seat => {
       
         if(seat["seat-name"] === s.seat_name){
          seat['seat-status'] ="sold"
         }else {
           return seat;
         }
      });
    })
    this.setState({
      seats: {
        ...this.state.seats,
      },
    });
  }

  bookseatssocket=(s)=>{
    console.log("counter sold",s)
    const { seats } = this.state.seats;
   const newSeats = seats.map(rowSeats => {
     return rowSeats.map(seat => {
        if(seat["seat-name"] === s.seat_name){
         seat['seat-status'] ="reserved"
        }else {
          return seat;
        }
     });
   })
   this.setState({
     seats: {
       ...this.state.seats,
     },
   });
 }

 counterhold=(s)=>{
    
  const { seats } = this.state.seats;
 const newSeats = seats.map(rowSeats => {
   return rowSeats.map(seat => {
      if(seat["seat-name"] === s.seat_name){
       seat['seat-status'] ="hold"
      }else {
        return seat;
      }
   });
 })
 this.setState({
   seats: {
     ...this.state.seats,
   },
 });
}




complimentaryseat=(s)=>{
    
  const { seats } = this.state.seats;
 const newSeats = seats.map(rowSeats => {
   return rowSeats.map(seat => {
      if(seat["seat-name"] === s.seat_name){
       seat['seat-status'] ="complimentary"
      }else {
        return seat;
      }
   });
 })
 this.setState({
   seats: {
     ...this.state.seats,
   },
 });
}

  releaseseat =(s)=>{
  
    // seat.seat_name``
    const { seats } = this.state.seats;
    const newSeats = seats.map(rowSeats => {
      return rowSeats.map(seat => {
         if(seat["seat-name"] === s.seat_name){
          seat['seat-status'] ="available"
         }else{
           return seat;
         }
      });
    })
    this.setState({
      
      seats: {
        ...this.state.seats,
      },
     
    });
  }


  selectSeat = (row, col) => {
    
    const socket = socketIOClient(this.state.endpoint);
    let movie = this.state.selectedMovie;
    let seats = [...this.state.seats.seats];

    let seat_op= seats[row][col];
    console.log("movie22",seats)
    const dataToSend ={
      screen_id: movie.screens["screen_id"],
      movie_id: movie["movie_id"],
      show_date: movie["date"],
      show_time: movie["showTime"],
      category:seat_op["category-name"],
      processed_by: 'counter',
      user_id: this.state.id,
      seat: seat_op["seat-name"],
    }

    console.log('DAta========================>>>>>>>>>>>>>>', dataToSend);
    
    if(seats[row][col]['seat-status'] === 'available') {
      seats[row][col]['seat-status'] = 'selected';
      socket.emit('hold seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
    } else if(seats[row][col]['seat-status'] === 'selected') {
      seats[row][col]['seat-status'] = 'available'
      socket.emit('release seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
    } else {
      return;
    }




    
    let obj = {
      seat_name: seats[row][col]['seat-name'] // Add remaining keys to send to the backend
    }    
    let selected = [...this.state.selectedSeats];
    
    let index=selected.indexOf(seat_op);
    if(index > -1) {
      selected.splice(index,1);
    }else {
      selected.push(seat_op)
    }
    
    // let sold= seats.map(o => o["seat-status"]).filter(i => i=="sold").length;
    let seatCatagory= selected.map(seat=>({
      name: seat["category-name"],
      price: seat["category-price"],
      count: 0
    }));
    let seatPrice= selected.map(seat=>seat["category-price"])
    // {this.counterData()}
  
    if(undefined != seatPrice && seatPrice != null && seatPrice != '' && seatPrice.length > 0){
      var totalprice= seatPrice.reduce((a=0,b=0)=>(a== null ? 0 : a)+(b==null ? 0 : b) );
    }

    let count ={};
    seatCatagory.map(category => {
      if(count.hasOwnProperty(category.name)) {
       let current = count[category.name];
       count[category.name] = {
         ...current,
         count: ++current.count
       }
      } else {
        count[category.name] = {
          ...category,
          count: 1
        }
      }
    })

    let sellingTicketSeatInfo = [...this.state.toSellSeats];
    for (var i = 0; i < selected.length; ++i) {

       if (selected[i]['category-name'] === "Platinum") {
         sellingTicketSeatInfo[0].push(selected[i]['seat-name']);
       } else if (selected[i]['category-name'] === "Gold"){
          sellingTicketSeatInfo[1].push(selected[i]['seat-name']);
       } else{
          sellingTicketSeatInfo[2].push(selected[i]['seat-name']);
       }

    }

    console.log('Selling ======================>>>>>>>>>>>>>>>>', sellingTicketSeatInfo[0].length);
    console.log('Selling ======================>>>>>>>>>>>>>>>>', sellingTicketSeatInfo);
  
    this.setState({
      ...this.state,
      seats: {
        ...this.state.seats,
        seats,

      },
     
      count,
      selectedSeats: selected,
      toSellSeatsInfo: sellingTicketSeatInfo,
      toSellSeats: [
                      [],
                      [],
                      []
                   ],
      seatCatagory,
      totalprice
    });
  }


 
seatDetails=(row, col)=>{
console.log("seat_details", row, col)
  let movie = this.state.selectedMovie;
  let seats = [...this.state.seats.seats];
  let seat_op= seats[row][col]['seat-name'];

  if(seats[row][col]['seat-status'] === 'sold'){
   
    console.log(seats[row][col]['seat-name'])
    {this.seatDetailapi(seat_op,"sell")}
    
  }else if(seats[row][col]['seat-status'] === 'hold'){
   
    {this.seatDetailapi(seat_op,"hold")}
  
  }else if(seats[row][col]['seat-status'] === 'reserved'){
  
    {this.seatDetailapi(seat_op,"reserve")}
  }else if(seats[row][col]['seat-status'] === 'complimentary'){
    
    {this.seatDetailapi(seat_op,"complimentary")}

  }else{
    console.log("")
  }

 this.setState({
   seatcancle:seat_op
 })

}


cancellingSingleSeat=async (seat)=>{
  console.log("seat", seat,)
  await this.setState({
    openseat:false,
    seatCatagorycancle:"complimentary"
  })
  console.log(
  "checking the state",this.state.seatCatagorycancle
  )
//  console.log("seat,ss",this.state.seatcancl.toString())

 
  // Parameters: screen_id, movie_id, show_date, show_time, seat_name, status(hold/reserve/sell/complimentary)
  fetch(`${this.state.main_url}api/counter/cancel-seat`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      screen_id:this.state.selectedMovie.screens["screen_id"],
      movie_id:this.state.selectedMovie["movie_id"],
      show_date:this.state.selectedMovie["date"],
      show_time:this.state.selectedMovie["showTime"],
      status:this.state.seatCatagorycancle,
      seat_name:[seat.row.join()],
      category:[this.state.category_name],
      reason_for_return:seat["comment"],
      
      computer_name:this.state.pcname,
      
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("new data",data,data.message)
this.setState({
  singleseatdetails:data,
  newMessage:data.message
})
this.generate("info");

  })
  .catch(error => {
    console.log(error)
    
})
this.holdDataTable()
this.ComplimentaryTable()
// {this.seatDetailapi()}

}



cancellingSingleSeathere=(seat)=>{
  console.log("seatseat",seat)
 
  this.setState({
    openseat:false,
   
  })
//  console.log("seat,ss",this.state.seatcancl.toString())

 
  // Parameters: screen_id, movie_id, show_date, show_time, seat_name, status(hold/reserve/sell/complimentary)
  fetch(`${this.state.main_url}api/counter/cancel-seat`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      screen_id:seat.datatobook["screen_id"],
      movie_id:seat.datatobook["movie_id"],
      show_date:seat.datatobook["show_date"],
      show_time:seat.datatobook["show_time"],
      status:"reserve",
      seat_name:[seat.row.join()],
      category:[this.state.category_name],
      reason_for_return:seat["comment"],
      computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("new data",data,data.message)
this.setState({
  singleseatdetails:data,
  newMessage:data.message
})
this.generate("info");

  })
  .catch(error => {
    console.log(error)
    
})
this.bookeddata();
this.holdDataTable()
// {this.seatDetailapi()}

}




cancellingSingleSeathold=(seat)=>{
  console.log("seat herere reere===>>>>>>>>>>>>>>>>>>>>>>", seat,seat.row)
  this.setState({
    openseat:false,
   
  })
//  console.log("seat,ss",this.state.seatcancl.toString())

 
  // Parameters: screen_id, movie_id, show_date, show_time, seat_name, status(hold/reserve/sell/complimentary)
  fetch(`${this.state.main_url}api/counter/cancel-seat`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      screen_id:seat.datatobook["screen_id"],
      movie_id:seat.datatobook["movie_id"],
      show_date:seat.datatobook["show_date"],
      show_time:seat.datatobook["show_time"],
      status:"hold",
      seat_name:[seat.row.join()],
      category:[this.state.category_name],
      computer_name:this.state.pcname,
      reason_for_return:seat["comment"]
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("new data",data,data.message)
this.setState({
  singleseatdetails:data,
  newMessage:data.message
})
this.generate("info");
this.holdDataTable()
  })
  .catch(error => {
    console.log(error)
    
})
this.holdDataTable()
// {this.seatDetailapi()}

}





cancellingcomplimentarySeat=(seat)=>{
  console.log("seat here", seat, seat.datatobook,seat.datatobook.comment)
  this.setState({
    openseat:false,
    seatCatagorycancle:"complimentary"
  })
//  console.log("seat,ss",this.state.seatcancl.toString())

 
  // Parameters: screen_id, movie_id, show_date, show_time, seat_name, status(hold/reserve/sell/complimentary)
  fetch(`${this.state.main_url}api/counter/cancel-seat`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
       screen_id:seat.datatobook.screen_id,
       movie_id:seat.datatobook.movie_id,
       show_date:seat.datatobook.show_date,
      show_time:seat.datatobook.show_time,
      status:this.state.seat,
      seat_name:[seat.row.join()],
      category:[this.state.category_name],
      computer_name:this.state.pcname,
      reason_for_return:seat["comment"]
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("new data",data,data.message)
this.setState({
  singleseatdetails:data,
  newMessage:data.message
})
{this.ComplimentaryTable()}
this.generate("info");

  })
  .catch(error => {
    console.log(error)
    
})
this.holdDataTable();
this.ComplimentaryTable();
// {this.seatDetailapi()}

}






updateSeat=(d)=>{
  this.setState({
    openseat:false,
  })
  
  fetch(`${this.state.main_url}api/counter/update`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code:this.state.global_code,
      status:this.state.seatCatagorycancle,
       release_time:d.time,
       computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("-----------------update-----",data)
  })
  .catch(error => {
    console.log(error)
})
}



updateSeathere=(d)=>{
  this.setState({
    openseat:false,
  })
  console.log("update time here",this.state.global_code,d.datatobook["booking_code"],this.state.seatCatagorycancle )
  fetch(`${this.state.main_url}api/counter/update`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code:d.datatobook["booking_code"],
      status:"reserve",
       release_time:d.time,
       computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("-----------------update-----",data)
  })
  .catch(error => {
    console.log(error)
})
this.bookeddata();
}





holddateSeathere=(d)=>{
  this.setState({
    openseat:false,
  })
  console.log("update time here",d)
  fetch(`${this.state.main_url}api/counter/update`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      code:d.datatobook["hold_id"],
      status:"hold",
       release_time:d.time,
       computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("-----------------update-----",data)
  })
  .catch(error => {
    console.log(error)
})
this.bookeddata();
this.holdDataTable()
}



seatDetailapi=(seat,aaa)=>{
  console.log("seat--------------detail",seat,aaa)
 let seat_names= seat.toString();
  
  fetch(`${this.state.main_url}api/counter/seat-wise-detail`, {
    method: 'post',
    headers: {
      'api-token':this.state.key,
      'Accept': 'application/json',
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      screen_id:this.state.selectedMovie.screens["screen_id"],
      movie_id:this.state.selectedMovie["movie_id"],
      show_date:this.state.selectedMovie["date"],
      show_time:this.state.selectedMovie["showTime"],
      status:aaa,
      category:[this.state.category_name],
      seat_name:seat_names,
      computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => {
    console.log("----------------------",data.data)
this.setState({
  global_date:data.data["date_time"],
  global_name:data.data["customer_name"],
  global_mobile:data.data["customer_mobile"],
  global_source:data.data["source"],
  global_email:data.data["customer_email"],
  global_code:data.data["code"],
  globaldata:data.data,
  seatCatagorycancle:aaa,
})

this.onSeatModal();
this.holdDataTable()
  })
  .catch(error => {
    console.log(error)
    
})
}


booktosell=(row)=>{
  console.log("row ----------------------------------->",row.datatobook)

this.setState({
  loader:true,
  openseat:false
})

  console.log("bookingtosell",row)
  fetch(`${this.state.main_url}api/counter/seats/book-to-sell`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
    body: JSON.stringify({
      booking_code: this.state.global_code,
      payment_mode: row.cardtype ,
      counter_id:this.state.id,
      seats: [row.row.join()],
      category:[this.state.category_name],
     computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("data--here ata booking ", data)
  
  
    // {this.counterData()}
    this.setState({
      loader:false,
      ticketData:data.data,
      selectedSeats: [],
       loadingticket:false,
      newMessage:data.message
    })
    this.generate("success");
   this.onPrint();
   
   {this.bookeddata()}
}).catch(error => {
  console.log(error)
  this.setState({
    loading: false,
    error: true
  })
})
}




// hold to sell==================================
holdsell=(row)=>{
  console.log("hold to to to ===== sell", row.row.join(), row.row)
  this.setState({
    loader:true,
    openseat:false
  })
  
  fetch(`${this.state.main_url}api/counter/seats/hold-to-sell`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
    body: JSON.stringify({
      
      hold_id: this.state.global_code,
      payment_mode: row.cardtype ,
      counter_id:this.state.id,
       seats: [row.row.join()],
       category:[this.state.category_name],
       computer_name:this.state.pcname,

    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("hold to sell",data)

    this.setState({
      ticketData:data.data,
      selectedSeats: [],
      loadingticket:false,
      loader:false,
      newMessage:data.message
    })

    
    this.generate("success");
    this.onPrint();
    {this.counterData()}
    {this.bookeddata()}
     this.holdDataTable()
  
 
}).catch(error => {
  console.log(error)
  this.setState({
    
    loading: false,
    error: true
  })
})
}



onRowSelect = (rowIndex, selected) => {
  let { seats } = this.state.seats;
  let rowStatus = this.state.seats.seats[rowIndex];
  let rows = seats[rowIndex];
  const seatsOnRow = seats[rowIndex];
  
  const r = seatsOnRow
    .map(seat => {
      if (Object.keys(seat).length) {
        return {
          ...seat,
          'seat-status': (() => {
         
            if (selected && seat['seat-status'] === 'available') {
              return 'selected';
            
            } else if (!selected && seat['seat-status'] === 'selected') {
              return 'available';
          
            }
            return seat['seat-status'];
          })()
        }
      } else {
        return seat;
      }
    })
    let toggleseat = [];
    let toggleoffseat =[];
    
    

    const s = seatsOnRow
    .map(seat => {
      if (Object.keys(seat).length) {
        return {
          ...seat,
          'seat-status': (() => {
            if (selected && seat['seat-status'] === 'available') {
             toggleseat.push(seat["seat-name"]);
              
            } else if (!selected && seat['seat-status'] === 'selected') {
              toggleoffseat.push(seat["seat-name"]);
            }
            return seat['seat-status'];
          })()
        }
      } else {
        return seat;
      }
    })
    



  
   
  seats[rowIndex] = r

  let nestedSelectedSeats = seats.map(seatRow => {
    return seatRow.filter(seat => seat['seat-status'] === 'selected')
  });
  // console.log("nestedselectedseats",selectedSeats,nestedSelectedSeats)
  let selectedSeats = [...flatten(nestedSelectedSeats)];
    
  
    let seatname= selectedSeats.map(seat=>(
    seat["seat-name"] 
    ));

    


  let seatPrice= selectedSeats.map(seat=>seat["category-price"])
  
  if(undefined != seatPrice && seatPrice != null && seatPrice != '' && seatPrice.length > 0){
    var totalprice= seatPrice.reduce((a=0,b=0)=>(a== null ? 0 : a)+(b==null ? 0 : b) );
  }

  // let sold= seats.map(o => o["seat-status"]).filter(i => i=="sold").length;
  let seatCatagory= selectedSeats.map(seat=>({
    name: seat["category-name"],
    price: seat["category-price"],
    count: 0
  }));

  let count ={};
    seatCatagory.map(category => {
      if(count.hasOwnProperty(category.name)) {
       let current = count[category.name];
       count[category.name] = {
         ...current,
         count: ++current.count
       }
      } else {
        count[category.name] = {
          ...category,
          count: 1
        }
      }
    })

   
    const socket = socketIOClient(this.state.endpoint);
    let movie = this.state.selectedMovie;
    
    let seat_op= seats[rowIndex][0];
    console.log("checking seat_op", seat_op)
    
    const dataToSend ={
      screen_id: movie.screens["screen_id"],
      movie_id: movie["movie_id"],
      show_date: movie["date"],
      show_time: movie["showTime"],
      category:seat_op["category-name"],
      processed_by: 'counter',
      user_id: this.state.id,
      seat: selected ? toggleseat.toString() :toggleoffseat.toString(),
    }
 

if(selected){
  socket.emit('hold seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
  
}else{

  socket.emit('release seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
}

  this.setState({
    ...this.state,
    totalprice,
    seats: {
      ...this.state.seats,
      seats,
      rowStatus,
    },
    selectedSeats,
    count,
    seatCatagory,
    
  })
}


  holdClicked = (fields) => {
    console.log("hold clicked", fields)
    console.log("data recived from hold",fields.time)

    let sellingTicketSeat = [...this.state.toSellSeats];
    let sellingTicketCategory = [...this.state.toSellCategory];
    
    
    for (var i = 0; i < this.state.selectedSeats.length; ++i) {

       if (this.state.selectedSeats[i]['category-name'] === "Platinum") {
         sellingTicketSeat[0].push(this.state.selectedSeats[i]['seat-name']);
       } else if (this.state.selectedSeats[i]['category-name'] === "Gold"){
          sellingTicketSeat[1].push(this.state.selectedSeats[i]['seat-name']);
       } else{
          sellingTicketSeat[2].push(this.state.selectedSeats[i]['seat-name']);
       }

    }

    for (var i = 2; i >= 0; i--) {
        
        if (!Array.isArray(sellingTicketSeat[i]) || !sellingTicketSeat[i].length) {
              sellingTicketSeat.splice(i, 1);
              sellingTicketCategory.splice(i, 1);
        }
    }

    for (var i = 0; i < sellingTicketSeat.length; i++) {
        sellingTicketSeat[i] = sellingTicketSeat[i].toString();
        sellingTicketCategory[i] = sellingTicketCategory[i].toString();
    }

    console.log('selling dataa:::',sellingTicketSeat)

    let seatname= this.state.selectedSeats.map(i=>i["seat-name"]);
      let seat_names= seatname.toString().split();
      fetch(`${this.state.main_url}api/counter/seats/hold`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'api-token':this.state.key,
        'Content-Type': 'application/json', 
      },
      body: JSON.stringify({
        screen_id:this.state.selectedMovie.screens["screen_id"],
        movie_id:this.state.selectedMovie["movie_id"],
        show_date:this.state.selectedMovie["date"],
        show_time:this.state.selectedMovie["showTime"],
        // seat_name:seat_names,
        seat_name:sellingTicketSeat,
        // category:[this.state.category_name],
        category:sellingTicketCategory,
        counter_id:this.state.id,
        customer_name:fields.firstName,
        customer_mobile:fields.number,
        computer_name:this.state.pcname,
        customer_email:fields.email,
        release_time: parseInt(fields.time) || 60
      }),
    }).then(function(response) {
      return response.json();
    }).then((data) => { 
      console.log("hod data", data)

      this.setState({
        selectedSeats: [],
        toSellSeatsInfo: [
                          [],
                          [],
                          []
                         ],
        toSellSeats: [
                      [],
                      [],
                      []
                   ],
        toSellCategory: [
                        ['Platinum'],
                        ['Gold'],
                        ['Cabin']
                      ]
       
       })
    
      {this.holdDataTable()}  
    })
  .catch(error => {
    console.log(error)
    this.setState({
      loading: false,
      error: true
    })
  }
)
    const { seats } = this.state.seats;
 
    const newSeats = seats.map(rowSeats => {
      return rowSeats.map(seat => {
      
        if (Object.keys(seat).length) {
          return {
            ...seat,
            'seat-status': seat['seat-status'] === 'selected'
             ? 'hold'
             : seat['seat-status']
          }
        } else {
          return seat;
        }
      });
    })
    console.log("hold seat seat", newSeats)
    this.setState({
      ...this.state,
      seats: {
        ...this.state.seats,
        seats: newSeats,
        
      }, 
      holdSeat:[...this.state.selectedSeats],
      selectedSeats: [],
      totalprice:0,
    })
  };





// booking seat=============================================================================
  bookedClicked = (fields) => {

    let sellingTicketSeat = [...this.state.toSellSeats];
    let sellingTicketCategory = [...this.state.toSellCategory];
    
    for (var i = 0; i < this.state.selectedSeats.length; ++i) {

       if (this.state.selectedSeats[i]['category-name'] === "Platinum") {
         sellingTicketSeat[0].push(this.state.selectedSeats[i]['seat-name']);
       } else if (this.state.selectedSeats[i]['category-name'] === "Gold"){
          sellingTicketSeat[1].push(this.state.selectedSeats[i]['seat-name']);
       } else{
          sellingTicketSeat[2].push(this.state.selectedSeats[i]['seat-name']);
       }

    }

    for (var i = 2; i >= 0; i--) {
        
        if (!Array.isArray(sellingTicketSeat[i]) || !sellingTicketSeat[i].length) {
              sellingTicketSeat.splice(i, 1);
              sellingTicketCategory.splice(i, 1);
        }
    }

    for (var i = 0; i < sellingTicketSeat.length; i++) {
        sellingTicketSeat[i] = sellingTicketSeat[i].toString();
        sellingTicketCategory[i] = sellingTicketCategory[i].toString();
    }

console.log("pc nbame", this.state.pcname)
  let seatname= this.state.selectedSeats.map(i=>i["seat-name"]);
   let seat_names= seatname.toString().split();
  const { seats } = this.state.seats;
  const newSeats = seats.map(rowSeats => {
    return rowSeats.map(seat => {
      if (Object.keys(seat).length) {
        return {
          ...seat,
          'seat-status': seat['seat-status'] === 'selected'
            ? 'reserved'
            : seat['seat-status']
        }
      } else {
        return seat;
      }
    });
  })


  this.setState({
    ...this.state,
    seats: {
      ...this.state.seats,
      seats: newSeats,
      totalprice:0,
      loader:true,
    },
    bookedSeat:[...this.state.selectedSeats],
    selectedSeats: [],
    fields:[...this.state.fields,fields],
    // tableData:[...this.state.tableData,tdata],
  })
  fetch(`${this.state.main_url}api/counter/seats/reserve`, {
  method: 'post',
  headers: {
    'api-token':this.state.key,
    'Accept': 'application/json',
    'Content-Type': 'application/json'
  },

  body: JSON.stringify({
    screen_id:this.state.selectedMovie.screens["screen_id"],
    movie_id:this.state.selectedMovie["movie_id"],
    show_date:this.state.selectedMovie["date"],
    show_time:this.state.selectedMovie["showTime"],
    // seat_name:seat_names,
    seat_name:sellingTicketSeat,
    // category:[this.state.category_name],
    category:sellingTicketCategory,
     counter_id:this.state.id,
     customer_name:fields.firstName,
    customer_mobile:fields.number,
    customer_email:fields.email,
    computer_name:this.state.pcname,
    release_time: parseInt(fields.time)

  }),
}).then(function(response) {
  return response.json();
}).then((data) => {
  console.log("book data", data)
  if (data.data === undefined){
    {this.counterData()}
    this.setState({
      selectedSeats:[],
      totalprice:0,
      newMessage:"reservation failed"
    })
    this.generate("danger");
  }else{
    {this.bookeddata()}
    {this.counterData()}
    this.setState({
      bookingCode:data.data,
      selectedSeats: [],
      toSellSeatsInfo: [
                        [],
                        [],
                        []
                       ],
      toSellSeats: [
                    [],
                    [],
                    []
                 ],
      toSellCategory: [
                      ['Platinum'],
                      ['Gold'],
                      ['Cabin']
                    ],
      totalprice:0,
      loader:false,
      newMessage:` Booking Code: ${data.data}`
     
     })

        // {this.counterData()}
        this.generate("success");
this.onOpenModal();
      let id= (this.state.tableData.length);  
                 
                 let tdata= ({ firstName: fields.firstName ,
                  //  id:  id ? id : 0,
                   email: fields.email,
                   number: fields.number,
                   movieName:this.state.selectedMovie["movie_name"] ,
                   seatSelected:seatname.toString(),
                   showDate:this.state.selectedMovie.date,
                   showTime:this.state.selectedMovie.showTime,
                   bookingCode:this.state.bookingCode
                   
                 })}

          })
          
          .catch(error => {
            this.setState({
              newMessage:"Booking Failed",
              loading: false,
              error: true, 
              loadingticket:true
            })
            this.generate("danger");
          })
            };
          


// booking seat+==============================================================================
  
bookeddata=()=>{
  // this.setState({
  //   loader:true,
  // })
fetch(`${this.state.main_url}api/counter/seats/booked`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
              "api-token":this.state.key,
            },
          }).then(function(response) {
            
            return response.json();
          }).then((data) => { 
             console.log("booktable================>",data)
             
            // const bookdata=data.data.seat.map((book,index) => {
            //   return {
            //     seat:book[index].seat
            //   }
            
            // })

            // console.log("bookdata=========>  > >", bookdata)



           this.setState({
            //  loader:false,
            tableData:data.data
           })
          
        })

      }

// bookedData==============================

// bank details
banklist=()=>{
  
  fetch(`${this.state.main_url}api/counter/bank-lists`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("bank data:",data.data)

    




   this.setState({
    banklist:data.data
   })
})
}


// bank details



// holdDatatable
holdDataTable=()=>{

  fetch(`${this.state.main_url}api/counter/seats/holded`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("holdtable:",data)
   this.setState({
    holdtable:data.data
   })
})
}

ComplimentaryTable=()=>{

  fetch(`${this.state.main_url}api/counter/seats/complimentary`, {
    method: 'GET',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("comp---------------table:",data)
   this.setState({
    complimentarytable:data.data
   })
})
}

// Counter Data===========

counterData=()=>{
  
  fetch(`${this.state.main_url}api/counter`, {
    method:"GET",
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
 
    if(data.error == false){
      const movies = data.data.map(mov => {
        const movie = mov['movie-detail'];
        const timeDetail = mov['schedule-detail'];
        const seatDetails = mov['seat-detail'];
        const screens = mov['screen-detail'];
        return {  
          ...movie,
          time: `${timeDetail['show-date']} ${timeDetail['show-time']}`,
          showTime: `${timeDetail['show-time']}`,
          date: `${timeDetail['show-date']}`,
          title: movie['movie_name'] || 'Unknown',
          imageSource: movie.image,
          seats: seatDetails,
          screens
        }
    })
    .filter(movie => {
      return moment(movie.time).format('YYYY-MM-DD') === this.state.startDate.format('YYYY-MM-DD')
    });
    let columns_ = this.state.seats.cols;
    let rows_ = this.state.seats.rows;
    const setInfo_ = this.state.selectedMovie.seats;
   
    // let seats_ = this.formatSeats(rows_, columns_, setInfo_);
      // console.log("counter data",data.data)
     this.setState({
      data: data.data,
     
     
      // seats: {
      //    seats: seats_,
      //  cols: columns_,
      //  rows: rows_
      // }
  
      
     })
    }else{
      
      this.setState({
        newMessage: "Too Many Requests",
        // timeout: 500,

      })
      // this.generate("danger");
    }
    
})

}


complimentary=(fields)=>{
 
  let sellingTicketSeat = [...this.state.toSellSeats];
  let sellingTicketCategory = [...this.state.toSellCategory];
  
  for (var i = 0; i < this.state.selectedSeats.length; ++i) {

     if (this.state.selectedSeats[i]['category-name'] === "Platinum") {
       sellingTicketSeat[0].push(this.state.selectedSeats[i]['seat-name']);
     } else if (this.state.selectedSeats[i]['category-name'] === "Gold"){
        sellingTicketSeat[1].push(this.state.selectedSeats[i]['seat-name']);
     } else{
        sellingTicketSeat[2].push(this.state.selectedSeats[i]['seat-name']);
     }

  }

  for (var i = 2; i >= 0; i--) {
      
      if (!Array.isArray(sellingTicketSeat[i]) || !sellingTicketSeat[i].length) {
            sellingTicketSeat.splice(i, 1);
            sellingTicketCategory.splice(i, 1);
      }
  }

  for (var i = 0; i < sellingTicketSeat.length; i++) {
      sellingTicketSeat[i] = sellingTicketSeat[i].toString();
      sellingTicketCategory[i] = sellingTicketCategory[i].toString();
  }

let seatname= this.state.selectedSeats.map(i=>i["seat-name"]);
let seat_names= seatname.toString().split();

  fetch(`${this.state.main_url}api/counter/seats/complimentary`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "api-token":this.state.key,
      },
    
      body: JSON.stringify({
        screen_id:this.state.selectedMovie.screens["screen_id"],
        movie_id:this.state.selectedMovie["movie_id"],
        show_date:this.state.selectedMovie["date"],
        show_time:this.state.selectedMovie["showTime"],
        seat_name:sellingTicketSeat,
        category:sellingTicketCategory,
        counter_id:this.state.id,
        remark:fields.remark || "{Complimentary}",
        customer_email:fields.firstName,
        customer_name:fields.email,
        computer_name:this.state.pcname,
        customer_mobile:fields.number
  

      }),
      
    }).then(function(response) {
     
      return response.json();
    }).then((data) => { 
     console.log("Complimentary data",data)
      if(data.error){
        this.setState({
          selectedSeats: [],
          loader:false,
          newMessage:data.message
        })
         this.generate("info");
      }else{
        {this.counterData()}
     this.setState({
        loader:false,
        ticketData:data.data,
        selectedSeats: [],
        toSellSeatsInfo: [
                          [],
                          [],
                          []
                         ],
        toSellSeats: [
                      [],
                      [],
                      []
                   ],
        toSellCategory: [
                        ['Platinum'],
                        ['Gold'],
                        ['Cabin']
                      ],
        loadingticket:false,
        newMessage:data.message
    })
     this.generate("success");
     this.onPrint();
     this.ComplimentaryTable();
      }
     
   
  })
  .catch(error => {
    console.log(error)
    this.setState({
      loader:false,
      loading: false,
      error: true
    })
  })


  const { seats } = this.state.seats;
        const newSeats = seats.map(rowSeats => {
          return rowSeats.map(seat => {
            if (Object.keys(seat).length) {
              return {
                ...seat,
                'seat-status': seat['seat-status'] === 'selected'
                ? 'complimentary'
                : seat['seat-status']
              }
            } else {
              return seat;
            }
          });
        })

        this.setState({
          ...this.state,
          seats: {
            ...this.state.seats,
            seats: newSeats,
          
          },
          totalprice:0,
          selectedSeats: [],
         
        })
      };


// sold seat+==============================================================================
  soldClicked = (fields) => {
    let bankName= (fields.cardtype == "cash" ? null : fields.bank)

    let sellingTicketSeat = [...this.state.toSellSeats];
    let sellingTicketCategory = [...this.state.toSellCategory];
    
    for (var i = 0; i < this.state.selectedSeats.length; ++i) {

       if (this.state.selectedSeats[i]['category-name'] === "Platinum") {
         sellingTicketSeat[0].push(this.state.selectedSeats[i]['seat-name']);
       } else if (this.state.selectedSeats[i]['category-name'] === "Gold"){
          sellingTicketSeat[1].push(this.state.selectedSeats[i]['seat-name']);
       } else{
          sellingTicketSeat[2].push(this.state.selectedSeats[i]['seat-name']);
       }

    }

    for (var i = 2; i >= 0; i--) {
        
        if (!Array.isArray(sellingTicketSeat[i]) || !sellingTicketSeat[i].length) {
              sellingTicketSeat.splice(i, 1);
              sellingTicketCategory.splice(i, 1);
        }
    }

    for (var i = 0; i < sellingTicketSeat.length; i++) {
        sellingTicketSeat[i] = sellingTicketSeat[i].toString();
        sellingTicketCategory[i] = sellingTicketCategory[i].toString();
    }

    let seatname= this.state.selectedSeats.map(i=>i["seat-name"]);
      let seat_names= seatname.toString().split();
       console.log("seatname--------",[seat_names],[seatname])
      fetch(`${this.state.main_url}api/counter/seats/sell`, {
      method: 'post',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        "api-token":this.state.key,
      },
   

      body: JSON.stringify({
        screen_id:this.state.selectedMovie.screens["screen_id"],
        movie_id:this.state.selectedMovie["movie_id"],
        show_date:this.state.selectedMovie["date"],
        show_time:this.state.selectedMovie["showTime"], 
        // seat_name:seat_names,
        seat_name:sellingTicketSeat,
        // category:[this.state.category_name],
        category:sellingTicketCategory,
        counter_id:this.state.id,
        payment_mode:fields.cardtype,
        bank_chose:bankName,
        computer_name: this.state.pcname,
        customer_name:fields.firstName,
        customer_email:fields.email,
        customer_mobile:fields.number,
    
      }),
    }).then(function(response) {
      return response.json();
    }).then((data) => { 
  
      console.log('DAta tes ========================>>>>>>>>>>>>>>>>>', data);
      if(data.error){
        this.setState({
          selectedSeats: [],
          loader:false,
          newMessage:data.message
        })
        this.generate("info");
      }else{
              // {this.counterData()}
     this.setState({
      loader:false,
      totalprice:0,
      ticketData:data.data,
      selectedSeats: [],
      loadingticket:false,
      toSellSeatsInfo: [
                        [],
                        [],
                        []
                       ],
      toSellSeats: [
                    [],
                    [],
                    []
                 ],
      toSellCategory: [
                      ['Platinum'],
                      ['Gold'],
                      ['Cabin']
                    ],
      newMessage:data.message
    })
    this.generate("success");
    this.onPrint();
    
      }
     
   
  })

  .catch(error => {
    console.log(error)
    this.setState({
      loader:false,
      loading: false,
      error: true
    })
  })


  const { seats } = this.state.seats;
  const newSeats = seats.map(rowSeats => {
    return rowSeats.map(seat => {
      if (Object.keys(seat).length) {
        return {
          ...seat,
          'seat-status': seat['seat-status'] === 'selected'
          ? 'sold'
          : seat['seat-status']
        }
      } else {
        return seat;
      }
    });
  })

  this.setState({
    ...this.state,
    seats: {
      ...this.state.seats,
      seats: newSeats
    },
    selectedSeats: []
  })
};


     

// sold seat+==============================================================================

  formatSeats = (rows, cols, seats) => {
    let seat_details = [];
    let index = 0;
    for(let i = 0; i < rows; i++) {
      let row = [];
      for(let j = 0; j < cols; j++) {
        let seat = seats[index];
        row.push(seat);
        index++;
      }
      seat_details.push(row);
    }
    return seat_details;
  }




  movieempty=()=>{
console.log("movie empty socket run")
      const socket = socketIOClient(this.state.endpoint);
      let movie = this.state.selectedMovie;
     let seats = [...this.state.seats.seats];
     console.log("seat_op",seats)
     console.log("12345",this.state.selectedSeats)
      
     const dataToSend ={
       screen_id: movie.screens["screen_id"],
       movie_id: movie["movie_id"],
       show_date: movie["date"],
       show_time: movie["showTime"],
       processed_by: 'counter',
       category:this.state.hall,
       user_id: this.state.id,
       seat: this.state.selectedSeats.map(seat=> seat["seat-name"]).toString(),
     }
     socket.emit('release seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
     
    
  }

  handleChangeDate=(date) =>{
    console.log("date",date)
    this.setState({
      loader:true,
      welcomePage: null
    })
    
    


    fetch(`${this.state.main_url}api/counter`, {
    method: 'post',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
    body: JSON.stringify({
      date: date.format('YYYY-MM-DD')
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("data",data)
    if(data.error == false && data.data.length > 0){
  
     
    
      const movies = data.data.map(mov => {
        const movie = mov['movie-detail'];
        const timeDetail = mov['schedule-detail'];
        const seatDetails = mov['seat-detail'];
        const screens = mov['screen-detail'];
        return {  
          ...movie,
          time: `${timeDetail['show-date']} ${timeDetail['show-time']}`,
          showTime: `${timeDetail['show-time']}`,
          date: `${timeDetail['show-date']}`,
          title: movie['movie_name'] || 'Unknown',
          imageSource: movie.image,
          seats: seatDetails,
          screens
        }
    })
    .filter(movie => {
      return moment(movie.time).format('YYYY-MM-DD') === date.format('YYYY-MM-DD')
    });
      let columns_ = movies[0].screens["number-of-columns"];
      let rows_ = movies[0].screens["number-of-rows"];
      const setInfo_ = movies[0].seats;
      let seats_ = this.formatSeats(rows_, columns_, setInfo_);
      
      this.setState({
        seats: {
          seats: seats_,
          cols: columns_,
          rows: rows_
        },
        loader:false,
        movieEmpty:false,
         startDate: date,
        data: data.data,
        date: date,
        selectedSeats: [],
        holdSeat:[],
        bookedSeat: [],
         movies,
         selectedMovie:movies[0],
        // loading:true
      })
      this.movieempty()
    }else{
     
      this.setState({
        loader:false,
        newMessage:"No Movies Available on this Date"
      })
      this.generate("info")
    }
    
    
  })
  .catch(error => {
    console.log("Error Changing Date: error part ", error.message);
    this.setState({
       loading: true,
      error: true
    })
  })
 
  };




  refresh=()=>{
    this.setState({
      loading:true,
      selectedSeats: [],
    data:{},
    bookedSeat: [],
    holdSeat:[],
    unavailableseats:[],
    loading: true,
    selectedMovie: {},
    movies: [],
    startDate: moment(),
    showTime:[],
    fields: {},
    Sellfields:{},
    tableData:{},
    seatCatagory:[],
    totalprice:0,
    position: "top-right",
    alerts: [],
    loadingticket:true,
    timeout: 0,
    isToggleOn: true,
    dateToggle: false,
    isFull:false,
    loader:false,
    timeout: 10000,
    toggleseats:{},
    movielength:2,
    welcomePage: null,
    error:false
      
    })
   {this.componentfirst()}
   {this.seatreleasesocket()}
  }



newComponentRender=()=>{
    this.setState({
        error:false,
        loading:false,
      })

     
    fetch(`${this.state.main_url}api/counter/movie-list`, {
        method: 'get',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json',
          "api-token":this.state.key,
        },
    
      }).then(function(response) {
        return response.json();
      }).then((data) => {
          console.log("newComonentrender", data)
      })
    }






// component 1st render on the top of all
  componentfirst=()=>{
    // this.seatreleasesocket();
    this.setState({
      error:false,
      loading:false,
    })
 
    fetch(`${this.state.main_url}api/counter`, {
    method: 'get',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },

  }).then(function(response) {
    return response.json();
  }).then((data) => { 
     console.log("data-length",data)
    if(data.error ==false){
      if(data.data.length == 0){
      
       this.setState({
        movieEmpty:true,
        loading:false
       })
       return
      }
      console.log("counter first",data.data)
      const movies = data.data.map(mov => {
        const movie = mov['movie-detail'];
        const timeDetail = mov['schedule-detail'];
        const seatDetails = mov['seat-detail'];
        const screens = mov['screen-detail'];
        return {  
          ...movie,
          time: `${timeDetail['show-date']} ${timeDetail['show-time']}`,
          showTime: `${timeDetail['show-time']}`,
          date: `${timeDetail['show-date']}`,
          title: movie['movie_name'] || 'Unknown',
          imageSource: movie.image,
        //   seats: seatDetails["Platinum"],
          screens
        }
    }) .filter(movie => {
      return moment(movie.time).format('YYYY-MM-DD') === this.state.startDate.format('YYYY-MM-DD')
    });
    let columns_ = movies[0].screens["number-of-columns"];
    let rows_ = movies[0].screens["number-of-rows"];
    const setInfo_ = movies[0].seats;
  
    let seats_ = this.formatSeats(rows_, columns_, setInfo_);
      
    console.log("counter 2nd",movies[0], movies)
//     this.bookeddata()
//    {this.holdDataTable()}
//    {this.banklist()}
//    {this.ComplimentaryTable()}
  this.socketmount()
  
      this.setState({
        data: data.data,
        selectedSeats:[],
        loading: false, 
        movies,
        movielength:data.data.length,
        // screen: movies[0].screens,
        selectedMovie:movies[0] ,
        seats: {
          seats: seats_,
          cols: columns_,
          rows: rows_
        }
      });
    }else{
      this.setState({
        newMessage:data.message
      })
      this.generate("danger");
    }
   
})
.catch(error => {
  console.log(error)
  
  })

  }


testcomponent=(movie)=>{
  console.log("moviessssssss",movie)
//   const socket = socketIOClient(this.state.endpoint);
this.setState({
  MyLoading:false,
})

 let seats = [...this.state.seats.seats];
 console.log("movie.screens",movie.screens["screen_id"],movie["movie_id"],movie["date"],movie["showTime"])
//  const dataToSend ={
//    screen_id: movie.screens["screen_id"],
//    movie_id: movie["movie_id"],
//    show_date: movie["date"],
//    show_time: movie["showTime"],
//    processed_by: 'counter',
//       user_id: this.state.id,
//    seat: this.state.selectedSeats.map(seat=> seat["seat-name"]).toString(),
//  }

  fetch(`${this.state.main_url}api/counter/single-movie-detail`, {
  method: 'POST',
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
    "api-token":this.state.key,
  },
  body: JSON.stringify({
    screen_id: movie.screens["screen_id"],
     movie_id: movie["movie_id"],
    show_date: movie["date"],
    show_time: movie["showTime"],
//    computer_name:this.state.pcname,
  }),
}).then(function(response) {
  console.log("chcking the response::::",response)
  return response.json();
}).then((data) => { 
    console.log("seat data",data)
 
//  socket.emit('release seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
  

    
  let columns_ = movie.screens["seat-categories"]["Platinum"]["number-of-columns"];
  
  let rows_ = movie.screens["seat-categories"]["Platinum"]["number-of-rows"];

  // let columns_gold = movie.screens["seat-categories"]["Gold"]["number-of-columns"];

  // let rows_gold = movie.screens["seat-categories"]["Gold"]["number-of-rows"];

  const setInfo_ = data.data["seat-info"];
  

  var size = Object.keys(movie.screens["seat-categories"]).length;
  

   
  let seats_ = this.formatSeats(rows_, columns_,setInfo_["Platinum"]);
  // let seats_gold = this.formatSeats(rows_gold,columns_gold,setInfo_["Gold"])
  


    this.setState({
      seats: {
        seats: seats_,
        cols: columns_,
        rows: rows_
      },
     newSeatData: data,
     size:size,
      MyLoading:true,
      sideBarSeat:setInfo_["Platinum"],
    })

  
  
  
})
.catch(error => {
  console.log("checking error:::=====",error)
  this.setState({
    loading: true,
    error: true
  })
})
console.log("test")


// {this.seatreleasesocket()}
}


  onMovieSelected = (movie) => { 
      console.log("movies selected",movie);
      // this.setState({
      //   selectedMovie: movie,
      //   MyLoading:false,
      //   welcomePage: 1
      // })

      
  //  console.log("movies selected", movie)
       
//   let columns_ = movie.screens["number-of-columns"];
//   let rows_ = movie.screens["number-of-rows"];
//   const setInfo_ = movie.seats;
  this.seatreleasesocket()
   
//   let seats_ = this.formatSeats(rows_, columns_, setInfo_);

      this.setState({
        selectedMovie: movie,
        MyLoading:false,
        welcomePage: 1,
        balconyStatus:"active",
        specialStatus:"inactive",
        cabinStatus:"inactive",
        seatCatagory:[],
        selectedSeats: [],
        toSellSeatsInfo: [
                          [],
                          [],
                          []
                         ],
        toSellSeats: [
                      [],
                      [],
                      []
                     ]
      });
      {this.testcomponent(movie)}
    // {this.counterData( )}
    
  }
  
seatreleasesocket=()=>{

 console.log("seatreleasesocket")
    const socket = socketIOClient(this.state.endpoint);
     let movie = this.state.selectedMovie;
    let seats = [...this.state.seats.seats];
    console.log("12345",this.state.selectedSeats)

    // let seat_op = seats[0][0]
    const dataToSend ={
      screen_id: movie.screens["screen_id"],
      movie_id: movie["movie_id"],
      show_date: movie["date"],
      show_time: movie["showTime"],
      category:this.state.hall,
      processed_by: 'counter',
      user_id: this.state.id,
      seat: this.state.selectedSeats.map(seat=> seat["seat-name"]).toString(),
    }     
     socket.emit('release seat', {room: 'seats updates', msg: JSON.stringify(dataToSend)});
     console.log("seatreleasesocket")
}






handlelogout=()=>{
  this.setState({
    isAuthenticated: false,
})
}
// BOOKIGN TO SELL===============================
bookingtosell=(row)=>{
  console.log("row================>", row.datatobook.category)
this.setState({
  loader:true,
})
 
  console.log("bookingtosell",row)
  fetch(`${this.state.main_url}api/counter/seats/book-to-sell`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
    body: JSON.stringify({
      booking_code: row.datatobook["booking_code"],
      payment_mode: row.cardtype || "cash" ,
      counter_id:this.state.id,
      computer_name:this.state.pcname,
      seats:[row.row.toString()],
      category:[row.datatobook.category]
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("data--here ata booking ", data)
  
  {this.bookeddata()}
    // {this.counterData()}
    this.setState({
      loader:false,
      ticketData:data.data,
      selectedSeats: [],
       loadingticket:false,
      newMessage:data.message
    })
    this.generate("success");
     this.onPrint();
   
}).catch(error => {
  console.log(error)
  this.setState({
    loading: false,
    error: true
  })
})
}
// BOOKIGN TO SELL=============================== 
// hold to sell==================================
holdtosell=(row)=>{
  console.log("hold to sell", row)
  this.setState({
    loader:true,
  })
  
  fetch(`${this.state.main_url}api/counter/seats/hold-to-sell`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
    body: JSON.stringify({
      hold_id:row.datatobook['hold_id'],
      payment_mode: row.cardtype || "cash" ,
      computer_name:this.state.pcname,
      counter_id:this.state.id,
      seats:[row.row.toString()],
      category:[row.datatobook.category]


    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    

    this.setState({
      ticketData:data.data,
      selectedSeats: [],
      loadingticket:false,
      loader:false,
      newMessage:data.message
    })

    
    this.generate("success");
     this.onPrint();
    {this.counterData()}
    {this.bookeddata()}
  {this.holdDataTable()}
  
 
}).catch(error => {
  console.log(error)
  this.setState({
    
    loading: false,
    error: true
  })
})
}

// hold to sell==================================


// hold to unhold

holdtoUnhold=(row)=>{
  console.log("checking row row row",row)
  
  fetch(`${this.state.main_url}api/counter/seats/hold-to-cancel`, {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Content-Type': 'application/json',
      "api-token":this.state.key,
    },
    body: JSON.stringify({
      hold_id:row['hold_id'],
      category:[row.category],
      computer_name:this.state.pcname,
    }),
  }).then(function(response) {
    return response.json();
  }).then((data) => { 
    console.log("checking the unhold data",data)

    this.setState({
      newMessage:data.message
    })
    this.generate("success");
    this.holdDataTable() 
    

}).catch(error => {
  console.log(error)
  this.setState({
    
    loading: false,
    error: true
  })
})
}


socketholdseat=(data)=>{
  if(this.state.isAuthenticated){
    if(data.screen_id == this.state.selectedMovie.screens["screen_id"] && 
    data.show_time == this.state.selectedMovie.showTime &&
    data.movie_id == this.state.selectedMovie["movie_id"]  &&
    data.show_date === this.state.selectedMovie.date
        ){
          if( data.processed_by != "counter" && data.status == "hold"){
          
             this.unavailableseats(data);
  
          }
          if( data.processed_by == "counter" && data.status == "hold" &&
          data.processed_by_id != this.state.id
        ){
             this.unavailableseats(data);
          }
  
        }
  
  }
    
  }
  


socketrelease=(data)=>{
  
  if(data.show_date === this.state.selectedMovie.date && 
    
    data.screen_id === this.state.selectedMovie.screens["screen_id"]  &&
    data.show_time === this.state.selectedMovie.showTime &&
    data.movie_id === this.state.selectedMovie["movie_id"]  
   
  ){
    this.releaseseat(data);
  }
}


socketsold=(data)=>{
  if(data.show_date === this.state.selectedMovie.date && 
  
    data.screen_id === this.state.selectedMovie.screens["screen_id"]  &&
    data.show_time === this.state.selectedMovie.showTime &&
    data.movie_id === this.state.selectedMovie["movie_id"] 
  
  ){
  
   this.soldseatssocket(data);
}
}

socketreserve=(data)=>{
  console.log("tesko ./...",data)
  if( data.show_date == this.state.selectedMovie.date && 
    data.show_time === this.state.selectedMovie.showTime &&
    data.movie_id === this.state.selectedMovie["movie_id"] 
  
  ){
    this.bookseatssocket(data);
  }else if(data.processed_by_id == this.state.id ){
    this.bookseatssocket(data);
  }
}

  socketcounterhold=(data)=>{
    if( data.processed_by_id == this.state.id &&
      data.show_date == this.state.selectedMovie.date && 
      data.screen_id === this.state.selectedMovie.screens["screen_id"]  &&
      data.show_time === this.state.selectedMovie.showTime &&
      data.movie_id === this.state.selectedMovie["movie_id"]  
      
      
    ){
      this.counterhold(data);
      
    }}
   
    socketcomplimentaryseat=(data)=>{
     
      if(data.show_date == this.state.selectedMovie.date && 
        data.screen_id === this.state.selectedMovie.screens["screen_id"]  &&
        data.show_time === this.state.selectedMovie.showTime &&
        data.movie_id === this.state.selectedMovie["movie_id"]  &&
        data.processed_by === "counter"
        
      ){
        this.complimentaryseat(data);
      }
    
}
// componentdidmount replaced by socketmount
 socketmount=()=>{  


//   ipcRenderer.send('async', 1);
//   ipcRenderer.on('async-reply', (event, arg) => {  
//     // Print 2
//     this.setState({
//       pcname:arg
//     })
//     console.log("--------------------------",arg,this.state.pcname);
//     // Send sync message to main process
   
// });



      const socket = socketIOClient(this.state.endpoint)
      socket.on('hold seat', (data) => {
       console.log("checking socket data",data)
          this.socketholdseat(data)
        // }
      
      })

      socket.on("release seat", (data) => {
        
      this.socketrelease(data);
      })


      socket.on("sold seat",(data)=>{

     
        this.socketsold(data)
      })

      socket.on("reserve seat",(data)=>{
        console.log("counter on sold  seat", data)
      this.socketreserve(data)
      })

      socket.on("counter hold seat",(data)=>{
      console.log("counter on hold seat", data)
        this.counterhold(data)
        })

        socket.on("complimentary seat",(data)=>{
          this.socketcomplimentaryseat(data)
          })

    
  }
componentWillMount(){
     this.setState({
    
     loadingticket: true,
    // id:data.data.id,
    // roles:data.data.roles,
    // key:data.data.api_key,
    // userName:data.data.name
  })
  console.log("mounted ")
  // {this.componentfirst()}
// this.newComponentRender();
}

  componentWillUnmount(){
    
    const socket = socketIOClient(this.state.endpoint)
    socket.removeListener('hold seat', (data) => {
      this.socketholdseat(data)
    })

    socket.removeListener("release seat", (data) => {
     this.socketrelease(data);
    })


    socket.removeListener("sold seat",(data)=>{
      this.socketsold(data)
    })

    socket.removeListener("reserve seat",(data)=>{
     this.socketreserve(data)
    })

    socket.removeListener("counter hold seat",(data)=>{
      this.counterhold(data)
      })
     
      socket.removeListener("complimentary seat",(data)=>{
        this.socketcomplimentaryseat(data)
        })

  }

toggleMenu = () => {
  this.setState({
      isToggleOn: !(this.state.isToggleOn),
      dateToggle: !(this.state.dateToggle)
    })
}


balcony=()=>{
    const {selectedMovie,newSeatData}=this.state
    console.log("12345",selectedMovie,"22",newSeatData)
    this.setState({
      hall: "Platinum"
    })

    // let seats = [...this.state.seats.seats];
    // console.log("special",selectedMovie)
    let columns_ = selectedMovie.screens["seat-categories"]["Platinum"]["number-of-columns"];
  
    let rows_ = selectedMovie.screens["seat-categories"]["Platinum"]["number-of-rows"];
    const setInfo_ = newSeatData.data["seat-info"];
    console.log("seats here at end",selectedMovie.screens["seat-categories"])
     
    let seats_ = this.formatSeats(rows_, columns_,setInfo_["Platinum"]);

    // for (var i = 0; i < seats.length; ++i) {
    //    for (var j = 0; j < seats[i].length; ++j) {
    //       if(seats[i][j]['seat-status'] === 'selected') {
    //         seats[i][j]['seat-status'] = 'available';
    //       }
    //    }
    // }

    this.setState({
        seats: {
          seats: seats_,
          cols: columns_,
          rows: rows_
        },
        balconyStatus:"active",
        specialStatus:"inactive",
        cabinStatus:"inactive",
        // selectedSeats:[],
        // seatCatagory:[],
        sideBarSeat:setInfo_["Platinum"],
        category_name:"Platinum",
      
      })

}

cabin=()=>{
    const {selectedMovie,newSeatData}=this.state

    // let seats = [...this.state.seats.seats];
    // let seat_op= seats[row][col];
    let columns_ = selectedMovie.screens["seat-categories"]["Cabin"]["number-of-columns"];
  
    let rows_ = selectedMovie.screens["seat-categories"]["Cabin"]["number-of-rows"];
    const setInfo_ = newSeatData.data["seat-info"];
    console.log('hera==================>>>>>>>>>>>>>>>', setInfo_);
    console.log("seats here at end",selectedMovie.screens["seat-categories"])
     
    let seats_ = this.formatSeats(rows_, columns_,setInfo_["Cabin"]);

    // console.log('test=====================>>>>>>>>>>>', seats_);

    // for (var i = 0; i < seats.length; ++i) {
    //    for (var j = 0; j < seats[i].length; ++j) {
    //       if(seats[i][j]['seat-status'] === 'selected') {
    //         seats[i][j]['seat-status'] = 'available';
    //       }
    //    }
    // }
    
    this.setState({
        seats: {
          seats: seats_,
          cols: columns_,
          rows: rows_
        },
        balconyStatus:"inactive",
        specialStatus:"inactive",
        cabinStatus:"active",
        category_name:"Cabin",
        // selectedSeats:[],
        // seatCatagory:[],
        sideBarSeat:setInfo_["Cabin"],
       
      })
    

}




special=()=>{
    const {selectedMovie,newSeatData}=this.state
    this.setState({
      hall:"Gold"
    })
    // console.log("special",selectedMovie)
    // let seats = [...this.state.seats.seats];
    let columns_ = selectedMovie.screens["seat-categories"]["Gold"]["number-of-columns"];
  
    let rows_ = selectedMovie.screens["seat-categories"]["Gold"]["number-of-rows"];
    const setInfo_ = newSeatData.data["seat-info"];
    console.log("seats here at end",selectedMovie.screens["seat-categories"])
     
    let seats_ = this.formatSeats(rows_, columns_,setInfo_["Gold"]);

    // for (var i = 0; i < seats.length; ++i) {
    //    for (var j = 0; j < seats[i].length; ++j) {
    //       if(seats[i][j]['seat-status'] === 'selected') {
    //         seats[i][j]['seat-status'] = 'available';
    //       }
    //    }
    // }

    this.setState({
        seats: {
          seats: seats_,
          cols: columns_,
          rows: rows_
        },
        balconyStatus:"inactive",
        specialStatus:"active",
        cabinStatus:"inactive",
        // selectedSeats:[],
        category_name:"Gold",
        // seatCatagory:[],
        sideBarSeat:setInfo_["Gold"],
       
      
      })
  
    // console.log("on balcony",this.state. category)
}

  render() {
    const { error } = this.state;
    if (error) {
      console.log("error",error)
      return <div className="errormain">
          <img src={errorbg} className="errorbg" />
          <button className=" btn-error-bg" onClick={this.counterData()}> Home </button>
      </div>
    }
    
    if(!this.state.isAuthenticated) {
      
      return (
       <Login    isAuthenticated={this.state.isAuthenticated} 
      onlogin={auth=> this.handleLogin(auth)}
      message={this.state.message}
       handleLogin={this.handleLogin}/>
      )
    }

    const { loading } = this.state;

    if (loading) {
      return <div className="loader"><div className="center-me"> <div className="lds-hourglass"></div></div></div>
    }
  
    const { data, movies, seats } = this.state;
    // const { startDate } = this.state;
    // console.log("movies", movies)
    
    let nestedSelectedSeats = seats.seats.map(seatRow => {
      return seatRow.filter(seat => seat['seat-status'] === 'selected')
    });
    
 
    let selectedSeats = [...flatten(nestedSelectedSeats)];
    // console.log("====screeen=====", screen)
    
  
    
  
  
    // let screen = movies[0].screens ;
    const { open } = this.state;
    const { openseat } = this.state;

    if (this.state.movieEmpty) {
        return(
          
                <PrintProvider>
                <Print exclusive >
           <Ticket ticketData={this.state.ticketData}
          user={this.state.user}
          loadingticket={this.state.loadingticket}/> 
          </Print >

          <NoPrint>
                <div className="App no-movie">


           <AlertList
                    position={this.state.position}  
                    alerts={this.state.alerts}
                    timeout={this.state.timeout}
                    dismissTitle="Begone!"
                    onDismiss={this.onAlertDismissed.bind(this)}
                  /> 
            {this.state.loader ? <Loaderscreen /> : '' } 

                  <div className="container-fluid">
                    <div className="row">
                    
                      <ActionSection 
                       movieEmpty={this.state.movieEmpty}
                    updateSeat={this.updateSeathere}
                    holddateSeathere={this.holddateSeathere}
                    cancellingSingleSeathold={this.cancellingSingleSeathold}
                     ComplimentaryTable={this.ComplimentaryTable}
                      cancellingSingleSeat={this.cancellingSingleSeathere}
                      cancellingSingleSeatComplimentary={this.cancellingSingleSeat}
                      banklist={this.state.banklist}
                      isToggleOn={this.state.isToggleOn}
                      toggleMenu={this.toggleMenu}
                      dateToggle={this.state.dateToggle}
                     userName= {this.state.userName}
                     welcomePage={this.props.welcomePage}
                      handlelogout={this.handlelogout}
                      refresh={this.refresh}
                      roles={this.state.roles}
                      complimentary={this.complimentary}
                      handleChangeDate ={this.handleChangeDate}
                      bookedclicked={this.bookedClicked}
                      bookingtosell={this.bookingtosell}
                      holdtosell={this.holdtosell}
                      holdtoUnhold={this.holdtoUnhold}
                      fields={this.state.fields}
                      tableData={this.state.tableData}
                      holdClicked={this.holdClicked}
                      holdtable={this.state.holdtable}
                      complimentarytable={this.state.complimentarytable}
                      selected={this.state.startDate}
                      />
                      



                      <Screen 
                      size={this.state.size}
                      welcomePage={this.state.welcomePage}
                      handleChangeDate ={this.handleChangeDate}
                      selected={this.state.startDate}
                      balconyStatus={this.state.balconyStatus}
                      specialStatus={this.state.specialStatus}
                      cabinStatus={this.state.cabinStatus}
                      balcony={this.balcony}
                      special={this.special}
                      cabin={this.cabin}
                      MyLoading={this.state.MyLoading}
                      newrows={this.state.rows}
                      newcolumns={this.state.columns}
                      movieEmpty={this.state.movieEmpty}
                      banklist={this.state.banklist}
                      seatDetails={this.seatDetails}
                      global={this.state.global}
                      toggleFullscreen={this.state.isFull}
                      isToggleOn={this.state.isToggleOn}
                      toggleMenu={this.toggleMenu}
                      seatSelected={this.seatSelected} 
                      selectedMovie={this.state.selectedMovie}
                      onRowSelect={this.onRowSelect}
                      selectSeat={this.selectSeat}
                      seats={this.state.seats.seats}
                      // rows={this.state.seats.rows}
                      // columns={this.state.seats.columns}
                      date={this.state.global_date}
                      mobile={this.state.global_mobile}
                      name={this.state.global_name}
                      email={this.state.global_email}
                      source={this.state.global_source}
                      data={this.state.data} />
                    </div>
                  </div>

                </div>


                </NoPrint>


          </PrintProvider>

        ); 
    }
  
    return (

      <PrintProvider>
      <Print exclusive >
 <Ticket ticketData={this.state.ticketData}
user={this.state.user}
loadingticket={this.state.loadingticket}/> 
</Print >

<NoPrint>
      <div className="App">


 <AlertList
					position={this.state.position}  
					alerts={this.state.alerts}
					timeout={this.state.timeout}
					dismissTitle="Begone!"
					onDismiss={this.onAlertDismissed.bind(this)}
				/> 
  {this.state.loader ? <Loaderscreen /> : '' } 

        <div className="container-fluid">
          <div className="row">
          
            <ActionSection 
             movieEmpty={this.state.movieEmpty}
          updateSeat={this.updateSeathere}
          holddateSeathere={this.holddateSeathere}
          cancellingSingleSeathold={this.cancellingSingleSeathold}
           ComplimentaryTable={this.ComplimentaryTable}
            cancellingSingleSeat={this.cancellingSingleSeathere}
            cancellingSingleSeatComplimentary={this.cancellingSingleSeat}
            banklist={this.state.banklist}
             userName= {this.state.userName}
           welcomePage={this.props.welcomePage}
            handlelogout={this.handlelogout}
            dateToggle={!this.state.dateToggle}
            isToggleOn={this.state.isToggleOn}
            toggleMenu={this.toggleMenu}
            refresh={this.refresh}
            roles={this.state.roles}
            complimentary={this.complimentary}
            handleChangeDate ={this.handleChangeDate}
            bookedclicked={this.bookedClicked}
            bookingtosell={this.bookingtosell}
            holdtosell={this.holdtosell}
            holdtoUnhold={this.holdtoUnhold}
            fields={this.state.fields}
            tableData={this.state.tableData}
            holdClicked={this.holdClicked}
            holdtable={this.state.holdtable}
            complimentarytable={this.state.complimentarytable}
            selected={this.state.startDate}
            />
            



            <Screen 
            size={this.state.size}
            welcomePage={this.state.welcomePage}
            handleChangeDate ={this.handleChangeDate}
            selected={this.state.startDate}
            balconyStatus={this.state.balconyStatus}
            specialStatus={this.state.specialStatus}
            cabinStatus={this.state.cabinStatus}
            balcony={this.balcony}
            special={this.special}
            cabin={this.cabin}
            MyLoading={this.state.MyLoading}
            newrows={this.state.rows}
            newcolumns={this.state.columns}
            movieEmpty={this.state.movieEmpty}
            banklist={this.state.banklist}
            seatDetails={this.seatDetails}
            global={this.state.global}
            toggleFullscreen={this.state.isFull}
            isToggleOn={this.state.isToggleOn}
            toggleMenu={this.toggleMenu}
            seatSelected={this.seatSelected} 
            selectedMovie={this.state.selectedMovie}
            onRowSelect={this.onRowSelect}
            selectSeat={this.selectSeat}
            seats={this.state.seats.seats}
            // rows={this.state.seats.rows}
            // columns={this.state.seats.columns}
            date={this.state.global_date}
            mobile={this.state.global_mobile}
            name={this.state.global_name}
            email={this.state.global_email}
            source={this.state.global_source}
            data={this.state.data} />


            <SideBar 
              seats={this.state.sideBarSeat}
             movieEmpty={this.state.movieEmpty}
            banklist={this.state.banklist}
              roles={this.state.roles}
            Sellfields={this.state.Sellfields}
            fields={this.state.fields}
            count={this.state.count}
            selectedSeat={this.state.selectedSeats}
            toSellSeatsInfo={this.state.toSellSeatsInfo}
            bookedSeat={this.state.bookedSeat}
            holdSeat={this.state.holdSeat}
            selectedMovie={this.state.selectedMovie}
            soldClicked={this.soldClicked}
            seatCatagory={this.state.seatCatagory}
            totalprice={this.state.totalprice}
            />
          </div>
        </div>
        <Movies movies={movies} onClick={this.onMovieSelected}/>

      </div>

      <Modal
          open={open}
          onClose={this.onCloseModal}
          center
          classNames={{ overlay: 'custom-overlay', modal: 'custom-modal' }}
        >
        <h1 className="booking-h">Booking Code  : <span className="booking-code">  {this.state.newMessage} </span></h1>
      </Modal>


      <Modal
          open={openseat}
          onClose={this.onSeatModalClose}
        >

          <SingleSeatDetails
          category={this.state.category_name}
          bookingtosell={fields => this.booktosell(fields)}
          roles={this.state.roles}
          holdtosell={fields => this.holdsell(fields)}
          seatclose={this.onSeatModalClose}
          onupdateseat={fields => this.updateSeat(fields)}
          onSubmit={fields => this.cancellingSingleSeat(fields)}
          seatCatagorycancle={this.state.seatCatagorycancle}
          globaldata={this.state.globaldata}
          singleseatdetails={this.state.singleseatdetails}
          banklist={this.state.banklist}

          />
      </Modal>


      </NoPrint>


</PrintProvider>
    );
  }
}

const Loaderscreen =( ) =>{
  return(<div className="loader"><div className="center-me"> <div className="lds-hourglass"></div></div></div>)
}
const Movies = ({ movies, onClick, movieEmpty }) => {
  console.log(movieEmpty)
  if(movieEmpty){
    return(
      <div className="container-fluid movies-section">
      <div className="col=sm=12">
        <div className="movie_list nomovies">
        <h2>No Movies Available on this Date</h2>
        </div>
      </div>
    </div>
    ) 
  }
  
  let movielength = movies.length > 5 ? 5 : movies.length ;
   
  var settings = {
    // dots: true,
    // infinite: true,
    speed: 500,
    slidesToShow: movielength,
    slidesToScroll: 3
  }
  const moviesView = movies.map((movie, index) => {
    // {console.log("moviehere i got",movie.screens["screen_name"])}
    return (
     
   
        <div className="movie-box" onClick={() => onClick(movie)} key={index}>
          <h1>{movie.showTime}</h1>
          <h1>{movie.screens["screen_name"]}</h1>
          <div>
          
            <Thumbnail src={movie.imageSource} alt="img"  />
          </div>
          <h1>{movie.title}</h1>
        </div>
    );
  });

  return (
    <div className="container-fluid movies-section  ">
      <div className="col=sm=12">
        <div className="movie_list">
        <Slider {...settings}>
         {moviesView}
          </Slider>
        </div>
      </div>
    </div>
  );
};


export default App;