// circolante-flussi.js - Analisi Circolante e Flussi di Cassa
// Modular approach: loads data from JSON and populates the page dynamically

let pageData = null;

// Load JSON data
async function loadPageData() {
    try {
        const response = await fetch('../data/pages/circolante-flussi.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        pageData = await response.json();
        console.log('Circolante-flussi data loaded successfully');
        return pageData;
    } catch (error) {
        console.error('Error loading circolante-flussi.json:', error);
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
        irpBadge.textContent = `IRP: ${badge.score.toFixed(1)}`;
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

// Populate Section 5.1
function populateSection51() {
    if (!pageData || !pageData.section51) return;

    const section = pageData.section51;

    // Section title
    const section51Title = document.getElementById('section51Title');
    if (section51Title) section51Title.innerHTML = section.title || '';

    // Cycle summary
    if (section.cycleSummary) {
        populateCycleSummary(section.cycleSummary);
    }

    // Cycle trend table
    if (section.cycleTrend) {
        populateCycleTrend(section.cycleTrend);
    }
}

function populateCycleSummary(data) {
    const title = document.getElementById('cycleSummaryTitle');
    const intro = document.getElementById('cycleSummaryIntro');
    const conclusion = document.getElementById('cycleSummaryConclusion');
    const kpisContainer = document.getElementById('cycleKPIsContainer');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (conclusion) conclusion.textContent = data.conclusion || '';

    // KPIs
    if (kpisContainer && data.kpis) {
        kpisContainer.innerHTML = '';
        data.kpis.forEach(kpi => {
            const col = document.createElement('div');
            col.className = 'col-md-3 col-6';

            const kpiClasses = `cycle-kpi ${kpi.borderClass || ''} ${kpi.bgClass || ''}`;
            col.innerHTML = `
                <div class="${kpiClasses}">
                    <span class="kpi-label">${kpi.label}</span>
                    <span class="kpi-value-days-lg ${kpi.valueClass || ''}">${kpi.value}</span>
                </div>
            `;
            kpisContainer.appendChild(col);
        });
    }
}

function populateCycleTrend(data) {
    const tableTitle = document.getElementById('cycleTrendTableTitle');
    if (tableTitle) tableTitle.textContent = data.tableTitle || '';

    if (data.headers && data.rows) {
        populateGenericTable(
            'cycleTrendTableHead',
            'cycleTrendTableBody',
            data.headers,
            data.rows,
            (row) => {
                const rowClass = row.highlight ? row.highlightClass || '' : '';
                return `
                    <tr class="${rowClass}">
                        <td>${row.componente || ''}</td>
                        <td class="text-end">${row['2022'] || ''}</td>
                        <td class="text-end">${row['2023'] || ''}</td>
                        <td class="text-end">${row['2024'] || ''}</td>
                        <td class="${row.trendClass || ''}">${row.trend || ''}</td>
                    </tr>
                `;
            },
            true // useCustomRowRenderer
        );
    }
}

// Populate Detailed Analysis
function populateDetailedAnalysis() {
    if (!pageData || !pageData.detailedAnalysis) return;

    const section = pageData.detailedAnalysis;

    const title = document.getElementById('detailedAnalysisTitle');
    const chart1Title = document.getElementById('chart1Title');

    if (title) title.textContent = section.title || '';
    if (chart1Title) chart1Title.textContent = section.chart1Title || '';

    // Cycle analysis alert
    if (section.cycleAnalysis) {
        const alert = document.getElementById('cycleAnalysisAlert');
        const alertTitle = document.getElementById('cycleAnalysisTitle');
        const alertText = document.getElementById('cycleAnalysisText');

        if (alert) alert.className = `alert-box p-3 mb-3 ${section.cycleAnalysis.alertClass || ''}`;
        if (alertTitle) alertTitle.innerHTML = section.cycleAnalysis.title || '';
        if (alertText) alertText.textContent = section.cycleAnalysis.text || '';
    }

    // Component key
    if (section.componentKey) {
        const componentKeyTitle = document.getElementById('componentKeyTitle');
        const componentKeyList = document.getElementById('componentKeyList');

        if (componentKeyTitle) componentKeyTitle.innerHTML = section.componentKey.title || '';
        if (componentKeyList && section.componentKey.items) {
            componentKeyList.innerHTML = '';
            section.componentKey.items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = `<strong class="${item.labelClass || ''}">${item.label}:</strong> ${item.text}`;
                componentKeyList.appendChild(li);
            });
        }
    }

    // Congruity test title
    const congruityTestTitle = document.getElementById('congruityTestTitle');
    if (congruityTestTitle && section.congruityTest) {
        congruityTestTitle.innerHTML = section.congruityTest.title || '';
    }

    // Test cards
    if (section.congruityTest && section.congruityTest.tests) {
        const container = document.getElementById('testCardsContainer');
        if (container) {
            container.innerHTML = '';
            section.congruityTest.tests.forEach(test => {
                const col = document.createElement('div');
                col.className = test.title === 'Magazzino (DIO)' ? 'col-lg-4 col-md-12' : 'col-lg-4 col-md-6';

                let dataHTML = '';
                if (test.data) {
                    dataHTML = '<ul class="list-unstyled small mb-0">';
                    test.data.forEach(item => {
                        dataHTML += `<li>${item}</li>`;
                    });
                    dataHTML += '</ul>';
                }

                let resultHTML = '';
                if (test.result) {
                    resultHTML = '<ul class="list-unstyled small mb-0">';
                    test.result.forEach(res => {
                        resultHTML += `<li class="mt-2 border-top pt-2">${res.label} <strong class="${res.valueClass || ''}">${res.value}</strong></li>`;
                    });
                    resultHTML += '</ul>';
                }

                col.innerHTML = `
                    <div class="dashboard-card h-100 ${test.borderClass || ''}">
                        <h6 class="card-title-small ${test.iconClass || ''}">
                            <i class="${test.icon || ''}"></i> ${test.title}
                        </h6>
                        ${dataHTML}
                        ${resultHTML}
                    </div>
                `;
                container.appendChild(col);
            });
        }
    }

    // Detailed alert
    if (section.detailedAlert) {
        const alert = document.getElementById('detailedAnalysisAlert');
        if (alert) {
            alert.className = `alert-box small mt-4 p-2 ${section.detailedAlert.alertClass || ''}`;
            alert.innerHTML = section.detailedAlert.text || '';
        }
    }

    // Improvement strategies
    const improvementStrategiesTitle = document.getElementById('improvementStrategiesTitle');
    if (improvementStrategiesTitle && section.improvementStrategies) {
        improvementStrategiesTitle.innerHTML = section.improvementStrategies.title || '';
    }

    if (section.improvementStrategies && section.improvementStrategies.strategies) {
        const container = document.getElementById('strategyCardsContainer');
        if (container) {
            container.innerHTML = '';
            section.improvementStrategies.strategies.forEach(strategy => {
                const col = document.createElement('div');
                col.className = 'col-md-4';

                let actionsHTML = '';
                if (strategy.actions) {
                    actionsHTML = '<ol>';
                    strategy.actions.forEach(action => {
                        actionsHTML += `<li>${action}</li>`;
                    });
                    actionsHTML += '</ol>';
                }

                col.innerHTML = `
                    <div class="strategy-card h-100">
                        <h6><i class="${strategy.icon || ''}"></i> ${strategy.title}</h6>
                        ${actionsHTML}
                        <p class="fw-bold ${strategy.impactClass || ''} mt-2 mb-0">${strategy.impact}</p>
                        <small class="text-muted">${strategy.target}</small>
                    </div>
                `;
                container.appendChild(col);
            });
        }
    }

    // Total impact
    if (section.totalImpact) {
        const alert = document.getElementById('totalImpactAlert');
        if (alert) {
            alert.className = `alert-box text-center mt-4 ${section.totalImpact.alertClass || ''}`;
            alert.innerHTML = section.totalImpact.text || '';
        }
    }

    // Render chart
    if (section.chart1) {
        renderChart('workingCapitalCycleChart', section.chart1);
    }
}

// Populate Section 5.2
function populateSection52() {
    if (!pageData || !pageData.section52) return;

    const section = pageData.section52;

    // Section title
    const section52Title = document.getElementById('section52Title');
    if (section52Title) section52Title.innerHTML = section.title || '';

    // Cash flow analysis
    if (section.cashFlowAnalysis) {
        populateCashFlowAnalysis(section.cashFlowAnalysis);
    }
}

function populateCashFlowAnalysis(data) {
    const title = document.getElementById('cashFlowAnalysisTitle');
    const intro = document.getElementById('cashFlowAnalysisIntro');
    const chart2Title = document.getElementById('chart2Title');
    const tableTitle = document.getElementById('cashFlowTableTitle');
    const tableSource = document.getElementById('cashFlowTableSource');
    const analysisSubtitle = document.getElementById('cashFlowAnalysisSubtitle');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (chart2Title) chart2Title.textContent = data.chart2Title || '';
    if (tableTitle) tableTitle.textContent = data.tableTitle || '';
    if (tableSource) tableSource.textContent = data.table.source || '';
    if (analysisSubtitle) analysisSubtitle.textContent = data.analysisSubtitle || '';

    // Table
    if (data.table) {
        populateGenericTable(
            'cashFlowTableHead',
            'cashFlowTableBody',
            data.table.headers,
            data.table.rows,
            (row) => {
                const rowClass = row.highlight ? row.highlightClass || '' : '';
                const iconHTML = row.icon ? `<i class="${row.icon}"></i> ` : '';
                return `
                    <tr class="${rowClass}">
                        <td>${iconHTML}${row.voce || ''}</td>
                        <td class="text-end ${row.valoreClass || ''}">${formatNumber(row.valore)}</td>
                        <td class="text-end">${row.pctRicavi || ''}</td>
                    </tr>
                `;
            },
            true
        );
    }

    // Analysis alert
    if (data.analysisAlert) {
        const alert = document.getElementById('cashFlowAnalysisAlert');
        const list = document.getElementById('cashFlowAnalysisList');

        if (alert) alert.className = `alert-box small ${data.analysisAlert.alertClass || ''}`;
        if (list && data.analysisAlert.items) {
            list.innerHTML = '';
            data.analysisAlert.items.forEach(item => {
                const li = document.createElement('li');
                li.innerHTML = item;
                list.appendChild(li);
            });
        }
    }

    // Render chart
    if (data.chart2) {
        renderChart('cashFlowWaterfallChart', data.chart2);
    }
}

// Populate Trend & Projections
function populateTrendProjections() {
    if (!pageData || !pageData.trendProjections) return;

    const section = pageData.trendProjections;

    const title = document.getElementById('trendProjectionsTitle');
    const chart3Title = document.getElementById('chart3Title');
    const chart4Title = document.getElementById('chart4Title');
    const trendInterpretationTitle = document.getElementById('trendInterpretationTitle');
    const projectionAnalysisTitle = document.getElementById('projectionAnalysisTitle');
    const projectionWarning = document.getElementById('projectionWarning');
    const operationalSuggestionsTitle = document.getElementById('operationalSuggestionsTitle');

    if (title) title.textContent = section.title || '';
    if (chart3Title) chart3Title.textContent = section.chart3Title || '';
    if (chart4Title) chart4Title.textContent = section.chart4Title || '';
    if (trendInterpretationTitle) trendInterpretationTitle.textContent = section.trendInterpretation.title || '';
    if (projectionAnalysisTitle) projectionAnalysisTitle.textContent = section.projectionAnalysis.title || '';
    if (projectionWarning) projectionWarning.textContent = section.projectionAnalysis.warning || '';
    if (operationalSuggestionsTitle) operationalSuggestionsTitle.textContent = section.operationalSuggestions.title || '';

    // Trend interpretation list
    const trendInterpretationList = document.getElementById('trendInterpretationList');
    if (trendInterpretationList && section.trendInterpretation.items) {
        trendInterpretationList.innerHTML = '';
        section.trendInterpretation.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${item.icon} ${item.iconClass} me-1"></i> ${item.text}`;
            trendInterpretationList.appendChild(li);
        });
    }

    // Projection analysis list
    const projectionAnalysisList = document.getElementById('projectionAnalysisList');
    if (projectionAnalysisList && section.projectionAnalysis.items) {
        projectionAnalysisList.innerHTML = '';
        section.projectionAnalysis.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = `<i class="${item.icon} ${item.iconClass} me-1"></i> ${item.text}`;
            projectionAnalysisList.appendChild(li);
        });
    }

    // Operational suggestions table
    if (section.operationalSuggestions && section.operationalSuggestions.table) {
        populateGenericTable(
            'suggestionsTableHead',
            'suggestionsTableBody',
            section.operationalSuggestions.table.headers,
            section.operationalSuggestions.table.rows,
            (row) => {
                const rowClass = row.highlight ? row.highlightClass || '' : '';
                return `
                    <tr class="${rowClass}">
                        <td>${row.area || ''}</td>
                        <td>${row.azione || ''}</td>
                        <td class="${row.impattClass || ''}">${row.impatto || ''}</td>
                    </tr>
                `;
            },
            true
        );
    }

    // Conclusions
    if (section.conclusions) {
        const alert = document.getElementById('conclusionsAlert');
        if (alert) {
            alert.className = `alert-box small mt-3 ${section.conclusions.alertClass || ''}`;
            alert.innerHTML = section.conclusions.text || '';
        }
    }

    // Render charts
    if (section.chart3) {
        renderChart('cashFlowTrendChart', section.chart3);
    }
    if (section.chart4) {
        renderChart('cashFlowProjectionChart', section.chart4);
    }
}

