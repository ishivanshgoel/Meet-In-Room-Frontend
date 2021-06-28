import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useHistory } from 'react-router'
import IconButton from '@material-ui/core/IconButton'
import Menu from '@material-ui/core/Menu'
import MenuItem from '@material-ui/core/MenuItem'
import Person from '@material-ui/icons/Person'
import ExitToApp from '@material-ui/icons/ExitToApp'
import Avatar from 'react-avatar'

// css
import './CSS/menu.css'

// helpers
import { removeItem } from '../../Helpers/LocalStorage/LocalStorage'
import { REMOVEUSER } from '../../Reducers/actionTypes'

const ITEM_HEIGHT = 48;

export default function LongMenu() {

    const user = useSelector((state)=>state.user)
    const email = useSelector((state)=>state.email)
    const token = useSelector((state)=>state.token)

    const [anchorEl, setAnchorEl] = React.useState(null)
    const open = Boolean(anchorEl)

    const dispatch = useDispatch()
    const history = useHistory()

    const handleClick = (event) => {
        setAnchorEl(event.currentTarget)
    };

    const handleClose = () => {
        setAnchorEl(null)
    };

    const handleLogout = () =>{
        setAnchorEl(null)

        removeItem('usertoken', token)
        removeItem('email', email)
        removeItem('uid', user)

        dispatch({
            type: REMOVEUSER
        })

        history.push("/")

    }

    return (
        <div>
            <IconButton
                aria-label="more"
                aria-controls="long-menu"
                aria-haspopup="true"
                onClick={handleClick}
            >
                <Avatar name={email} size="30" textSizeRatio={0.75} round="20px"/>
            </IconButton>
            <Menu
                id="long-menu"
                anchorEl={anchorEl}
                keepMounted
                open={open}
                onClose={handleClose}
                PaperProps={{
                    style: {
                        maxHeight: ITEM_HEIGHT * 4.5,
                        width: '26ch',
                    },
                }}
            >
                <MenuItem key='user'>
                    <Person/> <span style={{margin:"5px"}}>{email}</span>
                </MenuItem>
                <MenuItem key='logout' onClick={handleLogout}>
                    <ExitToApp/> <span style={{margin:"5px"}}>Sign Out</span>
                </MenuItem>
            </Menu>
        </div>
    );
}
