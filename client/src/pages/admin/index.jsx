import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress, MenuItem, InputLabel, Select } from '@mui/material'
import React, { useCallback, useEffect } from 'react'
import { useState} from 'react'
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import AddRecordModal from './AddRecordModal'
import AddProfessorModal from './AddProfessorModal'
import AddSubjectModal from './AddSubjectModal'
import AddUserModal from './AddUserModal'
import ProfessorSubjectsModal from './ProfessorSubjectsModal'
import UserSubjectsModal from './UserSubjectsModal'
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import Record from '../../components/Record'
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import Paper from '@mui/material/Paper';
import moment from 'moment'


const Admin = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [userExist, setUserExist] = useState(false)
  const [searchUserAddress, setSearchUserAddress] = useState('')
  const [users, setUsers] = useState([])
  const [addUserAddress, setAddUserAddress] = useState('')
  const [addUserName, setAddUserName] = useState('')
  const [addUserRecord, setAddUserRecord] = useState('')
  const [grades, setGrades] = useState([])
  const [addRecord, setAddRecord] = useState(false)
  const [addProfessorRecord, setAddProfessorRecord] = useState(false)
  const [addProfessorAddress] = useState('')
  const [addProfessorName] = useState('')
  const [addSubjectRecord, setAddSubjectRecord] = useState(false)
  const [addSubjectName] = useState('')
  const [subjects, setSubjects] = useState([])
  const [subjectList, setSubjectList]= useState(false)
  const [professors, setProfessors] = useState([])
  const [professorList, setProfessorList]= useState([])
  const [subjectName, setSubjectName] = useState('')
  const [subjectValue, setSubjectValue] = useState('')
  const [addProfessorSubjectRecord, setAddProfessorSubjectRecord]= useState(false)
  const [selected,setSelected] = useState([])
  const [selectedSubjectsOfStudent,setSelectedSubjectsOfStudent] = useState([])
  const [professorsSubjects, setProfessorsSubjects] = useState([])
  const [selectedProfessor, setSelectedProfessor] =useState('');
  const [selectedUser, setSelectedUser] =useState('');
  const [addUserSubjectRecord, setAddUserSubjectRecord]= useState(false)
  const [studentList, setStudentList]= useState([])

  const subjectsOfStudent = async (student) => {
    try {
      const ss = await contract.methods.getStudentSubjects().call({ from: accounts[0] })
      let arr = [];
      for (let k = 0; k < professorsSubjects.length; k++) {
       console.log(professorsSubjects[k])
        arr.push({id: null, professorId:professorsSubjects[k].professorId,subjectId:professorsSubjects[k].subjectId, selected:false})          
      }
      console.log(arr)
      for(let i =0; i< ss.length; i++){
          if (ss[i].studentId ===student.user.id){
            for (let j = 0; j < arr.length; j++) {
              if(arr[j].professorId === ss[i].professorId && arr[j].subjectId === ss[i].subjectId) {
                arr[j].id = ss[i].id;
                arr[j].selected = true;
              }
            
            }
          }           
      }
      setStudentList(arr);

      } catch(err) {
      console.log(err);
    }
  }


  const subjectsOfProfessor = async (professorId) => {
    try {
      const ps = await contract.methods.getProfessorSubjects().call({ from: accounts[0] })
      let arr = [];
      for (let k = 0; k < subjects.length; k++) {
       console.log(subjects[k])
        arr.push({id:subjects[k].id,name:subjects[k].name, selected:false})          
      }
      console.log(arr)
      for(let i =0; i< ps.length; i++){
          if (ps[i].professorId ===professorId.prof.id){
            for (let j = 0; j < arr.length; j++) {
              if(arr[j].id === ps[i].subjectId) {
                arr[j].selected = true;
              }
            
            }
          }           
      }
      setProfessorList(arr);

      } catch(err) {
      console.log(err);
    }
  }


  const showModalProfessorsSubjects = (record) => {
    console.log('prfe ',record);
    setSelectedProfessor(record);
    console.log('selecionado',selectedProfessor)
    setAddProfessorSubjectRecord(true);
    subjectsOfProfessor(record)
  };

  const showModalUsersSubjects = (record) => {
    console.log('user ',record);
    setSelectedUser(record);
    console.log('selecionado',selectedUser)
    setAddUserSubjectRecord(true);
    subjectsOfStudent(record);
  };
  
  const getSelected = async () => {
  console.log('hola',professorsSubjects)
    for (let i = 0; i < professorsSubjects.length; i++) {
      console.log('sub id',professorsSubjects[i].subjectId)
      selected.push(professorsSubjects[i].subjectId)      
    }
    return selected
    console.log('getselect',selected)
  }
  
  const getProfessorSubjects = async () => {
    try {
      const ps = await contract.methods.getProfessorSubjects().call({ from: accounts[0] })
      setProfessorsSubjects(ps);
      } catch(err) {
      console.log(err);
    }
  }
  
  const searchUser = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchUserAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      const userExists = await contract.methods.getUserExists(searchUserAddress).call({ from: accounts[0] })
      if (userExists) {
        //const records = await contract.methods.getRecords(searchUserAddress).call({ from: accounts[0] })
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
        console.log('records :>> ', g)
        let arr = [];
        for (let j = 0; j < g.length; j++) {
          for (let i = 0; i < professors.length; i++) {
            if (professors[i].id === ss[g[j].studentSubjectsId].professorId && searchUserAddress === ss[g[j].studentSubjectsId].studentId) {
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
        setGrades(arr)
        setUserExist(true)
      } else {
        setAlert('User does not exist', 'error')
      }
    } catch (err) {
      console.error(err)
    }
  }

  const registerUser = async (addUserAddress,addUserName) => {
    try {
      console.log(addUserAddress)
      await contract.methods.addUser(addUserAddress,addUserName).send({ from: accounts[0] })
      setAddUserRecord(false)
    } catch (err) {
      console.error(err)
    }
  }

  const registerProfessor = async (addProfessorAddress,addProfessorName) => {
    let dupl = false
    for(let i=0; i < professors.length; i++) {
      if(professors[i].id === addProfessorAddress){
        dupl = true
      }
    }
    if(dupl){
      setAlert('Duplicated professor', 'error')
      return
    }
    try {
        await contract.methods.addProfessor(addProfessorAddress,addProfessorName).send({ from: accounts[0]})
        setAddProfessorRecord(false)
    } catch(err) {
      console.log(err);
    }
  }

  const registerSubject  = async (addSubjectName) => {
    let dupl = false
    for(let i=0; i < subjects.length; i++) {
      if(subjects[i].name === addSubjectName){
        dupl = true
      }
    }
    if(dupl){
      setAlert('Duplicated subject', 'error')
      return
    }
    try {
        await contract.methods.addSubject(addSubjectName).send({ from: accounts[0]})
        setAddSubjectRecord(false)
      } catch(err) {
      console.log(err);
    }
  }

  const getSubjects = async () => {
    try {
      const subj = await contract.methods.getSubjects().call({ from: accounts[0] })
      setSubjects(subj)
      //console.log('subjects', subj)

      } catch(err) {
      console.log(err);
    }
  }

  const getProfessors = async () => {
    try {
      const prof = await contract.methods.getProfessors().call({ from: accounts[0] })
      setProfessors(prof)
      //console.log('subjects', subj)

      } catch(err) {
      console.log(err);
    }
  }

  const getUsers = async () => {
    try {
      const us = await contract.methods.getUsers().call({ from: accounts[0] })
      setUsers(us)

      } catch(err) {
      console.log(err);
    }
  }

  const addRecordCallback = useCallback(
    async (subjectName, subjectValue, userAddress) => {
      if (!userAddress) {
        setAlert('Please search for a patient first', 'error')
        return
      }
      try {
          await contract.methods.addRecord(subjectName,subjectValue, userAddress).send({ from: accounts[0] })
          setAlert('New record uploaded', 'success')
          setAddRecord(false)

          // refresh records
          const records = await contract.methods.getRecords(userAddress).call({ from: accounts[0] })
          setGrades(records)
      } catch (err) {
        setAlert('Record upload failed', 'error')
        console.log('subject :>> ',subjectName)
        console.log('value :>> ', subjectValue)
        console.error(err)
      }
    },
    [setAlert, contract, accounts]
  )
  useEffect(() => {
    getSubjects();
    getProfessors();
    getUsers();
    getProfessorSubjects();
  })


  

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
              {role === 'admin' && (
                <>
                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Box display='flex' alignItems='center' justifyContent='space-between' my={5}>
                    <Typography variant='h4'>Register User</Typography>
                    <Modal open={addUserRecord} onClose={() => setAddUserRecord(false)}>
                      <AddUserModal
                        handleCloseUser={() => setAddUserRecord(false)}
                        handleUploadUser={registerUser}
                        addUserAddress={addUserAddress}
                        addUserName={addUserName}
                      />
                    </Modal>
                    <CustomButton text={'New User'} handleClick={() => setAddUserRecord(true)}>
                      <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
                  </Box>

                  {users.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No Users found</Typography>
                    </Box>
                  )}

                  {users.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="users table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Subject Name</TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {users.map((user) => (
                              <TableRow
                                key={user.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {user.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <CustomButton text={'Enrollment'} handleClick={() => showModalUsersSubjects({user})}/>
                                 </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Modal key={'modal'-selectedUser.id} open={addUserSubjectRecord} onClose={() => setAddUserSubjectRecord(false)}>
                        <UserSubjectsModal
                          destroyOnClose
                          handleCloseUserSubject={() => setAddUserSubjectRecord(false)}
                          users={selectedUser}
                          professorsSubjects={professorsSubjects}
                          professors={professors}
                          subjects={subjects}
                          subjectsOfStudent={studentList}
                        />
                      </Modal>
                    </Box>
                  )}

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Box display='flex' alignItems='center' justifyContent='space-between' my={5}>
                      <Typography variant='h4'>Register Professor</Typography>
                      <CustomButton text={'New Professor'} handleClick={() => setAddProfessorRecord(true)}>
                          <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                        </CustomButton>
                      <Modal key="professorModal" open={addProfessorRecord} onClose={() => setAddProfessorRecord(false)}>
                        <AddProfessorModal
                          handleCloseProfessor={() => setAddProfessorRecord(false)}
                          handleUploadProfessor={registerProfessor}
                          addProfessorAddress={addProfessorAddress}
                          addProfessorName={addProfessorName}
                        />
                      </Modal>
                  </Box>
                  {professors.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No Professors found</Typography>
                    </Box>
                  )}

                  {professors.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="professors table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Professors Name</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {professors.map((prof) => (
                              <TableRow
                                key={prof.name}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {prof.name}
                                </TableCell>
                                <TableCell component="th" scope="row">
                                  <CustomButton text={'Subjects'} handleClick={() => showModalProfessorsSubjects({prof})}/>
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                      <Modal key={'modal'-selectedProfessor.id} open={addProfessorSubjectRecord} onClose={() => setAddProfessorSubjectRecord(false)}>
                        <ProfessorSubjectsModal
                          destroyOnClose
                          handleCloseProfessorSubject={() => setAddProfessorSubjectRecord(false)}
                          subjects={subjects}
                          professors={selectedProfessor}
                          professorId={selectedProfessor.id}
                          //professorsSubjects={professorsSubjects}
                          //selected={selected}
                          subjectsOfProfessor={professorList}
                        />
                      </Modal>
                    </Box>
                  )}

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Box display='flex' alignItems='center' justifyContent='space-between' my={5}>
                    <Typography variant='h4'>Add Subject</Typography>
                    <Modal key="subjectModal" open={addSubjectRecord} onClose={() => setAddSubjectRecord(false)}>
                      <AddSubjectModal
                        handleCloseSubject={() => setAddSubjectRecord(false)}
                        handleUploadSubject={registerSubject}
                        addSubjectName={addSubjectName}
                      />
                    </Modal>
                    <CustomButton text={'New Subject'} handleClick={() => setAddSubjectRecord(true)}>
                      <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
                  </Box>

                  {subjects.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No Subjects found</Typography>
                    </Box>
                  )}

                  {subjects.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      <TableContainer component={Paper}>
                        <Table sx={{ minWidth: 650 }} aria-label="subjects table">
                          <TableHead>
                            <TableRow>
                              <TableCell>Subject Name</TableCell>
                              <TableCell></TableCell>
                            </TableRow>
                          </TableHead>
                          <TableBody>
                            {subjects.map((sub) => (
                              <TableRow
                                key={sub.id}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                              >
                                <TableCell component="th" scope="row">
                                  {sub.name}
                                </TableCell>
                              </TableRow>
                            ))}
                          </TableBody>
                        </Table>
                      </TableContainer>
                    </Box>
                  )}

                    {/* <div>
                      <FormControl fullWidth>
                        <InputLabel id="subjectsList">Subjects</InputLabel>
                        <Select
                          labelId="demo-subjectsList"
                          id="demo-simple-select"
                          value={0}
                          label="Subject"
                          onLoad={() => getSubjects()}
                          //onChange={handleChange}
                        >
                          {
                            subjects.map((subject) => (
                              <MenuItem value={subject.id}>{subject.name}</MenuItem>                              
                            )
                          )}
                        </Select>
                      </FormControl>
                      
                    </div>
                    <div>
                      <FormControl fullWidth>
                        <InputLabel id="professorsList">Professors</InputLabel>
                        <Select
                          labelId="demo-professorsList"
                          id="demo-simple-select2"
                          value={0}
                          label="Professor"
                          onLoad={() => getProfessors()}
                          //onChange={handleChange}
                        >
                          {
                            professors.map((professor) => (
                              <MenuItem value={professor.id}>{professor.name}</MenuItem>                              
                            )
                          )}
                        </Select>
                      </FormControl>
                      
                    </div> */}
                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Modal key="recordModal" open={addRecord} onClose={() => setAddRecord(false)}>
                    <AddRecordModal
                      handleClose={() => setAddRecord(false)}
                      handleUpload={addRecordCallback}
                      userAddress={searchUserAddress}
                      subjectName={subjectName}
                      subjectValue={subjectValue}
                    />
                  </Modal>

                  <Typography variant='h4'>User Records</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search user by wallet address'
                        value={searchUserAddress}
                        onChange={e => setSearchUserAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Search'} handleClick={() => searchUser()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                    <CustomButton text={'New Record'} handleClick={() => setAddRecord(true)} disabled={!userExist}>
                      <CloudUploadRoundedIcon style={{ color: 'white' }} />
                    </CustomButton>
                  </Box>

                  {userExist && grades.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {userExist && grades.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                        <Box mb={2}>
                          {/* <Record key={index} record={record} /> */}
                          <React.Fragment>
                      <TableContainer component={Paper}>
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
                            {grades.map((g) => (
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
                        </Box>
                    </Box>
                  )}
      
                </>
              )}
              {(role === 'user' || role === 'professor') && (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>Only Admin can access this page</Typography>
                </Box>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default Admin
