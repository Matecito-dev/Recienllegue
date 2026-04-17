require('dotenv').config();

async function test() {
    const url = "https://recienllegue.matecito.dev/api/collections/users/records";
    const key = process.env.MATEBASE_SERVICE_KEY;
    const identifier = "elbardelorencia990@gmail.com";
    
    const filter = `(email='${identifier}'||username='${identifier}')`;
    const fullUrl = `${url}?filter=${encodeURIComponent(filter)}`;
    
    console.log('Testing Raw Fetch to:', fullUrl);
    
    try {
        const res = await fetch(fullUrl, {
            headers: {
                'x-service-key': key
            }
        });
        
        const data = await res.json();
        console.log('Status:', res.status);
        if (data.items) {
            console.log('Found users:', data.items.length);
            data.items.forEach(u => console.log(`- ${u.email} (${u.id})`));
        } else {
            console.log('Data:', data);
        }
    } catch (e) {
        console.error('Fetch Error:', e);
    }
}

test();
