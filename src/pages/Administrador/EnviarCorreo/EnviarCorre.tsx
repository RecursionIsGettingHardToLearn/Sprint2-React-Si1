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
        const response = await axios.get('/usuarios/');  // Endpoint para obtener los usuarios
        if (Array.isArray(response.data)) {
          setClientes(response.data);  // Solo asignar si es un array
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
      await axios.post('/send-email/', payload);  // Endpoint para enviar el correo
      alert('Correo enviado con éxito');
    } catch (err) {
      setError('Error al enviar el correo.');
    }
  };

  if (loading) return <div>Cargando clientes...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h1>Enviar Correo a Clientes</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="subject">Asunto:</label>
          <input
            type="text"
            id="subject"
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="message">Mensaje:</label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            required
          ></textarea>
        </div>

        <h2>Seleccionar destinatarios:</h2>
        <div>
          {clientes.map((cliente) => (
            <div key={cliente.id}>
              <label>
                <input
                  type="checkbox"
                  value={cliente.email}
                  checked={selectedEmails.includes(cliente.email)}
                  onChange={() => handleEmailChange(cliente.email)}
                />
                {cliente.nombre} ({cliente.email})
              </label>
            </div>
          ))}
        </div>

        <button type="submit">Enviar Correo</button>
      </form>
    </div>
  );
};

export default SendEmailForm;
