import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Backdrop,
  CircularProgress,
  Modal,
  generateUtilityClass,
} from "@mui/material";
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
import CustomButton from "../../components/CustomButton";
import moment from "moment";

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
  const [openList, setOpenList] = useState([]);
  const [openList2, setOpenList2] = useState([]);
  const [selectedUser, setSelectedUser] = useState("");
  const [addGradeRecord, setAddGradeRecord] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState([]);

  useEffect(() => {
    getProfessorSubjects();
    console.log("account ", accounts[0]);
    getStudentSubjects();
    loadOpenList();
    loadOpenList2();
    subjectsOfProfessor();
    console.log("sub prof list", subjectsProfessorList);
    // setSubjects(JSON.parse(window.localStorage.getItem('subjects')));
  }, []);

  useEffect(() => {
    getSubjects();
    getUsers();
    subjectsOfProfessor();

    //gradesOfStudent();

   // studentsOfProfessor();
    // setSubjects(JSON.parse(window.localStorage.getItem('subjects')));
  });
  /*useEffect(() => {
    window.localStorage.setItem('accounts', accounts);
    window.localStorage.setItem('subjects', subjects);
  }, [accounts,subjects]);
*/
const showProfessorsSubjects = (ps) => {
  setSelectedSubject(ps);
  console.log(ps)
  openList[ps.subjectId].open = !openList[ps.subjectId].open;
  console.log(ps)
  setOpen(!open);
};

