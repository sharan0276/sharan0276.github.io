document.addEventListener('DOMContentLoaded', async () => {
    // Current Year for Footer
    document.getElementById('current-year').textContent = new Date().getFullYear();

    // Fetch data from JSON files
    const fetchData = async (file) => {
        try {
            // Add timestamp to force fresh fetch
            const res = await fetch(file + '?v=' + Date.now());
            if (!res.ok) throw new Error(`HTTP error ${res.status}`);
            return await res.json();
        } catch (err) {
            console.error(`Failed to fetch ${file}:`, err);
            return null;
        }
    };

    // Load all data
    const [profile, experience, projects, education, publications, certifications, skills] = await Promise.all([
        fetchData('profile.json'),
        fetchData('experience.json'),
        fetchData('projects.json'),
        fetchData('education.json'),
        fetchData('publications.json'),
        fetchData('certifications.json'),
        fetchData('skills.json')
    ]);

    // Render sections with null checks
    if (profile) {
        try { renderHero(profile); } catch (e) { console.error("Error rendering Hero:", e); }
        try { renderAbout(profile); } catch (e) { console.error("Error rendering About:", e); }
    }

    if (experience) {
        try { renderExperience(experience.professional_experience); } catch (e) { console.error("Error rendering Experience:", e); }
        try { renderTeaching(experience.teaching_experience); } catch (e) { console.error("Error rendering Teaching:", e); }
        try { renderImpact(experience.professional_experience, education?.education, projects?.projects); } catch (e) { console.error("Error rendering Impact:", e); }
    }

    if (projects) {
        try { renderProjects(projects.projects); } catch (e) { console.error("Error rendering Projects:", e); }
    }

    if (education) {
        try { renderEducation(education.education); } catch (e) { console.error("Error rendering Education:", e); }
    }

    if (publications) {
        try { renderPublications(publications.publications); } catch (e) { console.error("Error rendering Publications:", e); }
    }

    if (certifications) {
        try { renderCertifications(certifications.certifications); } catch (e) { console.error("Error rendering Certifications:", e); }
    }

    if (skills) {
        try { renderSkills(skills.technical_skills); } catch (e) { console.error("Error rendering Skills:", e); }
    }
});

// Resume download tracking

// Render Hero Section
function renderHero(profile) {
    document.getElementById('hero-name').textContent = profile.name;
    document.getElementById('hero-tagline').textContent = profile.tagline;
    document.getElementById('hero-oneliner').textContent = profile.one_liner || "Hello, welcome to my page";

    const socialLinks = `
        <a href="${profile.contact.github}" target="_blank" class="social-icon" aria-label="GitHub"><i class="fab fa-github"></i></a>
        <a href="${profile.contact.linkedin}" target="_blank" class="social-icon" aria-label="LinkedIn"><i class="fab fa-linkedin"></i></a>
        <a href="mailto:${profile.contact.email}" class="social-icon" aria-label="Email"><i class="fas fa-envelope"></i></a>
    `;

    document.getElementById('hero-socials').innerHTML = socialLinks;
    document.getElementById('footer-socials').innerHTML = socialLinks;
}

// Render Quick Impact Bar - UPDATED
function renderImpact(experience, education, projects) {
    if (!experience || experience.length === 0) return;

    const impacts = [
        {
            number: "2 Years",
            text: "Enterprise Intelligent Automation",
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="2" ry="2"></rect>
                <rect x="9" y="9" width="6" height="6"></rect>
                <line x1="9" y1="1" x2="9" y2="4"></line>
                <line x1="15" y1="1" x2="15" y2="4"></line>
                <line x1="9" y1="20" x2="9" y2="23"></line>
                <line x1="15" y1="20" x2="15" y2="23"></line>
                <line x1="20" y1="9" x2="23" y2="9"></line>
                <line x1="20" y1="15" x2="23" y2="15"></line>
                <line x1="1" y1="9" x2="4" y2="9"></line>
                <line x1="1" y1="15" x2="4" y2="15"></line>
            </svg>`
        },
        {
            number: "50%",
            text: "Pipeline Throughput Improvement",
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
                <polyline points="17 6 23 6 23 12"></polyline>
            </svg>`
        },
        {
            number: "85 Hours/Month",
            text: "Automated via Production Pipelines",
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 4 23 10 17 10"></polyline>
                <polyline points="1 20 1 14 7 14"></polyline>
                <path d="M3.51 9a9 9 0 0 1 14.85-3.36L23 10M1 14l4.64 4.36A9 9 0 0 0 20.49 15"></path>
            </svg>`
        },
        {
            number: "98%",
            text: "LLM Token Cost Reduction",
            svg: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <polyline points="23 18 13.5 8.5 8.5 13.5 1 6"></polyline>
                <polyline points="17 18 23 18 23 12"></polyline>
            </svg>`
        }
    ];

    const grid = document.getElementById('impact-grid');
    grid.innerHTML = impacts.map(item => `
        <div class="impact-card">
            ${item.svg}
            <span class="impact-number">${item.number}</span>
            <span class="impact-text">${item.text}</span>
        </div>
    `).join('');
}

