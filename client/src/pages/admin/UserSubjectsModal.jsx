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

const UserSubjectsModal = ({
  handleCloseUserSubject,
  professorsSubjects,
  users,
  professors,
  subjects,
  subjectsOfStudent,
}) => {
  const {
    state: { contract, accounts },
  } = useEth();
  const { setAlert } = useAlert();
  const [selected, setSelected] = React.useState([]);
  const isSelected = (name) => {
    for (let i = 0; i < subjectsOfStudent.length; i++) {
      if (subjectsOfStudent[i].id === name) {
        return subjectsOfStudent[i].selected;
      }
    }
  };
  const [studentSubjects, setStudentSubjects] = useState([]);

  useEffect(() => {
    console.log("modal user", users.user.name);
    getStudentSubjects();
  }, []);

  const getStudentSubjects = async () => {
    try {
      const ps = await contract.methods
        .getStudentSubjects()
        .call({ from: accounts[0] });
      setStudentSubjects(ps);
    } catch (err) {
      console.log(err);
    }
  };

  const saveSubjects = async () => {
    console.log("ss ", subjectsOfStudent);
    console.log("ps ", studentSubjects);
    try {
      for (let k = 0; k < subjectsOfStudent.length; k++) {
        let found = false;
        console.log("iteration ss ", k, " value ", subjectsOfStudent[k]);
        for (let i = 0; i < studentSubjects.length; i++) {
          console.log("iteration ps ", 1, " value ", studentSubjects[k]);
          if (
            studentSubjects[i].professorId ===
              subjectsOfStudent[k].professorId &&
            studentSubjects[i].subjectId === subjectsOfStudent[k].subjectId
          ) {
            found = true;
            break;
          }
        }
        console.log(found);
        if (subjectsOfStudent[k].selected === true && !found) {
          contract.methods
            .addStudentSubjects(
              users.user.id,
              subjectsOfStudent[k].professorId,
              subjectsOfStudent[k].subjectId
            )
            .send({ from: accounts[0] });
        }
        if (subjectsOfStudent[k].selected === false && found) {
          contract.methods
            .deleteStudentSubjects(
              users.user.id,
              subjectsOfStudent[k].professorId,
              subjectsOfStudent[k].subjectId
            )
            .send({ from: accounts[0] });
        }
      }
      handleCloseUserSubject();
    } catch (err) {
      console.error(err);
    }
  };

  const handleClick = (event, name) => {
    for (let i = 0; i < subjectsOfStudent.length; i++) {
      if (subjectsOfStudent[i].id === name) {
        if (subjectsOfStudent[i].selected === true) {
          subjectsOfStudent[i].selected = false;
        } else {
          subjectsOfStudent[i].selected = true;
        }
      }
    }
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
          <IconButton onClick={() => handleCloseUserSubject()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display="flex" flexDirection="column" my={1}>
          <Typography variant="h4">
            Enrollment of Student {users.user.name}
          </Typography>
          {professorsSubjects.length === 0 && (
            <Box
              display="flex"
              alignItems="center"
              justifyContent="center"
              my={5}
            >
              <Typography variant="h5">
                You had to add subject to Professor first!
              </Typography>
            </Box>
          )}
          {professorsSubjects.length > 0 && (
            <Box my={2}>
              <Box display="flex" flexDirection="column" mt={3} mb={-2}>
                <TableContainer component={Paper}>
                  <Table sx={{ minWidth: 650 }} aria-label="subjects table">
                    <EnhancedTableHead
                      numSelected={selected.length}
                      //onSelectAllClick={handleSelectAllClick}
                      rowCount={professorsSubjects.length}
                    />
                    <TableBody>
                      {professorsSubjects.map((ps) => {
                        const isItemSelected = isSelected(ps.id);
                        const labelId = `enhanced-table-checkbox-${ps.id}`;
                        return (
                          <TableRow
                            key={ps.id}
                            onClick={(event) => handleClick(event, ps.id)}
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
                              {professors.map((prof) => {
                                if (prof.id === ps.professorId)
                                  return prof.name;
                              })}
                            </TableCell>
                            <TableCell component="th" scope="row">
                              {subjects.map((sub) => {
                                if (sub.id === ps.subjectId) return sub.name;
                              })}
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
          {professorsSubjects.length > 0 && (
            <Box display="flex" justifyContent="space-between" mb={2}>
              <Box flexGrow={1} />
              <CustomButton text="Save" handleClick={saveSubjects} />
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default UserSubjectsModal;
