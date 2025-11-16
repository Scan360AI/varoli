// rischi-raccomandazioni.js - Analisi Rischi e Raccomandazioni
let pageData = null;

async function loadPageData() {
    try {
        const response = await fetch('../data/pages/rischi-raccomandazioni.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        pageData = await response.json();
        console.log('Rischi-raccomandazioni data loaded successfully');
        return pageData;
    } catch (error) {
        console.error('Error loading rischi-raccomandazioni.json:', error);
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
        irpBadge.textContent = `IRP: ${badge.score} (${badge.category})`;
    }
}

function populateFooter() {
    const currentYear = new Date().getFullYear();
    ['currentYearSidebar', 'currentYearFooterReport'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.textContent = currentYear;
    });
}

function populateSection6() {
    if (!pageData?.section6) return;
    const section6Title = document.getElementById('section6Title');
    if (section6Title) section6Title.innerHTML = pageData.section6.title || '';

    // 6.1
    if (pageData.section6.section61) {
        const s = pageData.section6.section61;
        const el1 = document.getElementById('section61Title');
        const el2 = document.getElementById('section61Intro');
        const el3 = document.getElementById('section61Conclusion');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.intro || '';
        if (el3) el3.textContent = s.conclusion || '';
        if (s.table) {
            populateTable('table61Head', 'table61Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.indicatore}</td>
                <td class="text-end">${row['2022']}</td>
                <td class="text-end">${row['2023']}</td>
                <td class="text-end">${row['2024']}</td>
                <td>${row.trend}</td>
                <td class="${row.valutazioneClass || ''}">${row.valutazione}</td>
            `);
        }
    }

    // 6.2
    if (pageData.section6.section62) {
        const s = pageData.section6.section62;
        const el1 = document.getElementById('section62Title');
        const el2 = document.getElementById('table62Title');
        const el3 = document.getElementById('section62InterpretationTitle');
        const interpDiv = document.getElementById('section62Interpretation');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.tableTitle || '';
        if (el3) el3.textContent = s.interpretationTitle || '';
        if (interpDiv && s.interpretation) interpDiv.innerHTML = s.interpretation.join('');
        if (s.table) {
            populateTable('table62Head', 'table62Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.indicatore}</td>
                <td class="text-end value-highlight">${row.valore}</td>
                <td><span class="badge ${row.badgeClass || ''}">${row.badge}</span></td>
            `);
        }
    }

    // 6.3
    if (pageData.section6.section63) {
        const s = pageData.section6.section63;
        const el1 = document.getElementById('section63Title');
        const el2 = document.getElementById('table63Title');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.tableTitle || '';
        if (s.table) {
            populateTable('table63Head', 'table63Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.area}</td>
                <td>${row.segnale}</td>
                <td>${row.valore}</td>
                <td>${row.rischio}</td>
            `);
        }
    }

    // 6.4
    if (pageData.section6.section64) {
        const s = pageData.section6.section64;
        const el1 = document.getElementById('section64Title');
        const el2 = document.getElementById('section64Intro');
        const el3 = document.getElementById('table64Title');
        const el4 = document.getElementById('section64Conclusion');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.intro || '';
        if (el3) el3.textContent = s.tableTitle || '';
        if (el4) el4.innerHTML = s.conclusion || '';
        if (s.table) {
            populateTable('table64Head', 'table64Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.test}</td>
                <td>${row.indicatori}</td>
                <td class="text-left">${row.valutazione}</td>
                <td>${row.note}</td>
            `);
        }
    }

    // 6.5
    if (pageData.section6.section65) {
        const s = pageData.section6.section65;
        const el1 = document.getElementById('section65Title');
        const el2 = document.getElementById('table65Title');
        const el3 = document.getElementById('section65Alert');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.tableTitle || '';
        if (el3) el3.innerHTML = s.alert || '';
        if (s.table) {
            populateTable('table65Head', 'table65Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.parametro}</td>
                <td class="">${row.valore}</td>
                <td class="${row.interpretazioneClass || ''}">${row.interpretazione}</td>
            `);
        }
    }

    // 6.6
    if (pageData.section6.section66) {
        const s = pageData.section6.section66;
        const el1 = document.getElementById('section66Title');
        const el2 = document.getElementById('table66Title');
        const el3 = document.getElementById('section66Conclusion');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.tableTitle || '';
        if (el3) el3.textContent = s.conclusion || '';
        if (s.table) {
            populateTable('table66Head', 'table66Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.test}</td>
                <td class="${row.superatoClass || ''}">${row.superato}</td>
                <td>${row.valoreCritico}</td>
                <td>${row.valoreAttuale}</td>
                <td>${row.margine}</td>
            `);
        }
    }
}

