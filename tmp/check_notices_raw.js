require('dotenv').config();

async function check() {
    const url = "https://recienllegue.matecito.dev/api/collections/notices/records";
    const key = process.env.MATEBASE_SERVICE_KEY;
    
    console.log('Fetching RAW notices from:', url);
    
    try {
        const res = await fetch(url, {
            headers: { 'x-service-key': key }
        });
        
        const data = await res.json();
        console.log('Status:', res.status);
        
        if (data.items) {
            console.log(`Total registros: ${data.items.length}`);
            data.items.forEach((n, i) => {
                const title = n.title;
                const author = n.author;
                const description = n.description;
                
                const isGhost = !title && !description;
                console.log(`[${i+1}] ID: ${n.id} | Titulo: "${title || '---'}" | Autor: ${author || '---'} | ${isGhost ? '👻 GHOST' : '✅ OK'}`);
            });
        } else {
            console.log('No items found or error:', data);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

check();
