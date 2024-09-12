import React, { useState } from 'react';

function Recorrido() {
  const [posiciones, setPosiciones] = useState([]);
  const [corriendo, setCorriendo] = useState(false);
  const [pausado, setPausado] = useState(false);
  const [intervalo, setIntervalo] = useState(null);

  // Obtener ubicación actual del usuario
  const obtenerUbicacion = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const nuevaPosicion = {
            latitud: position.coords.latitude,
            longitud: position.coords.longitude,
            tiempo: new Date().toISOString(),
          };
          setPosiciones((prevPosiciones) => [...prevPosiciones, nuevaPosicion]);
        },
        (error) => {
          console.error("Error al obtener la ubicación: ", error);
        }
      );
    } else {
      console.error("Geolocalización no soportada por este navegador.");
    }
  };

  // Iniciar o reanudar el recorrido
  const iniciarRecorrido = () => {
    setCorriendo(true);
    setPausado(false);
    const idIntervalo = setInterval(obtenerUbicacion, 5000); // Captura ubicación cada 5 segundos
    setIntervalo(idIntervalo);
  };

  // Pausar el recorrido
  const pausarRecorrido = () => {
    setCorriendo(false);
    setPausado(true);
    clearInterval(intervalo);
  };

  // Terminar el recorrido y enviarlo al backend
  const terminarRecorrido = async () => {
    setCorriendo(false);
    setPausado(false);
    clearInterval(intervalo);

    // Enviar datos al backend
    await guardarRecorridoEnBackend(posiciones);

    // Reiniciar posiciones para el próximo recorrido
    setPosiciones([]);
  };

  // Función para guardar el recorrido en el backend
  const guardarRecorridoEnBackend = async (datosRecorrido) => {
    try {
      const response = await fetch('http://localhost:3000/api/recorridos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ recorrido: datosRecorrido }),
      });
      if (response.ok) {
        alert("Recorrido guardado exitosamente.");
      } else {
        console.error("Error al guardar el recorrido.");
      }
    } catch (error) {
      console.error("Error al conectar con el backend:", error);
    }
  };

  return (
    <div style={styles.container}>
      <h1>Recorrido con GPS</h1>

      {!corriendo && !pausado && (
        <button onClick={iniciarRecorrido} style={styles.button}>
          Iniciar Recorrido
        </button>
      )}
      
      {pausado && (
        <button onClick={iniciarRecorrido} style={styles.button}>
          Reanudar Recorrido
        </button>
      )}

      {corriendo && (
        <>
          <button onClick={pausarRecorrido} style={styles.button}>
            Pausar Recorrido
          </button>
          <button onClick={terminarRecorrido} style={styles.button}>
            Terminar Recorrido
          </button>
        </>
      )}

      <h2>Coordenadas del recorrido:</h2>
      <ul>
        {posiciones.map((pos, index) => (
          <li key={index}>
            Latitud: {pos.latitud}, Longitud: {pos.longitud}, Tiempo: {pos.tiempo}
          </li>
        ))}
      </ul>
    </div>
  );
}

const styles = {
  container: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    height: '100vh',
    backgroundColor: '#f0f0f0',
  },
  button: {
    margin: '10px',
    padding: '10px 20px',
    fontSize: '16px',
    cursor: 'pointer',
  },
};

export default Recorrido;

