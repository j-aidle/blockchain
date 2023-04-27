import React, { useState } from 'react'
import CustomButton from '../../components/CustomButton'
import { Box, Chip, IconButton, Typography, FormControl, TextField } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import useAlert from '../../contexts/AlertContext/useAlert'

const AddRecordModal = ({ handleClose, handleUpload, userAddress }) => {
  const { setAlert } = useAlert()
  const [file, setFile] = useState(null)
  const [buffer, setBuffer] = useState(null)

  const handleFileChange = fileObj => {
    const { file } = fileObj
    setBuffer(null)
    setFile(file)
    console.log('file.name :>> ', file.name)

    const reader = new FileReader()
    reader.readAsArrayBuffer(file)
    reader.onloadend = () => {
      const buffer = Buffer.from(reader.result)
      setBuffer(buffer)
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
          <IconButton onClick={() => handleClose()}>
            <CloseRoundedIcon />
          </IconButton>
        </Box>
        <Box display='flex' flexDirection='column' my={1}>
          <Typography variant='h4'>Add Record</Typography>
          <Box display='flex' justifyContent='space-between' mb={2}>
            <Box flexGrow={1} />
            <CustomButton
              text='upload'
              handleClick={() => handleUpload(buffer, userAddress)}
              disabled={!buffer}
            />
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default AddRecordModal
