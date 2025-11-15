/**
 * SCAN360 - Dashboard V2
 */

const Dashboard = {
    data: null,

    /**
     * Initialize the dashboard
     */
    async init() {
        try {
            await App.init();
            this.data = App.getData();

            this.renderKPIs();
            this.renderIRPSection();
            this.renderAlerts();
        } catch (error) {
            console.error('Error initializing dashboard:', error);
        }
    },

    /**
     * Render main KPI cards
     */
    renderKPIs() {
        const container = document.getElementById('dashboardKPIs');
        if (!container) return;

        const kpis = [
            {
                label: 'Ricavi 2024',
                value: '€1.030.748',
                trend: '+1,64%',
                trendDirection: 'up',
                trendType: 'positive',
                icon: 'fa-chart-line',
                iconType: 'success'
            },
            {
                label: 'EBITDA 2024',
                value: '€102.108',
                trend: '9,9%',
                trendDirection: 'minus',
                trendType: 'neutral',
                icon: 'fa-piggy-bank',
                iconType: 'warning'
            },
            {
                label: 'Utile Netto 2024',
                value: '€95.783',
                trend: '+131%',
                trendDirection: 'up',
                trendType: 'positive',
                icon: 'fa-coins',
                iconType: 'success'
            },
            {
                label: 'IRP Score',
                value: '78.5',
                trend: 'Categoria B',
                trendDirection: 'minus',
                trendType: 'neutral',
                icon: 'fa-shield-alt',
                iconType: 'info'
            }
        ];

        container.innerHTML = kpis.map(kpi => `
            <div class="kpi-card-v4">
                <div class="icon-circle ${kpi.iconType}">
                    <i class="fas ${kpi.icon}"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">${kpi.label}</div>
                    <div class="kpi-value">${kpi.value}</div>
                    <div class="kpi-trend ${kpi.trendType}">
                        <i class="fas fa-arrow-${kpi.trendDirection}"></i>
                        <span>${kpi.trend}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render IRP section
     */
    renderIRPSection() {
        const irpData = this.data.tables?.irp_dettaglio?.irpOverall || {
            score: 78.5,
            category: 'B',
            riskLevel: 'Rischio Moderato-Basso'
        };

        const score = irpData.score || 78.5;
        const category = irpData.category || 'B';
        const riskLevel = irpData.riskLevel || 'Rischio Moderato-Basso';
        const riskClass = Utils.getRiskLevel(score);

        // Update IRP score circle
        const scoreCircle = document.getElementById('dashboardIRPCircle');
        if (scoreCircle) {
            scoreCircle.className = `irp-score-circle risk-${riskClass}`;
        }

        const scoreValue = document.getElementById('dashboardIRPValue');
        if (scoreValue) {
            scoreValue.textContent = score.toFixed(1);
        }

        // Update category badge
        const categoryBadge = document.getElementById('dashboardIRPBadge');
        if (categoryBadge) {
            const badgeClass = riskClass === 'low' ? 'success' : riskClass === 'medium' ? 'warning' : 'danger';
            categoryBadge.className = `badge ${badgeClass}`;
            categoryBadge.textContent = `Categoria ${category}`;
        }

        // Update risk level
        const riskLevelEl = document.getElementById('dashboardRiskLevel');
        if (riskLevelEl) {
            riskLevelEl.textContent = riskLevel;
        }

        // Update visual section border
        const visualSection = document.getElementById('dashboardIRPSection');
        if (visualSection) {
            visualSection.className = `irp-visual-section risk-${riskClass}`;
        }

        // Position marker on gradient bar
        const marker = document.getElementById('dashboardIRPMarker');
        if (marker) {
            marker.style.left = `${score}%`;
        }

        // Update narrative
        const narrative = document.getElementById('dashboardIRPNarrative');
        if (narrative) {
            narrative.innerHTML = `
                L'<strong>Indice di Rischio Ponderato (IRP)</strong> si attesta a <strong>${score.toFixed(1)}/100</strong>,
                collocando l'azienda in <strong>categoria ${category}</strong> (${riskLevel.toLowerCase()}).
                L'analisi considera solidità patrimoniale, redditività, liquidità e merito creditizio.
                <br><br>
                L'azienda presenta buoni margini di sicurezza, con alcune aree di miglioramento legate alla gestione del circolante.
            `;
        }
    },

    /**
     * Render alerts and priorities
     */
    renderAlerts() {
        const container = document.getElementById('dashboardAlerts');
        if (!container) return;

        const alerts = [
            {
                type: 'warning',
                title: 'Attenzione: DSO Elevato',
                message: 'I giorni medi di incasso (DSO) sono pari a 173 giorni, significativamente sopra la media di settore. Si raccomanda di implementare azioni per ridurre i tempi di incasso.',
                action: 'Vedi Circolante e Flussi',
                link: 'parte5_circolante_flussi.html'
            },
            {
                type: 'info',
                title: 'Opportunità: Ottimizzazione Struttura Finanziaria',
                message: 'L\'eccessiva dipendenza da credito bancario a breve termine può essere mitigata negoziando linee di credito a medio-lungo termine.',
                action: 'Vedi Bancabilità',
                link: 'parte4_bancabilita.html'
            },
            {
                type: 'success',
                title: 'Punto di Forza: Redditività Eccellente',
                message: 'Il ROE si attesta al 40,9%, evidenziando un\'eccellente capacità di generare valore dal capitale investito. L\'utile netto è cresciuto del 131%.',
                action: 'Vedi Analisi Economica',
                link: 'parte2_economico.html'
            }
        ];

        container.innerHTML = alerts.map(alert => `
            <div class="alert-box ${alert.type}">
                <div class="alert-title">${alert.title}</div>
                <div class="alert-content">
                    ${alert.message}
                    <br>
                    <a href="${alert.link}" class="btn btn-sm btn-outline-primary mt-2">
                        <i class="fas fa-arrow-right"></i> ${alert.action}
                    </a>
                </div>
            </div>
        `).join('');
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Dashboard.init();
});
