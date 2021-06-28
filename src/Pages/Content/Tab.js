import React from 'react'
import { makeStyles } from '@material-ui/core/styles'
import Paper from '@material-ui/core/Paper'
import Tabs from '@material-ui/core/Tabs'
import Tab from '@material-ui/core/Tab'
import Menu from './Menu'

import { useHistory } from 'react-router'

const useStyles = makeStyles({
    root: {
        flexGrow: 1,
    },
});

export default function CenteredTabs({ routes }) {
    const classes = useStyles();
    const [value, setValue] = React.useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    const history = useHistory()

    return (
        <Paper className={classes.root}>
            <Tabs
                value={value}
                onChange={handleChange}
                indicatorColor="primary"
                textColor="primary"
                centered
            >
                {
                    routes.map((route) => {
                        return (
                            <Tab label={route.name} onClick={()=>{history.push(`${route.path}`)}}/>
                        )
                    })
                }
                <Menu />
            </Tabs>
        </Paper>
    );
}