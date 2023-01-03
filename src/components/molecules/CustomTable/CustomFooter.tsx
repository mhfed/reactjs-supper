import React from 'react';
import TableFooter from '@mui/material/TableFooter';
import TableRow from '@mui/material/TableRow';
import TableCell from '@mui/material/TableCell';
import MuiTablePagination from '@mui/material/TablePagination';
import { Trans, useTranslation } from 'react-i18next';

type CustomFooterProps = {
  changeRowsPerPage: (s: string) => void;
  changePage: (s: number) => void;
  count: number;
  rowsPerPage: number;
  page: number;
  rowsPerPageOptions: number[];
};

const CustomFooter: React.FC<CustomFooterProps> = ({
  changeRowsPerPage,
  changePage,
  count,
  rowsPerPage,
  page,
  rowsPerPageOptions,
}) => {
  const { t } = useTranslation();

  const handleRowChange = (event: React.ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
    changeRowsPerPage(event.target.value);
  };

  const handlePageChange = (e: React.MouseEvent<HTMLButtonElement> | null, page: number) => {
    changePage(page);
  };

  const footerStyle = {
    display: 'flex',
    justifyContent: 'flex-end',
    padding: 0,
  };

  return (
    <TableFooter>
      <TableRow>
        <TableCell style={footerStyle} colSpan={1000}>
          <MuiTablePagination
            component="div"
            count={count}
            showFirstButton
            showLastButton
            rowsPerPage={rowsPerPage}
            page={Math.min(page, count)}
            labelRowsPerPage={<Trans>lang_rows_per_page</Trans>}
            getItemAriaLabel={(type) => t(`lang_go_to_${type}_page`) as string}
            labelDisplayedRows={({ from, to, count }) => (
              <Trans values={{ from, to, count }}>lang_displayed_rows_pagination</Trans>
            )}
            rowsPerPageOptions={rowsPerPageOptions}
            onPageChange={handlePageChange}
            onRowsPerPageChange={handleRowChange}
          />
        </TableCell>
      </TableRow>
    </TableFooter>
  );
};

export default CustomFooter;
