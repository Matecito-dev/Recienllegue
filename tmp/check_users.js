require('dotenv').config();
const { createClient } = require('matecitodb');

async function check() {
    const url = process.env.NEXT_PUBLIC_MATECITO_URL || 'https://recienllegue.matecito.dev';
    const key = process.env.MATECITO_SERVICE_KEY;
    
    console.log('Connecting to:', url);
    const db = createClient(url, { apiKey: key, apiVersion: 'v2' });
    
    const { data: users, error } = await db.from('users').get();
    
    if (error) {
        console.error('Error fetching users:', error);
    } else {
        console.log('Total users:', users?.length || 0);
        users?.forEach(u => {
            console.log(`- ${u.email} | ${u.username} | ${u.id}`);
        });
    }
}

check();
