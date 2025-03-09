const express = require('express');
const cors = require('cors');
const axios = require('axios');

const app = express();
app.use(cors());
app.use(express.json());

app.post('/compile-latex', async (req, res) => {
  const { latexCode } = req.body;
  try {
    const response = await axios.post('https://latex.ytotech.com/builds/sync', {
      resources: [{ main: true, content: latexCode, path: 'main.tex' }]
    }, { responseType: 'arraybuffer' });

    res.setHeader('Content-Type', 'application/pdf');
    res.send(response.data);
  } catch (error) {
    res.status(500).json({ message: 'Compilation failed', error: error.message });
  }
});

app.listen(3001, () => console.log('Proxy server running on port 3001')); 