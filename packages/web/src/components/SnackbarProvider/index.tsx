import * as React from 'react';
import {
  SnackbarProvider as BaseSnackbarProvider,
  SnackbarProviderProps,
} from 'notistack';
import { css } from '@emotion/css';
import { useTheme } from '@mui/material/styles';

const SnackbarProvider = (props: SnackbarProviderProps): React.ReactElement => {
  const theme = useTheme();
  const classes = {
    zIndexOverwrite: css({
      zIndex: theme.zIndex.snackbar,
    }),
  };

  return (
    <BaseSnackbarProvider
      {...props}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
      dense
      classes={{ containerRoot: classes.zIndexOverwrite }}
    />
  );
};

export default SnackbarProvider;
