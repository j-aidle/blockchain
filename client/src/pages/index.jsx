import { Box, Typography, Backdrop, CircularProgress, Divider } from '@mui/material'
import React from 'react'
import AccountBalanceWalletRoundedIcon from '@mui/icons-material/AccountBalanceWalletRounded'
import useEth from '../contexts/EthContext/useEth'
import PersonAddAlt1RoundedIcon from '@mui/icons-material/PersonAddAlt1Rounded'
import CustomButton from '../components/CustomButton'
import { useNavigate } from 'react-router-dom'
import LoginRoundedIcon from '@mui/icons-material/LoginRounded'
import { grey } from '@mui/material/colors'
import '../App.css'

const Home = () => {
  const {
    state: { contract, accounts, role, loading },
    dispatch,
  } = useEth()
  const navigate = useNavigate()

  const registerAdmin = async () => {
    try {
      await contract.methods.addAdmin().send({ from: accounts[0] })
      dispatch({
        type: 'ADD_ADMIN',
      })
    } catch (err) {
      console.error(err)
    }
  }

  const ActionSection = () => {
    if (!accounts) {
      return (
        <Typography variant='h5' color='white'>
          Open your MetaMask wallet to get connected, then refresh this page
        </Typography>
      )
    } else {
      if (role === 'unknown') {
        return (
          <Box display='flex' flexDirection='column' alignItems='center'>
            <Box mb={2}>
              <CustomButton text='Admin Register' handleClick={() => registerAdmin()}>
                <PersonAddAlt1RoundedIcon style={{ color: 'white' }} />
              </CustomButton>
            </Box>
            <Typography variant='h5' color='white'>
              If you are an user, ask your admin! he's going to register you.
            </Typography>
          </Box>
        )
      } else if (role === 'admin') {
        return (
          <CustomButton text='Admin Page' handleClick={() => navigate('/admin')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } else if (role === 'user') {
        return (
          <CustomButton text='User Page' handleClick={() => navigate('/user')}>
            <LoginRoundedIcon style={{ color: 'white' }} />
          </CustomButton>
        )
      } 
    }
  }

  if (loading) {
    return (
      <Backdrop sx={{ color: '#fff', zIndex: theme => theme.zIndex.drawer + 1 }} open={loading}>
        <CircularProgress color='inherit' />
      </Backdrop>
    )
  } else {
    return (
      <Box
        display='flex'
        flexDirection='column'
        justifyContent='center'
        alignItems='center'
        width='100vw'
        height='100vh'
        id='background'
      >
        <Box id='home-page-box' display='flex' flexDirection='column' justifyContent='center' alignItems='center' p={5}>
          <Box mt={2} mb={5}>
            <Typography variant='h4' color='white'>
              Your Record
            </Typography>
          </Box>
          <ActionSection />
          <Box display='flex' alignItems='center' mt={2}>
            <Typography variant='h5' color='white'>
              powered by{' '}
            </Typography>
            <Box mx={1}>
              <img
                src='https://cdn.worldvectorlogo.com/logos/ethereum-1.svg'
                alt='Ethereum logo vector'
                style={{ height: 20 }}
              ></img>
            </Box>
          </Box>
        </Box>
      </Box>
    )
  }
}

export default Home