function populateSection7() {
    if (!pageData?.section7) return;
    const section7Title = document.getElementById('section7Title');
    if (section7Title) section7Title.innerHTML = pageData.section7.title || '';

    // 7.1
    if (pageData.section7.section71) {
        const s = pageData.section7.section71;
        const el1 = document.getElementById('section71Title');
        const el2 = document.getElementById('section71Intro');
        const el3 = document.getElementById('table71Title');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.intro || '';
        if (el3) el3.textContent = s.tableTitle || '';
        if (s.table) {
            populateTable('table71Head', 'table71Body', s.table.headers, s.table.rows, (row) => `
                <td><i class="${row.icon}"></i> ${row.area}</td>
                <td>${row.situazione}</td>
                <td>${row.azione}</td>
                <td>${row.effetti}</td>
                <td><span class="status-badge ${row.prioritaClass}">${row.priorita}</span></td>
            `);
        }
    }

    // 7.3 Timeline
    if (pageData.section7.section73) {
        const s = pageData.section7.section73;
        const el1 = document.getElementById('section73Title');
        const el2 = document.getElementById('table73Title');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.tableTitle || '';
        const container = document.getElementById('timelineContainer');
        if (container && s.timeline) {
            container.innerHTML = '';
            s.timeline.forEach(item => {
                const li = document.createElement('li');
                li.className = 'timeline-irp-item';
                const actionsHTML = item.actions.map(a => `<li>${a}</li>`).join('');
                li.innerHTML = `
                    <div class="timeline-irp-badge ${item.badge}">${item.timeframe}</div>
                    <div class="timeline-irp-content">
                        <h6>${item.title} <span class="badge ${item.labelClass} float-end">${item.label}</span></h6>
                        <ul class="small">${actionsHTML}</ul>
                    </div>
                `;
                container.appendChild(li);
            });
        }
    }

    // 7.4 Dashboard KPI with rowspan
    if (pageData.section7.section74) {
        const s = pageData.section7.section74;
        const el1 = document.getElementById('section74Title');
        const el2 = document.getElementById('section74Intro');
        const el3 = document.getElementById('table74Title');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.intro || '';
        if (el3) el3.textContent = s.tableTitle || '';
        if (s.table) {
            const thead = document.getElementById('table74Head');
            const tbody = document.getElementById('table74Body');
            if (thead) {
                const tr = document.createElement('tr');
                s.table.headers.forEach(h => {
                    const th = document.createElement('th');
                    if (h === 'Target' || h === 'Ultimo valore') th.className = 'text-end';
                    th.textContent = h;
                    tr.appendChild(th);
                });
                thead.innerHTML = '';
                thead.appendChild(tr);
            }
            if (tbody) {
                tbody.innerHTML = '';
                s.table.rows.forEach(row => {
                    const tr = document.createElement('tr');
                    if (row.categoria) {
                        const td = document.createElement('td');
                        td.rowSpan = row.rowspan || 1;
                        td.textContent = row.categoria;
                        tr.appendChild(td);
                    }
                    tr.innerHTML += `
                        <td>${row.kpi}</td>
                        <td>${row.frequenza}</td>
                        <td class="target-value">${row.target}</td>
                        <td class="${row.valoreClass || ''}">${row.ultimoValore}</td>
                        <td>${row.alert}</td>
                    `;
                    tbody.appendChild(tr);
                });
            }
        }
    }

    // 7.5
    if (pageData.section7.section75) {
        const s = pageData.section7.section75;
        const el1 = document.getElementById('section75Title');
        const el2 = document.getElementById('table75Title');
        const el3 = document.getElementById('section75ReportingIntro');
        const el4 = document.getElementById('section75Conclusion');
        if (el1) el1.textContent = s.title || '';
        if (el2) el2.textContent = s.tableTitle || '';
        if (el3) el3.textContent = s.reportingIntro || '';
        if (el4) el4.textContent = s.conclusion || '';
        if (s.table) {
            populateTable('table75Head', 'table75Body', s.table.headers, s.table.rows, (row) => `
                <td>${row.area}</td>
                <td>${row.frequenza}</td>
                <td>${row.soglie}</td>
                <td>${row.procedura}</td>
            `);
        }
        const reportingList = document.getElementById('section75ReportingList');
        if (reportingList && s.reportingList) {
            reportingList.innerHTML = '';
            s.reportingList.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                reportingList.appendChild(li);
            });
        }
    }
}

function populateSummary() {
    if (!pageData?.summary) return;
    const el1 = document.getElementById('summaryTitle');
    const el2 = document.getElementById('summaryConclusion');
    if (el1) el1.innerHTML = pageData.summary.title || '';
    if (el2) el2.textContent = pageData.summary.conclusion || '';
    if (pageData.summary.table) {
        populateTable('summaryTableHead', 'summaryTableBody', pageData.summary.table.headers, pageData.summary.table.rows, (row) => `
            <td><span class="icon-circle icon-circle-sm ${row.iconClass}"><i class="${row.icon}"></i></span> ${row.area}</td>
            <td>${row.situazione}</td>
            <td>${row.azione}</td>
            <td class="${row.effettiClass || ''}">${row.effetti}</td>
            <td><span class="status-badge ${row.prioritaClass}">${row.priorita}</span></td>
        `);
    }
}

function populateTable(headerId, bodyId, headers, rows, rowRenderer) {
    const thead = document.getElementById(headerId);
    const tbody = document.getElementById(bodyId);
    if (!thead || !tbody) return;
    if (headers) {
        const tr = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            if (['12/2022', '12/2023', '12/2024', 'Valore'].includes(h)) th.className = 'text-end';
            th.textContent = h;
            tr.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(tr);
    }
    if (rows && rowRenderer) {
        tbody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            tr.innerHTML = rowRenderer(row);
            tbody.appendChild(tr);
        });
    }
}

function setupEventHandlers() {
    const printBtn = document.getElementById('printBtn');
    if (printBtn) printBtn.addEventListener('click', () => window.print());
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
    console.log('Initializing Rischi-Raccomandazioni page...');
    const data = await loadPageData();
    if (!data) {
        console.error('Failed to load page data');
        return;
    }
    populateSidebar();
    populateHeader();
    populateFooter();
    populateSection6();
    populateSection7();
    populateSummary();
    setupEventHandlers();
    console.log('Rischi-Raccomandazioni page initialized successfully');
}

document.addEventListener('DOMContentLoaded', initPage);
