const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');

const app = express();
app.use(cors());

app.get('/cotacao', async (req, res) => {
  try {
    const response = await axios.get('https://br.investing.com/currencies/usd-brl', {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
        'Referer': 'https://www.google.com/',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      }
    });

    const $ = cheerio.load(response.data);
    const valorTexto = $('span[data-test="instrument-price-last"]').first().text().trim();
    const valor = parseFloat(valorTexto.replace('.', '').replace(',', '.'));

    const ajustado = valor / 0.97;
    res.json({ original: valor.toFixed(4), ajustado: ajustado.toFixed(4) });
  } catch (e) {
    res.status(500).json({ erro: 'Erro ao buscar cotação' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando na porta ${PORT}`));
