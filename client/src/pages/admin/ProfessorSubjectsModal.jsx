import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Box, FormControl, TextField, IconButton, Typography } from '@mui/material'
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

const ProfessorSubjectsModal = ({ handleCloseProfessorSubject, subjects, professors }) => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()
  const [selected, setSelected] = React.useState([]);
  const isSelected = (name) => selected.indexOf(name) !== -1;
  
  const saveSubjects = async () => {
    try {
     const professorSubjects = await contract.methods.getProfessorSubjects().call({ from: accounts[0] })   

     professorSubjects.array.forEach(async element => {
      if (!selected.find(element.subjectId)) {
        await contract.methods.deleteProfessorSubjects(professors,element.subjectId).call({ from: accounts[0] })          
      }
     });

     selected.array.forEach(async element => {
      if(professorSubjects.find(element)) {
        await contract.methods.addProfessorSubjects(professors,element).send({ from: accounts[0] });
      }
     })

     } catch (err) {
      console.error(err)
    }
  }

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = subjects.map((n) => n.name);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    const selectedIndex = selected.indexOf(name);
    let newSelected = [];

    if (selectedIndex === -1) {
      newSelected = newSelected.concat(selected, name);
    } else if (selectedIndex === 0) {
      newSelected = newSelected.concat(selected.slice(1));
    } else if (selectedIndex === selected.length - 1) {
      newSelected = newSelected.concat(selected.slice(0, -1));
    } else if (selectedIndex > 0) {
      newSelected = newSelected.concat(
        selected.slice(0, selectedIndex),
        selected.slice(selectedIndex + 1),
      );
    }

    setSelected(newSelected);
  };

  function EnhancedTableHead(props) {
    const { onSelectAllClick, order, orderBy, numSelected, rowCount, onRequestSort } =
      props;
    const createSortHandler = (property) => (event) => {
      onRequestSort(event, property);
    };
  
    return (
      <TableHead>
        <TableRow>
          <TableCell padding="checkbox">
            <Checkbox
              color="primary"
              indeterminate={numSelected > 0 && numSelected < rowCount}
              checked={rowCount > 0 && numSelected === rowCount}
              onChange={onSelectAllClick}
              inputProps={{
                'aria-label': 'select all desserts',
              }}
            />
          </TableCell>
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
          <IconButton onClick={() => handleCloseProfessorSubject()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display='flex' flexDirection='column' my={1}>
          <Typography variant='h4'>Add Subject to Professor {professors}</Typography>
          <Box my={2}>
          <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="subjects table">
                        <EnhancedTableHead
                          numSelected={selected.length}
                          onSelectAllClick={handleSelectAllClick}
                          rowCount={subjects.length}
                        />
                          <TableBody>
                            {subjects.map((sub) => {
                              const isItemSelected = isSelected(sub.name);
                              const labelId = `enhanced-table-checkbox-${sub.id}`;

                              return(
                              <TableRow
                                key={sub.id}
                                onClick={(event) => handleClick(event, sub.id)}
                                selected={isItemSelected}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  <Checkbox
                                  color="primary"
                                  checked={isItemSelected}
                                  inputProps={{
                                    'aria-label': labelId,
                                  }}
                              />
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {sub.name}
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
                  handleClick={saveSubjects()} />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default ProfessorSubjectsModal