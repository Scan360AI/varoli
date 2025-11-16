// irp-dettaglio.js - Approfondimento IRP
let pageData = null;

async function loadPageData() {
    try {
        const response = await fetch('../data/pages/irp-dettaglio.json');
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);
        pageData = await response.json();
        console.log('IRP-dettaglio data loaded successfully');
        return pageData;
    } catch (error) {
        console.error('Error loading irp-dettaglio.json:', error);
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

function populateIRPVisual() {
    if (!pageData?.irpVisual) return;

    const data = pageData.irpVisual;

    // Section class
    const section = document.getElementById('irpVisualSection');
    if (section && data.sectionClass) {
        section.classList.add(data.sectionClass);
    }

    // Title
    const title = document.getElementById('irpVisualTitle');
    if (title) title.textContent = data.title || '';

    // Marker positioning
    const marker = document.getElementById('irpMarker');
    const markerLabel = document.getElementById('irpMarkerLabel');
    if (marker && data.markerPosition !== undefined) {
        marker.style.left = `${data.markerPosition}%`;
    }
    if (markerLabel) markerLabel.textContent = data.markerLabel || '';

    // Score circle
    const scoreCircle = document.getElementById('irpScoreCircle');
    const scoreValue = document.getElementById('irpScoreValue');
    if (scoreCircle && data.scoreCircleClass) {
        scoreCircle.classList.add(data.scoreCircleClass);
    }
    if (scoreValue) scoreValue.textContent = data.score || '';

    // Category
    const categoryText = document.getElementById('irpCategoryText');
    if (categoryText) categoryText.textContent = data.category || '';

    const categoryBadge = document.getElementById('irpCategoryBadge');
    if (categoryBadge) {
        categoryBadge.textContent = data.categoryBadge || '';
        categoryBadge.className = `badge ${data.categoryBadgeClass || ''}`;
    }
}

function populateSintesiCalcolo() {
    if (!pageData?.sintesiCalcolo) return;

    const data = pageData.sintesiCalcolo;

    const title = document.getElementById('sintesiCalcoloTitle');
    const intro = document.getElementById('sintesiCalcoloIntro');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';

    if (data.table) {
        populateTable(
            'sintesiCalcoloTableHead',
            'sintesiCalcoloTableBody',
            data.table.headers,
            data.table.rows,
            (row) => {
                const trClass = row.highlight && row.highlightClass ? ` class="${row.highlightClass}"` : '';
                return `
                    <td${trClass}>${row.componente}</td>
                    <td${trClass} class="text-end">${row.valore}</td>
                    <td${trClass} class="text-end">${row.peso}</td>
                    <td${trClass} class="text-end">${row.ponderato}</td>
                `;
            },
            (row) => row.highlight && row.highlightClass ? row.highlightClass : ''
        );
    }
}

function populateCPComponent() {
    if (!pageData?.cpComponent) return;

    const data = pageData.cpComponent;

    const title = document.getElementById('cpCardTitle');
    const intro = document.getElementById('cpCardIntro');
    const conclusion = document.getElementById('cpCardConclusion');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (conclusion) conclusion.textContent = data.conclusion || '';

    if (data.table) {
        populateTable(
            'cpTableHead',
            'cpTableBody',
            data.table.headers,
            data.table.rows,
            (row) => {
                const scoreClass = row.scoreClass || '';
                const trClass = row.highlight && row.highlightClass ? ` class="${row.highlightClass}"` : '';
                return `
                    <td${trClass}>${row.indicatore}</td>
                    <td${trClass} class="text-end">${row.valore}</td>
                    <td${trClass} class="text-end ${scoreClass}">${row.score}</td>
                    <td${trClass} class="text-end">${row.peso}</td>
                    <td${trClass} class="text-end">${row.contributo}</td>
                `;
            },
            (row) => row.highlight && row.highlightClass ? row.highlightClass : ''
        );
    }
}

function populateLeanusComponent() {
    if (!pageData?.leanusComponent) return;

    const data = pageData.leanusComponent;

    const title = document.getElementById('leanusCardTitle');
    const intro = document.getElementById('leanusCardIntro');
    const conclusion = document.getElementById('leanusCardConclusion');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (conclusion) conclusion.textContent = data.conclusion || '';

    // Marker positioning
    const marker = document.getElementById('leanusMarker');
    const markerLabel = document.getElementById('leanusMarkerLabel');
    if (marker && data.markerPosition) {
        marker.style.left = data.markerPosition;
    }
    if (markerLabel) markerLabel.textContent = data.scoreRaw || '';

    // Scale labels
    const labelMin = document.getElementById('leanusLabelMin');
    const labelMid = document.getElementById('leanusLabelMid');
    const labelMax = document.getElementById('leanusLabelMax');
    if (labelMin) labelMin.textContent = data.scaleMin || '';
    if (labelMid) labelMid.textContent = data.scaleMid || '';
    if (labelMax) labelMax.textContent = data.scaleMax || '';

    // Alert
    const alert = document.getElementById('leanusAlert');
    if (alert && data.alert) {
        alert.innerHTML = data.alert.text || '';
        alert.className = `alert ${data.alert.class || ''} small mt-3`;
    }
}

function populateMCCComponent() {
    if (!pageData?.mccComponent) return;

    const data = pageData.mccComponent;

    const title = document.getElementById('mccCardTitle');
    const intro = document.getElementById('mccCardIntro');
    const conclusion = document.getElementById('mccCardConclusion');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (conclusion) conclusion.textContent = data.conclusion || '';

    // Value
    const value = document.getElementById('mccValue');
    const valueLabel = document.getElementById('mccValueLabel');
    if (value) value.textContent = data.value || '';
    if (valueLabel) valueLabel.textContent = data.valueLabel || '';

    // Alert
    const alert = document.getElementById('mccAlert');
    if (alert && data.alert) {
        alert.innerHTML = data.alert.text || '';
        alert.className = `alert ${data.alert.class || ''} small mt-3`;
    }
}

function populateZScoreComponent() {
    if (!pageData?.zscoreComponent) return;

    const data = pageData.zscoreComponent;

    const title = document.getElementById('zscoreCardTitle');
    const intro = document.getElementById('zscoreCardIntro');
    const conclusion = document.getElementById('zscoreCardConclusion');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (conclusion) conclusion.textContent = data.conclusion || '';

    // Indicator dot positioning
    const dot = document.getElementById('zscoreIndicatorDot');
    const dotLabel = document.getElementById('zscoreValueLabel');
    if (dot && data.dotPosition) {
        dot.style.left = data.dotPosition;
        if (data.zoneClass) {
            dot.classList.add(data.zoneClass);
        }
    }
    if (dotLabel) dotLabel.textContent = data.dotLabel || '';

    // Scale labels
    const labelMin = document.getElementById('zscoreLabelMin');
    const labelMid = document.getElementById('zscoreLabelMid');
    const labelMax = document.getElementById('zscoreLabelMax');
    if (labelMin) labelMin.textContent = data.scaleMin || '';
    if (labelMid) labelMid.textContent = data.scaleMid || '';
    if (labelMax) labelMax.textContent = data.scaleMax || '';
}

function populateValutazioneFinale() {
    if (!pageData?.valutazioneFinale) return;

    const data = pageData.valutazioneFinale;

    const title = document.getElementById('valutazioneFinaleTitle');
    if (title) title.textContent = data.title || '';

    // Punti di Forza
    if (data.puntiForte) {
        const titleEl = document.getElementById('puntiForteTitle');
        const listEl = document.getElementById('puntiForteLista');

        if (titleEl) titleEl.textContent = data.puntiForte.title || '';

        if (listEl && data.puntiForte.items) {
            listEl.innerHTML = '';
            data.puntiForte.items.forEach(item => {
                const li = document.createElement('li');
                const iconClass = item.iconClass || '';
                li.innerHTML = `<span class="fa-li"><i class="${item.icon} ${iconClass}"></i></span>${item.text}`;
                listEl.appendChild(li);
            });
        }
    }

    // Punti di Debolezza
    if (data.puntiDebolezza) {
        const titleEl = document.getElementById('puntiDebolezzaTitle');
        const listEl = document.getElementById('puntiDebolezzaLista');

        if (titleEl) titleEl.textContent = data.puntiDebolezza.title || '';

        if (listEl && data.puntiDebolezza.items) {
            listEl.innerHTML = '';
            data.puntiDebolezza.items.forEach(item => {
                const li = document.createElement('li');
                const iconClass = item.iconClass || '';
                li.innerHTML = `<span class="fa-li"><i class="${item.icon} ${iconClass}"></i></span>${item.text}`;
                listEl.appendChild(li);
            });
        }
    }
}

function populateRaccomandazioni() {
    if (!pageData?.raccomandazioni) return;

    const data = pageData.raccomandazioni;

    const title = document.getElementById('raccomandazioniTitle');
    const intro = document.getElementById('raccomandazioniIntro');
    const lista = document.getElementById('raccomandazioniLista');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';

    if (lista && data.items) {
        lista.innerHTML = '';
        data.items.forEach(item => {
            const li = document.createElement('li');
            li.innerHTML = item;
            li.className = 'mb-2';
            lista.appendChild(li);
        });
    }
}

function populateTargetMiglioramento() {
    if (!pageData?.targetMiglioramento) return;

    const data = pageData.targetMiglioramento;

    const title = document.getElementById('targetMiglioramentoTitle');
    const intro = document.getElementById('targetMiglioramentoIntro');
    const conclusion = document.getElementById('targetMiglioramentoConclusion');

    if (title) title.textContent = data.title || '';
    if (intro) intro.textContent = data.intro || '';
    if (conclusion) conclusion.textContent = data.conclusion || '';

    if (data.table) {
        populateTable(
            'targetMiglioramentoTableHead',
            'targetMiglioramentoTableBody',
            data.table.headers,
            data.table.rows,
            (row) => {
                const target6Class = row.target6Class || '';
                const target12Class = row.target12Class || '';
                const target24Class = row.target24Class || '';
                const trClass = row.highlight && row.highlightClass ? ` class="${row.highlightClass}"` : '';
                return `
                    <td${trClass}>${row.componente}</td>
                    <td${trClass} class="text-end">${row.attuale}</td>
                    <td${trClass} class="text-end ${target6Class}">${row.target6}</td>
                    <td${trClass} class="text-end ${target12Class}">${row.target12}</td>
                    <td${trClass} class="text-end ${target24Class}">${row.target24}</td>
                `;
            },
            (row) => row.highlight && row.highlightClass ? row.highlightClass : ''
        );
    }
}

function populateTable(headerId, bodyId, headers, rows, rowRenderer, rowClassGetter = null) {
    const thead = document.getElementById(headerId);
    const tbody = document.getElementById(bodyId);

    if (!thead || !tbody) return;

    // Headers
    if (headers) {
        const tr = document.createElement('tr');
        headers.forEach(h => {
            const th = document.createElement('th');
            if (['Valore', 'Peso', 'Punteggio Ponderato', 'Score (0-100)', 'Contributo', 'Valore 2024', 'Attuale', 'Target 6 mesi', 'Target 12 mesi', 'Target 24 mesi'].includes(h)) {
                th.className = 'text-end';
            }
            th.textContent = h;
            tr.appendChild(th);
        });
        thead.innerHTML = '';
        thead.appendChild(tr);
    }

    // Rows
    if (rows && rowRenderer) {
        tbody.innerHTML = '';
        rows.forEach(row => {
            const tr = document.createElement('tr');
            if (rowClassGetter) {
                const rowClass = rowClassGetter(row);
                if (rowClass) tr.className = rowClass;
            }
            tr.innerHTML = rowRenderer(row);
            tbody.appendChild(tr);
        });
    }
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
    console.log('Initializing IRP-Dettaglio page...');
    const data = await loadPageData();
    if (!data) {
        console.error('Failed to load page data');
        return;
    }

    populateSidebar();
    populateHeader();
    populateFooter();
    populateIRPVisual();
    populateSintesiCalcolo();
    populateCPComponent();
    populateLeanusComponent();
    populateMCCComponent();
    populateZScoreComponent();
    populateValutazioneFinale();
    populateRaccomandazioni();
    populateTargetMiglioramento();
    setupEventHandlers();

    console.log('IRP-Dettaglio page initialized successfully');
}

document.addEventListener('DOMContentLoaded', initPage);
