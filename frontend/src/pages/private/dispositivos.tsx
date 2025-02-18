import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  List,
  ListItemText,
  TextField,
  Button,
  ListItemButton,
  Grid,
  Paper
} from '@mui/material';

interface Dispositivo {
  dev_ui: number;
  nombre: string;
}

const Dispositivos: React.FC = () => {
  const [dispositivos, setDispositivos] = useState<Dispositivo[]>([]);
  const [selectedDispositivo, setSelectedDispositivo] = useState<Dispositivo | null>(null);
  const [newName, setNewName] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    axios.get('http://localhost:8800/dispositivos')
      .then(response => {
        const data = response.data.data || response.data;
        setDispositivos(data);
      })
      .catch(error => {
        console.error('Error fetching dispositivos:', error);
      });
  }, []);

  const handleSelectDispositivo = (dispositivo: Dispositivo) => {
    setSelectedDispositivo(prev => (prev?.dev_ui === dispositivo.dev_ui ? null : dispositivo));
    setNewName(dispositivo.nombre);
  };

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNewName(e.target.value);
  };

  const handleUpdateName = () => {
    if (selectedDispositivo && newName.trim()) {
      setLoading(true);
      axios.put(`http://localhost:8800/dispositivos/${selectedDispositivo.dev_ui}`, { nombre: newName })
        .then(() => {
          setDispositivos(prev =>
            prev.map(d =>
              d.dev_ui === selectedDispositivo.dev_ui ? { ...d, nombre: newName } : d
            )
          );
          setSelectedDispositivo({ ...selectedDispositivo, nombre: newName });
          setNewName("");
        })
        .catch(error => {
          console.error('Error updating dispositivo name:', error);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  };

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom align="center">
        Gestión de Dispositivos
      </Typography>
      <Grid container spacing={4}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Lista de Dispositivos
            </Typography>
            <List>
              {dispositivos.map(dispositivo => (
                <ListItemButton key={dispositivo.dev_ui} onClick={() => handleSelectDispositivo(dispositivo)} selected={selectedDispositivo?.dev_ui === dispositivo.dev_ui}>
                  <ListItemText 
                    primary={dispositivo.nombre} 
                    secondary={`ID: ${dispositivo.dev_ui}`}
                  />
                </ListItemButton>
              ))}
            </List>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 2, minHeight: '200px' }}>
            {selectedDispositivo ? (
              <>
                <Typography variant="h6" gutterBottom>
                  Editar Dispositivo
                </Typography>
                <TextField
                  label="Nuevo Nombre"
                  value={newName}
                  onChange={handleNameChange}
                  fullWidth
                  margin="normal"
                />
                <Button 
                  variant="contained" 
                  color="primary" 
                  onClick={handleUpdateName}
                  disabled={loading}
                  fullWidth
                  sx={{ mt: 2 }}
                >
                  {loading ? "Actualizando..." : "Actualizar Nombre"}
                </Button>
              </>
            ) : (
              <Typography variant="body1">
                Selecciona un dispositivo de la lista para editar su nombre.
              </Typography>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Dispositivos;
