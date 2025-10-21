import axiosInstance from '../app/axiosInstance';

export const fetchUsuarios = async () => {
    const response = await axiosInstance.get('/usuarios/?rol_nombre=Cliente');
    return response.data;
};
