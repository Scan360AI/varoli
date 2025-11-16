// patrimoniale.js - Analisi Patrimoniale
// Modular approach: loads data from JSON and populates the page dynamically

let pageData = null;

// Load JSON data
async function loadPageData() {
    try {
        const response = await fetch('../data/pages/patrimoniale.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pageData = await response.json();
        console.log('Patrimoniale data loaded successfully');
        return pageData;
    } catch (error) {
        console.error('Error loading patrimoniale.json:', error);
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
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = item.href;
            a.className = item.active ? 'active' : '';
            a.innerHTML = `<i class="${item.icon}"></i><span>${item.label}</span>`;
            li.appendChild(a);
            sidebarNav.appendChild(li);
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
        irpBadge.textContent = pageData.header.irpBadge.text || '';
        irpBadge.className = `badge me-3 ${pageData.header.irpBadge.class || ''}`;
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

// Section 1: Stato Patrimoniale Riclassificato
function populateSection1() {
    if (!pageData || !pageData.section1) return;

    const section = pageData.section1;

    // Intro text
    const intro = document.getElementById('section1Intro');
    if (intro) intro.innerHTML = section.intro || '';

    // Chart titles
    const chart1Title = document.getElementById('chart1Title');
    const chart2Title = document.getElementById('chart2Title');
    const table1Title = document.getElementById('table1Title');

    if (chart1Title) chart1Title.textContent = section.chart1Title || '';
    if (chart2Title) chart2Title.textContent = section.chart2Title || '';
    if (table1Title) table1Title.textContent = section.table1Title || '';

    // Populate Balance Sheet Table
    if (section.table1) {
        populateBalanceSheetTable(section.table1);
    }

    // Render charts
    if (section.chart1) {
        renderChart('assetsChart', section.chart1);
    }
    if (section.chart2) {
        renderChart('liabilitiesChart', section.chart2);
    }
}

function populateBalanceSheetTable(tableData) {
    const thead = document.getElementById('balanceSheetTableHead');
    const tbody = document.getElementById('balanceSheetTableBody');

    if (!thead || !tbody) return;

    // Headers
    if (tableData.headers) {
        const headerRow = document.createElement('tr');
        tableData.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    // Body - Assets section
    tbody.innerHTML = '';

    if (tableData.assets && tableData.assets.length > 0) {
        const assetHeaderRow = document.createElement('tr');
        assetHeaderRow.className = 'table-primary';
        assetHeaderRow.innerHTML = '<td colspan="5"><strong>ATTIVITÀ</strong></td>';
        tbody.appendChild(assetHeaderRow);

        tableData.assets.forEach(row => {
            const tr = document.createElement('tr');
            if (row.highlight) tr.className = row.highlightClass || '';

            tr.innerHTML = `
                <td>${row.voce || ''}</td>
                <td class="text-end">${formatNumber(row['2022']) || ''}</td>
                <td class="text-end">${formatNumber(row['2023']) || ''}</td>
                <td class="text-end">${formatNumber(row['2024']) || ''}</td>
                <td class="text-end ${row.varClass || ''}">${formatPercent(row.var) || ''}</td>
            `;
            tbody.appendChild(tr);
        });

        // Total Assets
        if (tableData.totalAssets) {
            const totalRow = document.createElement('tr');
            totalRow.className = 'table-secondary fw-bold';
            totalRow.innerHTML = `
                <td>${tableData.totalAssets.voce || ''}</td>
                <td class="text-end">${formatNumber(tableData.totalAssets['2022']) || ''}</td>
                <td class="text-end">${formatNumber(tableData.totalAssets['2023']) || ''}</td>
                <td class="text-end">${formatNumber(tableData.totalAssets['2024']) || ''}</td>
                <td class="text-end ${tableData.totalAssets.varClass || ''}">${formatPercent(tableData.totalAssets.var) || ''}</td>
            `;
            tbody.appendChild(totalRow);
        }
    }

    // Liabilities section
    if (tableData.liabilities && tableData.liabilities.length > 0) {
        const liabHeaderRow = document.createElement('tr');
        liabHeaderRow.className = 'table-primary';
        liabHeaderRow.innerHTML = '<td colspan="5"><strong>PASSIVITÀ E PATRIMONIO NETTO</strong></td>';
        tbody.appendChild(liabHeaderRow);

        tableData.liabilities.forEach(row => {
            const tr = document.createElement('tr');
            if (row.highlight) tr.className = row.highlightClass || '';

            tr.innerHTML = `
                <td>${row.voce || ''}</td>
                <td class="text-end">${formatNumber(row['2022']) || ''}</td>
                <td class="text-end">${formatNumber(row['2023']) || ''}</td>
                <td class="text-end">${formatNumber(row['2024']) || ''}</td>
                <td class="text-end ${row.varClass || ''}">${formatPercent(row.var) || ''}</td>
            `;
            tbody.appendChild(tr);
        });

        // Total Liabilities
        if (tableData.totalLiabilities) {
            const totalRow = document.createElement('tr');
            totalRow.className = 'table-secondary fw-bold';
            totalRow.innerHTML = `
                <td>${tableData.totalLiabilities.voce || ''}</td>
                <td class="text-end">${formatNumber(tableData.totalLiabilities['2022']) || ''}</td>
                <td class="text-end">${formatNumber(tableData.totalLiabilities['2023']) || ''}</td>
                <td class="text-end">${formatNumber(tableData.totalLiabilities['2024']) || ''}</td>
                <td class="text-end ${tableData.totalLiabilities.varClass || ''}">${formatPercent(tableData.totalLiabilities.var) || ''}</td>
            `;
            tbody.appendChild(totalRow);
        }
    }
}

// Section 2: Struttura degli Investimenti
function populateSection2() {
    if (!pageData || !pageData.section2) return;

    const section = pageData.section2;

    const intro = document.getElementById('section2Intro');
    const chart3Title = document.getElementById('chart3Title');
    const analysisTitle = document.getElementById('investmentsAnalysisTitle');
    const analysisList = document.getElementById('investmentsAnalysisList');

    if (intro) intro.innerHTML = section.intro || '';
    if (chart3Title) chart3Title.textContent = section.chartTitle || '';
    if (analysisTitle) analysisTitle.textContent = section.analysisTitle || '';

    // Populate analysis list
    if (analysisList && section.analysis && section.analysis.items) {
        analysisList.innerHTML = '';
        section.analysis.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `
                <span class="icon-circle ${item.iconClass || ''} me-2">
                    <i class="${item.icon || ''}"></i>
                </span>
                ${item.text || ''}
            `;
            analysisList.appendChild(li);
        });
    }

    // Render chart
    if (section.chart3) {
        renderChart('investmentsStructureChart', section.chart3);
    }
}

// Section 3: Struttura delle Fonti
function populateSection3() {
    if (!pageData || !pageData.section3) return;

    const section = pageData.section3;

    const intro = document.getElementById('section3Intro');
    const chart4Title = document.getElementById('chart4Title');
    const chart5Title = document.getElementById('chart5Title');
    const equityAnalysisTitle = document.getElementById('equityAnalysisTitle');
    const equityAnalysisList = document.getElementById('equityAnalysisList');
    const liabilitiesAnalysisTitle = document.getElementById('liabilitiesAnalysisTitle');
    const liabilitiesAnalysisList = document.getElementById('liabilitiesAnalysisList');

    if (intro) intro.innerHTML = section.intro || '';
    if (chart4Title) chart4Title.textContent = section.chart4Title || '';
    if (chart5Title) chart5Title.textContent = section.chart5Title || '';
    if (equityAnalysisTitle) equityAnalysisTitle.textContent = section.equityAnalysisTitle || '';
    if (liabilitiesAnalysisTitle) liabilitiesAnalysisTitle.textContent = section.liabilitiesAnalysisTitle || '';

    // Equity analysis list
    if (equityAnalysisList && section.equityAnalysis && section.equityAnalysis.items) {
        equityAnalysisList.innerHTML = '';
        section.equityAnalysis.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `
                <span class="icon-circle ${item.iconClass || ''} me-2">
                    <i class="${item.icon || ''}"></i>
                </span>
                ${item.text || ''}
            `;
            equityAnalysisList.appendChild(li);
        });
    }

    // Liabilities analysis list
    if (liabilitiesAnalysisList && section.liabilitiesAnalysis && section.liabilitiesAnalysis.items) {
        liabilitiesAnalysisList.innerHTML = '';
        section.liabilitiesAnalysis.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `
                <span class="icon-circle ${item.iconClass || ''} me-2">
                    <i class="${item.icon || ''}"></i>
                </span>
                ${item.text || ''}
            `;
            liabilitiesAnalysisList.appendChild(li);
        });
    }

    // Render charts
    if (section.chart4) {
        renderChart('equityCompositionChart', section.chart4);
    }
    if (section.chart5) {
        renderChart('currentLiabilitiesChart', section.chart5);
    }
}

