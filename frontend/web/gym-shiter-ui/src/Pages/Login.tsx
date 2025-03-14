import React, { useState } from "react";
import { Button, Container, Form, Card, Alert } from "react-bootstrap";

const Login = ({ onLogin }: { onLogin: () => void }) => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();

        // Validación básica
        if (!email || !password) {
            setError("Por favor, completa todos los campos.");
            return;
        }

        // Simulación de autenticación
        if (email === "usuario@example.com" && password === "contraseña") {
            console.log("Inicio de sesión exitoso");
            onLogin(); // Llama a la función para cambiar la vista en App.tsx
        } else {
            setError("Correo electrónico o contraseña incorrectos.");
        }
    };

    return (
        <Container className="d-flex justify-content-center align-items-center vh-100">
            <Card style={{ width: "400px", backgroundColor: "#6e0d7a", color: "#fff", borderRadius: "10px" }} className="p-4 shadow-lg">
                <Card.Body className="text-center">
                    {/* Logo */}
                    <img src="/img/logo-gym-active-png.png" alt="GymActive Logo" style={{ width: "200px", marginBottom: "5px" }} />

                    {/* Título */}
                    <h2 style={{ fontWeight: "bold", color: "#00eaff" }}>GymActive</h2>
                    <p>Inicia sesión para continuar</p>

                    {/* Mostrar errores */}
                    {error && <Alert variant="danger">{error}</Alert>}

                    {/* Formulario de Login */}
                    <Form onSubmit={handleSubmit}>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="email"
                                placeholder="Correo electrónico"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                style={{ borderRadius: "5px" }}
                            />
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Control
                                type="password"
                                placeholder="Contraseña"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                style={{ borderRadius: "5px" }}
                            />
                        </Form.Group>
                        <Button
                            type="submit"
                            variant="primary"
                            style={{ backgroundColor: "#00eaff", border: "none", borderRadius: "5px" }}
                            className="w-100"
                        >
                            Iniciar Sesión
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </Container>
    );
};

export default Login;