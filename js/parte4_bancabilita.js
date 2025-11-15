const Parte4Bancabilita = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderMerito();
            this.renderDSCR();
            this.renderRating();
        } catch (error) {
            console.error('Error initializing Parte 4:', error);
        }
    },
    renderMerito() {
        const container = document.getElementById('meritoGrid');
        if (!container) return;
        const kpis = [
            { label: 'Leanus Score', value: '6.8/10', icon: 'fa-star', iconType: 'success', trend: '+0.3', trendType: 'positive' },
            { label: 'Rating MCC', value: 'BB+', icon: 'fa-award', iconType: 'success', trend: 'Stabile', trendType: 'neutral' },
            { label: 'Business Category', value: 'Standard', icon: 'fa-building', iconType: 'info', trend: '-', trendType: 'neutral' },
            { label: 'Affidabilità', value: 'Alta', icon: 'fa-shield-alt', iconType: 'success', trend: 'Migliorata', trendType: 'positive' }
        ];
        container.innerHTML = kpis.map(kpi => `
            <div class="kpi-card-v4">
                <div class="icon-circle ${kpi.iconType}"><i class="fas ${kpi.icon}"></i></div>
                <div class="kpi-content">
                    <div class="kpi-label">${kpi.label}</div>
                    <div class="kpi-value">${kpi.value}</div>
                    <div class="kpi-trend ${kpi.trendType}"><i class="fas fa-arrow-${kpi.trendType === 'positive' ? 'up' : 'minus'}"></i><span>${kpi.trend}</span></div>
                </div>
            </div>
        `).join('');
    },
    renderDSCR() {
        const container = document.getElementById('dscrTable');
        if (!container) return;
        TableRenderer.renderTable(container, {
            columns: [
                { label: 'Anno', width: '25%' },
                { label: 'EBITDA', align: 'text-right', width: '25%' },
                { label: 'Oneri Finanziari', align: 'text-right', width: '25%' },
                { label: 'DSCR', align: 'text-right', width: '25%' }
            ],
            rows: [
                { cells: [{ value: '2024' }, { value: 135910, type: 'currency' }, { value: 6180, type: 'currency' }, { value: '22,0x', bold: true }], className: 'table-success' },
                { cells: [{ value: '2023' }, { value: 134040, type: 'currency' }, { value: 60814, type: 'currency' }, { value: '2,2x' }] },
                { cells: [{ value: '2022' }, { value: 131786, type: 'currency' }, { value: 59882, type: 'currency' }, { value: '2,2x' }] }
            ]
        });
    },
    renderRating() {
        const container = document.getElementById('ratingGrid');
        if (!container) return;
        const ratings = [
            { title: 'Rating Altman Z-Score', icon: 'fa-chart-line', score: '3.85', status: 'Zona Sicura', statusClass: 'success', description: 'Basso rischio fallimento' },
            { title: 'Rating Cerved', icon: 'fa-certificate', score: 'B1.2', status: 'Affidabile', statusClass: 'success', description: 'Rischio di credito contenuto' },
            { title: 'Rating Basel III', icon: 'fa-university', score: 'BBB', status: 'Investment Grade', statusClass: 'info', description: 'Buona qualità creditizia' }
        ];
        container.innerHTML = ratings.map(rating => `
            <div class="profile-section-restored">
                <div class="profile-section-title"><i class="fas ${rating.icon}"></i>${rating.title}</div>
                <div class="profile-item"><div class="profile-label">Score</div><div class="profile-value" style="font-size: 24px; font-weight: 700; color: var(--primary-color);">${rating.score}</div></div>
                <div class="profile-item"><div class="profile-label">Stato</div><div class="profile-value"><span class="badge ${rating.statusClass}">${rating.status}</span></div></div>
                <div class="profile-item"><div class="profile-label">Descrizione</div><div class="profile-value">${rating.description}</div></div>
            </div>
        `).join('');
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte4Bancabilita.init(); });
