const axios = require('axios');

const maxAnswers = 3;

const format = minutes => {
    if (minutes <= 0) {
        return 'jetzt sofort';
    }

    if (minutes === 1) {
        return 'in eine Minute';
    }
    return `in ${minutes} Minuten`;
};

const getData = async () => {
    const result = [];

    const response = await axios.get(
        'https://www.vrs.de/index.php?eID=tx_vrsinfo_ass2_departuremonitor&i=7dcc0577bf52481b24a0b095a78b10e5'
    );

    const line16 = response.data.events.filter(e => e.line.number === '16');
    const now = Math.floor(new Date().getTime() / 1000);

    for (const entry of line16) {
        const timestamp = parseInt(entry.departure.timestamp);
        const minutes = Math.floor((timestamp - now) / 60)
        result.push(format(minutes));
    }

    return result;
};

const execute = async () => {
    try {
        const resultData = await getData();

        const reducedResultData = resultData.slice(0, maxAnswers);

        if (reducedResultData.length === 0) {
            return `Ich habe keine Ahnung, sorry`;
        }

        let result = reducedResultData.join(', ');
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
