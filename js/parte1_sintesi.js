const Parte1Sintesi = {
    data: null,
    charts: {},

    async init() {
        try {
            await App.init();
            this.data = App.getData();

            this.renderHeaderIRPBadge();
            this.renderIRPSummarySection();
            this.renderKPICards();
            this.createMainMetricsChart();
            this.createCapitalChart();
            this.renderCompanyProfile();
            this.renderSWOT();
            this.renderCCIISection();
            this.renderPriorityActions();

        } catch (error) {
            console.error('Error initializing Parte 1:', error);
        }
    },

    renderHeaderIRPBadge() {
        const irpData = this.data.tables?.parte1_sintesi?.irpSummary || {};
        const score = irpData.score || 0;
        const category = irpData.category || 'D+';
        const badge = document.getElementById('headerIRPBadge');
        if (!badge) return;

        const badgeClass = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger';
        badge.innerHTML = `<span>IRP:</span><span class="irp-badge-score">${score.toFixed(1).replace('.', ',')}</span><span class="badge ${badgeClass}">${category}</span>`;
    },

    renderIRPSummarySection() {
        const container = document.getElementById('irpSummarySection');
        if (!container) return;

        const irpData = this.data.tables?.parte1_sintesi?.irpSummary || {};
        const supportIndicators = this.data.tables?.parte1_sintesi?.supportIndicators || {};
        const content = this.data.content?.parte1_sintesi || {};

        const score = irpData.score || 0;
        const category = irpData.category || 'D+';
        const riskClass = score >= 75 ? 'low' : score >= 50 ? 'medium' : 'high';
        const badgeClass = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger';

        // Render altri indicatori
        let indicatorsHTML = '';
        if (supportIndicators.rows) {
            supportIndicators.rows.forEach(ind => {
                indicatorsHTML += `
                    <li class="col-sm-6 d-flex align-items-center">
                        <span class="icon-circle icon-circle-sm bg-icon-${ind.iconColor} me-2"><i class="fas ${ind.icon}"></i></span>
                        <strong>${ind.indicator}:</strong> ${ind.value}
                        ${ind.assessment ? `<span class="badge bg-${ind.badgeColor} ms-1">${ind.assessment}</span>` : `<span class="badge stable-badge ms-1">${ind.value}</span>`}
                    </li>
                `;
            });
        }

        container.className = `irp-visual-section risk-${riskClass} report-section`;
        container.innerHTML = `
            <div class="row align-items-center">
                <div class="col-md-4 text-center mb-4 mb-md-0">
                    <h6 class="card-title-small mb-3"><i class="fas fa-shield-alt me-1"></i> Indice Rischio Ponderato</h6>
                    <div class="irp-score-circle risk-${riskClass}">
                        <span class="irp-score-value">${score.toFixed(2).replace('.', ',')}</span>
                        <span class="irp-score-max">/ 100</span>
                    </div>
                    <div class="irp-category-text text-${badgeClass} mt-2">
                        Rischio elevato
                        <span class="status-badge bg-${badgeClass}">${category}</span>
                    </div>
                    <a class='btn btn-sm btn-outline-primary mt-3 btn-pill' href='irp_dettaglio.html'>Vedi Dettaglio IRP</a>
                </div>
                <div class="col-md-8">
                    <h4 class="mb-3 fw-bold" style="color: var(--primary);">Valutazione Generale</h4>
                    <p class="mb-3">${content.irpDescription || ''}</p>
                    <a href="#cciiSection" class="btn btn-danger btn-sm mb-3 btn-pill">
                        <i class="fas fa-exclamation-circle me-1"></i> ${content.crisisButton || 'Verifica Crisi d\'Impresa'}
                    </a>
                    <div class="other-ratings border-top pt-3 mt-3">
                        <h6 class="card-title-small mb-2">Altri Indicatori di Supporto:</h6>
                        <ul class="list-unstyled mb-0 row gx-3 gy-2">${indicatorsHTML}</ul>
                    </div>
                </div>
            </div>
        `;
    },

    renderKPICards() {
        const container = document.getElementById('kpiCardsGrid');
        if (!container) return;

        const kpiData = this.data.tables?.parte1_sintesi?.kpiOverview || {};
        if (!kpiData.rows) return;

        const kpiMapping = {
            'Ricavi (Revenue)': { icon: 'fa-euro-sign', iconColor: 'danger' },
            'EBITDA': { icon: 'fa-chart-line', iconColor: 'danger' },
            'EBITDA Margin': { icon: 'fa-percentage', iconColor: 'danger' },
            'Utile Netto (Net Income)': { icon: 'fa-coins', iconColor: 'danger' },
            'Patrimonio Netto (Equity)': { icon: 'fa-landmark', iconColor: 'danger' },
            'Liquidità (Liquidity)': { icon: 'fa-tint', iconColor: 'success' },
            'PFN/EBITDA': { icon: 'fa-balance-scale-right', iconColor: 'danger' },
            'Leva Finanziaria (D/E)': { icon: 'fa-money-bill-wave', iconColor: 'danger' }
        };

        let html = '';
        kpiData.rows.forEach(kpi => {
            const config = kpiMapping[kpi.kpi] || { icon: 'fa-chart-bar', iconColor: 'secondary' };
            const isPositive = kpi.change.includes('+');
            const isNeutral = kpi.change.includes('Critico') || kpi.change.includes('Elevata');
            const trendClass = isNeutral ? 'trend-neutral' : (isPositive ? 'trend-up' : 'trend-down');
            const trendIcon = isNeutral ? 'fa-minus' : (isPositive ? 'fa-arrow-up' : 'fa-arrow-down');

            html += `
                <div class="col-lg-3 col-md-6">
                    <div class="kpi-card-v4">
                        <span class="icon-circle bg-icon-${config.iconColor}"><i class="fas ${config.icon}"></i></span>
                        <div class="kpi-content">
                            <div class="kpi-title">${kpi.kpi.replace(/\s*\(.*?\)\s*/g, '')}</div>
                            <div class="kpi-value">${kpi.value}</div>
                            <div class="kpi-trend ${trendClass}"><i class="fas ${trendIcon}"></i> ${kpi.change}</div>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    createMainMetricsChart() {
        const canvas = document.getElementById('mainMetricsChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Dati sintetici basati sui dati reali
        const years = ['2022', '2023', '2024'];
        const ricavi = [3722, 3324, 2850]; // in migliaia
        const ebitda = [197, 213, -44]; // in migliaia

        this.charts.mainMetrics = new Chart(ctx, {
            type: 'line',
            data: {
                labels: years,
                datasets: [
                    {
                        label: 'Ricavi (€000)',
                        data: ricavi,
                        borderColor: '#191970',
                        backgroundColor: 'rgba(25, 25, 112, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y'
                    },
                    {
                        label: 'EBITDA (€000)',
                        data: ebitda,
                        borderColor: '#F44336',
                        backgroundColor: 'rgba(244, 67, 54, 0.1)',
                        borderWidth: 2,
                        tension: 0.3,
                        yAxisID: 'y1'
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                interaction: {
                    mode: 'index',
                    intersect: false
                },
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.dataset.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                label += '€' + context.parsed.y.toLocaleString('it-IT');
                                return label;
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        type: 'linear',
                        display: true,
                        position: 'left',
                        title: {
                            display: true,
                            text: 'Ricavi (€000)'
                        }
                    },
                    y1: {
                        type: 'linear',
                        display: true,
                        position: 'right',
                        title: {
                            display: true,
                            text: 'EBITDA (€000)'
                        },
                        grid: {
                            drawOnChartArea: false
                        }
                    }
                }
            }
        });
    },

    createCapitalChart() {
        const canvas = document.getElementById('currentAssetsLiabilitiesChart');
        if (!canvas) return;

        const ctx = canvas.getContext('2d');

        // Dati sintetici del capitale circolante netto
        const years = ['2022', '2023', '2024'];
        const ccn = [1365000, 1299000, 459000]; // Valori approssimativi

        this.charts.capital = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: years,
                datasets: [{
                    label: 'Capitale Circolante Netto (€)',
                    data: ccn,
                    backgroundColor: '#4CAF50',
                    borderColor: '#4CAF50',
                    borderWidth: 1
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: true,
                plugins: {
                    legend: {
                        display: true,
                        position: 'bottom'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'CCN: €' + context.parsed.y.toLocaleString('it-IT');
                            }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            callback: function(value) {
                                return '€' + (value/1000).toFixed(0) + 'K';
                            }
                        }
                    }
                }
            }
        });
    },

    renderCompanyProfile() {
        const container = document.getElementById('companyProfileSection');
        if (!container) return;

        const profile = this.data.tables?.parte1_sintesi?.companyProfile || {};
        const content = this.data.content?.parte1_sintesi || {};

        let anagraficaHTML = '';
        if (profile.anagrafica) {
            profile.anagrafica.forEach(item => {
                anagraficaHTML += `<li><i class="fas ${item.icon} fa-fw"></i><strong>${item.label}:</strong> ${item.value}</li>`;
            });
        }

        let strutturaHTML = '';
        if (profile.struttura) {
            profile.struttura.forEach(item => {
                strutturaHTML += `<li><i class="fas ${item.icon} fa-fw"></i><strong>${item.label}:</strong> ${item.value}</li>`;
            });
        }

        container.innerHTML = `
            <div class="row">
                <div class="col-lg-6">
                    <h6><i class="fas fa-info-circle fa-fw me-2 text-primary"></i> Anagrafica e Settore</h6>
                    <ul>${anagraficaHTML}</ul>
                </div>
                <div class="col-lg-6">
                    <h6><i class="fas fa-users-cog fa-fw me-2 text-primary"></i> Struttura e Personale</h6>
                    <ul>${strutturaHTML}</ul>
                </div>
                <div class="col-lg-12 mt-3">
                    <h6><i class="fas fa-briefcase fa-fw me-2 text-primary"></i> Modello di Business e Posizionamento</h6>
                    <p class="small">${content.businessModel || ''}</p>
                </div>
            </div>
        `;
    },

    renderSWOT() {
        const container = document.getElementById('swotGrid');
        if (!container) return;

        const swot = this.data.tables?.parte1_sintesi?.swot || {};

        const swotCards = [
            { type: 'strength', title: 'Forza', icon: 'fa-thumbs-up', items: swot.strengths || [] },
            { type: 'weakness', title: 'Debolezza', icon: 'fa-thumbs-down', items: swot.weaknesses || [] },
            { type: 'opportunity', title: 'Opportunità', icon: 'fa-lightbulb', items: swot.opportunities || [] },
            { type: 'threat', title: 'Minacce', icon: 'fa-exclamation-triangle', items: swot.threats || [] }
        ];

        let html = '';
        swotCards.forEach(card => {
            let itemsHTML = '';
            card.items.forEach(item => {
                itemsHTML += `<li>${item}</li>`;
            });

            html += `
                <div class="col-md-6 col-lg-3 mb-4">
                    <div class="swot-card-restored ${card.type} h-100">
                        <div class="card-header"><i class="fas ${card.icon}"></i> ${card.title}</div>
                        <div class="card-body"><ul>${itemsHTML}</ul></div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    },

    renderCCIISection() {
        const container = document.getElementById('cciiSection');
        if (!container) return;

        const content = this.data.content?.parte1_sintesi || {};

        let normativeHTML = '';
        if (content.normativeContext) {
            content.normativeContext.forEach(item => {
                normativeHTML += `<li class="small">${item}</li>`;
            });
        }

        container.innerHTML = `
            <div class="card-header"><h5 class="mb-0">Verifica Indicatori e Framework Normativo</h5></div>
            <div class="card-body">
                <div class="alert-box alert-danger d-flex align-items-center">
                    <span class="icon-circle bg-icon-danger me-3"><i class="fas fa-exclamation-circle"></i></span>
                    <div>
                        <h6 class="mb-1">${content.cciiAlert?.title || ''}</h6>
                        <p class="small mb-0">${content.cciiAlert?.description || ''}</p>
                    </div>
                </div>
                <h6 class="mt-4">Contesto Normativo Rilevante:</h6>
                <ul>${normativeHTML}</ul>
                <p class="small text-muted mt-3">${content.dscrNote || ''}</p>
            </div>
        `;
    },

    renderPriorityActions() {
        const container = document.getElementById('priorityActionsTable');
        if (!container) return;

        const actionsData = this.data.tables?.parte1_sintesi?.priorityActions || {};
        if (!actionsData.rows) return;

        let headerHTML = '<thead class="table-light"><tr>';
        if (actionsData.headers) {
            actionsData.headers.forEach(h => {
                headerHTML += `<th>${h}</th>`;
            });
        }
        headerHTML += '</tr></thead>';

        let bodyHTML = '<tbody>';
        actionsData.rows.forEach(row => {
            bodyHTML += `
                <tr>
                    <td><span class="icon-circle icon-circle-sm ${row.iconColor}"><i class="fas ${row.icon}"></i></span> ${row.area}</td>
                    <td>${row.action}</td>
                    <td>${row.impact}</td>
                    <td><span class="status-badge ${row.badgeClass}">${row.priority}</span></td>
                </tr>
            `;
        });
        bodyHTML += '</tbody>';

        container.innerHTML = headerHTML + bodyHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => {
    Parte1Sintesi.init();
});
