import React, { useEffect, useState } from "react";
import PropTypes from "prop-types";
import { useTranslate } from "react-admin";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import Tooltip from "@material-ui/core/Tooltip";
import IconButton from "@material-ui/core/IconButton";
import { makeStyles } from "@material-ui/core";
import FilterListIcon from "@material-ui/icons/FilterList";
import InputBase from "@material-ui/core/InputBase";
import { Search } from "@material-ui/icons";
import Divider from "@material-ui/core/Divider";
import Chip from "@material-ui/core/Chip";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import gql from "graphql-tag";
import { useQuery } from "@apollo/react-hooks";

const GET_PRODUCT_CATEGORIES = gql`
  query getCategories {
    productCategories {
      id
      nameEn
      nameChi
    }
  }
`;

const useStyles = makeStyles((theme) => ({
  toolbar: {
    paddingLeft: theme.spacing(2),
    paddingRight: theme.spacing(1),
  },
  title: {
    flex: 1,
  },
  input: {
    marginLeft: theme.spacing(1),
  },
  iconButton: {
    padding: 10,
  },
  divider: {
    height: 28,
    margin: 4,
  },
  chips: {
    display: "flex",
    justifyContent: "flex-start",
    flexWrap: "wrap",
    "& > *": {
      margin: theme.spacing(0.5),
    },
  },
}));

function ProductListToolbar({ where, setWhere }) {
  const translate = useTranslate();
  const classes = useStyles();
  const [code, setCode] = useState("");
  const [search, setSearch] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [timeConstraint, setTimeConstraint] = useState([]);
  const { data } = useQuery(GET_PRODUCT_CATEGORIES);

  const categories = data ? data.productCategories : [];

  // if where is changed
  useEffect(() => {
    if (where.code_starts_with) {
      setSearch(where.code_starts_with);
    }

    // TODO: filter categories

    // TODO: filter time constraint
  }, [where]);

  // if element changed is changed
  useEffect(() => {
    const w = {};
    if (search) {
      w.code_starts_with = search;
    }

    // TODO: filter categories

    // TODO: filter time constraint

    setWhere(w);
  }, [search, selectedCategories, timeConstraint, setWhere]);

  const handleChangeCode = (e) => {
    setCode(e.target.value);
  };

  const handleSearch = (e) => {
    e.preventDefault();
    setSearch(code);
    setCode("");
  };

  const handleOpen = (e) => {
    setAnchorEl(e.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const cancelSearch = () => {
    setSearch(null);
  };

  const handleFilter = (field) => () => {
    if (!timeConstraint.includes(field)) {
      setTimeConstraint([...timeConstraint, field]);
    } else {
      timeConstraint.splice(timeConstraint.indexOf(field), 1);
      setTimeConstraint([...timeConstraint]);
    }
  };

  const handleFilterCat = (id) => () => {
    if (!selectedCategories.includes(id)) {
      setSelectedCategories([...selectedCategories, id]);
    } else {
      selectedCategories.splice(selectedCategories.indexOf(id), 1);
      setSelectedCategories([...selectedCategories]);
    }
  };

  return (
    <React.Fragment>
      <Toolbar className={classes.toolbar}>
        <Typography className={classes.title} variant="h6" id="tableTitle">
          {translate("salesOrder.selectProducts")}
        </Typography>
        <Divider className={classes.divider} orientation="vertical" />
        <form onSubmit={handleSearch}>
          <InputBase
            className={classes.input}
            value={code}
            onChange={handleChangeCode}
            placeholder={`${translate("common.search")} ${translate("salesOrder.productCode")}`}
            inputProps={{ "aria-label": `${translate("common.search")} ${translate("salesOrder.productCode")}` }}
          />
          <IconButton type="submit" className={classes.iconButton} aria-label="search">
            <Search />
          </IconButton>
        </form>
        {/* <Divider className={classes.divider} orientation="vertical" />
        <Tooltip title={translate('common.filter')}>
          <IconButton aria-label="filter" aria-controls="category-menu" aria-haspopup="true" onClick={handleOpen}>
            <FilterListIcon />
          </IconButton>
        </Tooltip>
        <Menu id="category-menu" open={Boolean(anchorEl)} keepMounted onClose={handleClose} anchorEl={anchorEl}>
          {categories.map(category => (
            <MenuItem key={`menu-${category.id}`} selected={selectedCategories.includes(category.id)} onClick={handleFilterCat(category.id)}>{category.nameEn}</MenuItem>
          ))}
          <Divider />
          <MenuItem selected={timeConstraint.includes('expiredIn6Months')} onClick={handleFilter('expiredIn6Months')}>{translate('product.expiredIn6Months')}</MenuItem>
        </Menu> */}
      </Toolbar>

      <div className={classes.chips}>
        {search && <Chip label={search} onDelete={cancelSearch} />}
        {timeConstraint.map((tc) => (
          <Chip key={`product.${tc}`} label={translate(`product.${tc}`)} onDelete={handleFilter(tc)} />
        ))}
        {selectedCategories.map((categoryId) => (
          <Chip key={`product.${categoryId}`} label={categories.find((c) => c.id === categoryId).nameEn} onDelete={handleFilterCat(categoryId)} />
        ))}
      </div>
    </React.Fragment>
  );
}

ProductListToolbar.propTypes = {
  where: PropTypes.object.isRequired,
  setWhere: PropTypes.func.isRequired,
};

export default ProductListToolbar;
