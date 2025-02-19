import * as React from 'react';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';

interface ButtonProps {
    onClick: () => void;
    children: React.ReactNode; // ReactNode es un tipo que acepta cualquier cosa que pueda ser renderizada en React
}

// React.FC es un tipo genérico que acepta un tipo de props y un tipo de retorno
const CustomButton: React.FC<ButtonProps> = ({ onClick, children }) => {
    return (
        <Stack spacing={2} direction="row">
            <Button variant="contained" onClick={onClick}> {children}
            </Button>
        </Stack>
    );
};

//Este componente es un botón personalizado que acepta una función onClick y un nodo React como children.
export default CustomButton;   