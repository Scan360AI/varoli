/**
 * Analisi Economica e Benchmark - Page Logic
 * Handles all data population and chart rendering for the economic analysis page
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
        populateSection_2_1_1();  // Conto Economico
        populateSection_2_1_2();  // Marginalità
        populateSection_2_1_3();  // Struttura Costi
        populateSection_2_1_4();  // Redditività
        populateSection_2_1_5();  // Leva Finanziaria
        populateSection_2_2_1();  // Benchmark
        populateSection_2_2_2();  // Gap Analysis
        populateSection_2_2_3();  // Azioni
        populateSummary();
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
        const response = await fetch('../data/pages/economica.json');
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

    if (companyNameEl) companyNameEl.textContent = pageData.sidebar.companyName;

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

    const irpScore = pageData.header.irpScore;
    let badgeClass = 'bg-warning text-dark';
    if (irpScore >= 71) badgeClass = 'bg-success';
    else if (irpScore < 51) badgeClass = 'bg-danger';

    badgeEl.className = `badge ${badgeClass} me-3`;
    badgeEl.textContent = `IRP: ${irpScore.toFixed(1)}`;
}

/**
 * Populate Section 2.1.1 - Conto Economico Riclassificato
 */
function populateSection_2_1_1() {
    const section = pageData.section_2_1_1;

    // Intro
    const introEl = document.getElementById('incomeStatementIntro');
    if (introEl) introEl.textContent = section.intro;

    // Chart 1 Title
    const chart1TitleEl = document.getElementById('chart1Title');
    if (chart1TitleEl) chart1TitleEl.textContent = section.chart1.title;

    // Render Chart 1
    renderChart(section.chart1.canvasId, section.chart1);

    // Table 1 Title
    const table1TitleEl = document.getElementById('table1Title');
    if (table1TitleEl) table1TitleEl.textContent = section.table1.title;

    // Populate Income Statement Table
    populateGenericTable(
        'incomeStatementTableHead',
        'incomeStatementTableBody',
        section.table1.headers,
        section.table1.rows,
        (row) => {
            const isNegative = typeof row.var === 'number' && row.var < 0;
            const varClass = isNegative ? 'text-danger' : 'text-success';
            const rowClass = row.highlight ? (row.highlightClass || '') : '';

            return `
                <tr class="${rowClass}">
                    <td>${row.voce}</td>
                    <td class="text-end">${formatNumber(row["2022"])}</td>
                    <td class="text-end">${row.pct_2022}</td>
                    <td class="text-end">${formatNumber(row["2023"])}</td>
                    <td class="text-end">${row.pct_2023}</td>
                    <td class="text-end">${formatNumber(row["2024"])}</td>
                    <td class="text-end">${row.pct_2024}</td>
                    <td class="${varClass}">${formatPercent(row.var)}</td>
                </tr>
            `;
        }
    );

    // Costs Composition Title
    const costsCompTitleEl = document.getElementById('costsCompositionTitle');
    if (costsCompTitleEl) costsCompTitleEl.textContent = section.costsComposition.title;

    // Populate Costs Composition Table
    populateGenericTable(
        'costsCompositionTableHead',
        'costsCompositionTableBody',
        section.costsComposition.headers,
        section.costsComposition.rows,
        (row) => {
            const varClass = row.varClass || '';
            return `
                <tr>
                    <td>${row.categoria}</td>
                    <td class="text-end">${formatNumber(row["2022"])}</td>
                    <td class="text-end">${row.pct_2022}</td>
                    <td class="text-end">${formatNumber(row["2023"])}</td>
                    <td class="text-end">${row.pct_2023}</td>
                    <td class="text-end">${formatNumber(row["2024"])}</td>
                    <td class="text-end">${row.pct_2024}</td>
                    <td class="${varClass}">${formatValue(row.var)}</td>
                </tr>
            `;
        }
    );

    // Analysis Title and List
    const analysisTitleEl = document.getElementById('incomeAnalysisTitle');
    const analysisListEl = document.getElementById('incomeAnalysisList');

    if (analysisTitleEl) analysisTitleEl.textContent = section.analysis.title;
    if (analysisListEl) {
        analysisListEl.innerHTML = '';
        section.analysis.points.forEach(point => {
            const li = document.createElement('li');
            li.innerHTML = point;
            analysisListEl.appendChild(li);
        });
    }
}

/**
 * Populate Section 2.1.2 - Marginalità
 */
