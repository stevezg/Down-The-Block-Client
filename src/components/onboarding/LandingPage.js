import React from 'react';
import {connect} from 'react-redux';
import {Redirect} from 'react-router-dom';
import LogInForm from './LogInForm';
import SignUpForm from './SignUpForm';
import About from '../common/About';
import './onboarding.scss';

export class LandingPage extends React.Component {
    componentDidMount(){
        document.title= 'DownTheBlock'
    }
    
    render(){
    // If we are logged in redirect straight to the user's home
    if (this.props.loggedIn) {
        return <Redirect to="/home" />;
    }

    return (
        <main className="landing-page">
            <section className="parallax">
            </section>
            <section className="intro">
                <h1>Discover What's Going On In Your Neighborhood</h1>
                <section className="form-section">
                    {this.props.display==="loginUsername" ? <LogInForm /> : this.props.display==="registerUsername" ? <SignUpForm /> : <LogInForm /> }
                </section>
                <About/> 
            </section>
        </main>
    );
    }
}

const mapStateToProps = state => ({
    loggedIn: state.auth.currentUser !== null,
    display: state.nav.display,
});

export default connect(mapStateToProps)(LandingPage);