import React, { useState,useEffect } from 'react'
import CustomButton from '../../components/CustomButton'
import { Box, FormControl, TextField, IconButton, Typography, circularProgressClasses } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import useEth from '../../contexts/EthContext/useEth'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import Checkbox from '@mui/material/Checkbox';
import PropTypes from 'prop-types';

const UserSubjectsModal = ({ handleCloseUserSubject, professorsSubjects, users }) => {
  const {
    state: { contract, accounts },
  } = useEth()
  const { setAlert } = useAlert()
  const [selected, setSelected] = React.useState([]);

  
  useEffect(() => {
  }, []);

  const saveSubjects = async () => {
    try {
     

     } catch (err) {
      console.error(err)
    }
  }


  function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } =
      props;
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            {/* <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            /> */}
          </TableCell>
          <TableCell>Professor Name</TableCell>
          <TableCell>Subject Name</TableCell>
        </TableRow>
      </TableHead>
    );
  }

  EnhancedTableHead.propTypes = {
    numSelected: PropTypes.number.isRequired,
    onSelectAllClick: PropTypes.func.isRequired,
    rowCount: PropTypes.number.isRequired,
  };

  return (
    <Box
      sx={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        weight: '100vw',
      }}
    >
      <Box
        width='50vw'
        style={{
          backgroundColor: 'white',
          boxShadow: 24,
          borderRadius: 10,
        }}
        p={2}
        pr={6}
        pb={0}
        position='relative'
      >
        <Box position='absolute' sx={{ top: 5, right: 5 }}>
          <IconButton onClick={() => handleCloseUserSubject()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display='flex' flexDirection='column' my={1}>
          <Typography variant='h4'>Add Subject to Student {users.name}</Typography>
          <Box my={2}>
          <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="subjects table">
                        <EnhancedTableHead
                          numSelected={selected.length}
                          //onSelectAllClick={handleSelectAllClick}
                          rowCount={professorsSubjects.length}
                        />
                          <TableBody>
                            {professorsSubjects.map((ps) => {
                             // const isItemSelected = isSelected(sub.id);
                              const labelId = `enhanced-table-checkbox-${ps.id}`;
                              return(
                              <TableRow
                                key={ps.id}
                                //onClick={(event) => handleClick(event, sub.id)}
                               // selected={isItemSelected}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  <Checkbox
                                  color="primary"
                                 // checked={isItemSelected}
                                  inputProps={{
                                    'aria-label': labelId,
                                  }}
                              />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {ps.professorId}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {ps.subjectId}
                                </TableCell>
                              </TableRow>)
                            })}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
          </Box>
          <Box display='flex' justifyContent='space-between' mb={2}>
              <Box flexGrow={1} />
              <CustomButton
                  text='Save'
                  handleClick={saveSubjects} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default UserSubjectsModal