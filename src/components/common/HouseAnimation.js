import React from 'react';
import './houseanimation.css'

export default class HouseAnimation extends React.Component{
  constructor(props){
    super(props)

    this.state={
      housesRight:[],
      housesLeft:[],
      houseIcon: <i style={styles.houseIcon} className="fas fa-home"></i>
    }
  }
  
  componentDidMount(){
    this.tick = setInterval(()=>
      this.setState(
        {housesLeft:[this.state.houseIcon, ...this.state.housesRight], 
        housesRight:[...this.state.housesLeft, this.state.houseIcon]}), 400)
  }

  componentWillUnmount(){
    clearInterval(this.tick);
  }

  render(){
    return( 
        <section style={styles.houses} className="houses">
          <div style={styles.houseDivRight} className="houses-right">
            {this.state.housesRight}
          </div>
          <h1 style={styles.heading}>Down The Block</h1> 
          
          <div style={styles.houseDivLeft} className="houses-right">
            {this.state.housesLeft}
          </div>
        </section>
    );
  }
}

const styles = {
  houses: {
    paddingTop: 200,
    fontSize:100,
    height: '100vh',
    background: 'rgb(237, 236, 217)'
  },
  houseIcon: {
    color: '#06311f',
    padding: 20, 
  },
  heading: {
    fontSize: 80,
    color: '#06311f',
    textAlign: 'center',
    fontFamily: 'Play',
    padding: 20
  },
  road: {
    fontSize: 80,
    color: '#06311f',
    textAlign: 'center',
    display: 'inline',
  },
  houseDivLeft: {
    overflow: 'hidden',
    maxHeight: 150,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  houseDivRight: {
    overflow: 'hidden',
    height: 150,
    display: 'flex',
    justifyContent: 'flex-end',
  }
}