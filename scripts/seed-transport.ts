import 'dotenv/config';
import { createClient } from 'matecitodb';

async function main() {
    console.log('🚍 Iniciando carga de líneas de colectivos en Matebase...');

    const db = createClient(process.env.NEXT_PUBLIC_MATECITO_URL!, {
        apiKey: process.env.MATECITO_SERVICE_KEY,
        apiVersion: 'v2',
    });

    const lineas = [
        {
            name: "Línea A",
            color: "#f43f5e",
            route: "Recorrido principal cruzando el centro y zonas universitarias.",
            kmlFile: "/assets/colectivos/linea_a.kml",
            frequency: "Aprox. 15-20 min",
            schedule: "Lunes a Viernes: 05:30 - 23:00 | Fines de semana: 06:00 - 22:00"
        },
        {
            name: "Línea B",
            color: "#3b82f6",
            route: "Conecta Barrio Belgrano con el Hospital y zona sur.",
            kmlFile: "/assets/colectivos/linea_b.kml",
            frequency: "Aprox. 20 min",
            schedule: "Lunes a Viernes: 05:30 - 23:00 | Fines de semana: 06:00 - 22:00"
        },
        {
            name: "Línea C",
            color: "#10b981",
            route: "Recorre desde el cruce principal hacia el sector oeste de la ciudad.",
            kmlFile: "/assets/colectivos/linea_c.kml",
            frequency: "Aprox. 20-30 min",
            schedule: "Lunes a Viernes: 05:30 - 23:00 | Fines de semana: 06:30 - 21:00"
        },
        {
            name: "Línea D",
            color: "#f59e0b",
            route: "Ruta desde la Terminal hacia diversos barrios periféricos.",
            kmlFile: "/assets/colectivos/linea_d.kml",
            frequency: "Aprox. 25 min",
            schedule: "Lunes a Viernes: 06:00 - 22:30 | Fines de semana: 07:00 - 21:30"
        },
        {
            name: "Línea E",
            color: "#8b5cf6",
            route: "Ruta que cubre el área industrial y zonas residenciales anexas.",
            kmlFile: "/assets/colectivos/linea_e.kml",
            frequency: "Aprox. 30 min",
            schedule: "Lunes a Viernes: 06:00 - 22:00 | Fines de semana: 07:00 - 21:00"
        }
    ];

    for (const linea of lineas) {
        const { error } = await db.from('transport_lines').insert(linea);
        if (error) {
            console.error(`❌ Error al insertar ${linea.name}:`, error.message);
        } else {
            console.log(`✅ ${linea.name} cargada.`);
        }
    }

    console.log('🎉 Carga de transporte finalizada.');
}

main().catch(console.error);
