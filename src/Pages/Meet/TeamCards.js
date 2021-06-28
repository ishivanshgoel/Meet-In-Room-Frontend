import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import {
  Grid,
} from "@material-ui/core/";
import Card from '../../Components/RoomCard/RoomCard'

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
    padding: theme.spacing(2)
  }
}));

export default function TeamCards({rooms}) {
  const classes = useStyles();
  return (
    <div className={classes.root}>
        <Grid
          container
          spacing={2}
          direction="row"
          justify="flex-start"
          alignItems="flex-start"
        >
          {rooms && rooms.map((room) => (
            <Grid item xs={3} key={rooms.indexOf(room)}>
              <Card roomId={room.roomId} name={room.name} type={room.type} />
            </Grid>
          ))}
        </Grid>
    </div>
  );
}
