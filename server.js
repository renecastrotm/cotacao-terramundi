const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

const SCRAPER_API_KEY = '086ca704f70cb499042bffa6fcf9bfcf'; // << Substitua aqui pela sua chave real

app.get('/cotacao', async (req, res) => {
  try {
    const targetUrl = encodeURIComponent('https://br.investing.com/currencies/usd-brl');
    const url = `http://api.scraperapi.com/?api_key=${SCRAPER_API_KEY}&url=${targetUrl}`;

    const response = await axios.get(url);
    const $ = cheerio.load(response.data);

    const span = $('span[data-test="instrument-price-last"]').first();
    const fallback = $('div.instrument-price_last__3ItgI').first();
    const valorTexto = (span.text().trim() || fallback.text().trim());

    const valor = parseFloat(valorTexto.replace('.', '').replace(',', '.'));
    const ajustado = valor / 0.97;

    if (isNaN(valor)) throw new Error('valor não encontrado');

    res.json({ original: valor.toFixed(4), ajustado: ajustado.toFixed(4) });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar cotação' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
