import React, { useEffect, useState } from 'react';
import './App.css';

const App = () => {
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://192.168.0.112/ws');
        newSocket.onopen = () => console.log('Conectado ao WebSocket');
        newSocket.onerror = (error) => console.error('Erro na conexão:', error);
        setSocket(newSocket);

        return () => newSocket.close();
    }, []);

    const enviarComando = (comando) => {
        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(comando);
        }
    };

    const iniciarEnvioContínuo = (comando) => {
        enviarComando(comando); // envia logo no início
        const interval = setInterval(() => enviarComando(comando), 100);

        const parar = () => {
            clearInterval(interval);
            document.removeEventListener('mouseup', parar);
            document.removeEventListener('touchend', parar);
        };

        document.addEventListener('mouseup', parar);
        document.addEventListener('touchend', parar);
    };

    return (
        <div className="container">
            <h1>Controle de posição servo motor</h1>
            <button onMouseDown={() => iniciarEnvioContínuo('me')} className="botaovermelho">Mover servo Base esquerda</button>
            <button onMouseDown={() => iniciarEnvioContínuo('md')} className="botaovermelho">Mover servo Base direita</button>
            <button onMouseDown={() => iniciarEnvioContínuo('if')} className="botaoamarelo">Inclinar para frente</button>
            <button onMouseDown={() => iniciarEnvioContínuo('it')} className="botaoamarelo">Inclinar para trás</button>
            <button onMouseDown={() => iniciarEnvioContínuo('ag')} className="botaoverde">Abrir garra</button>
            <button onMouseDown={() => iniciarEnvioContínuo('fg')} className="botaoverde">Fechar garra</button>
        </div>
    );
};

export default App;
