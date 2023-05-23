import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Box, FormControl, TextField, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useAlert from '../../contexts/AlertContext/useAlert'
import useEth from '../../contexts/EthContext/useEth'

const AddGradeModal = ({  handleCloseGrade, users }) => {
  const {
    state: { contract, accounts },
  } = useEth();
  const { setAlert } = useAlert()
  const [addDescription, setDescription] = useState('')
  const [addValue, setValue] = useState('')

  const saveGrade = async () =>  {
    try {
      console.log('id',users.std.id)
      contract.methods.addGrade(users.std.id,addDescription,addValue).send({ from: accounts[0] });
      handleCloseGrade();
    } catch (err) {
      console.error(err);
    }
  }

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
          <IconButton onClick={() => handleCloseGrade()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display='flex' flexDirection='column' my={1}>
          <Typography variant='h4'>Add Grade</Typography>
          <Box my={2}>
            <FormControl fullWidth>
              <TextField
                variant='outlined'
                placeholder='Description'
                value={addDescription}
                onChange={e => setDescription(e.target.value)}
                InputProps={{ style: { fontSize: '15px' } }}
                InputLabelProps={{ style: { fontSize: '15px' } }}
                size='small'
              />
              <TextField 
                placeholder='Value'
                value={addValue}
                onChange={e => setValue(e.target.value)}
                inputProps={{ inputMode: 'numeric', pattern: '[0-10]*' }} />
            </FormControl>
          </Box>
          <Box display='flex' justifyContent='space-between' mb={2}>
            <Box flexGrow={1} />
            <CustomButton
              text='Save'
              handleClick={() => saveGrade()}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddGradeModal