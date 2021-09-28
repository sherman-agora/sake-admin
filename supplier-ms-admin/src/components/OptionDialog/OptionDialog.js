import React from 'react';
import PropTypes from 'prop-types';
import Dialog from '@material-ui/core/Dialog';
import DialogTitle from '@material-ui/core/DialogTitle';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import DialogActions from '@material-ui/core/DialogActions';
import Button from '@material-ui/core/Button';
import { useTranslate } from 'react-admin';
import ListItemText from '@material-ui/core/ListItemText';

function OptionDialog({ title, options, open, onSelect, onCancel }) {
  const translate = useTranslate();

  const handleListItemClick = (selected) => () => {
    onSelect(selected);
  };

  return (
    <Dialog onClose={onCancel} aria-labelledby="simple-dialog-title" open={open}>
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <List>
        {options.map(option => (
          <ListItem button onClick={handleListItemClick(option)} key={option.id}>
            <ListItemText primary={option.label} />
          </ListItem>
        ))}
      </List>
      <DialogActions>
        <Button onClick={onCancel} color="primary">
          {translate('common.cancel')}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

OptionDialog.propTypes = {
  title: PropTypes.string.isRequired,
  options: PropTypes.arrayOf({
    id: PropTypes.string.isRequired,
    label: PropTypes.string.isRequired,
  }).isRequired,
  open: PropTypes.bool,
  onSelect: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default OptionDialog;
