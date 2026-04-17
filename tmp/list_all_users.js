require('dotenv').config();

async function listAll() {
    const url = "https://recienllegue.matecito.dev/api/collections/users/records";
    const key = process.env.MATEBASE_SERVICE_KEY;
    
    console.log('Listing ALL users in:', url);
    
    try {
        const res = await fetch(url, {
            headers: {
                'x-service-key': key
            }
        });
        
        const data = await res.json();
        console.log('Status:', res.status);
        if (data.items) {
            console.log('Total:', data.items.length);
            data.items.forEach(u => console.log(`- ${u.email} | ${u.id}`));
        } else {
            console.log('Data:', data);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

listAll();
