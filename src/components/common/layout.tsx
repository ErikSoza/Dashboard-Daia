import * as React from 'react';
import { AppBar, Toolbar, Typography, Box, CssBaseline, Container } from '@mui/material';

export default function Layout(props: any) {
  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar position="fixed">
        <Toolbar>
          <Typography variant="h6" noWrap component="div">
            Dashboard
          </Typography>
        </Toolbar>
      </AppBar>
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          mt: 8,
        }}
      >
        <Container>
          {props.children}
        </Container>
      </Box>
    </Box>
  );
}
