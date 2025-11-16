/**
 * Sintesi e Profilo Aziendale - Page Logic
 * Handles all data population and chart rendering for the summary page
 */

let pageData = null;
let charts = {};

/**
 * Main initialization function
 */
document.addEventListener('DOMContentLoaded', async () => {
    try {
        // Load page data from JSON
        await loadPageData();

        // Populate all sections
        populateSidebar();
        populateHeader();
        populateIRPSection();
        populateKPIs();
        populateCharts();
        populateProfile();
        populateSWOT();
        populateCrisis();
        populateActions();
        populateFooter();

        // Setup event handlers
        setupEventHandlers();

    } catch (error) {
        console.error('Error initializing page:', error);
    }
});

/**
 * Load page data from JSON file
 */
async function loadPageData() {
    try {
        const response = await fetch('../data/pages/sintesi.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pageData = await response.json();
    } catch (error) {
        console.error('Error loading page data:', error);
        throw error;
    }
}

/**
 * Populate sidebar navigation
 */
function populateSidebar() {
    const companyNameEl = document.getElementById('sidebarCompanyName');
    const navEl = document.getElementById('sidebarNav');

    if (companyNameEl) {
        companyNameEl.textContent = pageData.sidebar.companyName;
    }

    if (navEl) {
        navEl.innerHTML = '';
        pageData.sidebar.menuItems.forEach(item => {
            if (item.type === 'title') {
                const li = document.createElement('li');
                li.className = 'nav-title';
                li.textContent = item.label;
                navEl.appendChild(li);
            } else if (item.type === 'link') {
                const li = document.createElement('li');
                li.className = 'nav-item';
                const a = document.createElement('a');
                a.className = `nav-link${item.active ? ' active' : ''}`;
                a.href = item.href;
                a.innerHTML = `<i class="${item.icon} fa-fw"></i> <span>${item.label}</span>`;
                li.appendChild(a);
                navEl.appendChild(li);
            }
        });
    }
}

/**
 * Populate header section
 */
function populateHeader() {
    const titleEl = document.getElementById('headerTitle');
    const subtitleEl = document.getElementById('headerSubtitle');
    const userMenuNameEl = document.getElementById('userMenuName');
    const printCompanyNameEl = document.getElementById('printCompanyName');
    const printSubtitleEl = document.getElementById('printSubtitle');

    if (titleEl) titleEl.textContent = pageData.header.title;
    if (subtitleEl) subtitleEl.innerHTML = pageData.header.subtitle;
    if (userMenuNameEl) userMenuNameEl.textContent = pageData.header.userMenuName;
    if (printCompanyNameEl) printCompanyNameEl.textContent = pageData.metadata.companyName;
    if (printSubtitleEl) {
        printSubtitleEl.textContent = `${pageData.header.title} | ${pageData.metadata.reportDate}`;
    }

    // Update IRP badge in header
    updateIRPHeaderBadge();
}

/**
 * Update IRP badge in header
 */
function updateIRPHeaderBadge() {
    const badgeEl = document.getElementById('irp-header-badge');
    if (!badgeEl) return;

    const { score, category } = pageData.irp;
    let badgeClass = 'bg-danger';

    if (category === 'low') badgeClass = 'bg-success';
    else if (category === 'medium') badgeClass = 'bg-warning';

    badgeEl.className = `badge ${badgeClass} me-3`;
    badgeEl.textContent = `IRP: ${score.toFixed(1)}`;
}

/**
 * Populate IRP section with score, category, and ratings
 */
function populateIRPSection() {
    const { score, category, categoryLabel, categoryBadge, description, crisisText, otherRatings } = pageData.irp;

    // Score circle
    const scoreCircleEl = document.getElementById('irpScoreCircle');
    const scoreValueEl = document.getElementById('irpScoreValue');

    if (scoreCircleEl && scoreValueEl) {
        scoreValueEl.textContent = score.toFixed(2);

        // Apply risk class
        scoreCircleEl.className = 'irp-score-circle';
        if (category === 'low') scoreCircleEl.classList.add('risk-low');
        else if (category === 'medium') scoreCircleEl.classList.add('risk-medium');
        else if (category === 'high') scoreCircleEl.classList.add('risk-high');
    }

    // Category text and badge
    const categoryLabelEl = document.getElementById('irpCategoryLabel');
    const categoryBadgeEl = document.getElementById('irpCategoryBadge');
    const categoryTextEl = document.getElementById('irpCategoryText');

    if (categoryLabelEl) categoryLabelEl.textContent = categoryLabel;
    if (categoryBadgeEl) {
        categoryBadgeEl.textContent = categoryBadge;
        let badgeClass = 'bg-danger';
        if (category === 'low') badgeClass = 'bg-success';
        else if (category === 'medium') badgeClass = 'bg-warning';
        categoryBadgeEl.className = `status-badge ${badgeClass}`;
    }
    if (categoryTextEl) {
        let textClass = 'text-danger';
        if (category === 'low') textClass = 'text-success';
        else if (category === 'medium') textClass = 'text-warning';
        categoryTextEl.className = `irp-category-text ${textClass} mt-2`;
    }

    // Description
    const descriptionEl = document.getElementById('irpDescription');
    if (descriptionEl) descriptionEl.innerHTML = description;

    // Crisis text
    const crisisTextEl = document.getElementById('irpCrisisText');
    if (crisisTextEl) crisisTextEl.textContent = crisisText;

    // Other ratings
    const ratingsListEl = document.getElementById('otherRatingsList');
    if (ratingsListEl) {
        ratingsListEl.innerHTML = '';
        otherRatings.forEach(rating => {
            const li = document.createElement('li');
            li.className = 'col-sm-6 d-flex align-items-center';

            const badgeHTML = rating.badge ?
                `<span class="badge ${rating.badge.class} ms-1">${rating.badge.text}</span>` : '';

            li.innerHTML = `
                <span class="icon-circle icon-circle-sm ${rating.iconClass} me-2">
                    <i class="${rating.icon}"></i>
                </span>
                <strong>${rating.label}</strong> ${rating.value} ${badgeHTML}
            `;
            ratingsListEl.appendChild(li);
        });
    }

    // Apply section risk class
    const sectionEl = document.getElementById('irp-summary-section');
    if (sectionEl) {
        sectionEl.className = 'irp-visual-section report-section';
        if (category === 'high') sectionEl.classList.add('risk-high');
        else if (category === 'medium') sectionEl.classList.add('risk-medium');
        else if (category === 'low') sectionEl.classList.add('risk-low');
    }
}

/**
 * Populate KPI cards
 */
function populateKPIs() {
    const titleEl = document.getElementById('kpiSectionTitle');
    const containerEl = document.getElementById('kpiContainer');

    if (titleEl) titleEl.textContent = pageData.kpis.title;

    if (containerEl) {
        containerEl.innerHTML = '';
        pageData.kpis.items.forEach(kpi => {
            const col = document.createElement('div');
            col.className = 'col-lg-3 col-md-6';

            const trendClass = `trend-${kpi.trend.direction}`;

            col.innerHTML = `
                <div class="kpi-card-v4">
                    <span class="icon-circle ${kpi.iconClass}">
                        <i class="${kpi.icon}"></i>
                    </span>
                    <div class="kpi-content">
                        <div class="kpi-title">${kpi.title}</div>
                        <div class="kpi-value">${kpi.value}</div>
                        <div class="kpi-trend ${trendClass}">
                            <i class="${kpi.trend.icon}"></i> ${kpi.trend.text}
                        </div>
                    </div>
                </div>
            `;
            containerEl.appendChild(col);
        });
    }
}

/**
 * Populate charts using Chart.js
 */
function populateCharts() {
    const chart1TitleEl = document.getElementById('chart1Title');
    const chart2TitleEl = document.getElementById('chart2Title');

    if (chart1TitleEl) chart1TitleEl.textContent = pageData.charts.chart1.title;
    if (chart2TitleEl) chart2TitleEl.textContent = pageData.charts.chart2.title;

    // Render Chart 1
    renderChart('mainMetricsChart', pageData.charts.chart1);

    // Render Chart 2
    renderChart('currentAssetsLiabilitiesChart', pageData.charts.chart2);
}

/**
 * Render a single chart
 */
function renderChart(canvasId, chartConfig) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destroy existing chart if it exists
    if (charts[canvasId]) {
        charts[canvasId].destroy();
    }

    charts[canvasId] = new Chart(ctx, {
        type: chartConfig.type,
        data: chartConfig.data,
        options: chartConfig.options
    });
}

