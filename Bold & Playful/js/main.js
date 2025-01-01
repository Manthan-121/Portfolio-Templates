document.addEventListener('DOMContentLoaded', () => {
    // Menu toggle functionality
    const menuToggle = document.querySelector('.menu-toggle');
    const mobileMenu = document.querySelector('.mobile-menu');
    
    if (menuToggle && mobileMenu) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            mobileMenu.classList.toggle('active');
        });
    }

    // Smooth scroll functionality for navigation links
    const sideNavLinks = document.querySelectorAll('.side-nav a');
    
    sideNavLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetSection = document.querySelector(targetId);
            
            if (targetSection) {
                targetSection.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
                
                // Update active state
                sideNavLinks.forEach(navLink => navLink.classList.remove('active'));
                link.classList.add('active');
            }
        });
    });

    // Active section highlighting on scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.side-nav a');

    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.5
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const currentId = entry.target.id;
                navLinks.forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${currentId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    }, observerOptions);

    sections.forEach(section => observer.observe(section));

    // Animate skill bars on scroll
    const skillBars = document.querySelectorAll('.progress');
    const animateSkills = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.width = entry.target.parentElement.getAttribute('data-progress') + '%';
                observer.unobserve(entry.target);
            }
        });
    };

    const skillsObserver = new IntersectionObserver(animateSkills, {
        threshold: 0.5
    });

    skillBars.forEach(bar => skillsObserver.observe(bar));

    // Project hover effects
    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.querySelector('.project-overlay')?.classList.add('active');
        });
        
        card.addEventListener('mouseleave', () => {
            card.querySelector('.project-overlay')?.classList.remove('active');
        });
    });

    // Project filtering
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectItems = document.querySelectorAll('.project-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            projectItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'scale(1)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'scale(0.8)';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });

    // Project hover animations
    projectItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const overlay = item.querySelector('.project-overlay');
            const info = item.querySelector('.project-info');
            
            overlay.style.opacity = '1';
            info.style.transform = 'translateY(0)';
        });
        
        item.addEventListener('mouseleave', () => {
            const overlay = item.querySelector('.project-overlay');
            const info = item.querySelector('.project-info');
            
            overlay.style.opacity = '0';
            info.style.transform = 'translateY(20px)';
        });
    });

    // Project Modal Functionality
    const modal = document.querySelector('.project-modal');
    const modalOverlay = document.querySelector('.modal-overlay');
    const modalClose = document.querySelector('.modal-close');
    const modalImage = document.querySelector('.modal-image');
    const modalTitle = document.querySelector('.modal-title');
    const modalCategory = document.querySelector('.modal-category');
    const modalDescription = document.querySelector('.modal-description');
    const prevBtn = document.querySelector('.nav-btn.prev');
    const nextBtn = document.querySelector('.nav-btn.next');
    
    let currentProjectIndex = 0;
    const projects = Array.from(document.querySelectorAll('.project-item'));

    function openModal(project) {
        const projectImage = project.querySelector('img');
        const projectTitle = project.querySelector('h3').textContent;
        const projectCategory = project.querySelector('.project-category').textContent;
        const projectDescription = project.querySelector('p').textContent;
        
        modalImage.src = projectImage.src;
        modalTitle.textContent = projectTitle;
        modalCategory.textContent = projectCategory;
        modalDescription.textContent = projectDescription;
        
        currentProjectIndex = projects.indexOf(project);
        updateNavigationButtons();
        
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
        
        // Clear the image source after animation
        setTimeout(() => {
            modalImage.src = '';
        }, 300);
    }

    function navigateProject(direction) {
        currentProjectIndex = (currentProjectIndex + direction + projects.length) % projects.length;
        const nextProject = projects[currentProjectIndex];
        
        // Add fade-out effect
        modalImage.style.opacity = '0';
        modalTitle.style.opacity = '0';
        modalCategory.style.opacity = '0';
        modalDescription.style.opacity = '0';
        
        setTimeout(() => {
            openModal(nextProject);
            // Add fade-in effect
            modalImage.style.opacity = '1';
            modalTitle.style.opacity = '1';
            modalCategory.style.opacity = '1';
            modalDescription.style.opacity = '1';
        }, 300);
        
        updateNavigationButtons();
    }

    function updateNavigationButtons() {
        prevBtn.style.display = currentProjectIndex === 0 ? 'none' : 'flex';
        nextBtn.style.display = currentProjectIndex === projects.length - 1 ? 'none' : 'flex';
    }

    // Event Listeners for Modal
    projects.forEach(project => {
        const projectImage = project.querySelector('.project-image');
        projectImage.addEventListener('click', () => openModal(project));
    });

    modalOverlay.addEventListener('click', closeModal);
    modalClose.addEventListener('click', closeModal);
    prevBtn.addEventListener('click', () => navigateProject(-1));
    nextBtn.addEventListener('click', () => navigateProject(1));

    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        
        switch(e.key) {
            case 'Escape':
                closeModal();
                break;
            case 'ArrowLeft':
                if (currentProjectIndex > 0) navigateProject(-1);
                break;
            case 'ArrowRight':
                if (currentProjectIndex < projects.length - 1) navigateProject(1);
                break;
        }
    });

    // Prevent modal image drag
    modalImage.addEventListener('dragstart', (e) => e.preventDefault());

    // Touch swipe support
    let touchStartX = 0;
    let touchEndX = 0;

    modalImage.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });

    modalImage.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });

    function handleSwipe() {
        const swipeThreshold = 50;
        const swipeLength = touchEndX - touchStartX;
        
        if (Math.abs(swipeLength) > swipeThreshold) {
            if (swipeLength > 0 && currentProjectIndex > 0) {
                navigateProject(-1);
            } else if (swipeLength < 0 && currentProjectIndex < projects.length - 1) {
                navigateProject(1);
            }
        }
    }

    // Form validation and submission
    const contactForm = document.querySelector('.contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            // Add your form submission logic here
            const formData = new FormData(contactForm);
            console.log('Form submitted:', Object.fromEntries(formData));
            
            // Show success message
            alert('Thank you for your message! I will get back to you soon.');
            contactForm.reset();
        });
    }

    // Floating animation for hero shapes
    const shapes = document.querySelectorAll('.shape');
    shapes.forEach((shape, index) => {
        shape.style.animation = `float ${6 + index}s ease-in-out infinite ${index * 0.5}s`;
    });
});