function populateSection_2_1_2() {
    const section = pageData.section_2_1_2;

    // Intro
    const introEl = document.getElementById('marginalityIntro');
    if (introEl) introEl.textContent = section.intro;

    // Chart 2 Title
    const chart2TitleEl = document.getElementById('chart2Title');
    if (chart2TitleEl) chart2TitleEl.textContent = section.chart2.title;

    // Render Chart 2
    renderChart(section.chart2.canvasId, section.chart2);

    // Table 2 Title
    const table2TitleEl = document.getElementById('table2Title');
    if (table2TitleEl) table2TitleEl.textContent = section.table2.title;

    // Populate Marginality Table
    populateGenericTable(
        'marginalityTableHead',
        'marginalityTableBody',
        section.table2.headers,
        section.table2.rows,
        (row) => {
            const trendIcon = getTrendIcon(row.trend);
            const rowClass = row.highlight ? 'table-secondary' : '';
            return `
                <tr class="${rowClass}">
                    <td>${row.indicatore}</td>
                    <td class="text-end">${row["2022"]}</td>
                    <td class="text-end">${row["2023"]}</td>
                    <td class="text-end">${row["2024"]}</td>
                    <td class="${row.trendClass}"><i class="${trendIcon}"></i></td>
                </tr>
            `;
        }
    );

    // Break-even Title and List
    const breakEvenTitleEl = document.getElementById('breakEvenTitle');
    const breakEvenListEl = document.getElementById('breakEvenList');

    if (breakEvenTitleEl) breakEvenTitleEl.textContent = section.breakEven.title;
    if (breakEvenListEl) {
        breakEvenListEl.innerHTML = '';
        section.breakEven.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${item.icon} me-1"></i> ${item.text}`;
            breakEvenListEl.appendChild(li);
        });
    }
}

/**
 * Populate Section 2.1.3 - Struttura Costi
 */
function populateSection_2_1_3() {
    const section = pageData.section_2_1_3;

    // Intro
    const introEl = document.getElementById('costsStructureIntro');
    if (introEl) introEl.textContent = section.intro;

    // Table 3 Title
    const table3TitleEl = document.getElementById('table3Title');
    if (table3TitleEl) table3TitleEl.textContent = section.table3.title;

    // Populate Costs Structure Table
    populateGenericTable(
        'costsStructureTableHead',
        'costsStructureTableBody',
        section.table3.headers,
        section.table3.rows,
        (row) => {
            const varClass = row.varClass || '';
            return `
                <tr>
                    <td>${row.categoria}</td>
                    <td class="text-end">${formatNumber(row["2022"])}</td>
                    <td class="text-end">${row.pct_2022}</td>
                    <td class="text-end">${formatNumber(row["2023"])}</td>
                    <td class="text-end">${row.pct_2023}</td>
                    <td class="text-end">${formatNumber(row["2024"])}</td>
                    <td class="text-end">${row.pct_2024}</td>
                    <td class="${varClass}">${formatValue(row.var)}</td>
                    <td><span class="status-badge ${row.badgeClass}">${row.badge}</span></td>
                </tr>
            `;
        }
    );

    // Personnel Cost Title
    const personnelTitleEl = document.getElementById('personnelCostTitle');
    if (personnelTitleEl) personnelTitleEl.textContent = section.personnelCost.title;

    // Populate Personnel Cost Table
    populateGenericTable(
        'personnelCostTableHead',
        'personnelCostTableBody',
        section.personnelCost.headers,
        section.personnelCost.rows,
        (row) => {
            const varClass = row.varClass || '';
            return `
                <tr>
                    <td>${row.dettaglio}</td>
                    <td class="text-end">${formatValue(row["2022"])}</td>
                    <td class="text-end">${formatValue(row["2023"])}</td>
                    <td class="text-end">${formatValue(row["2024"])}</td>
                    <td class="text-end ${varClass}">${formatValue(row.var)}</td>
                </tr>
            `;
        }
    );

    // Costs Analysis Title and List
    const analysisTitleEl = document.getElementById('costsAnalysisTitle');
    const analysisListEl = document.getElementById('costsAnalysisList');

    if (analysisTitleEl) analysisTitleEl.textContent = section.costsAnalysis.title;
    if (analysisListEl) {
        analysisListEl.innerHTML = '';
        section.costsAnalysis.points.forEach(point => {
            const li = document.createElement('li');
            li.innerHTML = point;
            analysisListEl.appendChild(li);
        });
    }
}

/**
 * Populate Section 2.1.4 - Redditività
 */
