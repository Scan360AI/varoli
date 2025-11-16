// bancabilita.js - Bancabilità e Sostenibilità Debito
// Modular approach: loads data from JSON and populates the page dynamically

let pageData = null;

// Load JSON data
async function loadPageData() {
    try {
        const response = await fetch('../data/pages/bancabilita.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pageData = await response.json();
        console.log('Bancabilita data loaded successfully');
        return pageData;
    } catch (error) {
        console.error('Error loading bancabilita.json:', error);
        return null;
    }
}

// Populate sidebar
function populateSidebar() {
    if (!pageData || !pageData.sidebar) return;

    const sidebarNav = document.getElementById('sidebarNav');
    const sidebarCompanyName = document.getElementById('sidebarCompanyName');

    if (sidebarCompanyName) {
        sidebarCompanyName.textContent = pageData.sidebar.companyName || '';
    }

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

// Populate header
function populateHeader() {
    if (!pageData || !pageData.header) return;

    const headerTitle = document.getElementById('headerTitle');
    const headerSubtitle = document.getElementById('headerSubtitle');
    const printCompanyName = document.getElementById('printCompanyName');
    const printSubtitle = document.getElementById('printSubtitle');
    const userMenuName = document.getElementById('userMenuName');
    const irpBadge = document.getElementById('irp-header-badge');

    if (headerTitle) headerTitle.textContent = pageData.header.title || '';
    if (headerSubtitle) headerSubtitle.textContent = pageData.header.subtitle || '';
    if (printCompanyName) printCompanyName.textContent = pageData.header.companyName || '';
    if (printSubtitle) printSubtitle.textContent = pageData.header.title || '';
    if (userMenuName) userMenuName.textContent = pageData.header.userName || 'Utente';

    if (irpBadge && pageData.header.irpBadge) {
        const badge = pageData.header.irpBadge;
        irpBadge.className = `badge me-3 ${badge.class || ''}`;
        irpBadge.innerHTML = `<i class="${badge.icon} me-1"></i> IRP: ${badge.score} (${badge.category})`;
    }
}

// Populate footer
function populateFooter() {
    const currentYear = new Date().getFullYear();
    const yearElements = [
        document.getElementById('currentYearSidebar'),
        document.getElementById('currentYearFooterReport')
    ];
    yearElements.forEach(el => {
        if (el) el.textContent = currentYear;
    });
}

// Populate section main title
function populateSectionMain() {
    if (!pageData || !pageData.sectionMain) return;

    const sectionMainTitle = document.getElementById('sectionMainTitle');
    if (sectionMainTitle) {
        sectionMainTitle.innerHTML = `<i class="${pageData.sectionMain.icon}"></i>${pageData.sectionMain.title}`;
    }
}

// Populate IRP Summary Section
function populateIRPSummary() {
    if (!pageData || !pageData.irpSummary) return;

    const section = pageData.irpSummary;

    // Section class
    const irpSection = document.getElementById('irpSummarySection');
    if (irpSection && section.sectionClass) {
        irpSection.className = `irp-visual-section report-section ${section.sectionClass}`;
    }

    // Title
    const irpTitle = document.getElementById('irpTitle');
    if (irpTitle) irpTitle.innerHTML = section.title || '';

    // Score circle
    const irpScoreCircle = document.getElementById('irpScoreCircle');
    const irpScoreValue = document.getElementById('irpScoreValue');
    if (irpScoreCircle && section.category) {
        irpScoreCircle.className = `irp-score-circle ${section.category}`;
    }
    if (irpScoreValue) irpScoreValue.textContent = section.score || '';

    // Category text
    const irpCategoryText = document.getElementById('irpCategoryText');
    if (irpCategoryText && section.badge) {
        irpCategoryText.className = `irp-category-text mt-2 ${section.categoryClass || ''}`;
        irpCategoryText.innerHTML = `${section.categoryText} <span class="${section.badge.class}">${section.badge.text}</span>`;
    }

    // Detail link
    const irpDetailLink = document.getElementById('irpDetailLink');
    if (irpDetailLink) irpDetailLink.href = section.detailLink || '#';

    // General title and text
    const irpGeneralTitle = document.getElementById('irpGeneralTitle');
    const irpGeneralText = document.getElementById('irpGeneralText');
    if (irpGeneralTitle) irpGeneralTitle.textContent = section.generalTitle || '';
    if (irpGeneralText) irpGeneralText.innerHTML = section.generalText || '';

    // Crisis button
    const irpCrisisBtn = document.getElementById('irpCrisisBtn');
    if (irpCrisisBtn && section.crisisButton) {
        irpCrisisBtn.className = `btn btn-sm mb-3 btn-pill ${section.crisisButton.class || ''}`;
        irpCrisisBtn.innerHTML = `<i class="${section.crisisButton.icon}"></i> ${section.crisisButton.text}`;
    }

    // Other ratings
    const otherRatingsTitle = document.getElementById('otherRatingsTitle');
    const otherRatingsList = document.getElementById('otherRatingsList');

    if (otherRatingsTitle) otherRatingsTitle.textContent = section.otherRatings.title || '';

    if (otherRatingsList && section.otherRatings.items) {
        otherRatingsList.innerHTML = '';
        section.otherRatings.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'col-sm-6 d-flex align-items-center';

            let badgeHTML = '';
            if (item.badge) {
                badgeHTML = `<span class="badge ${item.badge.class} ms-1">${item.badge.text}</span>`;
            }

            li.innerHTML = `
                <span class="icon-circle icon-circle-sm ${item.iconClass} me-2">
                    <i class="${item.icon}"></i>
                </span>
                <strong>${item.label}</strong> ${item.value || ''} ${badgeHTML}
            `;
            otherRatingsList.appendChild(li);
        });
    }
}

