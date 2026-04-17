const { createClient } = require('matecitodb');

async function check() {
    const db = createClient("https://recienllegue.matecito.dev", {
        apiKey: "mb_sk_f852e0b37e9d46814ec7f81e78695f80ad3ca00ae1e4a6f3",
        apiVersion: 'v2'
    });

    try {
        const { data } = await db.from('notices').order('created', { ascending: false }).limit(2).get();
        console.log("AVISOS EN BBDD:");
        console.log(JSON.stringify(data, null, 2));

        if (data && data.length > 0) {
            const exp = await db.from('notices').expand('author').getOne(data[0].id);
            console.log("\nEXPAND TEST:");
            console.log(JSON.stringify(exp.data, null, 2));
        }
    } catch (e) {
        console.error(e);
    }
}
check();
