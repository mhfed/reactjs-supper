import * as React from 'react';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { useTheme } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import KebabIcon from '@mui/icons-material/MoreVert';
import { IKebabItem } from 'models/ICommon';
import { Trans } from 'react-i18next';

type KebabProps = {
  items?: IKebabItem[];
};
const Kebab: React.FC<KebabProps> = ({ items = [] }) => {
  const [anchorEl, setAnchorEl] = React.useState<any>(null);
  const open = Boolean(anchorEl);
  const theme = useTheme();

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <div>
      <IconButton
        id="basic-button"
        aria-controls="basic-menu"
        aria-haspopup="true"
        aria-expanded={open ? 'true' : undefined}
        onClick={handleClick}
        style={{ padding: 0, background: theme.palette.primary.light }}
      >
        <KebabIcon />
      </IconButton>
      <Menu
        id="basic-menu"
        anchorEl={anchorEl}
        open={open}
        onClose={handleClose}
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
      >
        {items.map((e: IKebabItem, i) => {
          return (
            <MenuItem
              key={`kebab_MenuItem_${i}`}
              onClick={() => {
                e?.onClick();
                handleClose();
              }}
            >
              <Trans>{e.label}</Trans>
            </MenuItem>
          );
        })}
      </Menu>
    </div>
  );
};

export default Kebab;
