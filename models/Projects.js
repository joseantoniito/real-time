var mongoose = require('mongoose');

var ProjectSchema = new mongoose.Schema({
  nombre: String,
  descripcion: String
  //idUsuario: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
  /*carpetas: [{ 
	nombre: String, 
	archivos: [{ nombre: String, ruta: String, contenido: String }] }],
  colaboradores: [{ 
	id: Schema.Types.ObjectId,
	nombre: String }],*/
  
});

mongoose.model('Project', ProjectSchema);