import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom'
import { useSelector } from 'react-redux';
import { makeStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead'
import TableRow from '@material-ui/core/TableRow'
import Paper from '@material-ui/core/Paper'
import Button from '@material-ui/core/Button'

// helpers
import get from '../../Helpers/Request/get'
import post from '../../Helpers/Request/post'

// components
import Notification from '../../Components/Notification/Notification';


const useStyles = makeStyles({
  table: {
    minWidth: 500,
  },
});

export default function BasicTable() {
  const classes = useStyles();

  const [fetched, setFetched] = useState(false)
  const [rows, setRows] = useState([])
  const user = useSelector((state)=>state.user)
  const { id } = useParams()

  useEffect(async () => {

    const response = await get('contactlist')
    console.log(response.data)

    if (response.data) {
      setRows(response.data)
      setFetched(true)
    } else {
      Notification('Error', 'Cannot fetch Users', 'warning')
    }

  }, [])

  const handleAdd = async (userId)=>{
    console.log(userId)
    const reponse = await post('addinroom', {
      myId: user,
      userId: userId,
      roomId: id
    })

    if(reponse.data){
      Notification('Success', 'User Added to Meet', 'success')
    } else{
      Notification('Error', 'Cannot Add!!', 'warning')
    }

  }

  return (
    <>
      {
        fetched ? (
          <TableContainer component={Paper}>
            <Table className={classes.table} aria-label="simple table">
              <TableHead>
                <TableRow>
                  <TableCell><b>Email Id</b></TableCell>
                  <TableCell align="center"><b>Add</b></TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row) => (
                  <TableRow key={row.email}>
                    <TableCell component="th" scope="row">
                      {row.email}
                    </TableCell>
                    <TableCell align="center"><Button variant="contained" color="primary" name={row.id} onClick={()=>handleAdd(row.id)}>
                      Add
                    </Button></TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (null)
      }
    </>
  );
}