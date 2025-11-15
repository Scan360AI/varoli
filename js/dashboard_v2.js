const DashboardV2 = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderWelcome();
            this.renderKPICards();
            this.renderTrendChart();
            this.renderPFNChart();
            this.renderIRPSection();
            this.renderAlerts();
        } catch (error) {
            console.error('Error initializing Dashboard:', error);
        }
    },

    renderWelcome() {
        const container = document.getElementById('welcomeMessage');
        if (!container) return;
        const welcome = this.data.content?.dashboard_v2?.welcomeMessage || '';
        const navGuide = this.data.content?.dashboard_v2?.navigationGuide || '';
        container.innerHTML = `<div class="alert alert-info"><i class="fas fa-info-circle me-2"></i>${welcome}</div><p class="text-muted">${navGuide}</p>`;
    },

    renderKPICards() {
        const container = document.getElementById('dashboardKPIs');
        if (!container) return;
        const kpis = this.data.kpis || {};

        // Configurazione degli 8 KPI da visualizzare
        const kpiConfigs = [
            { key: 'irp', colClass: 'col-xl-3 col-md-6 mb-4' },
            { key: 'revenue', colClass: 'col-xl-3 col-md-6 mb-4' },
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

        // Valore speciale per azione prioritaria (font-size più piccolo)
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
        const irpValue = document.getElementById('dashboardIRPValue');
        const irpBadge = document.getElementById('dashboardIRPBadge');
        const irpCircle = document.getElementById('dashboardIRPCircle');
        const irpMarker = document.getElementById('dashboardIRPMarker');
        const riskLevel = document.getElementById('dashboardRiskLevel');
        const irpNarrative = document.getElementById('dashboardIRPNarrative');

        const irp = this.data.kpis?.irp || {};
        const score = irp.value || 0;
        const category = irp.category || 'D+';
        const categoryLabel = irp.categoryLabel || '';
        const narrative = this.data.content?.dashboard_v2?.irpSummary || '';

        if (irpValue) irpValue.textContent = score.toFixed(1);
        if (irpBadge) {
            irpBadge.textContent = `Categoria ${category}`;
            irpBadge.className = 'badge ' + (irp.status || 'danger');
        }
        if (riskLevel) riskLevel.textContent = categoryLabel;
        if (irpNarrative) irpNarrative.textContent = narrative;

        // Posiziona il marker sulla barra gradient
        if (irpMarker) {
            irpMarker.style.left = `${score}%`;
        }

        // Colora il cerchio in base al rischio
        if (irpCircle) {
            const riskClass = score >= 75 ? 'success' : score >= 50 ? 'warning' : 'danger';
            irpCircle.className = 'irp-score-circle risk-' + riskClass;
        }
    },

    renderAlerts() {
        const container = document.getElementById('dashboardAlerts');
        if (!container) return;

        const alerts = this.data.content?.dashboard_v2?.alerts || [];
        if (alerts.length === 0) {
            container.innerHTML = '<p class="text-muted">Nessun alert critico al momento.</p>';
            return;
        }

        const alertsHTML = alerts.map(alert => {
            const typeClass = alert.type === 'danger' ? 'alert-danger' : alert.type === 'warning' ? 'alert-warning' : 'alert-info';
            const icon = alert.type === 'danger' ? 'fa-exclamation-triangle' : alert.type === 'warning' ? 'fa-exclamation-circle' : 'fa-info-circle';
            return `<div class="alert ${typeClass}">
                <h5 class="alert-heading"><i class="fas ${icon} me-2"></i>${alert.title || ''}</h5>
                <p style="margin:0;">${alert.description || ''}</p>
                ${alert.link ? `<a href="${alert.link}" class="btn btn-sm btn-${alert.type || 'primary'} mt-2"><i class="fas fa-arrow-right"></i> ${alert.linkText || 'Dettagli'}</a>` : ''}
            </div>`;
        }).join('');

        container.innerHTML = alertsHTML;
    }
};

document.addEventListener('DOMContentLoaded', () => { DashboardV2.init(); });