// Section 4.1: Valutazione Sintetica
function populateSection41() {
    if (!pageData || !pageData.section41) return;

    const section = pageData.section41;

    const title = document.getElementById('section41Title');
    const intro = document.getElementById('section41Intro');
    const conclusion = document.getElementById('section41Conclusion');

    if (title) title.textContent = section.title || '';
    if (intro && section.intro) {
        intro.innerHTML = section.intro.join('');
    }
    if (conclusion) conclusion.textContent = section.conclusion || '';

    // Table
    if (section.table) {
        populateGenericTable(
            'section41TableHead',
            'section41TableBody',
            section.table.headers,
            section.table.rows,
            (row) => `
                <td>${row.indicatore || ''}</td>
                <td class="text-end">${row.valore || ''}</td>
                <td>${row.valutazione || ''}</td>
            `
        );
    }

    // Strengths
    const strengthsTitle = document.getElementById('strengthsTitle');
    const strengthsList = document.getElementById('strengthsList');
    if (strengthsTitle) strengthsTitle.textContent = section.strengths.title || '';
    if (strengthsList && section.strengths.items) {
        strengthsList.innerHTML = '';
        section.strengths.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            strengthsList.appendChild(li);
        });
    }

    // Criticalities
    const criticalitiesTitle = document.getElementById('criticalitiesTitle');
    const criticalitiesList = document.getElementById('criticalitiesList');
    if (criticalitiesTitle) criticalitiesTitle.textContent = section.criticalities.title || '';
    if (criticalitiesList && section.criticalities.items) {
        criticalitiesList.innerHTML = '';
        section.criticalities.items.forEach(item => {
            const li = document.createElement('li');
            li.textContent = item;
            criticalitiesList.appendChild(li);
        });
    }
}

// Section 4.2: Indicatori Sostenibilità
function populateSection42() {
    if (!pageData || !pageData.section42) return;

    const section = pageData.section42;

    const title = document.getElementById('section42Title');
    const intro = document.getElementById('section42Intro');
    const tableTitle = document.getElementById('table42Title');
    const chartTitle = document.getElementById('chart42Title');
    const interpretationTitle = document.getElementById('interpretation42Title');
    const interpretationList = document.getElementById('interpretation42List');

    if (title) title.textContent = section.title || '';
    if (intro) intro.textContent = section.intro || '';
    if (tableTitle) tableTitle.textContent = section.tableTitle || '';
    if (chartTitle) chartTitle.textContent = section.chartTitle || '';
    if (interpretationTitle) interpretationTitle.textContent = section.interpretationTitle || '';

    // Table with badges
    if (section.table) {
        populateGenericTable(
            'section42TableHead',
            'section42TableBody',
            section.table.headers,
            section.table.rows,
            (row) => {
                const badgeHTML = row.badge ?
                    `<span class="status-badge ${row.badgeClass || ''}">${row.badge}</span>` : '';
                return `
                    <td>${row.indicatore || ''}</td>
                    <td class="text-end">${row.valore || ''}</td>
                    <td>${badgeHTML}</td>
                `;
            }
        );
    }

    // Interpretation list
    if (interpretationList && section.interpretation) {
        interpretationList.innerHTML = '';
        section.interpretation.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item;
            interpretationList.appendChild(li);
        });
    }

    // Render chart
    if (section.chart) {
        renderChart('debtSustainabilityChart', section.chart);
    }
}