function populateSection_2_1_4() {
    const section = pageData.section_2_1_4;

    // Intro
    const introEl = document.getElementById('profitabilityIntro');
    if (introEl) introEl.textContent = section.intro;

    // Table 4 Title
    const table4TitleEl = document.getElementById('table4Title');
    if (table4TitleEl) table4TitleEl.textContent = section.table4.title;

    // Populate Profitability Table
    populateGenericTable(
        'profitabilityTableHead',
        'profitabilityTableBody',
        section.table4.headers,
        section.table4.rows,
        (row) => {
            return `
                <tr>
                    <td>${row.indice}</td>
                    <td>${row.formula}</td>
                    <td class="text-end">${row["2022"]}</td>
                    <td class="text-end">${row["2023"]}</td>
                    <td class="text-end">${row["2024"]}</td>
                    <td>${row.soglia}</td>
                    <td><span class="status-badge ${row.badgeClass}">${row.badge}</span></td>
                </tr>
            `;
        }
    );

    // Chart 3 Title
    const chart3TitleEl = document.getElementById('chart3Title');
    if (chart3TitleEl) chart3TitleEl.textContent = section.chart3.title;

    // Render Chart 3
    renderChart(section.chart3.canvasId, section.chart3);

    // Profitability Analysis Title and List
    const analysisTitleEl = document.getElementById('profitabilityAnalysisTitle');
    const analysisListEl = document.getElementById('profitabilityAnalysisList');

    if (analysisTitleEl) analysisTitleEl.textContent = section.profitabilityAnalysis.title;
    if (analysisListEl) {
        analysisListEl.innerHTML = '';
        section.profitabilityAnalysis.points.forEach(point => {
            const li = document.createElement('li');
            li.innerHTML = point;
            analysisListEl.appendChild(li);
        });
    }
}

/**
 * Populate Section 2.1.5 - Leva Finanziaria
 */
function populateSection_2_1_5() {
    const section = pageData.section_2_1_5;

    // Intro
    const introEl = document.getElementById('leverageIntro');
    if (introEl) introEl.textContent = section.intro;

    // Table 5 Title
    const table5TitleEl = document.getElementById('table5Title');
    if (table5TitleEl) table5TitleEl.textContent = section.table5.title;

    // Populate Leverage Table
    populateGenericTable(
        'leverageTableHead',
        'leverageTableBody',
        section.table5.headers,
        section.table5.rows,
        (row) => {
            const rowClass = row.highlight ? 'table-secondary' : '';
            const tdClass = row.bold ? 'fw-bold' : '';
            return `
                <tr class="${rowClass}">
                    <td class="${tdClass}">${row.parametro}</td>
                    <td>${row.formula}</td>
                    <td class="text-end">${row["2022"]}</td>
                    <td class="text-end">${row["2023"]}</td>
                    <td class="text-end">${row["2024"]}</td>
                    <td class="text-end">${row.var}</td>
                </tr>
            `;
        }
    );

    // Chart 4 Title
    const chart4TitleEl = document.getElementById('chart4Title');
    if (chart4TitleEl) chart4TitleEl.textContent = section.chart4.title;

    // Render Chart 4
    renderChart(section.chart4.canvasId, section.chart4);

    // Leverage Analysis Title and List
    const analysisTitleEl = document.getElementById('leverageAnalysisTitle');
    const analysisListEl = document.getElementById('leverageAnalysisList');

    if (analysisTitleEl) analysisTitleEl.textContent = section.leverageAnalysis.title;
    if (analysisListEl) {
        analysisListEl.innerHTML = '';
        section.leverageAnalysis.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${item.icon} ${item.iconClass} me-1"></i> ${item.text}`;
            analysisListEl.appendChild(li);
        });
    }
}

/**
 * Populate Section 2.2.1 - Benchmark
 */
function populateSection_2_2_1() {
    const section = pageData.section_2_2_1;

    // Intro
    const introEl = document.getElementById('benchmarkIntro');
    if (introEl) introEl.textContent = section.intro;

    // Chart 5 Title
    const chart5TitleEl = document.getElementById('chart5Title');
    if (chart5TitleEl) chart5TitleEl.textContent = section.chart5.title;

    // Render Chart 5 (Radar)
    renderChart(section.chart5.canvasId, section.chart5);

    // Table 6 Title
    const table6TitleEl = document.getElementById('table6Title');
    if (table6TitleEl) table6TitleEl.textContent = section.table6.title;

    // Populate Benchmark Table
    populateGenericTable(
        'benchmarkTableHead',
        'benchmarkTableBody',
        section.table6.headers,
        section.table6.rows,
        (row) => {
            return `
                <tr>
                    <td>${row.indicatore}</td>
                    <td>${row.varoli}</td>
                    <td>${row.settore}</td>
                    <td class="${row.gapClass}">${row.gap}</td>
                    <td><span class="status-badge ${row.badgeClass}">${row.badge}</span></td>
                </tr>
            `;
        }
    );

    // Benchmark Analysis
    const analysisTitleEl = document.getElementById('benchmarkAnalysisTitle');
    const analysisTextEl = document.getElementById('benchmarkAnalysisText');

    if (analysisTitleEl) analysisTitleEl.textContent = section.benchmarkAnalysis.title;
    if (analysisTextEl) analysisTextEl.innerHTML = section.benchmarkAnalysis.text;
}

