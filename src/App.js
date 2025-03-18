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
        <div className="container">
            <h1>Controle de Porta</h1>
            <button onClick={() => enviarComando('ligar')} className="botao">Abrir Porta</button>
            <button onClick={() => enviarComando('desligar')} className="botao">Fechar Porta</button>
        </div>
    );
};

export default App;
