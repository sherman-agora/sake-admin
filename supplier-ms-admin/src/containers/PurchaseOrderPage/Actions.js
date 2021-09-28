import React from 'react';
import Button from '@material-ui/core/Button';
import { CreateButton, ExportButton, RefreshButton } from 'react-admin';
import Toolbar from '@material-ui/core/Toolbar';

const Actions = ({
                       basePath,
                       currentSort,
                       displayedFilters,
                       exporter,
                       filters,
                       filterValues,
                       onUnselectItems,
                       resource,
                       selectedIds,
                       showFilter,
                       total
                     }) => (
  <Toolbar>
    {filters && React.cloneElement(filters, {
      resource,
      showFilter,
      displayedFilters,
      filterValues,
      context: 'button',
    })}
    <CreateButton basePath={basePath} />
    <ExportButton
      disabled={total === 0}
      resource={resource}
      sort={currentSort}
      filter={filterValues}
      exporter={exporter}
    />
  </Toolbar>
);

export default Actions;
