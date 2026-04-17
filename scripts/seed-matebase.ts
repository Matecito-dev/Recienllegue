import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.NEXT_PUBLIC_MATECITO_URL!;
const SERVICE_KEY = process.env.MATECITO_SERVICE_KEY!;

// El SDK usa 'x-service-key' como header, no 'Authorization'
const HEADERS = {
    'Content-Type': 'application/json',
    'x-service-key': SERVICE_KEY
};

async function apiCall(method: string, endpoint: string, body?: any) {
    const res = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers: HEADERS,
        body: body ? JSON.stringify(body) : undefined
    });
    return { status: res.status, data: await res.json().catch(() => null) };
}

async function seedRestaurants() {
    console.log("=== SEED: Restaurantes (via API directa) ===\n");

    // PASO 1: Test de conexion
    console.log("1. Test de conexion...");
    const test = await apiCall('GET', '/api/collections/restaurants/records?perPage=1');
    console.log(`   Status: ${test.status} | Items existentes: ${test.data?.totalItems || 0}\n`);

    // PASO 2: Limpiar registros vacios
    if (test.data?.totalItems > 0) {
        console.log("2. Limpiando registros existentes...");
        const all = await apiCall('GET', `/api/collections/restaurants/records?perPage=${test.data.totalItems}`);
        let deleted = 0;
        for (const r of (all.data?.items || [])) {
            if (!r.name || r.name === "") {
                const del = await apiCall('DELETE', `/api/collections/restaurants/records/${r.id}`);
                if (del.status === 200 || del.status === 204) deleted++;
            }
        }
        console.log(`   Eliminados: ${deleted}\n`);
    }

    // PASO 3: Test insercion de 1 registro
    console.log("3. Test de insercion...");
    const testInsert = await apiCall('POST', '/api/collections/restaurants/records', {
        name: "TEST",
        category: "Test",
        rating: 5,
        distance: "1 min",
        address: "Test 123",
        priceRange: "MEDIO"
    });
    console.log(`   Status: ${testInsert.status}`);
    if (testInsert.status !== 200) {
        console.log("   Error:", JSON.stringify(testInsert.data, null, 2));
        console.log("\n   ABORTANDO - la insercion falla. Hay que revisar permisos.");
        process.exit(1);
    }
    console.log(`   ID creado: ${testInsert.data?.id}`);
    
    // Limpiar el test
    if (testInsert.data?.id) {
        await apiCall('DELETE', `/api/collections/restaurants/records/${testInsert.data.id}`);
        console.log("   Test limpiado\n");
    }

    // PASO 4: Cargar todos los restaurantes
    console.log("4. Cargando restaurantes...");
    const filePath = path.join(process.cwd(), 'public', 'assets', 'jsons', 'locales_con_distancia.json');
    const locales = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
    console.log(`   Locales en JSON: ${locales.length}\n`);

    let success = 0;
    let errors = 0;

    for (const local of locales) {
        if (!local.title || !local.street) continue;

        const record: Record<string, any> = {
            name: local.title,
            category: local.categoryName || "Restaurante",
            rating: Number(local.totalScore) || 0,
            distance: local.walkTime || "A calcular",
            address: `${local.street}${local.city ? ', ' + local.city : ''}`,
            phone: local.phone || "",
            priceRange: "MEDIO",
            isFeaturedHome: false,
            isVerified: false,
            isPremium: false
        };

        if (local.lat != null) record.lat = Number(local.lat) || 0;
        if (local.lng != null) record.lng = Number(local.lng) || 0;

        // Asegurar que rating no sea 0 si es required
        if (!record.rating || record.rating === 0) record.rating = 1;

        const result = await apiCall('POST', '/api/collections/restaurants/records', record);
        if (result.status === 200) {
            success++;
            if (success <= 5 || success % 20 === 0) {
                console.log(`   OK [${success}]: ${local.title}`);
            }
        } else {
            errors++;
            if (errors <= 3) {
                console.error(`   ERROR [${local.title}]: ${JSON.stringify(result.data)}`);
            }
        }
    }

    console.log(`\n=== RESULTADO ===`);
    console.log(`   Exitosos: ${success}`);
    console.log(`   Errores:  ${errors}`);

    // Verificacion
    console.log(`\n5. Verificacion final...`);
    const verify = await apiCall('GET', '/api/collections/restaurants/records?perPage=5');
    console.log(`   Total en DB: ${verify.data?.totalItems}`);
    if (verify.data?.items?.length > 0) {
        const r = verify.data.items[0];
        console.log(`   Ejemplo: "${r.name}" | ${r.category} | rating: ${r.rating}`);
    }

    process.exit(0);
}

seedRestaurants();
