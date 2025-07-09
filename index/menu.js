window.addEventListener("scroll", function(){
    let header = document.querySelector('#header')
    header.classList.toggle('rolagem',window.scrollY > 0)
})

//sroll lento para Home
function scrollToHome() {
    const target = document.getElementById("home").offsetTop; // Posição do destino
    const startPosition = window.pageYOffset; // Posição atual
    const distance = target - startPosition; // Distância a percorrer
    const duration = 1500; // Duração mais longa 
    let startTime = null;

    function animationScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    // Função de easing para suavizar o movimento
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
}

//Sroll lento para Sobre
function scrollToSobre() {
    const target = document.getElementById("sobre").offsetTop; // Posição do destino
    const startPosition = window.pageYOffset; // Posição atual
    const distance = target - startPosition; // Distância a percorrer
    const duration = 1500; // Duração mais longa 
    let startTime = null;

    function animationScroll(currentTime) {
        if (startTime === null) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const run = easeInOutQuad(timeElapsed, startPosition, distance, duration);
        window.scrollTo(0, run);
        if (timeElapsed < duration) requestAnimationFrame(animationScroll);
    }

    // Função de easing para suavizar o movimento
    function easeInOutQuad(t, b, c, d) {
        t /= d / 2;
        if (t < 1) return c / 2 * t * t + b;
        t--;
        return -c / 2 * (t * (t - 2) - 1) + b;
    }

    requestAnimationFrame(animationScroll);
}

//carrosel 
let currentIndex = 0;
const items = document.querySelectorAll('.carrossel-item');
const totalItems = items.length;

// Função para mostrar o slide atual
function showSlide(index) {
    // Remove a classe active de todos os itens
    items.forEach(item => item.classList.remove('active'));
    
    // Adiciona a classe active ao item atual
    items[index].classList.add('active');
}

// Função para mover os slides
function moveSlide(direction) {
    // Atualiza o índice do slide atual
    currentIndex += direction;

    // Se o índice for maior ou igual ao número total de slides, volta ao primeiro
    if (currentIndex >= totalItems) {
        currentIndex = 0;
    }

    // Se o índice for menor que 0, vai para o último slide
    if (currentIndex < 0) {
        currentIndex = totalItems - 1;
    }

    // Exibe o slide atual
    showSlide(currentIndex);
}

// Inicializa o carrossel mostrando o primeiro slide
document.addEventListener('DOMContentLoaded', () => {
    showSlide(currentIndex);
});
