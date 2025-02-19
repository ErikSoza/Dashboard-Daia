import * as React from 'react';
import {AppBar, Box, CssBaseline, Divider, Drawer, IconButton, List, ListItem, ListItemButton, ListItemText, Toolbar, Typography, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useNavigate } from 'react-router-dom';

interface Props {
  window?: () => Window;
  children: React.ReactNode;
}

const drawerWidth =240;
//navItems es un arreglo de objetos con dos propiedades: label y path que sirven para crear los items del menú y redirigir a las rutas correspondientes
const navItems: { label: string; path: string }[] = [ 
  { label: 'Home', path: '/home' },
  { label: 'Dispositivos', path: '/dispositivos' },
  { label: 'Salir', path: '/' }
];

export default function ResponsiveDrawerAppBar({ window, children }: Props) {
  const [mobileOpen, setMobileOpen] = React.useState(false); //mobileOpen es un estado que se utiliza para abrir y cerrar el menú en dispositivos móviles
  const navigate = useNavigate();

  const handleDrawerToggle = () => setMobileOpen((prev) => !prev);
  const handleNavigation = (path: string) => navigate(path);

  const drawer = (
    <Box onClick={handleDrawerToggle} sx={{ textAlign: 'center' }}>
      <Typography variant="h6" sx={{ my: 2 }}>
        Dashboard Daia
      </Typography>
      <Divider />
      <List>
        {navItems.map(({ label, path }) => ( //Se mapea el arreglo navItems para crear los items del menú
          <ListItem key={label} disablePadding>
            <ListItemButton sx={{ textAlign: 'center' }} onClick={() => handleNavigation(path)}>
              <ListItemText primary={label} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex' }}>
      <CssBaseline />
      <AppBar component="nav" position="fixed">
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="Abrir menú"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: 'none' } }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}>
            Dashboard
          </Typography>
          <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
            {navItems.map(({ label, path }) => (
              <Button key={label} sx={{ color: '#fff' }} onClick={() => handleNavigation(path)}>
                {label}
              </Button>
            ))}
          </Box>
        </Toolbar>
      </AppBar>
      <Box component="nav">
        <Drawer
          container={window !== undefined ? () => window().document.body : undefined}
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': { boxSizing: 'border-box', width: drawerWidth }
          }}
        >
          {drawer}
        </Drawer>
      </Box>
      <Box component="main" sx={{ flexGrow: 1, p: 3, mt: 8 }}>
        {children}
      </Box>
    </Box>
  );
}