/**
 * Populate Section 2.2.2 - Gap Analysis
 */
function populateSection_2_2_2() {
    const section = pageData.section_2_2_2;

    // Intro
    const introEl = document.getElementById('gapAnalysisIntro');
    if (introEl) introEl.textContent = section.intro;

    // Table 7 Title
    const table7TitleEl = document.getElementById('table7Title');
    if (table7TitleEl) table7TitleEl.textContent = section.table7.title;

    // Populate Gap Analysis Table
    populateGenericTable(
        'gapAnalysisTableHead',
        'gapAnalysisTableBody',
        section.table7.headers,
        section.table7.rows,
        (row) => {
            return `
                <tr>
                    <td>${row.area}</td>
                    <td>${row.attuale}</td>
                    <td>${row.benchmark}</td>
                    <td class="${row.gapClass}">${row.gap}</td>
                    <td><span class="status-badge ${row.badgeClass}">${row.badge}</span></td>
                </tr>
            `;
        }
    );
}

/**
 * Populate Section 2.2.3 - Azioni
 */
function populateSection_2_2_3() {
    const section = pageData.section_2_2_3;

    // Table 8 Title
    const table8TitleEl = document.getElementById('table8Title');
    if (table8TitleEl) table8TitleEl.textContent = section.table8.title;

    // Populate Actions Table
    populateGenericTable(
        'actionsTableHead',
        'actionsTableBody',
        section.table8.headers,
        section.table8.rows,
        (row) => {
            return `
                <tr>
                    <td>${row.area}</td>
                    <td>${row.azione}</td>
                    <td>${row.effetti}</td>
                    <td class="${row.benefitClass}">${row.benefit}</td>
                </tr>
            `;
        }
    );

    // Actions Note
    const actionsNoteEl = document.getElementById('actionsNote');
    if (actionsNoteEl) actionsNoteEl.textContent = section.actionsNote;
}

/**
 * Populate Summary Card
 */
function populateSummary() {
    const titleEl = document.getElementById('summaryTitle');
    const contentEl = document.getElementById('summaryContent');

    if (titleEl) titleEl.textContent = pageData.summary.title;
    if (contentEl) {
        contentEl.innerHTML = '';
        pageData.summary.paragraphs.forEach(para => {
            const p = document.createElement('p');
            p.innerHTML = para;
            contentEl.appendChild(p);
        });
    }
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
 * Generic table population function
 */
function populateGenericTable(headerId, bodyId, headers, rows, rowRenderer) {
    const headEl = document.getElementById(headerId);
    const bodyEl = document.getElementById(bodyId);

    if (headEl) {
        const tr = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            th.innerHTML = header;
            if (header.includes('text-end') || header.includes('€') || header.includes('%')) {
                th.className = 'text-end';
            }
            tr.appendChild(th);
        });
        headEl.innerHTML = '';
        headEl.appendChild(tr);
    }

    if (bodyEl) {
        bodyEl.innerHTML = '';
        rows.forEach(row => {
            bodyEl.innerHTML += rowRenderer(row);
        });
    }
}

/**
 * Render a chart using Chart.js
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
 * Setup event handlers
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
        });
    }
}

/**
 * Utility Functions
 */
function formatNumber(value) {
    if (value === null || value === undefined || value === 'n.d.') return 'n.d.';
    if (typeof value === 'string') return value;
    return new Intl.NumberFormat('it-IT').format(value);
}

function formatPercent(value) {
    if (value === null || value === undefined || value === 'n.d.') return 'n.d.';
    if (typeof value === 'string') return value;
    return `${value > 0 ? '+' : ''}${value.toFixed(2)}%`;
}

function formatValue(value) {
    if (value === null || value === undefined || value === 'n.d.') return 'n.d.';
    if (typeof value === 'string') return value;
    if (typeof value === 'number') {
        if (Number.isInteger(value)) return formatNumber(value);
        return value.toFixed(2);
    }
    return value;
}

function getTrendIcon(trend) {
    switch(trend) {
        case 'up': return 'fas fa-arrow-up';
        case 'down': return 'fas fa-arrow-down';
        case 'critical': return 'fas fa-times';
        default: return 'fas fa-minus';
    }
}
