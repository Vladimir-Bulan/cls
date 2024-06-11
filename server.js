require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

// Cargar variables de entorno desde el archivo .env
dotenv.config();

// Verificar que la variable de entorno está cargada correctamente
console.log('MONGO_URI:', process.env.MONGO_URI);

const app = express();
app.use(cors());
app.use(express.json());

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

const searchSchema = new mongoose.Schema({
  city: String,
  date: { type: Date, default: Date.now }
});

const Search = mongoose.model('Search', searchSchema);

app.post('/api/search', async (req, res) => {
  const { city } = req.body;
  const newSearch = new Search({ city });
  await newSearch.save();
  res.status(201).send(newSearch);
});

app.get('/api/searches', async (req, res) => {
  const searches = await Search.find().sort({ date: -1 });
  res.status(200).json(searches);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
