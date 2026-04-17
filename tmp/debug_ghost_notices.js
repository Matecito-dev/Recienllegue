require('dotenv').config();
const { createClient } = require('matecitodb');

async function debugNotices() {
    const url = process.env.MATEBASE_URL || 'https://recienllegue.matecito.dev';
    const key = process.env.MATEBASE_SERVICE_KEY;
    
    console.log('--- DEPURACIÓN DE AVISOS ---');
    const db = createClient(url, { apiKey: key, apiVersion: 'v2' });
    
    try {
        const { data: notices, error } = await db.from('notices').get();
        
        if (error) {
            console.error('Error:', error);
            return;
        }

        console.log(`Total registros en 'notices': ${notices?.length || 0}`);
        
        notices?.forEach((n, i) => {
            const isGhost = !n.title && !n.description;
            console.log(`[${i+1}] ID: ${n.id} | Titulo: "${n.title || 'VACIO'}" | Autor: ${n.author || 'SIN AUTOR'} | ${isGhost ? '👻 FANTASMA' : '✅ VALIDO'}`);
            if (isGhost) {
                 console.log(`    Data completa: ${JSON.stringify(n)}`);
            }
        });

    } catch (e) {
        console.error('Fallo el script:', e);
    }
}

debugNotices();
