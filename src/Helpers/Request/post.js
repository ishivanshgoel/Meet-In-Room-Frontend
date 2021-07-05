import axios from 'axios'

import BASEURL from '../../Configuration/baseurl'

const endPoints = {

    login: '/auth/login',
    register: '/auth/register',
    calloffer: '/call/calloffer',
    myrooms: '/call/myrooms',
    createroom:'/call/createroom',
    addinroom: '/call/addinroom',
    assignedwork: '/work/assignedwork',
    mywork: '/work/mywork',
    updatestatus: '/work/updatestatus',
    assign: '/work/assign',
    allMessages: '/chat/getall',
    sendMessage: '/chat/sendMessage'

}

function urlBuilder(endPoint, id = null) {
    return id ?
        BASEURL + endPoints[endPoint] + "/" + id
        : BASEURL + endPoints[endPoint]
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
        // to handle errors other than sent from server
        // error from server are being send in thr form of json
        console.log(err)
        if (err.message) {
            return err.message
        } else return 'Something went wrong'
    });

}

export default post