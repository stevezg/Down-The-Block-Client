import React from 'react';
import uuidv4 from 'uuid/v4';
import './houseanimation.css'

export default class HouseAnimation extends React.Component{
  constructor(props){
    super(props)

    this.state={
      housesRight:[],
      housesLeft:[],
    }
  }
  
  componentDidMount(){
    this.tick = setInterval(()=>
      this.setState(
        {housesLeft:[<i key={uuidv4()} style={styles.houseIcon} className="fas fa-home"></i>, ...this.state.housesRight], 
        housesRight:[...this.state.housesLeft, <i key={uuidv4()} style={styles.houseIcon} className="fas fa-home"></i>]}), 600)
  }

  componentWillUnmount(){
    clearInterval(this.tick);
  }

  render(){
    return(
      <main style={styles.mainContainer}>
        <section style={styles.houses} className="houses">
          <div style={styles.houseDivRight} className="houses-right">
            {this.state.housesRight}
          </div>
          <h1 style={styles.heading}>Down The Block</h1> 
          
          <div style={styles.houseDivLeft} className="houses-right">
            {this.state.housesLeft}
          </div>
        </section>
      </main> 
    );
  }
}

const styles = {
  mainContainer: {
    display: 'flex',
    height: '100vh',
    background: 'rgb(237, 236, 217)'
  },
  houses: {
    background: 'rgb(237, 236, 217)'
  },
  houseIcon: {
    color: '#06311f',
    padding: 20, 
  },
  heading: {
    color: '#06311f',
    textAlign: 'center',
    fontFamily: 'Play',
    padding: 20
  },
  houseDivLeft: {
    overflow: 'hidden',
    maxHeight: 150,
    display: 'flex',
    justifyContent: 'flex-start',
  },
  houseDivRight: {
    overflow: 'hidden',
    maxHeight: 150,
    display: 'flex',
    justifyContent: 'flex-end',
  }
}