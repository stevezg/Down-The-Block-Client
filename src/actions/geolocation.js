import {
    FETCH_LOCATION_SUCCESS,
    FETCH_LOCATION_ERROR,
    FETCH_ADDRESS_REQUEST,
    FETCH_ADDRESS_SUCCESS,
    FETCH_ADDRESS_ERROR
} from './types';

// import {GOOGLE_MAPS_API_KEY} from '../config';
import { normalizeResponseErrors } from './utils';

export const fetchLocationSuccess = coords => ({
    type: FETCH_LOCATION_SUCCESS,
    coords
});

export const fetchLocationError = () => ({
    type: FETCH_LOCATION_ERROR
});

export const fetchAddressRequest = () => ({
    type: FETCH_ADDRESS_REQUEST
});

export const fetchAddressSuccess = coords => ({
    type: FETCH_ADDRESS_SUCCESS,
    coords
});

export const fetchAddressError = err => ({
    type: FETCH_ADDRESS_ERROR, 
    err
});

export const fetchAddress = (address) => (dispatch) => {
    dispatch(fetchAddressRequest());
    let stringifiedAddress = Object.values(address).map(word => word.replace(/\s/g, '+')).join('+');
    console.log(stringifiedAddress);
    // console.log(process.env.REACT_APP_GOOGLE_API_KEY);
    // const googleAPIKey = `${process.env.REACT_APP_GOOGLE_API_KEY}`;
    // console.log(googleAPIKey);
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${stringifiedAddress}&key=${process.env.REACT_APP_GOOGLE_API_KEY}`;
    console.log(url);
    fetch(url)
        .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        .then(response => {
            let googleCoords = response.results[0].geometry.location;
            let coords = {
                latitude: googleCoords.lat,
                longitude: googleCoords.lng
            };
            dispatch(fetchAddressSuccess(coords));
        })
        .catch(error => {
            dispatch(fetchAddressError(error))
        });
};