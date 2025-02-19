const API_URL = 'http://localhost:8800';

export const fetchData = async () => {
    try {
        const response = await fetch(`${API_URL}/data`);
        if (!response.ok) {
            throw new Error('Error al obtener los datos');
        }
        const data = await response.json();
        return data.data;
    } catch (error) {
        console.error('Error: ', error);
        return [];
    }
};