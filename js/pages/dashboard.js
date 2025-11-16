// dashboard.js - Dashboard Esecutiva
let pageData = null;
let charts = {};

async function loadPageData() {
    try {
        const response = await fetch('../data/pages/dashboard.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        pageData = await response.json();
        console.log('Dashboard data loaded successfully');
        return pageData;
    } catch (error) {
        console.error('Error loading dashboard.json:', error);
        return null;
    }
}

function populateSidebar() {
    if (!pageData?.sidebar) return;

    const sidebarNav = document.getElementById('sidebarNav');
    const sidebarCompanyName = document.getElementById('sidebarCompanyName');

    if (sidebarCompanyName) sidebarCompanyName.textContent = pageData.sidebar.companyName || '';

    if (sidebarNav && pageData.sidebar.menuItems) {
        sidebarNav.innerHTML = '';
        pageData.sidebar.menuItems.forEach(item => {
            if (item.type === 'title') {
                const li = document.createElement('li');
                li.className = 'nav-title';
                li.textContent = item.label;
                sidebarNav.appendChild(li);
            } else {
                const li = document.createElement('li');
                li.className = 'nav-item';
                const a = document.createElement('a');
                a.href = item.href;
                a.className = item.active ? 'nav-link active' : 'nav-link';
                a.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
                li.appendChild(a);
                sidebarNav.appendChild(li);
            }
        });
    }
}

function populateHeader() {
    if (!pageData?.header) return;

    const headerCompanyName = document.getElementById('headerCompanyName');
    const headerTitle = document.getElementById('headerTitle');
    const headerUpdateDate = document.getElementById('headerUpdateDate');
    const userMenuName = document.getElementById('userMenuName');

    if (headerCompanyName) headerCompanyName.textContent = pageData.header.companyName || '';
    if (headerTitle) {
        headerTitle.textContent = pageData.header.title || '';
        if (pageData.header.titleStyle) {
            headerTitle.setAttribute('style', pageData.header.titleStyle);
        }
    }
    if (headerUpdateDate) headerUpdateDate.textContent = pageData.header.updateDate || '';
    if (userMenuName) userMenuName.textContent = pageData.header.userName || 'Utente';
}

function populateFooter() {
    const currentYear = new Date().getFullYear();
    ['currentYearSidebar', 'currentYearFooter'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentYear;
    });
}

function populateKPISection() {
    if (!pageData?.kpiSection) return;

    const title = document.getElementById('kpiSectionTitle');
    const container = document.getElementById('kpiCardsContainer');

    if (title) title.innerHTML = pageData.kpiSection.title || '';

    if (container && pageData.kpiSection.cards) {
        container.innerHTML = '';

        pageData.kpiSection.cards.forEach(card => {
            const col = document.createElement('div');
            col.className = 'col-xl-3 col-md-6 mb-4';

            const cardDiv = document.createElement('div');
            cardDiv.className = card.cardClass || 'kpi-card-v2';

            // Icon
            const icon = document.createElement('i');
            icon.className = `${card.icon} ${card.iconClass || ''}`;
            cardDiv.appendChild(icon);

            // Title
            const cardTitle = document.createElement('h4');
            cardTitle.className = 'card-title-modern';
            cardTitle.textContent = card.title || '';
            cardDiv.appendChild(cardTitle);

            // Value
            const value = document.createElement('div');
            value.className = 'kpi-value-modern';
            value.textContent = card.value || '';
            if (card.valueStyle) {
                value.setAttribute('style', card.valueStyle);
            }
            cardDiv.appendChild(value);

            // Trend
            if (card.trend) {
                const trendDiv = document.createElement('div');

                if (card.trend.type === 'badge') {
                    trendDiv.className = 'kpi-trend-modern';
                    const badge = document.createElement('span');
                    badge.className = card.trend.badgeClass || 'status-badge';
                    badge.textContent = card.trend.badge || '';
                    trendDiv.appendChild(badge);

                    if (card.trend.note) {
                        const note = document.createElement('span');
                        note.className = card.trend.noteClass || 'text-muted ms-2';
                        note.textContent = card.trend.note;
                        trendDiv.appendChild(note);
                    }
                } else if (card.trend.type === 'arrow') {
                    trendDiv.className = card.trend.trendClass || 'kpi-trend-modern';
                    const trendIcon = document.createElement('i');
                    trendIcon.className = `${card.trend.icon} ${card.trend.iconClass || ''}`;
                    trendDiv.appendChild(trendIcon);

                    const trendValue = document.createElement('span');
                    trendValue.className = card.trend.valueClass || 'trend-value';
                    trendValue.textContent = card.trend.value || '';
                    trendDiv.appendChild(trendValue);

                    if (card.trend.note) {
                        const note = document.createElement('span');
                        note.className = card.trend.noteClass || 'text-muted small ms-1';
                        note.textContent = card.trend.note;
                        trendDiv.appendChild(note);
                    }
                } else if (card.trend.type === 'badges') {
                    trendDiv.className = 'kpi-trend-modern';
                    card.trend.badges.forEach(b => {
                        const badge = document.createElement('span');
                        badge.className = b.class || 'status-badge';
                        badge.textContent = b.text || '';
                        trendDiv.appendChild(badge);
                    });
                }

                cardDiv.appendChild(trendDiv);
            }

            // Description
            if (card.description) {
                const desc = document.createElement('p');
                desc.className = 'kpi-description-modern';
                desc.textContent = card.description;
                cardDiv.appendChild(desc);
            }

            // Action Button
            if (card.actionButton) {
                const btn = document.createElement('a');
                btn.className = card.actionButton.class || 'btn btn-sm';
                btn.href = card.actionButton.href || '#';
                btn.textContent = card.actionButton.text || '';
                cardDiv.appendChild(btn);
            }

            col.appendChild(cardDiv);
            container.appendChild(col);
        });
    }
}

