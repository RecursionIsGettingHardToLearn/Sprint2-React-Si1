import React, { useState, useEffect } from 'react';
import axios from '../../../app/axiosInstance';  // Importar la instancia de axios

const SendEmailForm: React.FC = () => {
  const [subject, setSubject] = useState<string>('');
  const [message, setMessage] = useState<string>('');
  const [selectedEmails, setSelectedEmails] = useState<string[]>([]);
  const [clientes, setClientes] = useState<any[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // Cargar los clientes desde la API
  useEffect(() => {
    const fetchClientes = async () => {
      try {
        const response = await axios.get('/usuarios/');
        if (Array.isArray(response.data)) {
          setClientes(response.data);
        } else {
          setError('La respuesta no es un array.');
        }
        setLoading(false);
      } catch (err) {
        setError('No se pudieron cargar los clientes.');
        setLoading(false);
      }
    };

    fetchClientes();
  }, []);

  // Manejar la selección de correos electrónicos
  const handleEmailChange = (email: string) => {
    setSelectedEmails((prevEmails) => {
      if (prevEmails.includes(email)) {
        return prevEmails.filter((e) => e !== email);
      } else {
        return [...prevEmails, email];
      }
    });
  };

  // Enviar el correo
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!subject || !message || selectedEmails.length === 0) {
      setError('Por favor complete todos los campos y seleccione al menos un correo.');
      return;
    }

    const payload = {
      subject,
      message,
      emails: selectedEmails,
    };

    try {
      await axios.post('/send-email/', payload);
      alert('Correo enviado con éxito');
      setSubject('');
      setMessage('');
      setSelectedEmails([]);
    } catch (err) {
      setError('Error al enviar el correo.');
    }
  };

  if (loading) return <div className="text-center text-lg font-semibold">Cargando clientes...</div>;
  if (error) return <div className="text-center text-red-600">{error}</div>;

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Enviar Correo a Clientes</h1>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="subject" className="block text-lg font-medium text-gray-700">Asunto:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="message" className="block text-lg font-medium text-gray-700">Mensaje:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
            className="w-full p-3 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          ></textarea>
        </div>

        <h2 className="text-xl font-semibold mb-2">Seleccionar destinatarios:</h2>
        <div className="space-y-3 mb-6">
          {clientes.map((cliente) => (
            <div key={cliente.id} className="flex items-center">
              <input
                type="checkbox"
                value={cliente.email}
                checked={selectedEmails.includes(cliente.email)}
                onChange={() => handleEmailChange(cliente.email)}
                className="mr-2 h-5 w-5 text-blue-500"
              />
              <label className="text-lg">{cliente.nombre} ({cliente.email})</label>
            </div>
          ))}
        </div>

        <div className="flex justify-center">
          <button
            type="submit"
            className="px-6 py-3 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            Enviar Correo
          </button>
        </div>
      </form>
    </div>
  );
};

export default SendEmailForm;
