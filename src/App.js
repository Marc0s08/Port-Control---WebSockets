import React, { useEffect, useRef, useState } from 'react';
import './App.css';

const App = () => {
    const [socket, setSocket] = useState(null);
    const squareRef = useRef(null);
    const [pos, setPos] = useState({ x: 50, y: 50 }); // posição em %
    const [status, setStatus] = useState('Conectando...');
    const lastSent = useRef({ x: null, y: null });
    const timeoutRef = useRef(null);

    useEffect(() => {
        const newSocket = new WebSocket('ws://192.168.0.157/ws');

        newSocket.onopen = () => setStatus('Conectado ✅');
        newSocket.onerror = () => setStatus('Erro na conexão ❌');
        newSocket.onclose = () => setStatus('Desconectado 🔌');

        setSocket(newSocket);
        return () => newSocket.close();
    }, []);

    const enviarComando = (x, y) => {
        // Evita enviar comandos repetidos
        if (x === lastSent.current.x && y === lastSent.current.y) return;

        if (socket && socket.readyState === WebSocket.OPEN) {
            socket.send(JSON.stringify({ x, y }));
            lastSent.current = { x, y };
        }
    };

    const atualizarPosicao = (clientX, clientY) => {
        const square = squareRef.current;
        if (!square) return;

        const rect = square.getBoundingClientRect();
        const offsetX = clientX - rect.left;
        const offsetY = clientY - rect.top;

        let x = Math.max(0, Math.min(1, offsetX / rect.width));
        let y = Math.max(0, Math.min(1, offsetY / rect.height));

        const porcentagemX = Math.round(x * 100);
        const porcentagemY = Math.round(y * 100);

        setPos({ x: porcentagemX, y: porcentagemY });

        // Pequeno debounce (evita sobrecarregar o WebSocket)
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        timeoutRef.current = setTimeout(() => {
            enviarComando(porcentagemX, porcentagemY);
        }, 30);
    };

    return (
        <div className="container">
            <h1>Controle WebSocket</h1>
            <p>Status: <strong>{status}</strong></p>

            <div
                ref={squareRef}
                className="quadrado"
                onMouseMove={(e) => {
                    if (e.buttons === 1) atualizarPosicao(e.clientX, e.clientY);
                }}
                onTouchMove={(e) => {
                    const touch = e.touches[0];
                    atualizarPosicao(touch.clientX, touch.clientY);
                }}
            >
                <div
                    className="ponto"
                    style={{
                        left: `${pos.x}%`,
                        top: `${pos.y}%`
                    }}
                />
            </div>
        </div>
    );
};

export default App;
