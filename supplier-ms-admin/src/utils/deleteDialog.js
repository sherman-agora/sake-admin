import React from "react";
import { DeleteButton } from "react-admin";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";

export default function DeleteDialog({ record, props, child }) {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = (e) => {
    e.stopPropagation();

    setOpen(true);
  };

  const handleClose = (e) => {
    e.stopPropagation();
    setOpen(false);
  };

  return (
    <div>
      <Button variant="outlined" color="primary" onClick={handleClickOpen}>
        Delete
      </Button>
      <Dialog
        open={open}
        onClick={handleClose}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Warning!!"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure to DELETE this content?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} color="primary">
            Back
          </Button>
          {!!child ? (
            child
          ) : (
            <DeleteButton
              basePath={props.basePath}
              record={record}
              resource={props.resource}
            />
          )}
        </DialogActions>
      </Dialog>
    </div>
  );
}
