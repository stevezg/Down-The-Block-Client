import React from 'react';
import {connect} from 'react-redux';
import { focusOn, display } from '../../actions/navigation';
import { HashLink as Link } from 'react-router-hash-link';
import './navbar.scss'

export class Navbar extends React.Component{
  onClick(focus=""){
    this.props.dispatch(display(focus));
    this.props.dispatch(focusOn(focus));
  }

  navbarLinks(){

    if(!this.props.loggedIn){
      return (
        <div className = "right">
          <button 
            className="link"
            onClick={()=>this.onClick('loginUsername')} 
            >
            Login
          </button>
          <button 
            className="link"
            onClick={()=>this.onClick('registerUsername')} 
            >
            Register
          </button>
        </div>
      )
    }
  }

  render(){  
    let className= !this.props.loggedIn ? "landing-page-logo" : "logo";
    return( 
      <nav className="main-navbar">
        <Link className={`${className}`} 
          onClick={()=> this.props.loggedIn && this.props.dispatch(display(this.props.display))}
          to="/#app">
          <i className="fas fa-home"></i> DownTheBlock
        </Link>
        <p className="tagline">Knock Knock, It's Your Neighborhood</p>
        {this.navbarLinks()}
      </nav>
    );
  }
}

const mapStateToProps = (state) => ({
  loggedIn: state.auth.currentUser !== null,
  display: state.nav.display,
});

export default connect(mapStateToProps)(Navbar);