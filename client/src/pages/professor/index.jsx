import React, { useState, useEffect } from 'react'
import { Box, Typography, Backdrop, CircularProgress } from '@mui/material'
import useEth from '../../contexts/EthContext/useEth'


const Professor = () => {
  const {
    state: { contract, accounts, role, loading },
  } = useEth()

  const [records, setRecords] = useState([])
  const [loadingRecords, setLoadingRecords] = useState(true)


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
          <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
            <CircularProgress color='inherit' />
          </Backdrop>
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
              {(role === 'admin' || role === 'user') && (
                <Box display='flex' justifyContent='center'>
                  <Typography variant='h5'>Only professor can access this page</Typography>
                </Box>
              )}
              {role === 'professor' && (
                <>
                  <Typography variant='h4'>Professor page</Typography>


                </>
              )}
            </>
          )}
        </Box>
      </Box>
    )
  }
}

export default Professor
