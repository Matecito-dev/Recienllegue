import { createClient } from 'matecitodb';

async function check() {
    const db = createClient("https://recienllegue.matecito.dev", {
        apiKey: "mb_sk_f852e0b37e9d46814ec7f81e78695f80ad3ca00ae1e4a6f3",
        apiVersion: 'v2'
    });

    const { data } = await db.from('notices').get();
    console.log(`Total avisos: ${data?.length || 0}`);
    
    for (const n of (data || [])) {
        console.log(`ID: ${n.id} | Title: "${n.title}" | Desc length: ${n.description?.length || 0} | AuthorID: ${n.author}`);
    }
}
check();
