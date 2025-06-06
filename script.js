document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            navLinks.classList.toggle('active');
        });

        // Menü linklerine tıklandığında menüyü kapat
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
            });
        });

        // Sayfa dışına tıklandığında menüyü kapat
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        });
    }

    // Active link functionality
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    function setActiveLink() {
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 200)) {
                current = section.getAttribute('id');
            }
        });

        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href').slice(1) === current) {
                item.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', setActiveLink);
    setActiveLink(); // Set initial active link

    // GitHub Repositories
    const username = 'necmettincimen';
    const reposContainer = document.querySelector('.repos-container');
    
    if (reposContainer) {
        fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=100`)
            .then(response => response.json())
            .then(repos => {
                reposContainer.innerHTML = repos.map(repo => `
                    <div class="repo-card">
                        <h3>${repo.name}</h3>
                        <p>${repo.description || 'No description available'}</p>
                        <div class="repo-stats">
                            <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                            <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                        </div>
                        <div class="repo-links">
                            <a href="${repo.html_url}" target="_blank" class="repo-link">
                                <i class="fab fa-github"></i> View Code
                            </a>
                            ${repo.homepage ? `
                                <a href="${repo.homepage}" target="_blank" class="repo-link">
                                    <i class="fas fa-external-link-alt"></i> Live Demo
                                </a>
                            ` : ''}
                        </div>
                        <div class="repo-topics">
                            ${repo.topics ? repo.topics.map(topic => 
                                `<span class="topic">${topic}</span>`
                            ).join('') : ''}
                        </div>
                    </div>
                `).join('');
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                reposContainer.innerHTML = '<p>Error loading repositories. Please try again later.</p>';
            });
    }
}); 