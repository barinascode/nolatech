import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config(); // Carga las variables de entorno desde el archivo .env

const connectDB = async () => {
  try {
    // Usa la URI de conexión de la variable de entorno, con un valor por defecto
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tu_base_de_datos';

    // Opcional: Para el manejo de errores de conexión inicial
    mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 20000, // Timeout de 10 segundos para seleccionar un servidor
      

    }).then(() => {
      console.log('MongoDB conectado exitosamente');
    }).catch(err => {
        console.error('Error de conexión inicial a MongoDB:', err);
        // Aquí podrías decidir si quieres que la aplicación se detenga si la conexión inicial falla
        // process.exit(1); // Detiene la aplicación
    });

    // Manejadores de eventos para la conexión (opcional, pero recomendado)
    mongoose.connection.on('connected', () => {
      console.log('Conectado a MongoDB');
    });

    mongoose.connection.on('error', (err) => {
      console.error('Error de conexión a MongoDB:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('Desconectado de MongoDB');
    });

    // Opcional: Si quieres, puedes devolver la instancia de mongoose
    // return mongoose.connection;

  } catch (error) {
    console.error('Error al conectar a la base de datos:', error);
    // Considera si quieres que la aplicación se detenga aquí también
    // process.exit(1);
  }
};

export default connectDB;