// Render About
function renderAbout(profile) {
    document.getElementById('about-text').textContent = profile.about.text;
}

// Helper function to bold metrics
function boldMetrics(text) {
    return text.replace(/(\d+%|\d+\s?hours?\/?\w*|reducing|improving|saving|50%|72%|85|33%)/gi, '<span class="highlight-metric">$1</span>');
}

// Render Experience
function renderExperience(experiences) {
    const container = document.getElementById('experience-timeline');
    if (!experiences || experiences.length === 0) {
        container.innerHTML = '<p>No experience data available.</p>';
        return;
    }

    container.innerHTML = experiences.map(exp => {
        const showExpand = exp.highlights && exp.highlights.length > 2;
        return `
        <div class="timeline-item" data-exp-id="${exp.id}">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="exp-header">
                    <div>
                        <h3 class="exp-company">${exp.company}</h3>
                        ${exp.division ? `<div class="exp-division">${exp.division}</div>` : ''}
                    </div>
                    <span class="exp-dates">${exp.dates}</span>
                </div>
                <div class="exp-meta">
                    <span class="exp-title">${exp.title}</span>
                    <span class="exp-duration">${exp.duration}</span>
                </div>
                
                ${exp.highlights && exp.highlights.length > 0 ? `
                <div class="exp-highlights-wrapper">
                    <ul class="exp-highlights exp-highlights-preview">
                        ${exp.highlights.slice(0, 2).map(highlight => `
                            <li>${boldMetrics(highlight)}</li>
                        `).join('')}
                    </ul>
                    ${showExpand ? `
                        <ul class="exp-highlights exp-highlights-full" style="display: none;">
                            ${exp.highlights.map(highlight => `
                                <li>${boldMetrics(highlight)}</li>
                            `).join('')}
                        </ul>
                        <button class="expand-btn" onclick="toggleHighlights('${exp.id}')">
                            Show ${exp.highlights.length - 2} more <i class="fas fa-chevron-down"></i>
                        </button>
                    ` : ''}
                </div>
                ` : ''}
                
                ${exp.skills && exp.skills.length > 0 ? `
                <div class="skills-tags">
                    ${exp.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                ` : ''}
            </div>
        </div>
        `;
    }).join('');
}

// Toggle experience highlights
function toggleHighlights(id) {
    const item = document.querySelector(`[data-exp-id="${id}"]`);
    if (!item) return;

    const preview = item.querySelector('.exp-highlights-preview');
    const full = item.querySelector('.exp-highlights-full');
    const btn = item.querySelector('.expand-btn');

    if (!preview || !full || !btn) return;

    if (full.style.display === 'none') {
        preview.style.display = 'none';
        full.style.display = 'block';
        btn.innerHTML = 'Show less <i class="fas fa-chevron-up"></i>';
    } else {
        preview.style.display = 'block';
        full.style.display = 'none';
        const allItems = full.querySelectorAll('li');
        const count = allItems.length - 2;
        btn.innerHTML = `Show ${count} more <i class="fas fa-chevron-down"></i>`;
    }
}
window.toggleHighlights = toggleHighlights;

// Render Teaching
function renderTeaching(teaching) {
    const container = document.getElementById('teaching-timeline');
    if (!teaching || teaching.length === 0) {
        container.innerHTML = '<p>No teaching experience available.</p>';
        return;
    }

    container.innerHTML = teaching.map(exp => `
        <div class="timeline-item">
            <div class="timeline-dot"></div>
            <div class="timeline-content">
                <div class="exp-header">
                    <div>
                        <h3 class="exp-company">${exp.company}</h3>
                    </div>
                    <span class="exp-dates">${exp.dates}</span>
                </div>
                <div class="exp-meta">
                    <span class="exp-title">${exp.title}</span>
                    <span class="exp-duration">${exp.duration}</span>
                </div>
                ${exp.highlights && exp.highlights.length > 0 ? `
                <ul class="exp-highlights">
                    ${exp.highlights.map(h => `<li>${h}</li>`).join('')}
                </ul>
                ` : ''}
                ${exp.skills && exp.skills.length > 0 ? `
                <div class="skills-tags">
                    ${exp.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
                </div>
                ` : ''}
            </div>
        </div>
    `).join('');
}

// Render Projects - UPDATED to handle missing GitHub links
function renderProjects(projects) {
    const container = document.getElementById('projects-grid');
    if (!projects || projects.length === 0) {
        container.innerHTML = '<p>No projects found.</p>';
        return;
    }

    container.innerHTML = projects.map(proj => `
        <div class="project-card">
            <h3 class="project-title">${proj.title}</h3>
            ${proj.tagline ? `<div class="project-tagline">${proj.tagline}</div>` : ''}
            <div class="project-dates">${proj.dates}</div>
            ${proj.award ? `<div class="project-award"><i class="fas fa-award"></i> ${proj.award}</div>` : ''}
            <p class="project-desc collapsed" id="desc-${proj.id}">
                ${proj.description}
            </p>
            <button class="view-details-btn" onclick="toggleProject('${proj.id}')">
                View Details <i class="fas fa-chevron-down"></i>
            </button>
            ${proj.skills && proj.skills.length > 0 ? `
            <div class="skills-tags">
                ${proj.skills.map(skill => `<span class="skill-tag">${skill}</span>`).join('')}
            </div>
            ` : ''}
            ${proj.github_link ? `
            <div class="project-links">
                <a href="${proj.github_link}" target="_blank" class="github-icon-link" aria-label="View Code on GitHub">
                    <i class="fab fa-github"></i>
                </a>
            </div>
            ` : ''}
        </div>
    `).join('');
}

function toggleProject(id) {
    const desc = document.getElementById(`desc-${id}`);
    if (!desc) return;
    const btn = desc.nextElementSibling;

    if (desc.classList.contains('collapsed')) {
        desc.classList.remove('collapsed');
        btn.innerHTML = 'Show Less <i class="fas fa-chevron-up"></i>';
    } else {
        desc.classList.add('collapsed');
        btn.innerHTML = 'View Details <i class="fas fa-chevron-down"></i>';
    }
}
window.toggleProject = toggleProject;

// Render Education
function renderEducation(education) {
    const container = document.getElementById('education-timeline');
    if (!education || education.length === 0) {
        container.innerHTML = '<p>No education data available.</p>';
        return;
    }

    container.innerHTML = education.map(edu => `
        <div class="education-item">
            <div class="edu-logo-placeholder">
                <i class="fas fa-graduation-cap"></i>
            </div>
            <div class="edu-content">
                <div class="edu-school">${edu.school}</div>
                <div class="edu-degree">
                    ${edu.degree}${edu.field ? ` in ${edu.field}` : ''}
                    ${parseFloat(edu.gpa) >= 3.7 ? `<span class="gpa-badge">GPA ${edu.gpa}</span>` : ''}
                </div>
                <div class="edu-meta">${edu.dates}${edu.location ? ` • ${edu.location}` : ''}</div>
                
                ${edu.achievements && edu.achievements.length > 0 ? edu.achievements.map(ach => `
                    <div class="edu-achievement">
                        <i class="fas fa-trophy" style="color: #F59E0B"></i> ${ach}
                    </div>
                `).join('') : ''}
            </div>
        </div>
    `).join('');
}

// Render Publications
function renderPublications(publications) {
    const container = document.getElementById('publications-list');
    if (!publications || publications.length === 0) {
        container.innerHTML = '<p>No publications available.</p>';
        return;
    }

    container.innerHTML = publications.map(pub => `
        <div class="pub-item">
            <div class="pub-title">${pub.title}</div>
            <div class="pub-meta">
                ${pub.publisher}${pub.date ? ` • ${pub.date}` : ''}
            </div>
            <p class="pub-desc">${pub.description}</p>
        </div>
    `).join('');
}

// Render Certifications
function renderCertifications(certifications) {
    const container = document.getElementById('certifications-grid');
    if (!certifications || certifications.length === 0) {
        container.innerHTML = '<p>No certifications available.</p>';
        return;
    }

    container.innerHTML = certifications.map(cert => `
        <div class="cert-card">
            <div class="cert-title">${cert.name}</div>
            <div class="cert-issuer">${cert.issuer}</div>
            ${cert.date ? `<div class="cert-date">${cert.date}</div>` : ''}
            ${cert.credential_url ? `<a href="${cert.credential_url}" target="_blank" class="cert-link">Show credential</a>` : ''}
        </div>
    `).join('');
}

// Render Skills
function renderSkills(skills) {
    const container = document.getElementById('skills-container');
    if (!skills) {
        container.innerHTML = '<p>No skills data available.</p>';
        return;
    }

    const categoryNames = {
        data_engineering: "Data Engineering",
        mlops_infrastructure: "MLOps & Infrastructure",
        ml_ai_systems: "ML & AI Systems",
        ml_modeling: "ML Modeling",
        cloud_platforms: "Cloud Platforms",
        automation_integration: "Automation & Integration",
        additional: "Additional Skills"
    };

    container.innerHTML = '';
    for (const [key, list] of Object.entries(skills)) {
        if (!list || list.length === 0) continue;
        container.innerHTML += `
            <div class="skill-category">
                <h3>${categoryNames[key] || key}</h3>
                <div class="skill-cloud">
                    ${list.map(skill => `<span class="skill-pill">${skill}</span>`).join('')}
                </div>
            </div>
        `;
    }
}