// // LoginModal.js
// import React, { useState } from 'react';
// import '../model/loginmodel.css'
// const LoginModal = ({ isOpen, onClose, onLogin }) => {
//   const [username, setUsername] = useState('');
//   const [password, setPassword] = useState('');

//   const handleSubmit = (e) => {
//     e.preventDefault();
//     // Replace with your authentication logic
//     if (username === 'admin' && password === 'password') {
//       onLogin();
//     } else {
//       alert('Invalid credentials');
//     }
//   };

//   if (!isOpen) return null;

//   return (
//     <div className="modal">
//       <div className="modal-content">
//         <span className="close" onClick={onClose}>&times;</span>
//         <form onSubmit={handleSubmit}>
//           <label>
//             Username:
//             <input
//               type="text"
//               value={username}
//               onChange={(e) => setUsername(e.target.value)}
//             />
//           </label>
//           <label>
//             Password:
//             <input
//               type="password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//           </label>
//           <button type="submit">Login</button>
//         </form>
//       </div>
//     </div>
//   );
// };

// export default LoginModal;

import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';

import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

import { TextField } from '@mui/material';


const BootstrapDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
  '& .MuiPaper-root': {
    width: 1200, // Adjust the value to increase or decrease width
  },
}));


const LoginModal = ({ isOpen, onClose, onLogin }) => {
    const [username, setUsername] = React.useState('');
  const [password, setPassword] = React.useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // Replace with your authentication logic
    // if (username === 'tharb' && password === 'tharb@123') {
    if (username === 'tharb' && password === 'tharb@123') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  if (!isOpen) return null;
  return (
    <React.Fragment>

<BootstrapDialog
        onClose={onClose}
        aria-labelledby="customized-dialog-title"
        open={isOpen}
      >

        <IconButton 
          aria-label="close"
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <CloseIcon  />
        </IconButton >
     
         <div>
                  <form onSubmit={handleSubmit}>
            <div className="row">
              <div className="col-12 my-5 mx-5">
              <TextField
            id="outlined-basic"
            label="User name"
            variant="outlined"
            sx={{ width: 500 }}
            required
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />
              </div>
              <div className="col-12 mx-5">
              <TextField
            id="outlined-basic"
            label="Passowrd"
            variant="outlined"
            sx={{ width: 500 }}
            required
            type='password'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

              </div>
            </div>

<div className='my-3 text-center'>

<Button variant='contained' type="submit">Login</Button>
</div>
</form>
      </div>
             
        
 
        </BootstrapDialog>
    </React.Fragment>
  )
}

export default LoginModal