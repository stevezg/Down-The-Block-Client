import React from 'react';
import {connect} from 'react-redux';
import {Route, withRouter} from 'react-router-dom';
import LandingPage from './components/onboarding/LandingPage';
import HomePage from './components/home/HomePage';
import {refreshAuthToken} from './actions/auth';
import Navbar from './components/common/Navbar';
import { postBeingEdited } from './actions/posts';
import { commentBeingEdited } from './actions/comments';
import { showAnimation } from './actions/navigation';
import HouseAnimation from './components/common/HouseAnimation';

export class App extends React.Component {

    componentWillMount() {
        if(!this.props.loggedIn){
            this.props.dispatch(showAnimation(true))
            //show animation for 2 seconds
            setTimeout(
                function() {
                  this.props.dispatch(showAnimation(false));
                }
                .bind(this),
                3000
            );     
        }
        document.addEventListener("keydown", this.onKeyPressed.bind(this));
    }

    componentDidUpdate(prevProps) {
        if (!prevProps.loggedIn && this.props.loggedIn) {
            // When we are logged in, refresh the auth token periodically
            this.startPeriodicRefresh();
        } else if (prevProps.loggedIn && !this.props.loggedIn) {
            // Stop refreshing when we log out
            this.stopPeriodicRefresh();
        }
    }

    componentWillUnmount() {
        this.stopPeriodicRefresh();
        document.removeEventListener("keydown", this.onKeyPressed.bind(this));
    }

    startPeriodicRefresh() {
        this.refreshInterval = setInterval(
            () => this.props.dispatch(refreshAuthToken()),
            60 * 60 * 1000 // One hour
        );
    }

    stopPeriodicRefresh() {
        if (!this.refreshInterval) {
            return;
        }

        clearInterval(this.refreshInterval);
    }

    onKeyPressed(e){
        if (e.keyCode===27){
            //cancel comment and post 
            this.props.dispatch(commentBeingEdited(null))
            this.props.dispatch(postBeingEdited(null));
        }
    }


    render() {   
        if(this.props.showAnimation){
            return <HouseAnimation/>
        }

        return (
            <div 
                tabIndex={0}
                id="app" 
                className="app" 
                onKeyPress={this.onKeyPressed} 
                >
                {/* Always show the navbar! */}
                <Route path="/" component={Navbar} />
                <Route exact path="/" component={LandingPage} />
                <Route exact path="/home" component={HomePage}></Route>
            </div>
        );
    }
}

const mapStateToProps = state => ({
    hasAuthToken: state.auth.authToken !== null,
    loggedIn: state.auth.currentUser !== null,
    coords: state.geolocation.coords,
    showAnimation: state.nav.showAnimation,
});

export default withRouter(connect(mapStateToProps)(App));