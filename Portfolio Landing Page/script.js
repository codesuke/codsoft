//Typewriter Effect
const nameTypewriter = document.getElementById('nameTypewriter');
const fullName = 'Chirayush Verma';
const nickname = 'Codesuke';
let nameIndex = 0;
let isDeleting = false;
let showingFullName = true;

function typeNameEffect() {
    const currentText = showingFullName ? fullName : nickname;

    if (isDeleting) {
        nameTypewriter.textContent = currentText.substring(0, nameIndex - 1);
        nameIndex--;
    } else {
        nameTypewriter.textContent = currentText.substring(0, nameIndex + 1);
        nameIndex++;
    }

    let typeSpeed = isDeleting ? 50 : 100;

    if (!isDeleting && nameIndex === currentText.length) {
        typeSpeed = 3000; // Pause at end
        isDeleting = true;
    } else if (isDeleting && nameIndex === 0) {
        isDeleting = false;
        showingFullName = !showingFullName;
        typeSpeed = 500; // Pause before next name
    }

    setTimeout(typeNameEffect, typeSpeed);
}

// Bash Typing Effect for Titles 
function bashTypeEffect(elementId, text, delay = 0) {
    setTimeout(() => {
        const element = document.getElementById(elementId);
        if (!element) return;

        let index = 0;
        element.textContent = '$ ';

        function type() {
            if (index < text.length) {
                element.textContent = '$ ' + text.substring(0, index + 1);
                index++;
                setTimeout(type, 80);
            }
        }

        setTimeout(type, 300);
    }, delay);
}

// Music Control For Vibes Obviously 
const musicToggle = document.getElementById('musicToggle');
const bgMusic = document.getElementById('bgMusic');
const musicIcon = musicToggle.querySelector('i');
let isPlaying = false;

musicToggle.addEventListener('click', () => {
    if (isPlaying) {
        bgMusic.pause();
        musicIcon.className = 'fas fa-play';
        isPlaying = false;
    } else {
        bgMusic.play().catch(e => console.log('Audio play failed:', e));
        musicIcon.className = 'fas fa-pause';
        isPlaying = true;
    }
});

// Smooth Scrolling Experience 
function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Scroll Animations with Bash Typing
const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -50px 0px'
};

const titleTyped = {
    about: false,
    skills: false,
    projects: false,
    contact: false
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');

            // Trigger bash typing for section titles
            const sectionId = entry.target.closest('.section')?.id;
            if (sectionId === 'about' && !titleTyped.about) {
                bashTypeEffect('aboutTitle', 'About Me');
                titleTyped.about = true;
            } else if (sectionId === 'skills' && !titleTyped.skills) {
                bashTypeEffect('skillsTitle', 'Tech Arsenal');
                titleTyped.skills = true;
            } else if (sectionId === 'projects' && !titleTyped.projects) {
                bashTypeEffect('projectsTitle', 'Featured Projects');
                titleTyped.projects = true;
            } else if (sectionId === 'contact' && !titleTyped.contact) {
                bashTypeEffect('contactTitle', 'Let\'s Connect');
                titleTyped.contact = true;
            }
        }
    });
}, observerOptions);

document.querySelectorAll('.fade-in').forEach(el => {
    observer.observe(el);
});

// Initialize everything
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(typeNameEffect, 1000);
});

// Enhanced hover effects
document.querySelectorAll('.card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-8px) scale(1.02)';
    });

    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) scale(1)';
    });
});
