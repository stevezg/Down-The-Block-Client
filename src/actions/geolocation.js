import {
    FETCH_LOCATION_SUCCESS,
    FETCH_LOCATION_ERROR,
    FETCH_ADDRESS_REQUEST,
    FETCH_ADDRESS_SUCCESS,
    FETCH_ADDRESS_ERROR
} from './types';

import {GOOGLE_MAPS_API_KEY} from '../config';
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
})

export const fetchAddress = (address) => (dispatch) => {
    dispatch(fetchAddressRequest());
    // console.log(address);
    // console.log(Object.values(address));
    let stringifiedAddress = Object.values(address).map(word => word.replace(/\s/g, '+')).join('+');
    // console.log(addressArray);
    
    // .join('+');
    console.log(stringifiedAddress);
    let url = `https://maps.googleapis.com/maps/api/geocode/json?address=${stringifiedAddress}&key=${GOOGLE_MAPS_API_KEY}`;
    console.log(url);
    fetch(url)
    // fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=1600+Amphitheatre+Parkway,
    // +Mountain+View,+CA&key=${GOOGLE_MAPS_API_KEY}`)
        // .then(res => normalizeResponseErrors(res))
        .then(res => res.json())
        // .then(res => console.log(res))
        .then(response => {
            console.log('the results are', response.results)
            let googleCoords = response.results[0].geometry.location;
            // console.log(googleCoords);
            let coords = {
                latitude: googleCoords.lat,
                longitude: googleCoords.lng
            };
            // console.log(coordsObject);
            dispatch(fetchAddressSuccess(coords));
        })
        .catch(error => {
            dispatch(fetchAddressError(error))
        });
};