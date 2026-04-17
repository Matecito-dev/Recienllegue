import dotenv from "dotenv";
dotenv.config({ path: '.env.local' });

const BASE_URL = process.env.NEXT_PUBLIC_MATECITO_URL!;
const SERVICE_KEY = process.env.MATECITO_SERVICE_KEY!;
const HEADERS = { 'Content-Type': 'application/json', 'x-service-key': SERVICE_KEY };

async function cleanup() {
    console.log("=== LIMPIEZA DE DUPLICADOS ===\n");

    // Obtener TODOS los restaurantes (maximo 500)
    const res = await fetch(`${BASE_URL}/api/collections/restaurants/records?perPage=500`, {
        headers: HEADERS
    });
    const data = await res.json();
    console.log(`Total en DB: ${data.totalItems}`);

    // Separar: los que tienen nombre vs los que no
    const conNombre = data.items.filter((r: any) => r.name && r.name !== "");
    const sinNombre = data.items.filter((r: any) => !r.name || r.name === "");
    
    console.log(`Con nombre: ${conNombre.length}`);
    console.log(`Sin nombre (basura): ${sinNombre.length}`);

    // Eliminar los sin nombre
    let deleted = 0;
    for (const r of sinNombre) {
        const del = await fetch(`${BASE_URL}/api/collections/restaurants/records/${r.id}`, {
            method: 'DELETE',
            headers: HEADERS
        });
        if (del.ok || del.status === 204) deleted++;
    }
    console.log(`\nEliminados: ${deleted}`);

    // Verificar duplicados por nombre entre los que SI tienen nombre
    const nameCount = new Map<string, any[]>();
    for (const r of conNombre) {
        const list = nameCount.get(r.name) || [];
        list.push(r);
        nameCount.set(r.name, list);
    }

    const duplicados = [...nameCount.entries()].filter(([_, list]) => list.length > 1);
    console.log(`\nNombres duplicados: ${duplicados.length}`);

    // Eliminar duplicados (quedarse con el primero)
    let dupDeleted = 0;
    for (const [name, list] of duplicados) {
        // Mantener el primero, eliminar el resto
        for (let i = 1; i < list.length; i++) {
            const del = await fetch(`${BASE_URL}/api/collections/restaurants/records/${list[i].id}`, {
                method: 'DELETE',
                headers: HEADERS
            });
            if (del.ok || del.status === 204) dupDeleted++;
        }
    }
    console.log(`Duplicados eliminados: ${dupDeleted}`);

    // Verificacion final
    const final = await fetch(`${BASE_URL}/api/collections/restaurants/records?perPage=1`, {
        headers: HEADERS
    });
    const finalData = await final.json();
    console.log(`\nTotal final: ${finalData.totalItems}`);
}

cleanup();