// Section 4.3: Capacità Indebitamento
function populateSection43() {
    if (!pageData || !pageData.section43) return;

    const section = pageData.section43;

    const title = document.getElementById('section43Title');
    const intro = document.getElementById('section43Intro');
    const conclusion = document.getElementById('section43Conclusion');

    if (title) title.textContent = section.title || '';
    if (intro) intro.textContent = section.intro || '';
    if (conclusion && section.conclusion) {
        conclusion.innerHTML = section.conclusion.join('');
    }

    // Incremental capacity alert
    if (section.incrementalCapacity) {
        const alert = document.getElementById('incrementalCapacityAlert');
        const icon = document.getElementById('incrementalCapacityIcon');
        const alertTitle = document.getElementById('incrementalCapacityTitle');
        const value = document.getElementById('incrementalCapacityValue');
        const label = document.getElementById('incrementalCapacityLabel');

        if (alert) alert.className = `alert-box p-3 ${section.incrementalCapacity.alertClass}`;
        if (icon) {
            icon.className = `icon-circle ${section.incrementalCapacity.iconClass} mx-auto mb-2`;
            icon.innerHTML = `<i class="${section.incrementalCapacity.icon}"></i>`;
        }
        if (alertTitle) alertTitle.textContent = section.incrementalCapacity.title || '';
        if (value) value.textContent = section.incrementalCapacity.value || '';
        if (label) label.textContent = section.incrementalCapacity.label || '';
    }

    // Factors
    const factorsTitle = document.getElementById('factorsTitle');
    if (factorsTitle) factorsTitle.textContent = section.factorsTitle || '';

    // Criticalities factors
    const criticalitiesFactorsTitle = document.getElementById('criticalitiesFactorsTitle');
    const criticalitiesFactorsList = document.getElementById('criticalitiesFactorsList');
    if (criticalitiesFactorsTitle) criticalitiesFactorsTitle.textContent = section.criticalities.title || '';
    if (criticalitiesFactorsList && section.criticalities.items) {
        criticalitiesFactorsList.innerHTML = '';
        section.criticalities.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="fa-li ${item.iconClass}"><i class="${item.icon}"></i></span>${item.text}`;
            criticalitiesFactorsList.appendChild(li);
        });
    }

    // Considerations factors
    const considerationsFactorsTitle = document.getElementById('considerationsFactorsTitle');
    const considerationsFactorsList = document.getElementById('considerationsFactorsList');
    if (considerationsFactorsTitle) considerationsFactorsTitle.textContent = section.considerations.title || '';
    if (considerationsFactorsList && section.considerations.items) {
        considerationsFactorsList.innerHTML = '';
        section.considerations.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<span class="fa-li ${item.iconClass}"><i class="${item.icon}"></i></span>${item.text}`;
            considerationsFactorsList.appendChild(li);
        });
    }
}

// Section 4.4: DSCR
function populateSection44() {
    if (!pageData || !pageData.section44) return;

    const section = pageData.section44;

    const title = document.getElementById('section44Title');
    const intro = document.getElementById('section44Intro');
    const implicationsTitle = document.getElementById('implicationsTitle');
    const implicationsList = document.getElementById('implicationsList');
    const conclusion = document.getElementById('section44Conclusion');

    if (title) title.textContent = section.title || '';
    if (intro) intro.textContent = section.intro || '';
    if (implicationsTitle) implicationsTitle.textContent = section.implicationsTitle || '';
    if (conclusion) conclusion.textContent = section.conclusion || '';

    // Table
    if (section.table) {
        populateGenericTable(
            'section44TableHead',
            'section44TableBody',
            section.table.headers,
            section.table.rows,
            (row) => {
                const badgeHTML = row.badge ?
                    `<span class="status-badge ${row.badgeClass || ''}">${row.badge}</span>` : row.valutazione || '';
                return `
                    <td>${row.parametro || ''}</td>
                    <td class="text-end">${row.valore || ''}</td>
                    <td>${badgeHTML}</td>
                `;
            }
        );
    }

    // Analysis alert
    if (section.analysis) {
        const alert = document.getElementById('dscrAnalysisAlert');
        const alertTitle = document.getElementById('dscrAnalysisTitle');
        const alertIntro = document.getElementById('dscrAnalysisIntro');
        const alertList = document.getElementById('dscrAnalysisList');

        if (alert) alert.className = `alert-box ${section.analysis.alertClass}`;
        if (alertTitle) alertTitle.textContent = section.analysis.title || '';
        if (alertIntro) alertIntro.textContent = section.analysis.intro || '';
        if (alertList && section.analysis.items) {
            alertList.innerHTML = '';
            section.analysis.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                alertList.appendChild(li);
            });
        }
    }

    // Implications list
    if (implicationsList && section.implications) {
        implicationsList.innerHTML = '';
        section.implications.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item;
            implicationsList.appendChild(li);
        });
    }
}

