import React from 'react';
import { connect } from 'react-redux'
import SidebarNav from './SidebarNav';
import Main from './Main';
import Geolocator from '../common/Geolocator';
import AddressForm from './AddressForm';
import requiresLogin from '../common/requires-login';
import { showAnimation } from '../../actions/navigation';

export class HomePage extends React.Component{

  componentWillMount(){
    document.title = 'Home';
    this.props.socket.emit('USER_CONNECTED', this.props.user);
  }

  componentWillUnmount(){
    this.props.dispatch(showAnimation(false));
  }
  
  render(){
    return(
      <div id="home" className="home">
        <Geolocator/>
        {this.props.coords && 
        <SidebarNav />}
        {this.props.coords && <Main/>}
        {this.props.geoError && !this.props.coords && <AddressForm />}
      </div>
    );
  }
}

const mapStateToProps = state => ({
  coords: state.geolocation.coords,
  geoError: state.geolocation.error,
  showAnimation: state.nav.showAnimation,
  user: state.auth.currentUser,
  socket:state.socket.socket,
  display: state.nav.display 
});

export default requiresLogin()(connect(mapStateToProps)(HomePage));