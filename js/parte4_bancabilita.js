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
        const kpis = this.data.kpis || {};
        const supportInd = this.data.tables?.parte1_sintesi?.supportIndicators?.rows || [];
        const kpiConfigs = [
            { label: kpis.leanusScore?.title || 'Leanus Score', value: kpis.leanusScore?.displayValue || 'N/A', icon: 'fa-star', iconType: kpis.leanusScore?.status || 'warning' },
            { label: 'Rating MCC', value: supportInd.find(r => r.indicator === 'Rating MCC')?.value || 'n.d.', icon: 'fa-award', iconType: supportInd.find(r => r.indicator === 'Rating MCC')?.badgeColor || 'warning' },
            { label: 'Business Category', value: kpis.leanusScore?.metadata?.category || 'N/A', icon: 'fa-building', iconType: 'info' },
            { label: 'IRP', value: kpis.irp?.category || 'N/A', icon: 'fa-shield-alt', iconType: kpis.irp?.status || 'danger' }
        ];
        container.innerHTML = kpiConfigs.map(kpi => '<div class="kpi-card-v4"><div class="icon-circle ' + kpi.iconType + '"><i class="fas ' + kpi.icon + '"></i></div><div class="kpi-content"><div class="kpi-label">' + kpi.label + '</div><div class="kpi-value">' + kpi.value + '</div></div></div>').join('');
    },
    renderDSCR() {
        const container = document.getElementById('dscrTable');
        if (!container) return;
        const dscrData = this.data.tables?.parte4_bancabilita?.dscr;
        if (dscrData) {
            TableRenderer.renderTable(container, dscrData);
        } else {
            container.innerHTML = '<thead><tr><th>Anno</th><th class="text-right">EBITDA</th><th class="text-right">Oneri Finanziari</th><th class="text-right">DSCR</th></tr></thead><tbody><tr><td>2024</td><td class="text-right">€-44K</td><td class="text-right">€66K</td><td class="text-right text-danger"><strong>N/A</strong></td></tr><tr><td>2023</td><td class="text-right">€213K</td><td class="text-right">€39K</td><td class="text-right">5.4x</td></tr></tbody>';
        }
    },
    renderRating() {
        const container = document.getElementById('ratingGrid');
        if (!container) return;
        const ratings = [
            { title: 'Altman Z-Score', score: this.data.tables?.parte1_sintesi?.supportIndicators?.rows?.find(r => r.indicator === 'Z-Score')?.value || 'n.d.', status: 'Zona Grigia', statusClass: 'warning', description: 'Monitoraggio necessario' },
            { title: 'Rating Cerved', score: 'N/A', status: 'Non disponibile', statusClass: 'warning', description: 'Richiede valutazione' },
            { title: 'IRP Category', score: this.data.kpis?.irp?.category || 'N/A', status: this.data.kpis?.irp?.categoryLabel || 'N/A', statusClass: this.data.kpis?.irp?.status || 'danger', description: this.data.kpis?.irp?.description || '-' }
        ];
        container.innerHTML = ratings.map(rating => '<div class="profile-section-restored"><div class="profile-section-title"><i class="fas fa-certificate"></i>' + rating.title + '</div><div class="profile-item"><div class="profile-label">Score</div><div class="profile-value" style="font-size: 24px; font-weight: 700; color: var(--primary-color);">' + rating.score + '</div></div><div class="profile-item"><div class="profile-label">Stato</div><div class="profile-value"><span class="badge ' + rating.statusClass + '">' + rating.status + '</span></div></div><div class="profile-item"><div class="profile-label">Descrizione</div><div class="profile-value">' + rating.description + '</div></div></div>').join('');
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte4Bancabilita.init(); });
