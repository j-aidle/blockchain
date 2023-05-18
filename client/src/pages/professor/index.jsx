import React, { useState, useEffect } from 'react'
import { Box, Typography, Backdrop, CircularProgress } from '@mui/material'
import PropTypes from 'prop-types';
import Collapse from '@mui/material/Collapse';
import IconButton from '@mui/material/IconButton';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@mui/icons-material/KeyboardArrowUp';
import useEth from '../../contexts/EthContext/useEth'


const Professor = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()

  const [records, setRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(true)

  const [studentSubjects, setStudentSubjects] = useState([])
  const [subjectsProfessorList, setSubjectsProfessorList] = useState([])
  const [open, setOpen] = React.useState(false);
  
  useEffect(() => {
    console.log('account ',accounts)
    getStudentSubjects();
    subjectsOfProfessor();
    console.log('sub prof list',subjectsProfessorList )
  }, []);

  const getStudentSubjects = async () => {
    try {
      const ps = await contract.methods.getStudentSubjects().call({ from: accounts[0] })
      setStudentSubjects(ps)
      } catch(err) {
      console.log(err);
    }
  }

  const subjectsOfProfessor = async () => {
    
    try {
      const ps = await contract.methods.getProfessorSubjects().call({ from: accounts[0] })
      let arr = [];
      for(let i =0; i< ps.length; i++){
          if (ps[i].professorId === accounts[0]){
            arr.push({subjectId:ps[i].subjectId})  
          }           
      }
      console.log(arr)
      setSubjectsProfessorList(arr);

      } catch(err) {
      console.log(err);
    }
  }

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  } else {
    return (
      <Box display='flex' justifyContent='center' width='100vw'>
        <Box width='60%' my={5}>
          <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color='inherit' />
          </Backdrop>
          {!accounts ? (
            <Box display='flex' justifyContent='center'>
              <Typography variant='h6'>Open your MetaMask wallet to get connected, then refresh this page</Typography>
            </Box>
          ) : (
            <>
              {role === 'unknown' && (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>You're not registered, please go to home page</Typography>
                </Box>
              )}
              {(role === 'admin' || role === 'user') && (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>Only professor can access this page</Typography>
                </Box>
              )}
              {role === 'professor' && (
                <>
                  <Typography variant='h4'>Professor page</Typography>
                  <React.Fragment>
      <TableRow sx={{ '& > *': { borderBottom: 'unset' } }}>
        <TableCell>
          <IconButton
            aria-label="expand row"
            size="small"
            onClick={() => setOpen(!open)}
          >
            {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
          </IconButton>
        </TableCell>
        {subjectsProfessorList.map((sub) => (
          <TableCell component="th" scope="row">
          {sub.id}
          </TableCell>
        ))}

      </TableRow>
      <TableRow>
        <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
          <Collapse in={open} timeout="auto" unmountOnExit>
            <Box sx={{ margin: 1 }}>
              <Typography variant="h6" gutterBottom component="div">
                History
              </Typography>
              <Table size="small" aria-label="purchases">
                <TableHead>
                  <TableRow>
                    <TableCell>Date</TableCell>
                    <TableCell>Customer</TableCell>
                    <TableCell align="right">Amount</TableCell>
                    <TableCell align="right">Total price ($)</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>

                </TableBody>
              </Table>
            </Box>
          </Collapse>
        </TableCell>
      </TableRow>
    </React.Fragment>

                </>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default Professor
