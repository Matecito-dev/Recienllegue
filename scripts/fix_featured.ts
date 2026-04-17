import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_MATECITO_URL!;
const SERVICE_KEY = process.env.MATECITO_SERVICE_KEY!;
const HEADERS = { 'Content-Type': 'application/json', 'x-service-key': SERVICE_KEY };

async function fix() {
    console.log("=== FIX: Featured Restaurants ===\n");

    const res = await fetch(`${BASE_URL}/api/collections/restaurants/records?perPage=50`, {
        headers: HEADERS
    });
    const data = await res.json();
    
    const items = data.items || [];
    console.log(`Encontrados ${items.length} restaurantes.`);

    let featured = 0;
    for (let i = 0; i < Math.min(items.length, 12); i++) {
        const r = items[i];
        const update = await fetch(`${BASE_URL}/api/collections/restaurants/records/${r.id}`, {
            method: 'PATCH',
            headers: HEADERS,
            body: JSON.stringify({ isFeaturedHome: true })
        });
        if (update.ok) {
            featured++;
            console.log(`  FEATURED: ${r.name}`);
        } else {
            console.error(`  ERROR en ${r.name}: ${update.status}`);
        }
    }
    console.log(`\nTotal featured: ${featured}`);
}

fix();
