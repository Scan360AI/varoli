const Parte1Sintesi = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderPageIntro();
            this.renderKPICards();
            this.renderKPICommentary();
            this.renderAdditionalKPIs();
            this.renderTrendChart();
            this.renderPFNChart();
            this.renderIRPSection();
            this.renderBusinessModel();
            this.renderCCIIAlert();
            this.renderNormativeContext();
            this.renderProfileCards();
            this.renderKPIOverviewTable();
            this.renderSupportIndicatorsTable();
            this.renderSWOTCards();
            this.renderPriorityActionsTable();
        } catch (error) {
            console.error('Error initializing Parte 1:', error);
        }
    },
    renderPageIntro() {
        const container = document.getElementById('pageIntro');
        if (!container) return;
        const intro = this.data.content?.parte1_sintesi?.pageIntro || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${intro}</div>`;
    },
    renderKPICards() {
        const container = document.getElementById('kpiMainGrid');
        if (!container) return;
        const kpis = this.data.kpis || {};

        // Primi 4 KPI principali
        const kpiConfigs = [
            { key: 'irp', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'revenue', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'ebitda', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'netIncome', colClass: 'col-xl-3 col-md-6 mb-4' }
        ];

        const cardsHTML = kpiConfigs.map(config => {
            const kpi = kpis[config.key] || {};
            return `<div class="${config.colClass}">${this.buildKPICard(kpi, config.key)}</div>`;
        }).join('');

        container.innerHTML = cardsHTML;
    },

    renderAdditionalKPIs() {
        const container = document.getElementById('kpiAdditionalGrid');
        if (!container) return;
        const kpis = this.data.kpis || {};

        // KPI aggiuntivi
        const kpiConfigs = [
            { key: 'ebitdaMargin', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'pfnEbitda', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'dso', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'cashFlowOperativo', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'leanusScore', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'azionePrioritaria', colClass: 'col-xl-3 col-md-6 mb-4' }
        ];

        const cardsHTML = kpiConfigs.map(config => {
            const kpi = kpis[config.key] || {};
            return `<div class="${config.colClass}">${this.buildKPICard(kpi, config.key)}</div>`;
        }).join('');

        container.innerHTML = cardsHTML;
    },

    buildKPICard(kpi, key) {
        const title = kpi.title || '';
        const value = kpi.displayValue || 'N/A';
        const description = kpi.description || '';
        const icon = kpi.icon || 'fa-chart-bar';
        const borderClass = kpi.borderClass || 'border-left-success';

        // Badge personalizzati per alcuni KPI
        let badgesHTML = '';
        if (key === 'irp') {
            const category = kpi.category || 'D+';
            const categoryLabel = kpi.categoryLabel || 'Rischio elevato';
            badgesHTML = `<div class="kpi-trend-modern">
                <span class="status-badge bg-danger">${category}</span>
                <span class="text-muted ms-2">(${categoryLabel})</span>
            </div>`;
        } else if (key === 'leanusScore' && kpi.trend?.badges) {
            badgesHTML = `<div class="kpi-trend-modern">
                ${kpi.trend.badges.map(badge =>
                    `<span class="status-badge ${badge.class} me-2">${badge.text}</span>`
                ).join('')}
            </div>`;
        } else if (key === 'azionePrioritaria' && kpi.trend?.badges) {
            badgesHTML = `<div class="kpi-trend-modern">
                ${kpi.trend.badges.map(badge =>
                    `<span class="status-badge ${badge.class}">${badge.text}</span>`
                ).join('')}
            </div>`;
        } else if (kpi.trend && kpi.trend.direction !== 'none') {
            const trendIcon = kpi.trend.iconClass || 'fa-minus';
            const trendValue = kpi.trend.displayValue || '';
            const trendLabel = kpi.trend.label || '';
            const trendClass = kpi.trend.direction === 'down' ? 'trend-down' : 'trend-up';
            badgesHTML = `<div class="kpi-trend-modern ${trendClass}">
                <i class="fas ${trendIcon} trend-icon"></i>
                <span class="trend-value">${trendValue}</span> <span class="text-muted small">${trendLabel}</span>
            </div>`;
        }

        // Action button per azione prioritaria
        let actionButton = '';
        if (key === 'azionePrioritaria' && kpi.action?.enabled) {
            const btnText = kpi.action.buttonText || 'Vedi Piano';
            const btnClass = kpi.action.buttonClass || 'btn btn-outline-primary btn-sm btn-pill mt-2';
            const link = kpi.action.link || 'parte6_rischi-raccomandazioni.html';
            actionButton = `<a class="${btnClass}" href="${link}">${btnText}</a>`;
        }

        // Valore speciale per azione prioritaria
        const valueClass = key === 'azionePrioritaria' ? 'style="font-size: 1.5rem;"' : '';

        return `<div class="kpi-card-v2 ${borderClass}">
            <i class="fas ${icon} kpi-icon-modern-bg"></i>
            <h4 class="card-title-modern">${title}</h4>
            <div class="kpi-value-modern" ${valueClass}>${value}</div>
            ${badgesHTML}
            <p class="kpi-description-modern">${description}</p>
            ${actionButton}
        </div>`;
    },
    renderKPICommentary() {
        const container = document.getElementById('kpiCommentary');
        if (!container) return;
        const commentary = this.data.content?.parte1_sintesi?.kpiCommentary || '';
        if (commentary) {
            container.innerHTML = `<div class="alert alert-warning mt-3"><i class="fas fa-exclamation-triangle me-2"></i>${commentary}</div>`;
        }
    },

    renderTrendChart() {
        const canvas = document.getElementById('trendChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const years = ['2022', '2023', '2024'];
        const revenueData = [3.722, 3.324, 2.850]; // Milioni di €
        const ebitdaMarginData = [5.3, 6.4, -1.53]; // Percentuali

        this.charts.trendChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Ricavi (M€)',
                    data: revenueData,
                    backgroundColor: 'rgba(40, 167, 69, 0.8)',
                    borderColor: 'rgba(40, 167, 69, 1)',
                    borderWidth: 1,
                    yAxisID: 'y'
                }, {
                    label: 'EBITDA Margin (%)',
                    data: ebitdaMarginData,
                    type: 'line',
                    borderColor: 'rgba(255, 193, 7, 1)',
                    backgroundColor: 'rgba(255, 193, 7, 0.2)',
                    borderWidth: 3,
                    borderDash: [5, 5],
                    pointBackgroundColor: 'rgba(255, 193, 7, 1)',
                    pointBorderColor: 'rgba(255, 193, 7, 1)',
                    pointRadius: 6,
                    fill: false,
                    yAxisID: 'y1'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.datasetIndex === 0) {
                                    return context.dataset.label + ': €' + context.raw + 'M';
                                } else {
                                    return context.dataset.label + ': ' + context.raw + '%';
                                }
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Anno'
                        }
                    },
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Ricavi (M€)'
                        },
                        min: 0,
                        max: 4.0
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'EBITDA Margin (%)'
                        },
                        min: -5,
                        max: 10,
                        grid: {
                            drawOnChartArea: false,
                        },
                    }
                }
            }
        });
    },

    renderPFNChart() {
        const canvas = document.getElementById('pfnChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        const years = ['2022', '2023', '2024'];
        const pfnEbitdaData = [2.10, 1.58, null]; // null per 2024 (EBITDA negativo)

        this.charts.pfnChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'PFN/EBITDA',
                    data: pfnEbitdaData,
                    backgroundColor: pfnEbitdaData.map(val =>
                        val === null ? 'rgba(108, 117, 125, 0.8)' :
                        val > 3 ? 'rgba(220, 53, 69, 0.8)' :
                        'rgba(255, 193, 7, 0.8)'
                    ),
                    borderColor: pfnEbitdaData.map(val =>
                        val === null ? 'rgba(108, 117, 125, 1)' :
                        val > 3 ? 'rgba(220, 53, 69, 1)' :
                        'rgba(255, 193, 7, 1)'
                    ),
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        position: 'bottom',
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                if (context.raw === null) {
                                    return context.dataset.label + ': N/A (EBITDA negativo)';
                                }
                                return context.dataset.label + ': ' + context.raw.toFixed(2) + 'x';
                            }
                        }
                    }
                },
                scales: {
                    x: {
                        display: true,
                        title: {
                            display: true,
                            text: 'Anno'
                        }
                    },
                    y: {
                        display: true,
                        title: {
                            display: true,
                            text: 'PFN/EBITDA (x)'
                        },
                        min: 0,
                        max: 3.5,
                        ticks: {
                            callback: function(value) {
                                return value.toFixed(1) + 'x';
                            }
                        }
                    }
                }
            }
        });
    },

    renderIRPSection() {
        const irpData = this.data.kpis?.irp || {};
        const score = irpData.value || 0;
        const category = irpData.category || 'N/A';
        const riskLevel = irpData.categoryLabel || 'Non disponibile';
        const riskClass = Utils.getRiskLevel(score);
        const scoreCircle = document.getElementById('irpScoreCircle');
        if (scoreCircle) scoreCircle.className = 'irp-score-circle risk-' + riskClass;
        const scoreValue = document.getElementById('irpScoreValue');
        if (scoreValue) scoreValue.textContent = score.toFixed(1);
        const categoryBadge = document.getElementById('irpCategoryBadge');
        if (categoryBadge) {
            categoryBadge.className = 'badge ' + (irpData.status || 'danger');
            categoryBadge.textContent = 'Categoria ' + category;
        }
        const riskLevelEl = document.getElementById('irpRiskLevel');
        if (riskLevelEl) riskLevelEl.textContent = riskLevel;
        const visualSection = document.getElementById('irpVisualSection');
        if (visualSection) visualSection.className = 'irp-visual-section risk-' + riskClass;
        const marker = document.getElementById('irpMarker');
        if (marker) marker.style.left = score + '%';
        this.renderIRPIndicators();
        const narrative = document.getElementById('irpNarrative');
        if (narrative) narrative.innerHTML = this.data.content?.parte1_sintesi?.irpDescription || 'L\'azienda presenta un IRP di ' + score.toFixed(1) + '/100.';
    },
    renderIRPIndicators() {
        const container = document.getElementById('irpIndicators');
        if (!container) return;
        const supportData = this.data.tables?.parte1_sintesi?.supportIndicators?.rows || [];
        const indicators = [
            { label: this.data.kpis?.leanusScore?.title || 'Leanus Score', value: this.data.kpis?.leanusScore?.displayValue || 'N/A', max: this.data.kpis?.leanusScore?.metadata?.max },
            { label: 'Business Category', value: this.data.kpis?.leanusScore?.metadata?.category || 'N/A' },
            { label: 'Rating MCC', value: supportData.find(r => r.indicator === 'Rating MCC')?.value || 'n.d.' }
        ];
        container.innerHTML = indicators.map(ind => `<div class="col-md-4"><div class="kpi-card-v4"><div class="kpi-content" style="text-align: center; width: 100%;"><div class="kpi-label">${ind.label}</div><div class="kpi-value" style="font-size: 24px;">${ind.value}${ind.max ? '<span style="font-size: 16px; color: var(--text-secondary);"> / ' + ind.max + '</span>' : ''}</div></div></div></div>`).join('');
    },
    renderBusinessModel() {
        const container = document.getElementById('businessModelSection');
        if (!container) return;
        const title = this.data.content?.parte1_sintesi?.businessModelTitle || 'Modello di Business';
        const text = this.data.content?.parte1_sintesi?.businessModel || '';
        container.innerHTML = `
            <div class="content-section">
                <div class="section-header">
                    <h2 class="section-title"><i class="fas fa-industry"></i> ${title}</h2>
                </div>
                <div class="alert alert-light">
                    <p style="margin: 0; line-height: 1.8;">${text}</p>
                </div>
            </div>`;
    },
    renderCCIIAlert() {
        const container = document.getElementById('cciiAlertSection');
        if (!container) return;
        const ccii = this.data.content?.parte1_sintesi?.cciiAlert || {};
        if (ccii.title) {
            container.innerHTML = `
                <div class="alert alert-warning">
                    <h5 class="alert-heading"><i class="fas fa-gavel me-2"></i>${ccii.title}</h5>
                    <p style="margin: 0;">${ccii.description || ''}</p>
                </div>`;
        }
    },
    renderNormativeContext() {
        const container = document.getElementById('normativeSection');
        if (!container) return;
        const title = this.data.content?.parte1_sintesi?.normativeTitle || 'Quadro Normativo';
        const items = this.data.content?.parte1_sintesi?.normativeContext || [];
        if (items.length > 0) {
            container.innerHTML = `
                <div class="content-section">
                    <div class="section-header">
                        <h2 class="section-title"><i class="fas fa-balance-scale"></i> ${title}</h2>
                    </div>
                    <div class="alert alert-light">
                        <ul style="margin: 0; padding-left: 20px; line-height: 2;">
                            ${items.map(item => '<li>' + item + '</li>').join('')}
                        </ul>
                    </div>
                </div>`;
        }
    },
    renderProfileCards() {
        const container = document.getElementById('profileGrid');
        if (!container) return;
        const company = this.data.company || {};
        const profiles = [
            {
                title: 'Dati Identificativi',
                icon: 'fa-id-card',
                items: [
                    { label: 'Ragione Sociale', value: company.profile?.legalName || company.name || '-' },
                    { label: 'Settore', value: company.profile?.sector || '-' },
                    { label: 'ATECO', value: company.profile?.ateco || '-' },
                    { label: 'Sede', value: company.profile?.headquarters ? (company.profile.headquarters.city + ', ' + company.profile.headquarters.region) : '-' }
                ]
            },
            {
                title: 'Operatività',
                icon: 'fa-industry',
                items: [
                    { label: 'Anno costituzione', value: company.profile?.founded || '-' },
                    { label: 'Dipendenti', value: company.profile?.employees || '-' },
                    { label: 'Dimensione', value: company.profile?.size || '-' },
                    { label: 'Business Model', value: company.profile?.businessModel || '-' }
                ]
            },
            {
                title: 'Governance',
                icon: 'fa-users',
                items: [
                    { label: 'Capitale Sociale', value: company.profile?.shareCapital ? Utils.formatCurrency(company.profile.shareCapital) : '-' },
                    { label: 'Proprietà', value: company.profile?.ownership || '-' },
                    { label: 'Forma Giuridica', value: 'S.R.L.' },
                    { label: 'Anno fiscale', value: company.fiscalYear || '-' }
                ]
            }
        ];
        container.innerHTML = profiles.map(profile => `<div class="profile-section-restored"><div class="profile-section-title"><i class="fas ${profile.icon}"></i>${profile.title}</div>${profile.items.map(item => '<div class="profile-item"><div class="profile-label">' + item.label + '</div><div class="profile-value">' + item.value + '</div></div>').join('')}</div>`).join('');
    },
    renderSWOTCards() {
        const container = document.getElementById('swotGrid');
        if (!container) return;
        const swotIntro = document.getElementById('swotIntro');
        if (swotIntro) {
            const intro = this.data.content?.parte1_sintesi?.swotIntro || '';
            if (intro) swotIntro.innerHTML = `<p class="mb-3">${intro}</p>`;
        }
        const swotData = this.data.tables?.parte1_sintesi?.swot || {};
        const swotCards = [
            { type: 'strengths', title: 'Punti di Forza', icon: 'fa-thumbs-up', items: swotData.strengths || ['Dati non disponibili'] },
            { type: 'weaknesses', title: 'Punti di Debolezza', icon: 'fa-thumbs-down', items: swotData.weaknesses || ['Dati non disponibili'] },
            { type: 'opportunities', title: 'Opportunità', icon: 'fa-lightbulb', items: swotData.opportunities || ['Dati non disponibili'] },
            { type: 'threats', title: 'Minacce', icon: 'fa-exclamation-triangle', items: swotData.threats || ['Dati non disponibili'] }
        ];
        container.innerHTML = swotCards.map(card => `<div class="swot-card-restored"><div class="swot-card-header ${card.type}"><i class="fas ${card.icon}"></i><span>${card.title}</span></div><div class="swot-card-body"><ul>${card.items.map(item => '<li>' + item + '</li>').join('')}</ul></div></div>`).join('');
    },
    renderKPIOverviewTable() {
        const container = document.getElementById('kpiOverviewTable');
        if (!container) return;
        const data = this.data.tables?.parte1_sintesi?.kpiOverview;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row =>
            '<tr><td class="fw-semibold">' + row.kpi + '</td><td class="text-right">' + row.value + '</td><td class="text-right ' + (row.change.includes('-') ? 'text-danger' : 'text-success') + '">' + row.change + '</td></tr>'
        ).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderSupportIndicatorsTable() {
        const container = document.getElementById('supportIndicatorsTable');
        if (!container) return;
        const data = this.data.tables?.parte1_sintesi?.supportIndicators;
        if (!data) return;
        const thead = '<thead><tr>' + data.headers.map(h => '<th>' + h + '</th>').join('') + '</tr></thead>';
        const tbody = '<tbody>' + data.rows.map(row =>
            '<tr><td><i class="fas ' + row.icon + ' text-' + row.iconColor + ' me-2"></i>' + row.indicator + '</td><td class="text-center"><span class="badge bg-' + row.badgeColor + '">' + row.value + '</span></td><td>' + row.assessment + '</td></tr>'
        ).join('') + '</tbody>';
        container.innerHTML = thead + tbody;
    },
    renderPriorityActionsTable() {
        const container = document.getElementById('priorityActionsTable');
        if (!container) return;
        const intro = document.getElementById('priorityActionsIntro');
        if (intro) {
            const introText = this.data.content?.parte1_sintesi?.priorityActionsIntro || '';
            if (introText) intro.innerHTML = `<p class="mb-3">${introText}</p>`;
        }
        const actionsData = this.data.tables?.parte1_sintesi?.priorityActions?.rows || [];
        const getPriorityBadge = (priority) => ({ 'Alta': 'danger', 'Media': 'warning', 'Bassa': 'info' }[priority] || 'info');
        container.innerHTML = '<thead><tr><th>Priorità</th><th>Area</th><th>Azione</th><th>Impatto Atteso</th></tr></thead><tbody>' +
            (actionsData.length > 0 ? actionsData.map(action => '<tr><td><span class="badge ' + getPriorityBadge(action.priority) + '">' + action.priority + '</span></td><td class="fw-semibold">' + action.area + '</td><td>' + action.action + '</td><td>' + action.impact + '</td></tr>').join('') : '<tr><td colspan="4" class="text-center">Nessun dato disponibile</td></tr>') +
            '</tbody>';
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte1Sintesi.init(); });
