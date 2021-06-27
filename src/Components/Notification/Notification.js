import { store } from 'react-notifications-component'

function Notification(title, message, type) {
    store.addNotification({
        title: title,
        message: message,
        type: type,
        insert: "bottom",
        container: "bottom-center",
        animationIn: ["animate__animated", "animate__fadeIn"],
        animationOut: ["animate__animated", "animate__fadeOut"],
        dismiss: {
          duration: 5000,
          onScreen: true
        }
      });
}

export default Notification