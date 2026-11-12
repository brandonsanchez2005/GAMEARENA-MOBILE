import {
    IonContent,
    IonHeader,
    IonPage,
    IonTitle,
    IonToolbar,
    IonText,
    IonButton,
    IonInput,
    IonItem
} from '@ionic/react';
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import {
    guardarToken,
    iniciarSesionAPI
} from '../services/api';

const Login: React.FC = () => {
    const navigate = useNavigate();

    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [mensaje, setMensaje] = useState('');
    const [cargando, setCargando] = useState(false);

    const iniciarSesion = async () => {
        if(!username.trim() || !password) {
            setMensaje('Digite usuario y contraseña');
            return;
        }
        try{
            setCargando(true);
            setMensaje('');

            const token = await iniciarSesionAPI(
                username.trim(),
                password
            );
            guardarToken(token);
            navigate('/home',{ replace: true });
            
        } catch (error) {
            setMensaje(
                error instanceof Error 
                ? error.message
                : 'Error de conexión'
            );
        } finally {
            setCargando(false);
        }
    };
    return (
        <IonPage>
            <IonHeader>
                <IonToolbar color="primary">
                    <IonTitle>Game Arena | Login</IonTitle>
                </IonToolbar>
            </IonHeader>
            <IonContent className="ion-padding">
                <IonItem>
                    <IonInput
                        label="Usuario"
                        labelPlacement="stacked"
                        value={username}
                        onIonChange={(e) => setUsername(e.detail.value ?? '')}
                    />
                </IonItem>
                <IonItem>
                    <IonInput
                        label="Contraseña"
                        labelPlacement="stacked"
                        type="password"
                        value={password}
                        onIonChange={(e) => setPassword(e.detail.value ?? '')}
                    />
                </IonItem>
                {mensaje && (
                    <IonText color="danger">
                        <p>{mensaje}</p>
                    </IonText>
                )}
                <IonButton
                    expand="block"
                    disabled={cargando}
                    onClick={iniciarSesion}
                >
                    {cargando ? 'Iniciando sesión...' : 'Iniciar sesión'}
                </IonButton>
            </IonContent>
        </IonPage>
    );
};

export default Login;