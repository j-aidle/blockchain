import React, { useState, useEffect } from "react";
import { Box, Typography, Backdrop, CircularProgress } from "@mui/material";
import useEth from "../../contexts/EthContext/useEth";
import Record from "../../components/Record";
import moment from "moment";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";

const User = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth();

  const [records, setRecords] = useState([]);
  const [loadingRecords, setLoadingRecords] = useState(true);
  const [gradesList, setGradesList] = useState([]);

  /*useEffect(() => {
    const getRecords = async () => {
      try {
        const records = await contract.methods.getRecords(accounts[0]).call({ from: accounts[0] })
        setRecords(records)
        setLoadingRecords(false)
      } catch (err) {
        console.error(err)
        setLoadingRecords(false)
      }
    }
    getRecords()
  })*/
  useEffect(() => {
    gradesOfStudent();
    console.log(gradesList);
    console.log(gradesList.length);
  });

  const gradesOfStudent = async () => {
    try {
      const ss = await contract.methods
        .getStudentSubjects()
        .call({ from: accounts[0] });
      const subject = await contract.methods
        .getSubjects()
        .call({ from: accounts[0] });
      const professors = await contract.methods
        .getProfessors()
        .call({ from: accounts[0] });
      const students = await contract.methods
        .getUsers()
        .call({ from: accounts[0] });
      const g = await contract.methods.getGrades().call({ from: accounts[0] });
      let arr = [];

      for (let j = 0; j < g.length; j++) {
        for (let i = 0; i < professors.length; i++) {
          if (professors[i].id == ss[g[j].studentSubjectsId].professorId && accounts[0] === ss[g[j].studentSubjectsId].studentId) {
            arr.push({
              id: g[j].id,
              professorId: professors[i].name,
              subjectId: subject[ss[g[j].studentSubjectsId].subjectId].name,
              description: g[j].description,
              value: g[j].value,
              time: g[j].momentAddition,
            });
          }
        }
      }

      function compare (a,b)  {
        if ( a.subjectId < b.subjectId ){
          return -1;
        }
        if ( a.subjectId > b.subjectId ){
          return 1;
        }
        return 0;
      }

      console.log(arr.sort(compare));
      setGradesList(arr.sort(compare));
      //console.log("sub of prof list", subjectsProfessorList);
    } catch (err) {
      console.log(err);
    }
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
              {role === "admin" && (
                <Box display="flex" justifyContent="center">
                  <Typography variant="h5">
                    Only user can access this page
                  </Typography>
                </Box>
              )}
              {role === "user" && (
                <>
                  <Typography variant="h4">My Records</Typography>

                  {gradesList.length === 0 && (
                    <Box
                      display="flex"
                      alignItems="center"
                      justifyContent="center"
                      my={5}
                    >
                      <Typography variant="h5">No records found</Typography>
                    </Box>
                  )}

                  {gradesList.length > 0 && (
                    <React.Fragment>
                      <TableContainer component={Paper}>
                        <Table size="small" aria-label="purchases">
                          <TableHead>
                            <TableRow>
                              <TableCell>Subject</TableCell>
                              <TableCell>Description</TableCell>
                              <TableCell>Value</TableCell>
                              <TableCell>Creation Time</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {gradesList.map((g) => (
                              <TableRow>
                                <TableCell component="th" scope="row">
                                  {g.subjectId}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {g.description}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {g.value}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  {moment
                                    .unix(g.time)
                                    .format("DD-MM-YYYY HH:mm")}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
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

export default User;
