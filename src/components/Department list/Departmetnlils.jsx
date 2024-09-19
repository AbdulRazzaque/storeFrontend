import React from 'react'
import { Box, Tab, Tabs, Typography } from '@mui/material';
import PropTypes from 'prop-types';
// import Promotion from './Promotion';
// import Award from './Award';
// import Travel from './Travel';
// import Transfer from './Transfer';
// import Resignations from './Resignations';
// import Complaints from './Complaints';
// import Warning from './Warning';
// import Terminations from './Terminations';
const Departmetnlils = ({ departments ,onDepartmentSelect  }) => {
  // console.log(departments,'depamrtnt')
    //  =====================================logic==========================================================================
    const [display,setDisplay]=React.useState(false)
    const [value, setValue] = React.useState();
    const handleChange = (event, newValue) => {
        setValue(newValue);
        const selectedDepartment = departments[newValue].name;

        onDepartmentSelect(selectedDepartment)
      };


      function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;
      
        return (
          <div
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            {...other}
          >
            {value === index && (
              <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
              </Box>
            )}
          </div>
        );
      }
      
      CustomTabPanel.propTypes = {
        children: PropTypes.node,
        index: PropTypes.number.isRequired,
        value: PropTypes.number.isRequired,
      };

      Departmetnlils.propTypes = {
        departments: PropTypes.array.isRequired,
        onDepartmentSelect: PropTypes.func.isRequired
    };
    
 
      function a11yProps(index) {
        return {
          id: `simple-tab-${index}`,
          'aria-controls': `simple-tabpanel-${index}`,
        }; 
      }
    
  return (
    
        <div className="box">
<Box sx={{ width: '100%', height:50}} className="bg-white my-2 mx-2   ">
  <Box sx={{ borderBottom: 1,  borderColor: 'divider',}}>
    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className='tabs'>

      {
        departments.map((department,index)=>{

        return(  <Tab label={department.name} key={index} {...a11yProps(index)} className='tab'/>)
        })
      }
    </Tabs>
  </Box>
  </Box>
  <div className='mt-1'>


  {departments.map((department, index) => (
          <CustomTabPanel value={value} index={index} key={index}>
            <p>{department.content}</p>
          </CustomTabPanel>
        ))}
  </div>

</div>

  )
}

export default Departmetnlils