/**
 * Populate profile section
 */
function populateProfile() {
    const anagraficaListEl = document.getElementById('profileAnagraficaList');
    const strutturaListEl = document.getElementById('profileStrutturaList');
    const businessModelEl = document.getElementById('profileBusinessModel');

    // Anagrafica
    if (anagraficaListEl) {
        anagraficaListEl.innerHTML = '';
        pageData.profile.anagrafica.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${item.icon} fa-fw"></i><strong>${item.label}</strong> ${item.value}`;
            anagraficaListEl.appendChild(li);
        });
    }

    // Struttura
    if (strutturaListEl) {
        strutturaListEl.innerHTML = '';
        pageData.profile.struttura.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${item.icon} fa-fw"></i><strong>${item.label}</strong> ${item.value}`;
            strutturaListEl.appendChild(li);
        });
    }

    // Business Model
    if (businessModelEl) businessModelEl.textContent = pageData.profile.businessModel;
}

/**
 * Populate SWOT analysis cards
 */
function populateSWOT() {
    const containerEl = document.getElementById('swotContainer');
    if (!containerEl) return;

    containerEl.innerHTML = '';
    pageData.swot.forEach(category => {
        const col = document.createElement('div');
        col.className = 'col-md-6 col-lg-3 mb-4';

        const itemsHTML = category.items.map(item => `<li>${item}</li>`).join('');

        col.innerHTML = `
            <div class="swot-card-restored ${category.type} h-100">
                <div class="card-header">
                    <i class="${category.icon}"></i> ${category.title}
                </div>
                <div class="card-body">
                    <ul>${itemsHTML}</ul>
                </div>
            </div>
        `;
        containerEl.appendChild(col);
    });
}

