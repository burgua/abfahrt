const axios = require('axios');
const cheerio = require('cheerio');

const normalize = text => {
    try {
        if (text === 'Sofort') {
            return 'jetzt sofort';
        }

        const minutes = parseInt(text.replace(' Min', ''));
        if (minutes === 1) {
            return 'in eine Minute';
        }
        return `in ${minutes} Minuten`;
    } catch (Error) {
        return text;
    }
};

const execute = async () => {
    try {
        const response = await axios.get('https://www.kvb.koeln/qr/343/');
        const $ = cheerio.load(response.data);

        const data = [];
        $('#qr_ergebnis td.qr_td').each((i, elem) => {
            data.push($(elem).text());
        });

        const resultData = [];

        for (let i = 0; i < data.length; i = i + 3) {
            if (data[i] === '16') {
                resultData.push(normalize(data[i + 2]));
            }
        }

        let result = resultData.join(', ');
        const lastComma = result.lastIndexOf(',');
        if (lastComma !== -1) {
            result = result.substring(0, lastComma) + ' und' + result.substring(lastComma + 1);
        }

        return `Bahn fährt ` + result;
    } catch (error) {
        return 'Etwas ist schief gelaufen';
    }
};

module.exports = execute;
