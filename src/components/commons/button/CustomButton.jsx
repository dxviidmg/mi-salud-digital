import React from 'react'
import Button from '@mui/material/Button';


const CustomButton = ({text, onClick}) => {
    console.log('text', text, onClick)
  return (
    <Button variant="contained" color="primary" onClick={onClick}>{text} 
  </Button>
  )
}

export default CustomButton
