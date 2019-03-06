import React from 'react';
import { connect } from 'react-redux'
import PlacesAutocomplete, {geocodeByAddress, getLatLng} from 'react-places-autocomplete';
import './address-form.scss'
import { showAnimation } from '../../actions/navigation';
import { fetchAddressSuccess } from '../../actions/geolocation';
import { setUserCoords } from '../../actions/users';

class AddressForm extends React.Component {
  constructor(props) {
    super(props);
    this.state = { address: '' };
  }
 
  handleChange = address => {
    this.setState({ address });
  };

  componentDidMount(){
    document.title='DownTheBlock'
    this.props.dispatch(showAnimation(false));
  };
 
  handleSelect = address => {
    this.setState({ address });
    geocodeByAddress(address)
      .then(results => getLatLng(results[0]))
      .then(googleCoords => {
          let coords = {
            latitude: googleCoords.lat,
            longitude: googleCoords.lng,
            automatic: false
        };
        this.props.dispatch(showAnimation(false));
        this.props.dispatch(fetchAddressSuccess(coords));
        this.props.dispatch(setUserCoords(coords));
      })
      .catch(error => {
        //add error handling
      });
  };
 
  render() {
    return (
      <div className="addressDiv">
        <section className="parallax"></section>
        <section className="intro">
          <section className="address-container">
          <h1>Find Your Neighborhood</h1>
          <p className="text">Your browser hasn't allowed DownTheBlock permission to your location. However, to be placed in the correct neighborhood, DownTheBlock needs access to your location. Please either change the settings in your browser and refresh, or manually input your address below.</p>
          <PlacesAutocomplete
            value={this.state.address}
            onChange={this.handleChange}
            onSelect={this.handleSelect}
          >
            {({ getInputProps, suggestions, getSuggestionItemProps }) => (
              
                  <section className="address-form">
                    <input
                      {...getInputProps({
                        placeholder: 'Enter your address here...',
                        className: 'location-search-input',
                      })}
                    />
                    <div className="autocomplete-dropdown-container">
                      {suggestions.map(suggestion => {
                        const className = 'suggestion-item';
                        //   const style = suggestion.active
                        //   ? { backgroundColor: '#06311f', color: 'rgb(237, 236, 217)', cursor: 'pointer' }
                        //   : { backgroundColor: 'white', cursor: 'pointer' };
                        return (
                          <div
                            {...getSuggestionItemProps(suggestion, {
                              className,
                              // style
                            })}
                          >
                            <span>{suggestion.description}</span>
                          </div>
                        );
                      })}
                    </div>
                    </section>
            )}
          </PlacesAutocomplete>
        </section>
        </section>
      </div>
    );
  }
}

export default connect()(AddressForm);