import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Box, FormControl, TextField, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import useEth from '../../contexts/EthContext/useEth'

const AddRecordModal = ({ handleClose, handleUpload, userAddress }) => {
  const { setAlert } = useAlert()
  const [subjectName, setSubjectName] = useState('')
  const [subjectValue, setSubjectValue] = useState('')

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
          <IconButton onClick={() => handleClose()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display='flex' flexDirection='column' my={1}>
          <Typography variant='h4'>Add Record</Typography>
          <Box my={2}>
            <FormControl fullWidth>
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
          </Box>
          <Box display='flex' justifyContent='space-between' mb={2}>
            <Box flexGrow={1} />
            <CustomButton
              text='upload'
              handleClick={() => handleUpload(subjectName,subjectValue, userAddress)}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddRecordModal