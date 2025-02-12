import React from "react";
import { Container, TextField, Button, Typography, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Login: React.FC = () => {

  //funcion de dirigir al /home
  const navigate = useNavigate();
  const handleSubmit = () => {
    navigate("/home");
  }

  return (
    <Container maxWidth="sm">
      <Box display="flex" flexDirection="column" alignItems="center" mt={8}>
        <Typography variant="h4" component="h1" gutterBottom>
          Login
        </Typography>
          <Box mb={2}>
            <TextField
              variant="filled"
              fullWidth
              id="username"
              label="Username"
              name="username"
              required
            />
          </Box>
          <Box mb={2}>
            <TextField
              variant="filled"
              fullWidth
              id="password"
              label="Password"
              name="password"
              type="password"
              required
            />
          </Box>
          <Button onClick={handleSubmit} variant="contained" color="primary">
            Login
          </Button>
      </Box>
    </Container>
  );
}

export default Login;