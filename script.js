// Variable para recordar quién está conectado actualmente
let usuarioActual = "";

document.addEventListener('DOMContentLoaded', () => {
    const loginForm = document.getElementById('login-form');
    const loginScreen = document.getElementById('login-screen');
    const appScreen = document.getElementById('app-screen');

    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const inputs = loginForm.querySelectorAll('input');
        const usuarioInput = inputs[0].value; // El nombre de usuario

        if(usuarioInput) {
            try {
                // --- AQUÍ CONECTAMOS CON LA BASE DE DATOS ---
                const respuesta = await fetch('http://localhost:3000/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ usuario: usuarioInput })
                });

                if(respuesta.ok) {
                    usuarioActual = usuarioInput; // Guardamos el usuario en memoria
                    alert(`¡Hola ${usuarioInput}! Te hemos registrado en la base de datos.`);
                    
                    // Cambiar de pantalla
                    loginScreen.style.display = 'none';
                    appScreen.classList.remove('hidden');
                    document.body.style.backgroundColor = '#fff';
                }
            } catch (error) {
                console.error("Error al conectar con el servidor:", error);
                alert("Hubo un error conectando con la base de datos. Asegúrate de correr 'node server.js'");
            }
        }
    });
});

// Función de donación actualizada
async function donar(causa) {
    if(!usuarioActual) return alert("Debes iniciar sesión primero");

    const confirmar = confirm(`¿Deseas apoyar al caso: ${causa}?`);
    
    if(confirmar) {
        try {
            // --- ENVIAR DONACIÓN A LA BASE DE DATOS ---
            await fetch('http://localhost:3000/api/donar', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                    usuario: usuarioActual,
                    causa: causa 
                })
            });
            alert("¡Donación guardada en MongoDB! Gracias. ");
        } catch (error) {
            console.error(error);
            alert("Error al guardar la donación.");
        }
    }
}