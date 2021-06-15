import axios from 'axios'

import BASEURL from '../../Configuration/baseurl'

// endpoints in server api
// just make changes here if any of the endpoint url changes on server side
const endPoints = {
    

}


var urlBuilder = (endPoint, id = null) => {

    return id ?
        BASEURL + endPoints[endPoint] + "/" + id
        : BASEURL + endPoints[endPoint]

}

// by default id is null, passin as the second argument if the field is required
async function get(endPoint, id = null) {

    // let token = getItem('token') // make a function to retrieve token from local storage
    let token = 'dummy'

    //pass the token in headers of request 
    return axios.get(urlBuilder(endPoint, id), {
        headers: { 'Authorization': token ? `Bearer ${token}` : '', 'Content-Type': 'application/json' }
        }).then((response) => {
            return response
        }).catch((err) => {
        // to handle errors other than sent from server
        if (err.message) {
            return err.message
        } else return 'Something went wrong'
    })

}

export default get