import React, { useState, useEffect } from "react";
import CustomButton from "../../components/CustomButton";
import {
  Box,
  FormControl,
  TextField,
  IconButton,
  Typography,
  circularProgressClasses,
} from "@mui/material";
import CloseRoundedIcon from "@mui/icons-material/CloseRounded";
import useAlert from "../../contexts/AlertContext/useAlert";
import useEth from "../../contexts/EthContext/useEth";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import Checkbox from "@mui/material/Checkbox";
import PropTypes from "prop-types";

const ProfessorSubjectsModal = ({
  handleCloseProfessorSubject,
  subjects,
  professors,
  professorId,
  subjectsOfProfessor,
}) => {
  const {
    state: { contract, accounts },
  } = useEth();
  const { setAlert } = useAlert();
  const [selected, setSelected] = React.useState([]);
  const isSelected = (name) => {
    for (let i = 0; i < subjectsOfProfessor.length; i++) {
      if (subjectsOfProfessor[i].id === name) {
        return subjectsOfProfessor[i].selected;
      }
    }
  };
  const [professorsSubjects, setProfessorsSubjects] = useState([]);

  useEffect(() => {
    console.log("modal profe", professors.prof.name);
    getProfessorSubjects();
    //getSelected();
  }, []);

  const getSelected = async () => {
    console.log("hola", professorsSubjects);
    for (let i = 0; i < professorsSubjects.length; i++) {
      console.log("sub id", professorsSubjects[i].subjectId);
      setSelected(professorsSubjects[i].subjectId);
    }

    console.log("getselect", selected);
  };

  const getProfessorSubjects = async () => {
    try {
      const ps = await contract.methods
        .getProfessorSubjects()
        .call({ from: accounts[0] });
      setProfessorsSubjects(ps);
    } catch (err) {
      console.log(err);
    }
  };

  const saveSubjects = async () => {
    try {
      //const professorSubjects = await contract.methods.getProfessorSubjects().call({ from: accounts[0] })
      console.log("professorsSubjects ", professorsSubjects);
      console.log("sub prof ", subjectsOfProfessor);
      console.log("contracts", contract);
      console.log("professors", professors);
      for (let k = 0; k < subjectsOfProfessor.length; k++) {
        let found = false;
        for (let i = 0; i < professorsSubjects.length; i++) {
          if (
            professorsSubjects[i].professorId === professors.prof.id &&
            professorsSubjects[i].subjectId === subjectsOfProfessor[k].id
          ) {
            found = true;
            break;
          }
        }
        if (subjectsOfProfessor[k].selected === true && !found) {
          contract.methods
            .addProfessorSubjects(professors.prof.id, subjectsOfProfessor[k].id)
            .send({ from: accounts[0] });
        }
        if (subjectsOfProfessor[k].selected === false && found) {
          contract.methods
            .deleteProfessorSubjects(
              professors.prof.id,
              subjectsOfProfessor[k].id
            )
            .send({ from: accounts[0] });
        }
      }
      handleCloseProfessorSubject();

      /*selected.array.forEach( element => {
      if(professorsSubjects.find(element)) {
        contract.methods.addProfessorSubjects(professors,element).send({ from: accounts[0] });
      }
     })*/
    } catch (err) {
      console.error(err);
    }
  };

  const handleSelectAllClick = (event) => {
    if (event.target.checked) {
      const newSelected = subjectsOfProfessor.map((n) => n.id);
      setSelected(newSelected);
      return;
    }
    setSelected([]);
  };

  const handleClick = (event, name) => {
    for (let i = 0; i < subjectsOfProfessor.length; i++) {
      if (subjectsOfProfessor[i].id === name) {
        if (subjectsOfProfessor[i].selected === true) {
          subjectsOfProfessor[i].selected = false;
        } else {
          subjectsOfProfessor[i].selected = true;
        }
      }
    }

    /*const selectedIndex = selected.indexOf(name);
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

    setSelected(newSelected);*/
  };

  function EnhancedTableHead(props) {
    const { onSelectAllClick, numSelected, rowCount } = props;

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
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
        weight: "100vw",
      }}
    >
      <Box
        width="50vw"
        style={{
          backgroundColor: "white",
          boxShadow: 24,
          borderRadius: 10,
        }}
        p={2}
        pr={6}
        pb={0}
        position="relative"
      >
        <Box position="absolute" sx={{ top: 5, right: 5 }}>
          <IconButton onClick={() => handleCloseProfessorSubject()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" my={1}>
          <Typography variant="h4">
            Subjects of Professor {professors.prof.name}
          </Typography>
          {subjects.length === 0 && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              my={5}
            >
              <Typography variant="h5">
                You had to create subjects first!
              </Typography>
            </Box>
          )}
          {subjects.length > 0 && (
            <Box my={2}>
              <Box display="flex" flexDirection="column" mt={3} mb={-2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="subjects table">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      //onSelectAllClick={handleSelectAllClick}
                      rowCount={subjects.length}
                    />
                    <TableBody>
                      {subjectsOfProfessor.map((sub) => {
                        const isItemSelected = isSelected(sub.id);
                        const labelId = `enhanced-table-checkbox-${sub.id}`;
                        return (
                          <TableRow
                            key={sub.id}
                            onClick={(event) => handleClick(event, sub.id)}
                            selected={isItemSelected}
                            sx={{
                              "&:last-child td, &:last-child th": { border: 0 },
                            }}
                          >
                            <TableCell component="th" scope="row">
                              <Checkbox
                                color="primary"
                                checked={isItemSelected}
                                inputProps={{
                                  "aria-label": labelId,
                                }}
                              />
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {sub.name}
                            </TableCell>
                          </TableRow>
                        );
                      })}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Box>
            </Box>
          )}
          {subjects.length > 0 && (
            <Box display="flex" justifyContent="space-around" mb={2}>
              <Box flexGrow={1} />
              <CustomButton text="Save" handleClick={saveSubjects} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default ProfessorSubjectsModal;
