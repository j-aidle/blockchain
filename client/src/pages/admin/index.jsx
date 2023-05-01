import { Box, Divider, FormControl, Modal, TextField, Typography, Backdrop, CircularProgress } from '@mui/material'
import React, { useCallback } from 'react'
import { useState} from 'react'
import CustomButton from '../../components/CustomButton'
import SearchRoundedIcon from '@mui/icons-material/SearchRounded'
import useEth from '../../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import AddRecordModal from './AddRecordModal'
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
  const [records, setRecords] = useState([])
  const [addRecord, setAddRecord] = useState(false)
  const [userAddr, setUserAddr] = useState('')
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

  const registerUser = async () => {
    try {
      await contract.methods.addUser(addUserAddress).send({ from: accounts[0] })
    } catch (err) {
      console.error(err)
    }
  }

  const rec = async () => {
    if (!userAddr) {
      setAlert('Please search for a patient first', 'error')
      return
    }
    try {
        await contract.methods.addRecord(subjectName,subjectValue, userAddr).send({ from: accounts[0] })
        setAlert('New record uploaded', 'success')
        setAddRecord(false)

        // refresh records
        const records = await contract.methods.getRecords(userAddr).call({ from: accounts[0] })
        setRecords(records)
    } catch (err) {
      setAlert('Record upload failed', 'error')
      console.log('subject :>> ',subjectName)
      console.log('value :>> ', subjectValue)
      console.error(err)
    }
  }

  const addRecordCallback = useCallback(
    async (subjectName, subjectValue, userAddress) => {
      if (!userAddress) {
        setAlert('Please search for a patient first', 'error')
        return
      }
      try {
        console.log('eo')
        console.log('subject :>> ',subjectName)
        console.log('value :>> ', subjectValue)
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
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Register user by wallet address'
                        value={addUserAddress}
                        onChange={e => setAddUserAddress(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Register'} handleClick={() => registerUser()}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>

                  <Typography variant='h4'>add rec</Typography>
                  <Box display='flex' alignItems='center' my={1}>
                    <FormControl fullWidth>
                      <TextField
                        variant='outlined'
                        placeholder='Search user by wallet address'
                        value={userAddr}
                        onChange={e => setUserAddr(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                      <TextField
                        variant='outlined'
                        placeholder='Name of the subject'
                        value={subjectName}
                        onChange={e => setSubjectName(e.target.value)}
                        InputProps={{ style: { fontSize: '15px' } }}
                        InputLabelProps={{ style: { fontSize: '15px' } }}
                        size='small'
                      />
                      <TextField 
                        inputProps={{ inputMode: 'numeric', pattern: '[0-9]*' }}
                        placeholder='Value of the subject'
                        value={subjectValue}
                        onChange={e => setSubjectValue(e.target.value)}
                      />
                    </FormControl>
                    <Box mx={2}>
                      <CustomButton text={'Register'} handleClick={() => rec()}>
                        <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
                      </CustomButton>
                    </Box>
                  </Box>

                  <Box mt={6} mb={4}>
                    <Divider />
                  </Box>
           
                  <Modal open={addRecord} onClose={() => setAddRecord(false)}>
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
                        <Box mb={2}>
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
