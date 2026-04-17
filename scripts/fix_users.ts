import { createClient } from 'matecitodb';

async function fix() {
    const db = createClient("https://recienllegue.matecito.dev", {
        apiKey: "mb_sk_f852e0b37e9d46814ec7f81e78695f80ad3ca00ae1e4a6f3",
        apiVersion: 'v2',
    });

    try {
        // 1. Eliminar comentario huerfano del aviso fantasma
        console.log("1. Buscando comentarios huerfanos...");
        const { data: comments } = await db.from('notice_comments')
            .eq('notice', '275fpn22jr8htyz')
            .get();
        
        for (const c of (comments || [])) {
            console.log(`   Eliminando comentario ${c.id}...`);
            const { error } = await db.from('notice_comments').delete(c.id);
            if (error) console.error('   ERROR:', error);
            else console.log('   OK!');
        }

        // 2. Eliminar aviso fantasma
        console.log("\n2. Eliminando aviso fantasma 275fpn22jr8htyz...");
        const { error: delErr } = await db.from('notices').delete('275fpn22jr8htyz');
        if (delErr) console.error('   ERROR:', delErr);
        else console.log('   OK!');

        // 3. Intentar actualizar username usando el objeto completo
        console.log("\n3. Intentando actualizar username del usuario...");
        // Probamos enviar un objeto con SOLO username
        const { data: updated, error: upErr } = await db.from('users').eq('id', '3xd0tuhdrwzauh7').update({
            username: 'horacio.rodriguez'
        });
        if (upErr) {
            console.error('   ERROR con update normal:', upErr);
        } else {
            console.log('   Resultado update:', JSON.stringify(updated, null, 2));
        }

        // 4. Verificacion
        console.log("\n=== Verificacion final ===");
        const { data: user } = await db.from('users').getOne('3xd0tuhdrwzauh7');
        console.log(`username: "${user?.username}" | avatarSeed: "${user?.avatarSeed}"`);
        
        const { data: notices } = await db.from('notices').get();
        console.log(`Avisos totales: ${notices?.length || 0}`);
        for (const n of (notices || [])) {
            console.log(`  ${n.id} | title: "${n.title}" | author: "${n.author}"`);
        }

    } catch (e) {
        console.error("Error:", e);
    }
}
fix();
