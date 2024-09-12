const express = require('express');
const { Pool } = require('pg');
const app = express();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'bigeo',
  password: '1234',
  port: 5432,
});

app.use(express.json());

// Ruta para guardar el recorrido en la base de datos
app.post('/api/recorridos', async (req, res) => {
  const { recorrido } = req.body; // Recibe las coordenadas del recorrido

  try {
    for (let punto of recorrido) {
      await pool.query(
        'INSERT INTO recorridos (latitud, longitud, tiempo) VALUES ($1, $2, NOW())',
        [punto[0], punto[1]] // Inserta latitud y longitud
      );
    }
    res.status(200).json({ message: 'Recorrido guardado exitosamente' });
  } catch (error) {
    console.error('Error al guardar el recorrido:', error);
    res.status(500).json({ message: 'Error al guardar el recorrido' });
  }
});

app.listen(3000, () => {
  console.log('Servidor escuchando en el puerto 3000');
});
