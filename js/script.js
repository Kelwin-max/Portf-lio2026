gsap.registerPlugin(ScrollTrigger);

document.addEventListener('DOMContentLoaded', () => {

    const bootSequence = document.getElementById('system-boot-sequence');
    const mainInterface = document.getElementById('main-interface');
    const sections = document.querySelectorAll('.interface-section');
    const progressFill = document.querySelector('.progress-fill');
    const systemClock = document.getElementById('system-clock');
    const customCursor = document.getElementById('custom-cursor');

    // --- FUNÇÕES DE UTILIDADE ---
    function updateSystemClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        if (systemClock) {
            systemClock.textContent = `${hours}:${minutes}:${seconds}`;
        }
    }
    
    function initCustomCursor() {
        document.addEventListener('mousemove', (e) => {
            gsap.to(customCursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.05,
                ease: "power2.out"
            });
        });

        const interactiveElements = 'a, button, .command-btn, .project-card, .social-icon-unit';
        document.querySelectorAll(interactiveElements).forEach(el => {
            el.addEventListener('mouseenter', () => {
                customCursor.classList.add('hover-target');
            });
            el.addEventListener('mouseleave', () => {
                customCursor.classList.remove('hover-target');
            });
        });
    }

    // --- ANIMAÇÕES DE ROLAGEM CINEMATOGRÁFICAS (ScrollTrigger) ---
    function initScrollAnimations() {
        sections.forEach((section) => {
            
            // Define o trigger para todos os elementos internos do "section-content"
            const contentElements = section.querySelectorAll('.section-content > *:not(.main-title):not(.sub-title), .glass-panel, .skill-item');
            
            // Animação de entrada da seção principal
            gsap.fromTo(section, 
                { opacity: 0 },
                { 
                    opacity: 1, 
                    duration: 1.5, 
                    ease: "power2.inOut",
                    scrollTrigger: {
                        trigger: section,
                        start: "top 80%",
                        toggleActions: "play none none none",
                    }
                }
            );

            // Animação de carregamento modular (stagger)
            gsap.from(contentElements, {
                opacity: 0, 
                y: 50, 
                stagger: 0.1, 
                duration: 1.2, 
                delay: 0.3, // Delay para a seção já ter começado a aparecer
                ease: "power3.out",
                scrollTrigger: {
                    trigger: section,
                    start: "top 75%",
                    toggleActions: "play none none none",
                }
            });

        });
    }

    // --- SEQUÊNCIA DE BOOT PRINCIPAL (Timeline GSAP) ---
    function startSystem() {
        
        // Linha do tempo de boot
        gsap.timeline({
            onComplete: () => {
                bootSequence.style.display = 'none';
                mainInterface.classList.remove('no-scroll');
                document.body.classList.remove('no-scroll');
                
                // Inicia funções principais
                initCustomCursor();
                initScrollAnimations();
                updateSystemClock();
                setInterval(updateSystemClock, 1000); 
            }
        })
        // 1. Preenchimento da barra de progresso
        .to(progressFill, {
            width: "100%",
            duration: 2.5, 
            ease: "power2.inOut"
        })
        // 2. Animação de saída do loader e entrada da interface principal
        .to(bootSequence, {
            opacity: 0,
            duration: 0.7,
            delay: 0.5 // Breve pausa após o progresso
        })
        .fromTo(mainInterface, 
            { opacity: 0 },
            { opacity: 1, duration: 1.5, ease: "power2.out" },
            "<0.3" // Começa a interface antes do loader sumir completamente
        )
        // 3. Animação dramática do título Hero
        .from(".main-title, .sub-title", {
            opacity: 0,
            y: 50,
            stagger: 0.3,
            duration: 1.5,
            ease: "power4.out"
        }, "<0.5")
        // 4. Animação dos botões Hero
        .from(".action-module a", {
            opacity: 0,
            scale: 0.8,
            stagger: 0.2,
            duration: 0.8,
            ease: "back.out(1.7)"
        }, "<0.5");
    }
    
    // Setup inicial
    document.body.classList.add('no-scroll');
    mainInterface.classList.add('no-scroll');
    startSystem(); 
});