const Parte5Circolante = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderCiclo();
            this.renderCCN();
            this.renderCashFlow();
        } catch (error) {
            console.error('Error initializing Parte 5:', error);
        }
    },
    renderCiclo() {
        const container = document.getElementById('cicloGrid');
        if (!container) return;
        const cicli = [
            { label: 'DSO', value: '173', unit: 'giorni', icon: 'fa-calendar-check', status: 'warning', description: 'Giorni medi di incasso' },
            { label: 'DIO', value: '21', unit: 'giorni', icon: 'fa-boxes', status: 'good', description: 'Giorni giacenza magazzino' },
            { label: 'DPO', value: '72', unit: 'giorni', icon: 'fa-file-invoice-dollar', status: 'good', description: 'Giorni medi di pagamento' }
        ];
        container.innerHTML = cicli.map(ciclo => `
            <div class="cycle-kpi ${ciclo.status}">
                <div class="cycle-kpi-label">${ciclo.label}</div>
                <div class="cycle-kpi-value">${ciclo.value}<span class="cycle-kpi-unit">${ciclo.unit}</span></div>
                <div style="margin-top: 12px; font-size: 13px; color: var(--text-secondary);">${ciclo.description}</div>
            </div>
        `).join('');
    },
    renderCCN() {
        const container = document.getElementById('ccnTable');
        if (!container) return;
        TableRenderer.renderTable(container, {
            columns: [
                { label: 'Componente', width: '50%' },
                { label: '2024', align: 'text-right', width: '25%' },
                { label: '2023', align: 'text-right', width: '25%' }
            ],
            rows: [
                { cells: [{ value: 'Attivo Circolante' }, { value: 611975, type: 'currency' }, { value: 602043, type: 'currency' }], className: 'table-primary' },
                { cells: [{ value: 'Passivo Corrente' }, { value: 549540, type: 'currency' }, { value: 540589, type: 'currency' }], className: 'table-primary' },
                { isSpacer: true },
                { cells: [{ value: 'Capitale Circolante Netto', bold: true }, { value: 62435, type: 'currency', bold: true }, { value: 61454, type: 'currency', bold: true }], className: 'table-success' }
            ]
        });
    },
    renderCashFlow() {
        const ctx = document.getElementById('cashFlowChart');
        if (!ctx) return;
        if (this.charts.cashFlow) this.charts.cashFlow.destroy();
        this.charts.cashFlow = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: ['Liquidità Iniziale', 'CF Operativo', 'CF Investimenti', 'CF Finanziario', 'Liquidità Finale'],
                datasets: [{
                    label: 'Flusso di Cassa',
                    data: [47.9, 125.3, -32.5, -91.2, 49.5],
                    backgroundColor: ['#2196F3', '#24b47e', '#F44336', '#FF9800', '#191970']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: (context) => '€' + context.parsed.y.toFixed(1) + 'K'
                        }
                    }
                },
                scales: {
                    y: {
                        ticks: {
                            callback: (value) => '€' + value + 'K'
                        }
                    }
                }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte5Circolante.init(); });
