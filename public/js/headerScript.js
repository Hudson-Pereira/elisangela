window.onload = function() {
    const message = document.getElementById('message');
    if (message) {
        setTimeout(() => {
            message.classList.add('hidden'); // Adiciona a classe 'hidden' para iniciar a transição
            setTimeout(() => {
                message.style.display = 'none'; // Remove a mensagem do DOM após a transição
            }, 1000); // Espera a transição terminar (1 segundo)
        }, 5000); // Espera 5 segundos antes de iniciar o desaparecimento
    }
};