import React from 'react';
import { useNavigate } from 'react-router-dom';
import Palta from './Palta.jpg';  // Asegúrate de que la imagen esté en la carpeta src

function Home() {
  const navigate = useNavigate();

  const iniciarRecorrido = () => {
    navigate('/recorrido');
  };

  return (
    <div style={styles.container}>
      <img src={Palta} alt="Palta" style={styles.image} />
      <button onClick={iniciarRecorrido} style={styles.button}>Iniciar Recorrido</button>
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
  image: {
    width: '300px',
    height: '300px',
  },
  button: {
    marginTop: '20px',
    padding: '10px 20px',
    fontSize: '18px',
    cursor: 'pointer',
  },
};

export default Home;
