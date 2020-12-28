import React, { Component } from 'react';
import {BrowserRouter as Router,Link,Route,Switch,
  } from 'react-router-dom';
import {logo}  from  '../../utils';
import cross  from  '../img/cross.png';
import Welcome from './Welcome';
import BookModal from './bookmodal';
import Modalhold from './modalhold';
import Tablemodal from './tablemodal';
import Holdmodal from './holdmodal';
import Complimentary from './complimentary';
import Complimentarymodal from './Complimentarymodal';
import classNames from 'classnames';


export default class ActionSection extends Component {
    constructor(props) {
        super(props);

        this.logout = this.logout.bind(this);
        this.refresh = this.refresh.bind(this);
    }
     
logout( ){
        this.props.handlelogout();
    }
    refresh( ){
        this.props.refresh();
    }
     
  
    include =(arr, obj) => {
        for(var i=0; i<arr.length; i++) {
            if (arr[i] == obj) return true;
        }
    } 
    render() {
        // let sellroles=this.props.roles.split(',')

    
        return (
            <div
            className={classNames({
              'col-sm-2 menu displayNone': (this.props.isToggleOn && this.props.dateToggle),
              'col-sm-2 menu': (!(this.props.isToggleOn && this.props.dateToggle)),
              'no-movie': (this.props.movieEmpty)
            })}
           >
                <div className="cross">
                  <div className="img-wrap" onClick={this.props.toggleMenu}>
                    <img src={cross} alt="Cancel"/>
                  </div>
                </div>
                <div className="logo">
                  <img src={logo} className="logo" alt="logo" />
                </div>
                <div className="user"> 
                    <Welcome 
                    welcomePage={this.props.welcomePage}
                   userName= {this.props.userName}
                    handleChangeDate={this.props.handleChangeDate}
                    selected={this.props.selected}
                    />
                 <hr/>
            <section className="action-menu">
                <ul>
          
         


                
                    <li onClick={this.refresh}><i className="fa fa-refresh" aria-hidden="true"></i>  Refresh</li>
            
                    <span className={ this.include(this.props.roles.split(","), "reserve") ?  " " :"displayNone"}> 
                    <li><BookModal 
                      
                    onSubmit={fields => this.props.bookedclicked(fields)} /></li>
            </span>
            <span
                  className={ this.include(this.props.roles.split(","), "sell") ?  " " :"displayNone"}
                > 
                    <li>
                        <Tablemodal
                         updateSeat={this.props.updateSeat}
                         cancellingSingleSeat={this.props.cancellingSingleSeat}
                        banklist={this.props.banklist}
                        bookingtosell={this.props.bookingtosell}
                         tableData={this.props.tableData} />
                        </li>
                        </span>
                        <span
                  className={ this.include(this.props.roles.split(","), "hold") ? " " :"displayNone"  }
                > 
               
                        <li><Modalhold
                    onSubmit={fields => this.props.holdClicked(fields)} 
                    banklist={this.props.banklist}
                    /></li>
                            </span>



                <span
                  className={ this.include(this.props.roles.split(","), "sell") ?  " " :"displayNone"}
                > 
                   <li><Holdmodal
                   
                    updateSeat={this.props.holddateSeathere}
                    cancellingSingleSeat={this.props.cancellingSingleSeathold}
                   banklist={this.props.banklist} 
                   holdtosell={this.props.holdtosell}
                   holdtoUnhold={this.props.holdtoUnhold}
                   holdtable={this.props.holdtable}/>
                        </li>
                       </span>

                {/* <span
                
                  className={ this.include(this.props.roles.split(","), "complementary") ?  " " :"displayNone"}
                >  */}
                             <li><Complimentary
                    onSubmit={fields => this.props.complimentary(fields)} 
                    /></li>
                {/* </span> */}


                    {/* <li onClick={()=>{this.props.holdClicked()}} >  <i className="fa fa-lock" aria-hidden="true"></i> Hold</li> */}
                    
                

                   {/* <span
                  className={ this.include(this.props.roles.split(","), "complementary" ) ?  " " :"displayNone"}
                >  */}
                   <li><Complimentarymodal
                  
                   banklist={this.props.banklist} 
                  
                   cancellingSingleSeat={this.props.cancellingSingleSeatComplimentary}
                   holdtoUnhold={this.props.holdtoUnhold}
                   complimentarytable={this.props.complimentarytable}/>
                        </li>
                       {/* </span>     */}
                       
                    <li onClick={this.logout}  ><i className="fa fa-power-off" aria-hidden="true" ></i>   Logout</li>
                    </ul>
            </section>

</div>
   </div>
        )
    }
}