// Generic table renderer
function populateGenericTable(headerId, bodyId, headers, rows, rowRenderer, useCustomRowRenderer = false) {
    const thead = document.getElementById(headerId);
    const tbody = document.getElementById(bodyId);

    if (!thead || !tbody) return;

    // Headers
    if (headers) {
        const headerRow = document.createElement('tr');
        headers.forEach(header => {
            const th = document.createElement('th');
            if (header === 'Valore' || header === '12/2022' || header === '12/2023' || header === '12/2024' || header === '% Ricavi' || header === 'Impatto Quantitativo Annuo') {
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
            if (useCustomRowRenderer) {
                tbody.innerHTML += rowRenderer(row);
            } else {
                const tr = document.createElement('tr');
                tr.innerHTML = rowRenderer(row);
                tbody.appendChild(tr);
            }
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

    // Handle ticks callback (convert string to function)
    if (chartConfig.options && chartConfig.options.scales) {
        const scales = chartConfig.options.scales;
        Object.keys(scales).forEach(scaleKey => {
            if (scales[scaleKey].ticks && scales[scaleKey].ticks.callback) {
                if (typeof scales[scaleKey].ticks.callback === 'string') {
                    scales[scaleKey].ticks.callback = eval('(' + scales[scaleKey].ticks.callback + ')');
                }
            }
        });
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
    console.log('Initializing Circolante-Flussi page...');

    const data = await loadPageData();
    if (!data) {
        console.error('Failed to load page data');
        return;
    }

    // Populate all sections
    populateSidebar();
    populateHeader();
    populateFooter();
    populateSection51();
    populateDetailedAnalysis();
    populateSection52();
    populateTrendProjections();

    // Setup event handlers
    setupEventHandlers();

    console.log('Circolante-Flussi page initialized successfully');
}

// Run on page load
document.addEventListener('DOMContentLoaded', initPage);
