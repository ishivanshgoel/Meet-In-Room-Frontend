import React, { useEffect, useState } from 'react'
import CssBaseline from '@material-ui/core/CssBaseline'
import Divider from '@material-ui/core/Divider'
import Drawer from '@material-ui/core/Drawer'
import Hidden from '@material-ui/core/Hidden'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemIcon from '@material-ui/core/ListItemIcon'
import ListItemText from '@material-ui/core/ListItemText'
import { makeStyles, useTheme } from '@material-ui/core/styles'
import Avatar from 'react-avatar'

// css
import './CSS/assignedWork.css'

// helpers
import get from '../../Helpers/Request/get'

// components
import LoadingScreen from '../../Components/LoadingScreen/LoadingScreenHook'
import Notification from '../../Components/Notification/Notification'
import AssignedWorkRight from './AssignedWorkRight.js'

const drawerWidth = 280;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    drawer: {
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    // necessary for content to be below app bar
    toolbar: theme.mixins.toolbar,
    drawerPaper: {
        width: drawerWidth,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

function ResponsiveDrawer(props) {
    const { window } = props;
    const classes = useStyles();
    const theme = useTheme();
    const [mobileOpen, setMobileOpen] = React.useState(false);

    const handleDrawerToggle = () => {
        setMobileOpen(!mobileOpen);
    };

    const [loadingScreen, showLoadingScreen, hideLoadingScreen] = LoadingScreen()
    const [users, setUsers] = useState([])
    const [loadUser, setLoadUser] = useState(null)
    const [loadUserEmail, setLoadUserEmail] = useState(null)
    const [loadRight, setLoadRight] = useState(false)

    useEffect(async () => {
        // start the loading screen
        showLoadingScreen()
        const response = await get('contactlist')
        console.log("Contact List ", response.data)

        // initialize user
        if (response.data) {
            // set the contact list
            setUsers(response.data)
        } else {
            Notification('Error', 'Cannot fetch your contact list', 'danger')
        }

        // time to hide loading screen
        hideLoadingScreen()
    }, [])

    const handleLoadChat = async (id, email)=>{
        await setLoadRight(false)
        setLoadUser(id)
        setLoadUserEmail(email)
        setLoadRight(true)
        console.log(id)
    }


    // sidebar => containing list of all the contacts
    const drawer = (
        <div>
            <div className={classes.toolbar} />
            <Divider />
            <List>
                {users && users.map(({id, email}, index) => (
                    <ListItem button key={id} name={id} onClick={()=>handleLoadChat(id, email)}>
                        {/* icon for name */}
                        <ListItemIcon><Avatar name={email} size="30" textSizeRatio={0.75} round="20px"/></ListItemIcon> 
                        <ListItemText primary={email}/>
                    </ListItem>
                ))}
            </List>
        </div>
    );

    const container = window !== undefined ? () => window().document.body : undefined;

    return (
        <>
            {
                users ? (
                    <div className={classes.root}>
                        <CssBaseline />
                        <nav className={classes.drawer} aria-label="mailbox folders">
                            {/* The implementation can be swapped with js to avoid SEO duplication of links. */}
                            <Hidden smUp implementation="css">
                                <Drawer
                                    container={container}
                                    variant="temporary"
                                    anchor={theme.direction === 'rtl' ? 'right' : 'left'}
                                    open={mobileOpen}
                                    onClose={handleDrawerToggle}
                                    classes={{
                                        paper: classes.drawerPaper,
                                    }}
                                    ModalProps={{
                                        keepMounted: true, // Better open performance on mobile.
                                    }}
                                >
                                    {drawer}
                                </Drawer>
                            </Hidden>
                            <Hidden xsDown implementation="css">
                                <Drawer
                                    classes={{
                                        paper: classes.drawerPaper,
                                    }}
                                    variant="permanent"
                                    open
                                >
                                    {drawer}
                                </Drawer>
                            </Hidden>
                        </nav>
                        <main className={classes.content}>
                            <div className={classes.toolbar} />
                                {
                                    loadRight?(
                                        <AssignedWorkRight userId={loadUser} userEmail={loadUserEmail}/>
                                    ):(null)
                                }
                        </main>
                    </div>) : (null)
            }
        </>
    );
}

export default ResponsiveDrawer;