function populateChartsSection() {
    if (!pageData?.chartsSection) return;

    const title = document.getElementById('chartsSectionTitle');
    if (title) title.innerHTML = pageData.chartsSection.title || '';

    // Chart 1 Title
    const chart1Title = document.getElementById('chart1Title');
    if (chart1Title && pageData.chartsSection.charts[0]) {
        chart1Title.textContent = pageData.chartsSection.charts[0].title || '';
    }

    // Chart 2 Title
    const chart2Title = document.getElementById('chart2Title');
    if (chart2Title && pageData.chartsSection.charts[1]) {
        chart2Title.textContent = pageData.chartsSection.charts[1].title || '';
    }
}

function renderCharts() {
    if (!pageData?.chartsSection?.charts) return;

    pageData.chartsSection.charts.forEach(chartConfig => {
        const canvas = document.getElementById(chartConfig.canvasId);
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Prepare chart configuration
        const config = {
            type: chartConfig.type,
            data: chartConfig.data,
            options: chartConfig.options || {}
        };

        // Add tooltip callbacks for formatting
        if (chartConfig.id === 'chart1') {
            config.options.plugins = config.options.plugins || {};
            config.options.plugins.tooltip = {
                callbacks: {
                    label: function(context) {
                        if (context.datasetIndex === 0) {
                            return context.dataset.label + ': €' + context.raw + 'M';
                        } else {
                            return context.dataset.label + ': ' + context.raw + '%';
                        }
                    }
                }
            };
        } else if (chartConfig.id === 'chart2') {
            config.options.plugins = config.options.plugins || {};
            config.options.plugins.tooltip = {
                callbacks: {
                    label: function(context) {
                        return context.dataset.label + ': ' + (context.raw !== null ? context.raw : 'N/A');
                    }
                }
            };
        }

        // Create chart
        charts[chartConfig.id] = new Chart(ctx, config);
    });
}

function setupEventHandlers() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => window.print());
    }

    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            if (confirm('Confermi il logout?')) {
                sessionStorage.clear();
                localStorage.removeItem('isAuthenticated');
                window.location.href = '../index.html';
            }
        });
    }
}

async function initPage() {
    console.log('Initializing Dashboard page...');
    const data = await loadPageData();
    if (!data) {
        console.error('Failed to load page data');
        return;
    }

    populateSidebar();
    populateHeader();
    populateFooter();
    populateKPISection();
    populateChartsSection();
    renderCharts();
    setupEventHandlers();

    console.log('Dashboard page initialized successfully');
}

document.addEventListener('DOMContentLoaded', initPage);
