import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, List, ListItemText, TextField, Button as MuiButton, ListItemButton } from '@mui/material';
import Button from '../../components/common/Button.tsx';

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
        console.log('Datos recibidos:', response.data);
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
        .then(response => {
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
    <Container>
      <Typography variant="h4" gutterBottom>
        Dispositivos
      </Typography>
      <List>
        {dispositivos.map(dispositivo => (
          <ListItemButton 
            key={dispositivo.dev_ui} 
            onClick={() => handleSelectDispositivo(dispositivo)}
            selected={selectedDispositivo?.dev_ui === dispositivo.dev_ui}
          >
            <ListItemText primary={dispositivo.nombre} />
          </ListItemButton>
        ))}
      </List>
        {selectedDispositivo && (
        <div>
          <Typography variant="h6" gutterBottom>
            Editar Nombre del Dispositivo
          </Typography>
          <TextField
            label="Nuevo nombre"
            value={newName}
            onChange={handleNameChange}
            fullWidth
            margin="normal"
          />
          <MuiButton 
            variant="contained" 
            color="primary" 
            onClick={handleUpdateName}
            disabled={loading}
          >
            {loading ? <Button onClick={function (): void {
                throw new Error('Function not implemented.');
                    } } children={undefined}/> : "Actualizar"}
          </MuiButton>
        </div>
      )}
    </Container>
  );
};

export default Dispositivos;
