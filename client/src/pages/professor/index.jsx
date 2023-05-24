import React, { useState, useEffect } from "react";
import { Box, Typography, Backdrop, CircularProgress, Modal, generateUtilityClass } from "@mui/material";
import PropTypes from "prop-types";
import Collapse from "@mui/material/Collapse";
import IconButton from "@mui/material/IconButton";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import useEth from "../../contexts/EthContext/useEth";
import AddGradeModal from "./AddGradeModal";
import CustomButton from '../../components/CustomButton'
import moment from 'moment'

const Professor = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth();

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);

  const [users, setUsers] = useState([]);
  const [grades, setGrades] = useState([]);
  const [subjects, setSubjects] = useState([]);
  const [studentSubjects, setStudentSubjects] = useState([]);
  const [professorsSubjects, setProfessorsSubjects] = useState([]);
  const [subjectsProfessorList, setSubjectsProfessorList] = useState([]);
  const [studentsProfessorList, setStudentsProfessorList] = useState([]);
  const [gradesList, setGradesList] = useState([]);
  const [open, setOpen] = React.useState(false);
  const [open2, setOpen2] = React.useState(false);
  const [selectedUser, setSelectedUser] =useState('');
  const [addGradeRecord, setAddGradeRecord]=useState(false)

  useEffect(() => {
    getProfessorSubjects();
    console.log("account ", accounts[0]);
    getStudentSubjects();

    console.log("sub prof list", subjectsProfessorList);
    // setSubjects(JSON.parse(window.localStorage.getItem('subjects')));
  }, []);

  useEffect(() => {
    getSubjects();
    getUsers();
    gradesOfStudent();
    subjectsOfProfessor();
    studentsOfProfessor();
    // setSubjects(JSON.parse(window.localStorage.getItem('subjects')));
  });
  /*useEffect(() => {
    window.localStorage.setItem('accounts', accounts);
    window.localStorage.setItem('subjects', subjects);
  }, [accounts,subjects]);
*/

  const getUsers = async () => {
    try {
      const us = await contract.methods.getUsers().call({ from: accounts[0] });
      setUsers(us);
    } catch (err) {
      console.log(err);
    }
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

  const subjectsOfProfessor = async () => {
    try {
      const ps = await contract.methods
        .getProfessorSubjects()
        .call({ from: accounts[0] });
      let arr = [];
      for (let i = 0; i < ps.length; i++) {
        if (ps[i].professorId === accounts[0]) {
          arr.push({ subjectId: ps[i].subjectId, students: [] });
        }
      }
      //console.log(arr);
      setSubjectsProfessorList(arr);
      //console.log("sub of prof list", subjectsProfessorList);
    } catch (err) {
      console.log(err);
    }
  };

  const studentsOfProfessor = async () => {
    try {
      const ss = await contract.methods
        .getStudentSubjects()
        .call({ from: accounts[0] });
        const g = await contract.methods.getGrades().call({ from: accounts[0] });
      let arr = [];
      for (let i = 0; i < ss.length; i++) {
        if (ss[i].professorId === accounts[0]) {
          for (let k = 0; k < subjectsProfessorList.length; k++) {
            if (subjectsProfessorList[k].subjectId === ss[k].subjectId) {
              for (let j = 0; j < g.length; j++) {
                if (ss[k].id == g[j].studentSubjectsId) {
                  //arr.push({ id: ss[k].id, professorId: ss[k].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId, description: g[j].description, value: g[j].value, time: g[j].momentAddition  });
                  subjectsProfessorList[k].students.push({ id: ss[k].id, professorId: ss[i].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId, grades: { id: ss[k].id, professorId: ss[k].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId, description: g[j].description, value: g[j].value, time: g[j].momentAddition  } });
                }                
              }
              
              //arr.push({ id: ss[k].id, professorId: ss[i].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId });
            }
          }
        }
      }
      //console.log(arr);
      setStudentsProfessorList(arr);
      //console.log("sub of prof list", subjectsProfessorList);
    } catch (err) {
      console.log(err);
    }
  };

  const gradesOfStudent = async () => {
    try {
      const ss = await contract.methods
        .getStudentSubjects()
        .call({ from: accounts[0] });
      const g = await contract.methods.getGrades().call({ from: accounts[0] });
      let arr = [];
      for (let i = 0; i < ss.length; i++) {
        if (ss[i].professorId === accounts[0]) {
          for (let k = 0; k < subjectsProfessorList.length; k++) {
            if (subjectsProfessorList[k].subjectId === ss[k].subjectId) {
              for (let j = 0; j < g.length; j++) {
                if (ss[k].id == g[j].studentSubjectsId) {
                  arr.push({ id: ss[k].id, professorId: ss[k].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId, description: g[j].description, value: g[j].value, time: g[j].momentAddition  });
                }                
              }
            }            
          }
        }
      }
      //console.log(arr);
      setGradesList(arr);
      //console.log("sub of prof list", subjectsProfessorList);
    } catch (err) {
      console.log(err);
    }
  };

  /*const subjectsOfProfessor = async () => {
    try {
      const ps = await contract.methods
        .getSubjectsOfProfessor(accounts[0])
        .call({ from: accounts[0] });
      setSubjectsProfessorList(ps);
      console.log("sub of prof list", subjectsProfessorList);
    } catch (err) {
      console.log(err);
    }
  };*/

  const getSubjects = async () => {
    try {
      const subj = await contract.methods
        .getSubjects()
        .call({ from: accounts[0] });
      setSubjects(subj);
      //console.log('subjects', subj)
    } catch (err) {
      console.log(err);
    }
  };

  const getGrades = async () => {
    try {
      const g = await contract.methods
        .getGrades()
        .call({ from: accounts[0] });
      setGrades(g);
      //console.log('subjects', subj)
    } catch (err) {
      console.log(err);
    }
  };

  const showModalAddGrade = (record) => {
    console.log('user ',record);
    setSelectedUser(record);
    console.log('selecionado',selectedUser)
    setAddGradeRecord(true);
  };


  if (loading) {
    return (
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={loading}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    );
  } else {
    return (
      <Box display="flex" justifyContent="center" width="100vw">
        <Box width="60%" my={5}>
          <Backdrop
            sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
            open={loading}
          >
            <CircularProgress color="inherit" />
          </Backdrop>
          {!accounts ? (
            <Box display="flex" justifyContent="center">
              <Typography variant="h6">
                Open your MetaMask wallet to get connected, then refresh this
                page
              </Typography>
            </Box>
          ) : (
            <>
              {role === "unknown" && (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5">
                    You're not registered, please go to home page
                  </Typography>
                </Box>
              )}
              {(role === "admin" || role === "user") && (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5">
                    Only professor can access this page
                  </Typography>
                </Box>
              )}
              {role === "professor" && (
                <>
                  {subjectsProfessorList.length === 0 && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      my={5}
                    >
                      <Typography variant="h5">No subjects assigned</Typography>
                    </Box>
                  )}
                  {subjectsProfessorList.length > 0 && (
                    <React.Fragment>
                      <TableContainer component={Paper}>
                        <Table
                          sx={{ minWidth: 650 }}
                          aria-label="subjects and users table"
                        >
                          <TableHead>
                            <TableRow>
                              <TableCell>
                                {" "}
                                <Typography
                                  variant="h6"
                                  gutterBottom
                                  component="div"
                                >
                                  Subjects List
                                </Typography>
                              </TableCell>
                            </TableRow>
                          </TableHead>
                          {subjectsProfessorList.map((ps) => (
                          <><TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                              <TableCell>
                                <IconButton
                                  aria-label="expand row"
                                  size="small"
                                  onClick={() => setOpen(!open)}
                                >
                                  {open ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </TableCell>

                              <TableCell component="th" scope="row">
                                {subjects.map((subj) => {
                                  if (subj.id === ps.subjectId) {
                                    return subj.name;
                                  }
                                })}
                              </TableCell>
                            </TableRow>
                            <TableRow sx={{ "& > *": { borderBottom: "unset" } }}>
                                <TableCell>
                                  <IconButton
                                    aria-label="expand row2"
                                    size="small"
                                    onClick={() => setOpen2(!open2)}
                                  >
                                    {open2 ? (
                                      <KeyboardArrowUpIcon />
                                    ) : (
                                      <KeyboardArrowDownIcon />
                                    )}
                                  </IconButton>
                                </TableCell>
                                <TableCell
                                  style={{ paddingBottom: 0, paddingTop: 0 }}
                                  colSpan={6}
                                >
                                  <Collapse in={open} timeout="auto" unmountOnExit>
                                  {ps.students.map((std) => (
                                    <><Box sx={{ margin: 1 }}>
                                      <Typography
                                        variant="h6"
                                        gutterBottom
                                        component="div"
                                      >
                                        Students
                                      </Typography>
                                      <Table size="small" aria-label="purchases">
                                        <TableHead>
                                          <TableRow>
                                            <TableCell>Name</TableCell>
                                            <TableCell></TableCell>
                                          </TableRow>
                                        </TableHead>
                                        <TableBody>
                                          <TableBody>

                                            <><TableCell component="th" scope="row">
                                              {users.map((us) => {
                                                if (us.id === std.studentId) {
                                                  return us.name;
                                                }
                                              })}

                                            </TableCell><TableCell>
                                                <CustomButton text={'Add Grade'} handleClick={() => showModalAddGrade({ std })} />
                                              </TableCell></>
                                          </TableBody>
                                        </TableBody>
                                      </Table>
                                    </Box><TableRow>
                                        <TableCell
                                          style={{ paddingBottom: 0, paddingTop: 0 }}
                                          colSpan={6}
                                        >
                                          <Collapse in={open2} timeout="auto" unmountOnExit>
                                            <Box sx={{ margin: 1 }}>
                                              <Typography
                                                variant="h6"
                                                gutterBottom
                                                component="div"
                                              >
                                                Grades
                                              </Typography>
                                              <Table size="small" aria-label="purchases">
                                                <TableHead>
                                                  <TableRow>
                                                    <TableCell>Subject</TableCell>
                                                    <TableCell>Description</TableCell>
                                                    <TableCell>Value</TableCell>
                                                    <TableCell>Created Time</TableCell>
                                                  </TableRow>
                                                </TableHead>
                                                <TableBody>
                                                  {ps.std.grades.map((g) => (
                                                    <TableRow>
                                                      <TableCell component="th" scope="row">
                                                        {subjects.map((sub) => {
                                                          if (g.subjectId === sub.id) {
                                                            return sub.name;
                                                          }
                                                        })}
                                                      </TableCell>
                                                      <TableCell component="th" scope="row">
                                                        {g.description}
                                                      </TableCell>
                                                      <TableCell component="th" scope="row">
                                                        {g.value}
                                                      </TableCell>
                                                      <TableCell component="th" scope="row">
                                                        {moment.unix(g.time).format('DD-MM-YYYY HH:mm')}
                                                      </TableCell>
                                                    </TableRow>
                                                  ))}
                                                </TableBody>
                                              </Table>
                                            </Box>
                                            ))}
                                          </Collapse>
                                        </TableCell>
                                      </TableRow></>
                                  </Collapse>
                                </TableCell>
                              </TableRow></>                        
                          ))}
                                                   <Modal key={'modal'-selectedUser.id} open={addGradeRecord} onClose={() => setAddGradeRecord(false)}>
                            <AddGradeModal
                              destroyOnClose
                              handleCloseGrade={() => setAddGradeRecord(false)}
                              users={selectedUser}
                            />
                          </Modal>                          
                          

                        </Table>
                      </TableContainer>
                    </React.Fragment>
                  )}
                </>
              )}
            </>
          )}
        </Box>
      </Box>
    );
  }
};

export default Professor;
