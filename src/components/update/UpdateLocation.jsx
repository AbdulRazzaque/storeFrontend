import React from 'react'
import { Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';

const UpdateLocation = ({update,showDialog,setShowDialog,changeRoweData,updateRow,department}) => {
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
              label="Update location"
              variant="outlined"
              name="locationName"
              value={update.locationName}
              onChange={changeRoweData}
              sx={{ width: 250 }}
              required
            />
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

export default UpdateLocation