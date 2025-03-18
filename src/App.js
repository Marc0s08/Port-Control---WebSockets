import React, { useEffect, useState } from 'react';
import './App.css';


const App = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://192.168.0.113/ws');
        newSocket.onopen = () => console.log('Conectado ao WebSocket');
        newSocket.onerror = (error) => console.error('Erro na conexão:', error);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const enviarComando = (comando) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(comando);
        } else {
            console.warn('WebSocket não está conectado.');
        }
    };

    return (
        <div style={{ textAlign: 'center', marginTop: '50px' }}>
            <h1>Controle de porta</h1>
            <button onClick={() => enviarComando('ligar')} style={botaoEstilo}>Abrir Porta</button>
            <button onClick={() => enviarComando('desligar')} style={botaoEstilo}>Fechar Porta</button>
        </div>
    );
};

const botaoEstilo = {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer'
};

export default App;
