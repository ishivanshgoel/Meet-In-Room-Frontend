// Area:
console.log("Join Meet 2 Script")
function Area(Increment, Count, Width, Height, Margin = 10) {
    let i = 0
    let w = 0;
    let h = Increment * 0.75 + (Margin * 2);
    while (i < (Count)) {
        if ((w + Increment) > Width) {
            w = 0;
            h = h + (Increment * 0.75) + (Margin * 2);
        }
        w = w + Increment + (Margin * 2);
        i++;
    }
    if (h > Height) return false;
    else return Increment;
}

// Dish:
function Dish() {
    // variables:
    try {
        let Margin = 2;
        let Scenary = document.getElementById('Dish');
        let Width = Scenary.offsetWidth - (Margin * 2);
        let Height = Scenary.offsetHeight - (Margin * 2);
        let Cameras = document.getElementsByClassName('Camera');
        let max = 0;

        // loop (i recommend you optimize this)
        let i = 1;
        while (i < 5000) {
            let w = Area(i, Cameras.length, Width, Height, Margin);
            if (w === false) {
                max = i - 1;
                break;
            }
            i++;
        }

        // set styles
        max = max - (Margin * 2);
        setWidth(max, Margin);
    } catch (err) {
        console.log(err)
    }

}

// Set Width and Margin 
function setWidth(width, margin) {
    let Cameras = document.getElementsByClassName('Camera');
    for (var s = 0; s < Cameras.length; s++) {
        Cameras[s].style.width = width + "px";
        Cameras[s].style.margin = margin + "px";
        Cameras[s].style.height = (width * 0.75) + "px";
    }
}

// add more
function add(videoStream, userId, userEmail) {
    console.log('Add called')
    console.log("UserId ", userId)
    console.log("UserEmail ", userEmail)
    let Scenary = document.getElementById('Dish');
    let Camera = document.createElement('video');
    Camera.className = 'Camera';
    Camera.setAttribute('id', userId)
    Camera.srcObject = videoStream
    Camera.addEventListener('loadedmetadata', () => {
        Camera.play()
    })
    Scenary.appendChild(Camera);
    Dish();
}

// remove
function less(userId) {
    let removeCamera = document.getElementById(userId)
    removeCamera.parentNode.removeChild(removeCamera)
    Dish();
}

// Load and Resize Event
window.addEventListener("load", function (event) {
    Dish();
    window.onresize = Dish;
}, false);

export default {}
export { add, less }