// Section 4: Posizione Finanziaria Netta (PFN)
function populateSection4() {
    if (!pageData || !pageData.section4) return;

    const section = pageData.section4;

    const intro = document.getElementById('section4Intro');
    const table2Title = document.getElementById('table2Title');
    const chart6Title = document.getElementById('chart6Title');
    const pfnAnalysisTitle = document.getElementById('pfnAnalysisTitle');
    const pfnAnalysisList = document.getElementById('pfnAnalysisList');

    if (intro) intro.innerHTML = section.intro || '';
    if (table2Title) table2Title.textContent = section.tableTitle || '';
    if (chart6Title) chart6Title.textContent = section.chartTitle || '';
    if (pfnAnalysisTitle) pfnAnalysisTitle.textContent = section.analysisTitle || '';

    // Populate PFN table
    if (section.table2) {
        populatePFNTable(section.table2);
    }

    // PFN analysis list
    if (pfnAnalysisList && section.analysis && section.analysis.items) {
        pfnAnalysisList.innerHTML = '';
        section.analysis.items.forEach(item => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = `
                <span class="icon-circle ${item.iconClass || ''} me-2">
                    <i class="${item.icon || ''}"></i>
                </span>
                ${item.text || ''}
            `;
            pfnAnalysisList.appendChild(li);
        });
    }

    // Render chart
    if (section.chart6) {
        renderChart('pfnTrendChart', section.chart6);
    }
}

