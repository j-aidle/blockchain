import { Box, Divider, FormControl, Modal, ListItemText, TextField, Typography, Backdrop, CircularProgress, Menu, MenuItem, InputLabel, Select } from '@mui/material'
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
import CloudUploadRoundedIcon from '@mui/icons-material/CloudUploadRounded'
import Record from '../../components/Record'


const Admin = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()
  const { setAlert } = useAlert()

  const [userExist, setUserExist] = useState(false)
  const [searchUserAddress, setSearchUserAddress] = useState('')
  const [addUserAddress, setAddUserAddress] = useState('')
  const [addUserName, setAddUserName] = useState('')
  const [addUserRecord, setAddUserRecord] = useState('')
  const [records, setRecords] = useState([])
  const [addRecord, setAddRecord] = useState(false)
  const [addProfessorRecord, setAddProfessorRecord] = useState(false)
  const [addProfessorAddress] = useState('')
  const [addProfessorName] = useState('')
  const [addSubjectRecord, setAddSubjectRecord] = useState(false)
  const [addSubjectName] = useState('')
  const [subjects, setSubjects] = useState([])
  const [subjectList, setSubjectList]= useState(false)
  const [professors, setProfessors] = useState([])
  const [professorList, setProfessorList]= useState(false)
  const [subjectName, setSubjectName] = useState('')
  const [subjectValue, setSubjectValue] = useState('')
  
  const searchUser = async () => {
    try {
      if (!/^(0x)?[0-9a-f]{40}$/i.test(searchUserAddress)) {
        setAlert('Please enter a valid wallet address', 'error')
        return
      }
      const userExists = await contract.methods.getUserExists(searchUserAddress).call({ from: accounts[0] })
      if (userExists) {
        const records = await contract.methods.getRecords(searchUserAddress).call({ from: accounts[0] })
        console.log('records :>> ', records)
        setRecords(records)
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
    } catch (err) {
      console.error(err)
    }
  }

  const registerProfessor = async (addProfessorAddress,addProfessorName) => {
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
          setRecords(records)
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

                  <Typography variant='h4'>Register User</Typography>
                  <Box display='flex' alignItems='center' my={1}>
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

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Typography variant='h4'>Register Professor</Typography>
                  <Modal key="professorModal" open={addProfessorRecord} onClose={() => setAddProfessorRecord(false)}>
                    <AddProfessorModal
                      handleCloseProfessor={() => setAddProfessorRecord(false)}
                      handleUploadProfessor={registerProfessor}
                      addProfessorAddress={addProfessorAddress}
                      addProfessorName={addProfessorName}
                    />
                    </Modal>
                    <CustomButton text={'New Professor'} handleClick={() => setAddProfessorRecord(true)}>
                      <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                    </CustomButton>

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

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
                    <div>
                    <Menu
                        id="subjectsMenu"
                        aria-labelledby="subjectsMenu"
                        anchorOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'left',
                        }}
                        open={subjectList} onClose={() => setSubjectList(false)}
                      >
                        {subjects.map((subject, index) => (
                                  <MenuItem
                                    key={index}
                                    disabled={index === 0}
                                  >
                                    
                                    <ListItemText key={subject.id}>{subject}</ListItemText>
                                  </MenuItem>
                                ))}
                      </Menu>
                      <CustomButton text={'Subjects List'} handleClick={() => getSubjects()}>
                        <SearchRoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
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
                            subjects.map((subject, index) => (
                              <MenuItem value={subject.id}>{subject.name}</MenuItem>                              
                            )
                          )}
                        </Select>
                      </FormControl>
                      
                    </div>
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

                  {userExist && records.length === 0 && (
                    <Box display='flex' alignItems='center' justifyContent='center' my={5}>
                      <Typography variant='h5'>No records found</Typography>
                    </Box>
                  )}

                  {userExist && records.length > 0 && (
                    <Box display='flex' flexDirection='column' mt={3} mb={-2}>
                      {records.map((record,index) => (
                        <Box mb={2} key={index}>
                          <Record key={index} record={record} />
                        </Box>
                      ))}
                    </Box>
                  )}
      
                </>
              )}
              {role === 'user' && (
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
