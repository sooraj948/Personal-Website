document.addEventListener('DOMContentLoaded', () => {
    // --- Scroll Reveal Animation ---
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const publications = document.querySelectorAll('.publication-item');
    publications.forEach((pub, index) => {
        pub.style.opacity = '0';
        pub.style.transform = 'translateY(20px)';
        pub.style.transition = 'opacity 0.6s ease-out, transform 0.6s ease-out';
        pub.style.transitionDelay = `${index * 0.1}s`;
        observer.observe(pub);
    });

    // --- Neural Background (Canvas) ---
    const canvas = document.getElementById('neural-canvas');
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resizeCanvas() {
        width = window.innerWidth;
        height = window.innerHeight;
        canvas.width = width;
        canvas.height = height;
    }

    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();

    class Particle {
        constructor() {
            this.x = Math.random() * width;
            this.y = Math.random() * height;
            this.vx = (Math.random() - 0.5) * 0.5;
            this.vy = (Math.random() - 0.5) * 0.5;
            this.size = Math.random() * 2 + 1;
        }

        update() {
            this.x += this.vx;
            this.y += this.vy;

            if (this.x < 0 || this.x > width) this.vx *= -1;
            if (this.y < 0 || this.y > height) this.vy *= -1;
        }

        draw() {
            ctx.fillStyle = 'rgba(88, 166, 255, 0.3)'; // Accent color with low opacity
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
            ctx.fill();
        }
    }

    function initParticles() {
        particles = [];
        const particleCount = Math.min(width * 0.1, 100); // Responsive count
        for (let i = 0; i < particleCount; i++) {
            particles.push(new Particle());
        }
    }

    function animateParticles() {
        ctx.clearRect(0, 0, width, height);

        particles.forEach((p, index) => {
            p.update();
            p.draw();

            // Draw connections
            for (let j = index + 1; j < particles.length; j++) {
                const p2 = particles[j];
                const dx = p.x - p2.x;
                const dy = p.y - p2.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 100) {
                    ctx.strokeStyle = `rgba(88, 166, 255, ${0.1 * (1 - distance / 100)})`;
                    ctx.lineWidth = 1;
                    ctx.beginPath();
                    ctx.moveTo(p.x, p.y);
                    ctx.lineTo(p2.x, p2.y);
                    ctx.stroke();
                }
            }
        });
        requestAnimationFrame(animateParticles);
    }

    initParticles();
    animateParticles();


    // --- Hidden Terminal ---
    const terminalOverlay = document.getElementById('terminal-overlay');
    const terminalInput = document.getElementById('terminal-input');
    const terminalOutput = document.getElementById('terminal-output');
    const closeTerminalBtn = document.getElementById('close-terminal');

    // Toggle Terminal with `~` (Backtick)
    document.addEventListener('keydown', (e) => {
        if (e.key === '`' || e.key === '~') {
            e.preventDefault(); // Prevent typing `
            terminalOverlay.classList.toggle('hidden');
            if (!terminalOverlay.classList.contains('hidden')) {
                terminalInput.focus();
            }
        }
    });

    closeTerminalBtn.addEventListener('click', () => {
        terminalOverlay.classList.add('hidden');
    });

    // Terminal Commands
    const commands = {
        'help': 'Available commands: help, whoami, clear, social, date, exit',
        'whoami': 'root@sooraj-website (Guest User)',
        'social': 'Check the icons above! (Twitter, LinkedIn, etc.)',
        'date': new Date().toString(),
        'clear': 'CLEAR',
        'exit': 'EXIT'
    };

    terminalInput.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            const input = terminalInput.value.trim().toLowerCase();
            const outputLine = document.createElement('p');

            // Echo command
            outputLine.innerHTML = `<span style="color: #7ee787;">user@sooraj:~$</span> ${input}`;
            terminalOutput.appendChild(outputLine);

            // Process command
            if (commands[input]) {
                if (input === 'clear') {
                    terminalOutput.innerHTML = '';
                } else if (input === 'exit') {
                    terminalOverlay.classList.add('hidden');
                    terminalInput.value = '';
                } else {
                    const responseLine = document.createElement('p');
                    responseLine.textContent = commands[input];
                    responseLine.style.color = '#d2a8ff'; // Purple accent
                    terminalOutput.appendChild(responseLine);
                }
            } else if (input !== '') {
                const errorLine = document.createElement('p');
                errorLine.textContent = `Command not found: ${input}. Type 'help' for list.`;
                errorLine.style.color = '#ff7b72'; // Red error
                terminalOutput.appendChild(errorLine);
            }

            terminalInput.value = '';
            // Scroll to bottom
            const terminalBody = document.querySelector('.terminal-body');
            terminalBody.scrollTop = terminalBody.scrollHeight;
        }
    });


    // --- Konami Code Easter Egg ---
    const konamiCode = ['ArrowUp', 'ArrowUp', 'ArrowDown', 'ArrowDown', 'ArrowLeft', 'ArrowRight', 'ArrowLeft', 'ArrowRight', 'b', 'a'];
    let konamiIndex = 0;

    document.addEventListener('keydown', (e) => {
        if (e.key === konamiCode[konamiIndex]) {
            konamiIndex++;
            if (konamiIndex === konamiCode.length) {
                activatePartyMode();
                konamiIndex = 0;
            }
        } else {
            konamiIndex = 0;
        }
    });

    function activatePartyMode() {
        alert('🌟 REWARD MAXIMIZED! PARTY MODE ACTIVATED! 🌟');
        document.body.classList.add('party-mode');

        // Confetti effect (simple CSS/DOM version)
        for (let i = 0; i < 50; i++) {
            createConfetti();
        }
    }

    function createConfetti() {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.top = '-10px';
        confetti.style.width = '10px';
        confetti.style.height = '10px';
        confetti.style.backgroundColor = `hsl(${Math.random() * 360}, 100%, 50%)`;
        confetti.style.zIndex = '9999';
        confetti.style.pointerEvents = 'none';
        document.body.appendChild(confetti);

        const animation = confetti.animate([
            { transform: `translateY(0) rotate(0deg)`, opacity: 1 },
            { transform: `translateY(100vh) rotate(720deg)`, opacity: 0 }
        ], {
            duration: Math.random() * 2000 + 1000,
            easing: 'linear'
        });

        animation.onfinish = () => confetti.remove();
    }

    console.log('Website loaded successfully! Try pressing `~` ...');
});
