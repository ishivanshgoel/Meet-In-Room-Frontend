const names = {
    usertoken : 'teams-user-token',
    email: 'teams-user-email',
    uid: 'teams-user-id'
}


let getItem = (name)=>{
    let item = localStorage.getItem(names[name])
    return item
}

let setItem = (name, value)=>{
    localStorage.setItem(names[name], value)
}

let removeItem = (name, value)=>{
    localStorage.removeItem(names[name], value)
}

export default {}
export { setItem, getItem, removeItem }