/**
 * Populate crisis framework section
 */
function populateCrisis() {
    const alertTitleEl = document.getElementById('crisisAlertTitle');
    const alertTextEl = document.getElementById('crisisAlertText');
    const normativeListEl = document.getElementById('crisisNormativeList');
    const noteEl = document.getElementById('crisisNote');

    if (alertTitleEl) alertTitleEl.innerHTML = pageData.crisis.alertTitle;
    if (alertTextEl) alertTextEl.textContent = pageData.crisis.alertText;
    if (noteEl) noteEl.textContent = pageData.crisis.note;

    if (normativeListEl) {
        normativeListEl.innerHTML = '';
        pageData.crisis.normatives.forEach(normative => {
            const li = document.createElement('li');
            li.innerHTML = normative;
            normativeListEl.appendChild(li);
        });
    }
}

/**
 * Populate actions table
 */
function populateActions() {
    const tbodyEl = document.getElementById('actionsTableBody');
    if (!tbodyEl) return;

    tbodyEl.innerHTML = '';
    pageData.actions.forEach(action => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>
                <span class="icon-circle icon-circle-sm ${action.iconClass}">
                    <i class="${action.icon}"></i>
                </span> ${action.area}
            </td>
            <td>${action.action}</td>
            <td>${action.impact}</td>
            <td><span class="status-badge ${action.priorityClass}">${action.priority}</span></td>
        `;
        tbodyEl.appendChild(tr);
    });
}

/**
 * Populate footer with current year
 */
function populateFooter() {
    const currentYear = new Date().getFullYear();

    const sidebarYearEl = document.getElementById('currentYearSidebar');
    const footerYearEl = document.getElementById('currentYearFooterReport');

    if (sidebarYearEl) sidebarYearEl.textContent = currentYear;
    if (footerYearEl) footerYearEl.textContent = currentYear;
}

/**
 * Setup event handlers for buttons and interactions
 */
function setupEventHandlers() {
    // Print button
    const printBtn = document.getElementById('printBtn');
    if (printBtn) {
        printBtn.addEventListener('click', () => {
            window.print();
        });
    }

    // Logout button
    const logoutBtn = document.getElementById('logoutBtn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            console.log('Logout action triggered');
            // Add logout logic here
            // window.location.href = '/logout';
        });
    }
}

/**
 * Utility: Add icon-circle-sm class if not in CSS
 */
const style = document.createElement('style');
style.textContent = `
    .icon-circle-sm {
        width: 24px;
        height: 24px;
        font-size: 0.75rem;
    }
    .btn-pill {
        border-radius: 50px;
    }
`;
document.head.appendChild(style);
