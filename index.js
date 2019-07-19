const axios = require('axios');
const cheerio = require('cheerio');

const execute = async () => {
    const response = await axios.get(`https://www.kvb.koeln/qr/343/`);
    $ = cheerio.load(response.data);

    const data = [];
    $('#qr_ergebnis td.qr_td').each((i, elem) => {
        data.push($(elem).text());
    });

    console.log(data);

    const resultData = [];

    for (let i = 0; i < data.length; i = i + 3) {
        if (data[i] === '16') {
            resultData.push(data[i + 2]);
        }
    }

    console.log(resultData);
};

execute();
