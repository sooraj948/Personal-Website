document.addEventListener('DOMContentLoaded', () => {
    // Scroll reveal animation for publications
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
        pub.style.transitionDelay = `${index * 0.1}s`; // Stagger effect
        observer.observe(pub);
    });

    console.log('Website loaded successfully!');
});
