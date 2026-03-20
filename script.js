const btnconfetti = document.querySelector('.btn-confetti');
btnconfetti.addEventListener('click', function (){
    confetti({
        particleCount: 100,
        spread: 100,
        origin: {y:1}
    })
})