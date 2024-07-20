import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const Updatemember = ({update,showDialog,setShowDialog,changeRoweData,updateRow,department}) => {
  return (
    <div>
              <div>
     {update && (
          <Dialog open={showDialog} style={{ height: 600 }}>
            <DialogTitle>Update Data</DialogTitle>
            <DialogContent>

            
               <form className="space-y-4 my-6">
 

      <div className="container d-flex flex-column align-items-center">
        <div className="row my-2">
          <div className="col-md-6">
            <TextField
              id="outlined-basic"
              label="Item code"
              variant="outlined"
              name="memberName"
              value={update.memberName}
              onChange={changeRoweData}
              sx={{ width: 250 }}
              required
            />
          </div>
          <div className="col-md-6">
          <FormControl sx={{width:250}}>
        <InputLabel id="demo-simple-select-label">Department</InputLabel>
        <Select
          labelId="demo-simple-select-label"
          id="demo-simple-select"
          value={update.department}
          label="department"
          name='department'
          onChange={changeRoweData}
        > 
        <MenuItem value="TCGC">TCGC</MenuItem>
          <MenuItem value="MICROBIOLOGY">MICROBIOLOGY</MenuItem>
          <MenuItem value="HEAMOTOLGY">HEAMOTOLGY</MenuItem>
          <MenuItem value="BIOCHEMISTRY">BIOCHEMISTRY</MenuItem>
          <MenuItem value="HPLC">HPLC</MenuItem>
          <MenuItem value="AAS">AAS</MenuItem>
          <MenuItem value="PARASITOLOGY">PARASITOLOGY</MenuItem>
          <MenuItem value="GENERAL">GENERAL</MenuItem>
          {/* <MenuItem value="Parasitology">Histology</MenuItem> */}
        </Select>
      </FormControl>
            
          </div>
        </div>
      
       
        
      </div>
     
    </form>
            </DialogContent>
            <DialogActions>
              <Button type="submit" variant="contained" onClick={updateRow}>
                Update
              </Button>
              <Button
                variant="outlined"
                color="error"
                onClick={() => {
                  setShowDialog(false);
                }}
              >
                Cancel
              </Button>
            </DialogActions>
          </Dialog>
        )}
</div>
    </div>
  )
}

export default Updatemember