import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_MATECITO_URL!;
const SERVICE_KEY = process.env.MATECITO_SERVICE_KEY!;

async function test() {
    console.log("=== TEST AUTENTICACION ===\n");

    // Test 1: Leer restaurantes (GET) - deberia funcionar si auth es correcta
    console.log("1. GET restaurantes...");
    const getRes = await fetch(`${BASE_URL}/api/collections/restaurants/records?perPage=1`, {
        headers: { 'Authorization': SERVICE_KEY }
    });
    console.log(`   Status: ${getRes.status}`);
    const getData = await getRes.json();
    console.log(`   Total items: ${getData.totalItems}`);
    if (getData.items?.length > 0) {
        console.log("   Primer registro:", JSON.stringify(getData.items[0], null, 2));
    }

    // Test 2: Probar con token como superuser de PB
    // PocketBase requiere autenticar como superuser primero
    console.log("\n2. Intentando como superuser...");
    const authRes = await fetch(`${BASE_URL}/api/collections/_superusers/auth-with-password`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            identity: "admin@matecito.dev",
            password: SERVICE_KEY
        })
    });
    console.log(`   Auth status: ${authRes.status}`);
    const authData = await authRes.json();
    if (authData.token) {
        console.log("   Token obtenido!");
        
        // Test 3: Insertar con el token real de superuser
        console.log("\n3. Insertando con token de superuser...");
        const insertRes = await fetch(`${BASE_URL}/api/collections/restaurants/records`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': authData.token
            },
            body: JSON.stringify({
                name: "TEST - Directo",
                category: "Test",
                rating: 5,
                distance: "1 min",
                address: "Test 123",
                priceRange: "MEDIO"
            })
        });
        console.log(`   Insert status: ${insertRes.status}`);
        const insertData = await insertRes.json();
        console.log("   Result:", JSON.stringify(insertData, null, 2));
    } else {
        console.log("   No se pudo autenticar:", JSON.stringify(authData));
    }
}
test();
