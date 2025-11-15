const Parte3Patrimoniale = {
    data: null,
    charts: {},
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderStatoPatrimoniale();
            this.renderIndiciPatrimoniali();
            this.renderComposizioneAttivo();
            this.renderComposizionePassivo();
            this.renderPatrimonioNettoEvolution();
        } catch (error) {
            console.error('Error initializing Parte 3:', error);
        }
    },
    renderStatoPatrimoniale() {
        const container = document.getElementById('statoPatrimonialeTable');
        if (!container) return;
        const impieghi = this.data.tables?.parte3_patrimoniale?.statoPatrimonialeImpieghi;
        const fonti = this.data.tables?.parte3_patrimoniale?.statoPatrimonialeFonti;
        if (!impieghi && !fonti) {
            container.innerHTML = '<tr><td>Dati non disponibili</td></tr>';
            return;
        }
        let html = '<thead><tr><th>Voce</th><th class="text-right">2022</th><th class="text-right">2023</th><th class="text-right">2024</th></tr></thead><tbody>';
        html += '<tr class="table-primary"><td colspan="4"><strong>ATTIVO</strong></td></tr>';
        if (impieghi) {
            (impieghi.rows || []).forEach(row => {
                html += '<tr' + (row.highlight ? ' class="table-success"' : '') + '><td>' + row.categoria + '</td><td class="text-right">' + Utils.formatCurrency(row[2022]) + '</td><td class="text-right">' + Utils.formatCurrency(row[2023]) + '</td><td class="text-right">' + Utils.formatCurrency(row[2024]) + '</td></tr>';
            });
        }
        html += '<tr style="height:24px"><td colspan="4"></td></tr>';
        html += '<tr class="table-primary"><td colspan="4"><strong>PASSIVO E PATRIMONIO NETTO</strong></td></tr>';
        if (fonti) {
            (fonti.rows || []).forEach(row => {
                html += '<tr' + (row.highlight ? ' class="table-success"' : '') + '><td>' + row.categoria + '</td><td class="text-right">' + Utils.formatCurrency(row[2022]) + '</td><td class="text-right">' + Utils.formatCurrency(row[2023]) + '</td><td class="text-right">' + Utils.formatCurrency(row[2024]) + '</td></tr>';
            });
        }
        html += '</tbody>';
        container.innerHTML = html;
    },
    renderIndiciPatrimoniali() {
        const container = document.getElementById('indiciPatrimonialiGrid');
        if (!container) return;
        const indici = this.data.tables?.parte3_patrimoniale?.indiciPatrimoniali?.rows || [];
        container.innerHTML = indici.slice(0, 4).map(idx => '<div class="kpi-card-v4"><div class="icon-circle ' + (idx.valutazione === 'Critico' ? 'danger' : idx.valutazione === 'Ottimo' ? 'success' : 'warning') + '"><i class="fas fa-shield-alt"></i></div><div class="kpi-content"><div class="kpi-label">' + idx.indice + '</div><div class="kpi-value">' + (idx['2024'] !== null ? idx['2024'].toFixed(2) : 'N/A') + '</div><div class="kpi-subtitle">' + idx.formula + '</div></div></div>').join('');
    },
    renderComposizioneAttivo() {
        const ctx = document.getElementById('attivoChart');
        if (!ctx) return;
        if (this.charts.attivo) this.charts.attivo.destroy();
        this.charts.attivo = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Immobilizzazioni', 'Crediti', 'Rimanenze', 'Liquidità', 'Altri'],
                datasets: [{
                    data: [25, 35, 25, 10, 5],
                    backgroundColor: ['#191970', '#24b47e', '#2196F3', '#FFC107', '#9E9E9E']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    },
    renderComposizionePassivo() {
        const ctx = document.getElementById('passivoChart');
        if (!ctx) return;
        if (this.charts.passivo) this.charts.passivo.destroy();
        this.charts.passivo = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: ['Patrimonio Netto', 'Debiti Finanziari', 'Debiti Commerciali', 'TFR', 'Altri'],
                datasets: [{
                    data: [30, 35, 20, 10, 5],
                    backgroundColor: ['#24b47e', '#F44336', '#FF9800', '#2196F3', '#9E9E9E']
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { position: 'bottom' } }
            }
        });
    },
    renderPatrimonioNettoEvolution() {
        const ctx = document.getElementById('patrimonioNettoChart');
        if (!ctx) return;
        const chartData = this.data.charts?.reports?.parte1?.mainMetricsChart;
        if (!chartData) return;
        if (this.charts.patrimonioNetto) this.charts.patrimonioNetto.destroy();
        this.charts.patrimonioNetto = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: chartData.labels,
                datasets: [{
                    label: 'Patrimonio Netto',
                    data: chartData.datasets.equity.data,
                    backgroundColor: '#24b47e'
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: { legend: { display: false } },
                scales: { y: { beginAtZero: true, ticks: { callback: v => '€' + v + 'K' } } }
            }
        });
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte3Patrimoniale.init(); });
