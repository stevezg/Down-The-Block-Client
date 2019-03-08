import React from 'react';
import {connect} from 'react-redux';
import mockup from '../../img/mockup.png';
import { display, focusOn } from '../../actions/navigation'
import './about.scss';

export class About extends React.Component{
  componentDidMount(){
    document.title='DownTheBlock'
  }

  onClick(focus=""){
    this.props.dispatch(display(focus));
    this.props.dispatch(focusOn(focus));
  }

  render(){
    return(
      <React.Fragment>
        <section className="about">
          <article className="text">
            <h2>Your Neighborhood At Your Fingertips</h2>
            <p>
            DownTheBlock connects you with your neighborhood and provides a convenient way of staying informed. Whether you lost your pet, are throwing an event, or want to be aware of the latest criminal activity around you, DownTheBlock is here to help. Join today to stay up-to-date on everything happening close to home as well as in the broader community!
            </p>
            {!this.props.loggedIn && <button
              type="button"
              className="join-today"
              onClick={()=>this.onClick('registerUsername')} 
            > Join Your Neighborhood</button>}
          </article>
          <img className="mockup" src={mockup} alt="mockup"/>
        </section>
        <section className="about-icons">
          <div className="icon-holder">
            <i className="fas fa-map-marker-alt"></i>
            <p>Easy Access To Your Community Based On Your Geolocation</p>
          </div>
          <div className="icon-holder">
            <i className="fas fa-edit"></i>
            <p>Post In Forums To Help Keep Your Neighborhood In The Loop</p>
          </div>
          <div className="icon-holder">
            <i className="fas fa-search"></i>
            <p>Easily Search And Filter Forums To Find What You're Interested In</p>
          </div>
          <div className="icon-holder">
            <i className="fas fa-comments"></i>
            <p>Directly Message Your Neighbors For A More Personal Experience</p>
          </div>
          
        </section>
      </React.Fragment>
    );
  }
}

const mapStateToProps = state => ({
  loggedIn: state.auth.currentUser !== null,
});

export default connect(mapStateToProps)(About);