// Section 4.5: Matching Finanziario
function populateSection45() {
    if (!pageData || !pageData.section45) return;

    const section = pageData.section45;

    const title = document.getElementById('section45Title');
    const intro = document.getElementById('section45Intro');

    if (title) title.textContent = section.title || '';
    if (intro) intro.textContent = section.intro || '';

    // Matching cards
    const container = document.getElementById('matchingCardsContainer');
    if (container && section.matchingCards) {
        container.innerHTML = '';
        section.matchingCards.forEach(card => {
            const col = document.createElement('div');
            col.className = 'col-md-6';

            const cardDiv = document.createElement('div');
            cardDiv.className = `dashboard-card matching-card ${card.cardClass} h-100`;

            let dataHTML = '';
            if (card.data) {
                dataHTML = '<ul class="small list-unstyled">';
                card.data.forEach(item => {
                    dataHTML += `<li>${item}</li>`;
                });
                dataHTML += '</ul>';
            }

            const badgeHTML = card.evaluation ?
                `<span class="status-badge ${card.badgeClass}">${card.evaluation}</span>` : '';

            cardDiv.innerHTML = `
                <h6 class="matching-card-header">
                    <i class="${card.icon} ${card.iconClass}"></i> ${card.title}
                </h6>
                <p class="small mb-1">${card.intro}</p>
                ${dataHTML}
                <p class="small">${card.text}</p>
                <p class="small fw-bold mb-0">Valutazione: ${badgeHTML}</p>
            `;

            col.appendChild(cardDiv);
            container.appendChild(col);
        });
    }
}

// Section 4.6: Analisi Capacità Sostenibile
function populateSection46() {
    if (!pageData || !pageData.section46) return;

    const section = pageData.section46;

    const title = document.getElementById('section46Title');
    const intro = document.getElementById('section46Intro');
    const outlookTitle = document.getElementById('outlookTitle');
    const outlookIntro = document.getElementById('outlookIntro');
    const conclusion = document.getElementById('section46Conclusion');

    if (title) title.textContent = section.title || '';
    if (intro) intro.textContent = section.intro || '';
    if (outlookTitle) outlookTitle.textContent = section.outlookTitle || '';
    if (outlookIntro) outlookIntro.textContent = section.outlookIntro || '';
    if (conclusion) conclusion.textContent = section.conclusion || '';

    // Table 1
    if (section.table1) {
        populateGenericTable(
            'section46Table1Head',
            'section46Table1Body',
            section.table1.headers,
            section.table1.rows,
            (row) => `
                <td>${row.scenario || ''}</td>
                <td class="text-end">${row.formula || ''}</td>
                <td class="text-end">${row.valore || ''}</td>
            `
        );
    }

    // Table 2
    if (section.table2) {
        populateGenericTable(
            'section46Table2Head',
            'section46Table2Body',
            section.table2.headers,
            section.table2.rows,
            (row) => `
                <td>${row.anno || ''}</td>
                <td class="text-end">${row.rating || ''}</td>
                <td>${row.problematiche || ''}</td>
                <td class="text-end">${row.capacita || ''}</td>
            `
        );
    }
}

// Section 4.7: KPI Crisi
function populateSection47() {
    if (!pageData || !pageData.section47) return;

    const section = pageData.section47;

    const title = document.getElementById('section47Title');
    const intro = document.getElementById('section47Intro');

    if (title) title.textContent = section.title || '';
    if (intro) intro.textContent = section.intro || '';

    // Table
    if (section.table) {
        populateGenericTable(
            'section47TableHead',
            'section47TableBody',
            section.table.headers,
            section.table.rows,
            (row) => {
                const badgeHTML = row.badge ?
                    `<span class="status-badge ${row.badgeClass || ''}">${row.badge}</span>` : '';
                return `
                    <td>${row.indicatore || ''}</td>
                    <td>${row.formula || ''}</td>
                    <td class="text-end">${row.valore || ''}</td>
                    <td>${row.soglia || ''}</td>
                    <td>${badgeHTML}</td>
                `;
            }
        );
    }

    // Result alert
    if (section.result) {
        const alert = document.getElementById('cciiResultAlert');
        const alertTitle = document.getElementById('cciiResultTitle');
        const alertText = document.getElementById('cciiResultText');
        const alertList = document.getElementById('cciiResultList');

        if (alert) alert.className = `alert-box ${section.result.alertClass}`;
        if (alertTitle) alertTitle.textContent = section.result.title || '';
        if (alertText) alertText.textContent = section.result.text || '';
        if (alertList && section.result.items) {
            alertList.innerHTML = '';
            section.result.items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                alertList.appendChild(li);
            });
        }
    }
}

