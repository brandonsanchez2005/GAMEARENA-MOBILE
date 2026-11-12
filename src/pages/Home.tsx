import {
  IonContent,
  IonHeader,
  IonPage,
  IonTitle,
  IonToolbar,
  IonCard,
  IonCardContent,
  IonCardHeader,
  IonCardSubtitle,
  IonCardTitle,
  IonSpinner,
  IonText
} from '@ionic/react';

import React, { useState, useEffect } from 'react';

import './Home.css';


const API_URL = 'http://127.0.0.1:8000/api/videojuegos/';

const Home: React.FC = () => {
  const [videojuegos, setVideojuegos] = useState<any[]>([]);
  const [cargando, setCargando] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function cargarVideojuegos() {
      try {
        setCargando(true);
        setError('');

        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`Error http: ${response.status}`);
        }
        const data = await response.json();

        setVideojuegos(
          Array.isArray(data) ? data : data.results ?? []
        );

      } catch (err) {
        setError((err as Error).message);
      } finally {
        setCargando(false);
      }
    }
    cargarVideojuegos();
  }, []);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>GameArena Mobile</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <h2>Videojuegos</h2>
        {cargando && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <IonSpinner />
            <p>Cargando videojuegos...</p>
          </div>
        )}
        {error && (
          <IonText color="danger">
            <p>Error: {error}</p>
          </IonText>
        )}
        {!cargando && !error && videojuegos.length === 0 && (
          <p>No hay videojuegos disponibles.</p>

        )}
        {!cargando && !error && videojuegos.map((videojuego) => (
          <IonCard key={videojuego.id}>
            <IonCardHeader>
              <IonCardTitle>{videojuego.nombre}</IonCardTitle>
              <IonCardSubtitle>{videojuego.plataforma || 'Plataforma no disponible'}</IonCardSubtitle>
            </IonCardHeader>
            <IonCardContent>
              <p>{videojuego.genero || 'Género no disponible'}</p>
            </IonCardContent>
          </IonCard>
        ))}
      </IonContent>
    </IonPage>
  );
};

export default Home;
