import React, { useState, useEffect } from 'react';

// material core
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import TextField from '@mui/material/TextField';
import IconButton from '@mui/material/IconButton';

// material icons
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

// styles
import useStyles from './styles';

type IProps = {
  perPage: number;
  totalPage: number;
  pageIndex: number;
  changePage: (value: number) => void;
  changePerPage: (value: number) => void;
};

const PaginationBase = ({ perPage, totalPage, pageIndex, changePage, changePerPage }: IProps) => {
  const classes = useStyles();
  const [page, setPage] = useState(1);

  const _onChangePerPage = (event: any) => {
    changePerPage(Number(event.target.value));
  };

  const _onChangePage = (value: number) => () => {
    setPage(value);
    changePage(value);
  };

  const _onChangeInput = (event: React.ChangeEvent<HTMLInputElement>) => {
    const reg = new RegExp('^[0-9]+$');
    const { value } = event.target;
    if (reg.test(value)) {
      setPage(Number(event.target.value));
    }
  };

  useEffect(() => {
    if (pageIndex >= 1) {
      setPage(pageIndex);
    }
  }, [pageIndex]);

  const _onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      changePage(page);
    }
  };

  return (
    <div className={classes.root}>
      <div>
        Row per page
        <Select
          value={perPage}
          onChange={_onChangePerPage}
          displayEmpty
          className={classes.selectEmpty}
          inputProps={{ 'aria-label': 'Without label' }}
        >
          <MenuItem value={10}>10</MenuItem>
          <MenuItem value={20}>20</MenuItem>
          <MenuItem value={50}>50</MenuItem>
        </Select>
      </div>
      <div className={classes.pagination}>
        <IconButton disabled={page === 1} color="primary" aria-label="prev" onClick={_onChangePage(page - 1)} size="large">
          <ArrowBackIosIcon fontSize="small" />
        </IconButton>
        <div className={classes.pageNumber}>
          <TextField
            id="number-page"
            value={page}
            size="small"
            label=""
            variant="outlined"
            className={classes.textPage}
            onChange={_onChangeInput}
            onKeyDown={_onKeyDown}
          />{' '}
          of {totalPage}
        </div>
        <IconButton disabled={page >= totalPage} color="primary" aria-label="next" onClick={_onChangePage(page + 1)} size="large">
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </div>
    </div>
  );
};

export default PaginationBase;