// Section 4.8: Raccomandazioni
function populateSection48() {
    if (!pageData || !pageData.section48) return;

    const section = pageData.section48;

    const title = document.getElementById('section48Title');
    const priorityTitle = document.getElementById('priorityRecommendationsTitle');
    const conclusion = document.getElementById('section48Conclusion');

    if (title) title.textContent = section.title || '';
    if (priorityTitle) priorityTitle.textContent = section.priorityRecommendationsTitle || '';
    if (conclusion) conclusion.innerHTML = section.conclusion || '';

    // Table
    if (section.table) {
        populateGenericTable(
            'section48TableHead',
            'section48TableBody',
            section.table.headers,
            section.table.rows,
            (row) => `
                <td>${row.situazione || ''}</td>
                <td>${row.azione || ''}</td>
                <td>${row.effetti || ''}</td>
                <td class="text-end">${row.impatto || ''}</td>
            `
        );
    }

    // Priority recommendations (numbered list)
    const priorityList = document.getElementById('priorityRecommendationsList');
    if (priorityList && section.priorityRecommendations) {
        priorityList.innerHTML = '';
        section.priorityRecommendations.forEach(rec => {
            const li = document.createElement('li');
            li.innerHTML = `${rec.title}: ${rec.intro}`;

            if (rec.items) {
                const ul = document.createElement('ul');
                rec.items.forEach(item => {
                    const itemLi = document.createElement('li');
                    itemLi.textContent = item;
                    ul.appendChild(itemLi);
                });
                li.appendChild(ul);
            }

            priorityList.appendChild(li);
        });
    }
}

// Generic table renderer
function populateGenericTable(headerId, bodyId, headers, rows, rowRenderer) {
    const thead = document.getElementById(headerId);
    const tbody = document.getElementById(bodyId);

    if (!thead || !tbody) return;

    // Headers
    if (headers) {
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            if (header === 'Valore' || header === 'Valore (€)' || header === 'Valore stimato' || header === 'Formula' || header === 'Outlook Rating' || header === 'Capacità incrementale (€)' || header === 'Impatto Quantitativo/Costo') {
                th.className = 'text-end';
            }
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    // Body
    tbody.innerHTML = '';
    if (rows && rowRenderer) {
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = rowRenderer(row);
            tbody.appendChild(tr);
        });
    }
}

// Generic chart renderer using Chart.js
function renderChart(canvasId, chartConfig) {
    const ctx = document.getElementById(canvasId);
    if (!ctx) return;

    // Destroy existing chart if present
    if (window[canvasId + 'Instance']) {
        window[canvasId + 'Instance'].destroy();
    }

    // Create new chart
    window[canvasId + 'Instance'] = new Chart(ctx, {
        type: chartConfig.type || 'line',
        data: chartConfig.data || {},
        options: chartConfig.options || {}
    });
}

// Utility: Format number with Italian locale
function formatNumber(value) {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return value;
    return num.toLocaleString('it-IT');
}

// Utility: Format percentage
function formatPercent(value) {
    if (value === null || value === undefined || value === '') return '';
    const num = typeof value === 'number' ? value : parseFloat(value);
    if (isNaN(num)) return value;
    const sign = num > 0 ? '+' : '';
    return sign + num.toFixed(1) + '%';
}

// Event handlers
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
            if (confirm('Confermi il logout?')) {
                sessionStorage.clear();
                localStorage.removeItem('isAuthenticated');
                window.location.href = '../index.html';
            }
        });
    }
}

// Initialize page
async function initPage() {
    console.log('Initializing Bancabilita page...');

    const data = await loadPageData();
    if (!data) {
        console.error('Failed to load page data');
        return;
    }

    // Populate all sections
    populateSidebar();
    populateHeader();
    populateFooter();
    populateSectionMain();
    populateIRPSummary();
    populateSection41();
    populateSection42();
    populateSection43();
    populateSection44();
    populateSection45();
    populateSection46();
    populateSection47();
    populateSection48();

    // Setup event handlers
    setupEventHandlers();

    console.log('Bancabilita page initialized successfully');
}

// Run on page load
document.addEventListener('DOMContentLoaded', initPage);
