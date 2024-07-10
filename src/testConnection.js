import dbService from './services/dbService.js';

async function testConnection() {
    try {
      
      const db = await dbService.connect();
      
      
      const collections = await db.listCollections().toArray();
      
      console.log('Conexión exitosa a MongoDB');
      console.log('Colecciones en la base de datos:');
      collections.forEach(collection => {
        console.log(` - ${collection.name}`);
        
      });


  
    } catch (error) {
      console.error('Error al conectar a MongoDB:', error);
    } finally {
      
      await dbService.close();
    }
  }

testConnection();

