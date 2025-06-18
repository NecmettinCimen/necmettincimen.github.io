document.addEventListener('DOMContentLoaded', function() {
    // Mobile menu functionality
    const mobileMenuButton = document.querySelector('.mobile-menu');
    const navLinks = document.querySelector('.nav-links');
    
    if (mobileMenuButton && navLinks) {
        mobileMenuButton.addEventListener('click', function() {
            const isExpanded = navLinks.classList.contains('active');
            navLinks.classList.toggle('active');
            mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
        });

        // Close menu when clicking on links
        const menuLinks = navLinks.querySelectorAll('a');
        menuLinks.forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            });
        });

        // Close menu when clicking outside
        document.addEventListener('click', function(event) {
            if (!event.target.closest('.navbar')) {
                navLinks.classList.remove('active');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
            }
        });
    }

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    if (navbar) {
        let lastScrollY = window.scrollY;
        
        window.addEventListener('scroll', () => {
            const currentScrollY = window.scrollY;
            
            if (currentScrollY > 50) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
            
            lastScrollY = currentScrollY;
        }, { passive: true });
    }

    // Active link functionality with throttling
    const sections = document.querySelectorAll('section');
    const navItems = document.querySelectorAll('.nav-links a');

    function setActiveLink() {
        let current = '';
        const scrollPosition = window.scrollY + 200;

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
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

    // Throttle scroll events for better performance
    let ticking = false;
    function updateActiveLink() {
        setActiveLink();
        ticking = false;
    }

    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(updateActiveLink);
            ticking = true;
        }
    }, { passive: true });

    setActiveLink(); // Set initial active link

    // GitHub Repositories with error handling and loading state
    const username = 'necmettincimen';
    const reposContainer = document.querySelector('.repos-container');
    
    if (reposContainer) {
        // Show loading state
        reposContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);"><i class="fas fa-spinner fa-spin" style="font-size: 2rem; margin-bottom: 1rem;"></i><p>Loading projects...</p></div>';
        
        fetch(`https://api.github.com/users/${username}/repos?sort=created&per_page=100`)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(repos => {
                // Filter out forks and sort by creation date (newest first)
                const filteredRepos = repos
                    .filter(repo => !repo.fork)
                    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
                    .slice(0, 12); // Limit to 12 most recent projects
                
                if (filteredRepos.length === 0) {
                    reposContainer.innerHTML = '<div style="text-align: center; padding: 2rem; color: var(--text-secondary);"><p>No projects found.</p></div>';
                    return;
                }
                
                reposContainer.innerHTML = filteredRepos.map((repo, index) => {
                    const createdDate = new Date(repo.created_at);
                    const year = createdDate.getFullYear();
                    const month = createdDate.toLocaleString('en-US', { month: 'short' });
                    
                    // Calculate time ago
                    const now = new Date();
                    const diffTime = Math.abs(now - createdDate);
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    const diffMonths = Math.floor(diffDays / 30);
                    const diffYears = Math.floor(diffDays / 365);
                    
                    let timeAgo = '';
                    if (diffYears > 0) {
                        timeAgo = `${diffYears} year${diffYears > 1 ? 's' : ''} ago`;
                    } else if (diffMonths > 0) {
                        timeAgo = `${diffMonths} month${diffMonths > 1 ? 's' : ''} ago`;
                    } else {
                        timeAgo = `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
                    }
                    
                    return `
                        <div class="repo-timeline-item">
                            <div class="repo-year">${timeAgo}</div>
                            <div class="repo-content">
                                <h3>${repo.name}</h3>
                                <p>${repo.description || 'No description available'}</p>
                                <div class="repo-stats">
                                    <span><i class="fas fa-star"></i> ${repo.stargazers_count}</span>
                                    <span><i class="fas fa-code-branch"></i> ${repo.forks_count}</span>
                                    <span><i class="fas fa-calendar"></i> ${month} ${year}</span>
                                </div>
                                <div class="repo-links">
                                    <a href="${repo.html_url}" target="_blank" rel="noopener noreferrer" class="repo-link">
                                        <i class="fab fa-github"></i> View Code
                                    </a>
                                    ${repo.homepage ? `
                                        <a href="${repo.homepage}" target="_blank" rel="noopener noreferrer" class="repo-link">
                                            <i class="fas fa-external-link-alt"></i> Live Demo
                                        </a>
                                    ` : ''}
                                </div>
                                ${repo.topics && repo.topics.length > 0 ? `
                                    <div class="repo-topics">
                                        ${repo.topics.slice(0, 5).map(topic => 
                                            `<span class="topic">${topic}</span>`
                                        ).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `;
                }).join('');
            })
            .catch(error => {
                console.error('Error fetching repositories:', error);
                reposContainer.innerHTML = `
                    <div style="text-align: center; padding: 2rem; color: var(--text-secondary);">
                        <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem; color: var(--accent);"></i>
                        <p>Error loading projects. Please try again later.</p>
                        <p style="font-size: 0.9rem; margin-top: 0.5rem;">You can also visit my <a href="https://github.com/${username}" target="_blank" rel="noopener noreferrer" style="color: var(--accent);">GitHub profile</a> directly.</p>
                    </div>
                `;
            });
    }

    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Add loading animation to skill progress bars
    const skillProgressBars = document.querySelectorAll('.skill-progress');
    const observerOptions = {
        threshold: 0.5,
        rootMargin: '0px 0px -50px 0px'
    };

    const skillObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.style.width;
                progressBar.style.width = '0%';
                
                setTimeout(() => {
                    progressBar.style.width = width;
                }, 100);
                
                skillObserver.unobserve(progressBar);
            }
        });
    }, observerOptions);

    skillProgressBars.forEach(bar => {
        skillObserver.observe(bar);
    });
});
