// to filter connected devices
console.log('External script connected')

async function getConnectedDevices(type) {
    const devices = await navigator.mediaDevices.enumerateDevices()
    return devices.filter(device => device.kind == type)
}

// get all input audio devices
async function getAllInputAudio() {
    let outputDevices = getConnectedDevices('audioinput')
    return outputDevices
}

// get all output audio devices
function getAllOutputAudio() {
    let outputDevices = getConnectedDevices('audiooutput')
    return outputDevices
}


// get all cameras
function getAllCameras() {
    let cameras = getConnectedDevices('videoinput')
    return cameras
}

export default {}
export { getAllInputAudio, getAllOutputAudio, getAllCameras }