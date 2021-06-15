import axios from 'axios'

import BASEURL from '../../Configuration/baseurl'

const endPoints = {

}

function urlBuilder(endPoint, id = null) {
    if (id != null) {
        return BASEURL + endPoints[endPoint] + "/" + id
    }
    else return BASEURL + endPoints[endPoint]
}

// by default id is null, passin as the second argument if the field is required
async function post(endPoint, data, id = null) {

    // let token = getItem('token') // make a function to retrieve token from local storage
    let token = 'dummy'

    //pass the token in headers of request 
    return axios.post(urlBuilder(endPoint, id), data, {
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' }
    }).then((response) => {
        return response
    }).catch((err) => {
        if(err.response && err.response.data && err.response.error) return err.response.data.error.message
        return "Error Occured"
    });

}

export default post