const showStudentsSubjects = (s) => {
  setSelectedStudent(s);
  console.log(s)
  openList2[s.id].open2 = !openList2[s.id].open2;
  console.log(s)
  setOpen2(!open2);
}; 
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

  const loadOpenList = async () =>  {
    try {
      const ps = await contract.methods
        .getProfessorSubjects()
        .call({ from: accounts[0] });
    for (let i = 0; i < ps.length; i++) { 
      if (ps[i].professorId === accounts[0]) {
        openList.push({subjectId: ps[i].subjectId, open: false})
      }
    }
    } catch(err) {
      console.log(err)
    }
  }

  const loadOpenList2 = async () => {
    try {
      const ss = await contract.methods
        .getStudentSubjects()
        .call({ from: accounts[0] });
    for (let i = 0; i < ss.length; i++) { 
      if (ss[i].professorId === accounts[0]) {
        openList2.push({id: ss[i].id, open2: false})
      }
    }
    } catch(err) {
      console.log(err)
    }
  }

  const subjectsOfProfessor = async () => {
    try {
      const ps = await contract.methods
        .getProfessorSubjects()
        .call({ from: accounts[0] });
      const ss = await contract.methods
        .getStudentSubjects()
        .call({ from: accounts[0] });
      const g = await contract.methods.getGrades().call({ from: accounts[0] });
      let arr = [];
      let variable;
      let variable2;
      for (let i = 0; i < ps.length; i++) {
        if (ps[i].professorId === accounts[0]) {
           variable = arr.push({subjectId: ps[i].subjectId, students: [] });
            for (let j = 0; j < ss.length; j++) {
              if (ss[j].professorId === accounts[0] && ps[i].subjectId === ss[j].subjectId) {
                variable2 = arr[variable-1].students.push({
                  id: ss[j].id,
                  professorId: ss[j].professorId,
                  subjectId: ss[j].subjectId,
                  studentId: ss[j].studentId,
                  grades: [],
                })
                for (let k = 0; k < g.length; k++) {
                  if (ss[j].id == g[k].studentSubjectsId) {
                    //arr.push({ id: ss[k].id, professorId: ss[k].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId, description: g[j].description, value: g[j].value, time: g[j].momentAddition  });
                    arr[variable-1].students[variable2-1].grades.push({
                        id: ss[j].id,
                        professorId: ss[j].professorId,
                        subjectId: ss[j].subjectId,
                        studentId: ss[j].studentId,
                        description: g[k].description,
                        value: g[k].value,
                        time: g[k].momentAddition,
                    });
                  }
                }
                
                //arr.push({ id: ss[k].id, professorId: ss[i].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId });
              }

        }
        }
      }

      //console.log('openlist',openList)
      //console.log('ps',ps)
      //console.log('ss',ss)
      //console.log('g',g)
      //console.log('arr',arr);
      setSubjectsProfessorList(arr);
      //console.log("sub of prof list", subjectsProfessorList);
    } catch (err) {
      console.log(err);
    }
  };

  const updateGrades = async (std) => {
    try {
    let arr =  subjectsProfessorList;
    const g = await contract.methods.getGrades().call({ from: accounts[0] });
    for (let i = 0; i < arr.length; i++) {
          if (std.subjectId === arr[i].subjectId) {
            for (let k = 0; k <  arr[i].students.length; k++) {
              if ( arr[i].students[k].id == std.id) {
                //arr.push({ id: ss[k].id, professorId: ss[k].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId, description: g[j].description, value: g[j].value, time: g[j].momentAddition  });
                arr[i].students[k].grades = [];
                for (let j = 0; j < g.length; j++) {
                  if (g[j].id === arr[i].students[k].id) {
                    arr[i].students[k].grades.push({
                      id:arr[i].students[k].id,
                      professorId: arr[i].students[k].professorId,
                      subjectId: arr[i].students[k].subjectId,
                      studentId: arr[i].students[k].studentId,
                      description: g[k].description,
                      value: g[k].value,
                      time: g[k].momentAddition,
                  });
                  }
                  
                }
              }
            }
            
            //arr.push({ id: ss[k].id, professorId: ss[i].professorId, subjectId: ss[k].subjectId, studentId: ss[i].studentId });
          }

    }
    setSubjectsProfessorList(arr);

} catch (err) {
  console.error(err);
}

  }


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
      const g = await contract.methods.getGrades().call({ from: accounts[0] });
      setGrades(g);
      //console.log('subjects', subj)
    } catch (err) {
      console.log(err);
    }
  };

  const showModalAddGrade = (record) => {
    console.log("user ", record);
    setSelectedUser(record);
    console.log("selecionado", selectedUser);
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
              {(role === "admin" || role === "student") && (
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
                                                        <>
                              <TableRow
                                //key={ps}
                                sx={{ "& > *": { borderBottom: "unset" } }}
                              >
                                <TableCell>
                                  <IconButton
                                    aria-label="expand row"
                                    size="small"
                                    //onClick={() => setOpen(!open)}
                                    onClick={() => {showProfessorsSubjects(ps)}}
                                  >
                                    {openList[ps.subjectId].open ? (
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
                              {ps.students.map((std) => (
                                <>
                                  <TableRow
                                    sx={{ "& > *": { borderBottom: "unset" } }}
                                  >
                                    <TableCell
                                      style={{
                                        paddingBottom: 0,
                                        paddingTop: 0,
                                      }}
                                      colSpan={6}
                                    >
                                      <Collapse
                                        in={openList[ps.subjectId].open}
                                        timeout="auto"
                                        unmountOnExit
                                      >
                                        <Box sx={{ margin: 1 }}>
                                          <Typography
                                            variant="h6"
                                            gutterBottom
                                            component="div"
                                          >
                                            Students
                                          </Typography>
                                          <Table
                                            size="small"
                                            aria-label="purchases"
                                          >
                                            <TableHead>
                                              <TableRow>
                                                <TableCell>Name</TableCell>
                                                <TableCell></TableCell>
                                              </TableRow>
                                            </TableHead>
                                            <TableBody>
                                              <TableBody>
                                                <>
                                                  <TableCell
                                                    component="th"
                                                    scope="row"
                                                  >
                                                    {users.map((us) => {
                                                      if (
                                                        us.id === std.studentId
                                                      ) {
                                                        return us.name;
                                                      }
                                                    })}
                                                  </TableCell>
                                                  <TableCell>
                                                    <CustomButton
                                                      text={"Add Grade"}
                                                      handleClick={() =>
                                                        showModalAddGrade({
                                                          std,
                                                        })
                                                      }
                                                    />
                                                  </TableCell>
                                                  <TableCell>
                                                    <IconButton
                                                      aria-label="expand row2"
                                                      size="small"
                                                      //onClick={() => setOpen2(!open2)}
                                                      onClick={() => showStudentsSubjects(std)}
                                                    >
                                                      {openList2[std.id].open2 ? (
                                                        <KeyboardArrowUpIcon />
                                                      ) : (
                                                        <KeyboardArrowDownIcon />
                                                      )}
                                                    </IconButton>
                                                  </TableCell>
                                                </>
                                              </TableBody>
                                            </TableBody>
                                          </Table>
                                        </Box>
                                        <TableRow>
                                          <TableCell
                                            style={{
                                              paddingBottom: 0,
                                              paddingTop: 0,
                                            }}
                                            colSpan={6}
                                          >
                                            <Collapse
                                              in={openList2[std.id].open2}
                                              timeout="auto"
                                              unmountOnExit
                                            >
                                              <Box sx={{ margin: 1 }}>
                                                <Typography
                                                  variant="h6"
                                                  gutterBottom
                                                  component="div"
                                                >
                                                  Grades
                                                </Typography>
                                                <Table
                                                  size="small"
                                                  aria-label="purchases"
                                                >
                                                  <TableHead>
                                                    <TableRow>
                                                      <TableCell>
                                                        Subject
                                                      </TableCell>
                                                      <TableCell>
                                                        Description
                                                      </TableCell>
                                                      <TableCell>
                                                        Value
                                                      </TableCell>
                                                      <TableCell>
                                                        Creation Time
                                                      </TableCell>
                                                    </TableRow>
                                                  </TableHead>
                                                  <TableBody>
                                                    {std.grades.map((g) => (
                                                      <TableRow>
                                                        <TableCell
                                                          component="th"
                                                          scope="row"
                                                        >
                                                          {subjects.map(
                                                            (sub) => {
                                                              if (
                                                                g.subjectId ===
                                                                sub.id
                                                              ) {
                                                                return sub.name;
                                                              }
                                                            }
                                                          )}
                                                        </TableCell>
                                                        <TableCell
                                                          component="th"
                                                          scope="row"
                                                        >
                                                          {g.description}
                                                        </TableCell>
                                                        <TableCell
                                                          component="th"
                                                          scope="row"
                                                        >
                                                          {g.value}
                                                        </TableCell>
                                                        <TableCell
                                                          component="th"
                                                          scope="row"
                                                        >
                                                          {moment
                                                            .unix(g.time)
                                                            .format(
                                                              "DD-MM-YYYY HH:mm"
                                                            )}
                                                        </TableCell>
                                                      </TableRow>
                                                    ))}
                                                  </TableBody>
                                                </Table>
                                              </Box>
                                            </Collapse>
                                          </TableCell>
                                        </TableRow>
                                      </Collapse>
                                    </TableCell>
                                  </TableRow>
                                </>
                              ))}
                            </>
                          ))}
                          <Modal
                            key={"modal" - selectedUser.id}
                            open={addGradeRecord}
                            onClose={() => setAddGradeRecord(false)}
                          >
                            <AddGradeModal
                              destroyOnClose
                              handleCloseGrade={() => setAddGradeRecord(false)}
                              users={selectedUser}
                              updateGrades={subjectsOfProfessor}
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