function populatePFNTable(tableData) {
    const thead = document.getElementById('pfnTableHead');
    const tbody = document.getElementById('pfnTableBody');

    if (!thead || !tbody) return;

    // Headers
    if (tableData.headers) {
        const headerRow = document.createElement('tr');
        tableData.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    // Body
    tbody.innerHTML = '';
    if (tableData.rows) {
        tableData.rows.forEach(row => {
            const tr = document.createElement('tr');
            if (row.highlight) tr.className = row.highlightClass || '';

            tr.innerHTML = `
                <td>${row.voce || ''}</td>
                <td class="text-end">${formatNumber(row['2022']) || ''}</td>
                <td class="text-end">${formatNumber(row['2023']) || ''}</td>
                <td class="text-end">${formatNumber(row['2024']) || ''}</td>
                <td class="text-end ${row.varClass || ''}">${formatPercent(row.var) || ''}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Section 5: Indici di Solidità
function populateSection5() {
    if (!pageData || !pageData.section5) return;

    const section = pageData.section5;

    const intro = document.getElementById('section5Intro');
    const table3Title = document.getElementById('table3Title');
    const notesList = document.getElementById('solidityNotesList');

    if (intro) intro.innerHTML = section.intro || '';
    if (table3Title) table3Title.textContent = section.tableTitle || '';

    // Populate solidity table
    if (section.table3) {
        populateSolidityTable(section.table3);
    }

    // Notes
    if (notesList && section.notes && section.notes.items) {
        notesList.innerHTML = '';
        section.notes.items.forEach(note => {
            const div = document.createElement('div');
            div.className = 'col-lg-6 mb-2';
            div.innerHTML = `<strong>${note.label}:</strong> ${note.text}`;
            notesList.appendChild(div);
        });
    }
}

function populateSolidityTable(tableData) {
    const thead = document.getElementById('solidityTableHead');
    const tbody = document.getElementById('solidityTableBody');

    if (!thead || !tbody) return;

    // Headers
    if (tableData.headers) {
        const headerRow = document.createElement('tr');
        tableData.headers.forEach(header => {
            const th = document.createElement('th');
            th.textContent = header;
            headerRow.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(headerRow);
    }

    // Body
    tbody.innerHTML = '';
    if (tableData.rows) {
        tableData.rows.forEach(row => {
            const tr = document.createElement('tr');

            const badgeHTML = row.badge ?
                `<span class="badge ${row.badgeClass || ''}">${row.badge}</span>` : '';

            tr.innerHTML = `
                <td>${row.indice || ''}</td>
                <td class="text-end">${row['2022'] || ''}</td>
                <td class="text-end">${row['2023'] || ''}</td>
                <td class="text-end">${row['2024'] || ''}</td>
                <td class="text-center">${badgeHTML}</td>
            `;
            tbody.appendChild(tr);
        });
    }
}

// Section 6: Summary/Conclusions
function populateSummary() {
    if (!pageData || !pageData.summary) return;

    const summaryTitle = document.getElementById('summaryTitle');
    const summaryContent = document.getElementById('summaryContent');

    if (summaryTitle) summaryTitle.textContent = pageData.summary.title || '';

    if (summaryContent && pageData.summary.points) {
        summaryContent.innerHTML = '<ul class="small"></ul>';
        const ul = summaryContent.querySelector('ul');
        pageData.summary.points.forEach(point => {
            const li = document.createElement('li');
            li.className = 'mb-2';
            li.innerHTML = point;
            ul.appendChild(li);
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
    console.log('Initializing Patrimoniale page...');

    const data = await loadPageData();
    if (!data) {
        console.error('Failed to load page data');
        return;
    }

    // Populate all sections
    populateSidebar();
    populateHeader();
    populateFooter();
    populateSection1();
    populateSection2();
    populateSection3();
    populateSection4();
    populateSection5();
    populateSummary();

    // Setup event handlers
    setupEventHandlers();

    console.log('Patrimoniale page initialized successfully');
}

// Run on page load
document.addEventListener('DOMContentLoaded', initPage);
