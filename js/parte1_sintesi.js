/**
 * SCAN360 - Parte 1: Sintesi e Profilo Aziendale
 */

const Parte1Sintesi = {
    data: null,

    /**
     * Initialize the page
     */
    async init() {
        try {
            await App.init();
            this.data = App.getData();

            this.renderKPICards();
            this.renderIRPSection();
            this.renderProfileCards();
            this.renderSWOTCards();
            this.renderPriorityActionsTable();
        } catch (error) {
            console.error('Error initializing Parte 1:', error);
        }
    },

    /**
     * Render main KPI cards (1.1)
     */
    renderKPICards() {
        const container = document.getElementById('kpiMainGrid');
        if (!container) return;

        const kpis = this.data.kpis?.parte1_sintesi?.kpiPrincipali || [];

        const kpiConfigs = [
            {
                label: 'Ricavi 2024',
                value: '€1.030.748',
                trend: '+1,64%',
                trendDirection: 'up',
                trendType: 'positive',
                subtitle: 'vs 2023',
                icon: 'fa-chart-line',
                iconType: 'success'
            },
            {
                label: 'EBITDA 2024',
                value: '€102.108',
                trend: '-2,68%',
                trendDirection: 'down',
                trendType: 'negative',
                subtitle: '9,9% dei Ricavi',
                icon: 'fa-piggy-bank',
                iconType: 'warning'
            },
            {
                label: 'Utile Netto 2024',
                value: '€95.783',
                trend: '+131,00%',
                trendDirection: 'up',
                trendType: 'positive',
                subtitle: '9,3% dei Ricavi',
                icon: 'fa-coins',
                iconType: 'success'
            },
            {
                label: 'Patrimonio Netto 2024',
                value: '€234.134',
                trend: '+69,23%',
                trendDirection: 'up',
                trendType: 'positive',
                subtitle: 'vs 2023',
                icon: 'fa-university',
                iconType: 'success'
            }
        ];

        container.innerHTML = kpiConfigs.map(kpi => `
            <div class="kpi-card-v4">
                <div class="icon-circle ${kpi.iconType}">
                    <i class="fas ${kpi.icon}"></i>
                </div>
                <div class="kpi-content">
                    <div class="kpi-label">${kpi.label}</div>
                    <div class="kpi-value">${kpi.value}</div>
                    <div class="kpi-trend ${kpi.trendType}">
                        <i class="fas fa-arrow-${kpi.trendDirection}"></i>
                        <span>${kpi.trend} ${kpi.subtitle}</span>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render IRP visual section (1.2)
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
        const scoreCircle = document.getElementById('irpScoreCircle');
        if (scoreCircle) {
            scoreCircle.className = `irp-score-circle risk-${riskClass}`;
        }

        const scoreValue = document.getElementById('irpScoreValue');
        if (scoreValue) {
            scoreValue.textContent = score.toFixed(1);
        }

        // Update category badge
        const categoryBadge = document.getElementById('irpCategoryBadge');
        if (categoryBadge) {
            const badgeClass = riskClass === 'low' ? 'success' : riskClass === 'medium' ? 'warning' : 'danger';
            categoryBadge.className = `badge ${badgeClass}`;
            categoryBadge.textContent = `Categoria ${category}`;
        }

        // Update risk level
        const riskLevelEl = document.getElementById('irpRiskLevel');
        if (riskLevelEl) {
            riskLevelEl.textContent = riskLevel;
        }

        // Update visual section border
        const visualSection = document.getElementById('irpVisualSection');
        if (visualSection) {
            visualSection.className = `irp-visual-section risk-${riskClass}`;
        }

        // Position marker on gradient bar
        const marker = document.getElementById('irpMarker');
        if (marker) {
            marker.style.left = `${score}%`;
        }

        // Render IRP indicators
        this.renderIRPIndicators();

        // Update narrative
        const narrative = document.getElementById('irpNarrative');
        if (narrative) {
            narrative.textContent = `L'azienda presenta un IRP di ${score.toFixed(1)}/100, classificata in categoria ${category}. ` +
                `Questo indica ${riskLevel.toLowerCase()}, con margini di miglioramento nelle aree di efficienza operativa e gestione del circolante.`;
        }
    },

    /**
     * Render IRP related indicators
     */
    renderIRPIndicators() {
        const container = document.getElementById('irpIndicators');
        if (!container) return;

        const indicators = [
            {
                label: 'Leanus Score',
                value: '6.8',
                max: '10',
                type: 'success'
            },
            {
                label: 'Business Category',
                value: 'Standard',
                type: 'info'
            },
            {
                label: 'Rating MCC',
                value: 'BB+',
                type: 'success'
            }
        ];

        container.innerHTML = indicators.map(ind => `
            <div class="col-md-4">
                <div class="kpi-card-v4">
                    <div class="kpi-content" style="text-align: center; width: 100%;">
                        <div class="kpi-label">${ind.label}</div>
                        <div class="kpi-value" style="font-size: 24px;">
                            ${ind.value}${ind.max ? `<span style="font-size: 16px; color: var(--text-secondary);"> / ${ind.max}</span>` : ''}
                        </div>
                    </div>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render profile cards (1.3)
     */
    renderProfileCards() {
        const container = document.getElementById('profileGrid');
        if (!container) return;

        const company = this.data.company || {};

        const profiles = [
            {
                title: 'Dati Identificativi',
                icon: 'fa-id-card',
                items: [
                    { label: 'Ragione Sociale', value: company.name || 'VAROLI GUIDO E FIGLIO S.R.L.' },
                    { label: 'Codice Fiscale', value: company.fiscalCode || '00191770360' },
                    { label: 'Partita IVA', value: company.vat || '00191770360' },
                    { label: 'Sede Legale', value: company.address || 'Via Emilia Ovest, 1527 - 41123 Modena (MO)' }
                ]
            },
            {
                title: 'Operatività',
                icon: 'fa-industry',
                items: [
                    { label: 'Settore', value: company.sector || 'Produzione macchine per l\'industria' },
                    { label: 'ATECO', value: company.ateco || '28.99.09' },
                    { label: 'Dipendenti', value: company.employees || '7' },
                    { label: 'Anno costituzione', value: company.foundingYear || '1958' }
                ]
            },
            {
                title: 'Governance',
                icon: 'fa-users',
                items: [
                    { label: 'Forma Giuridica', value: company.legalForm || 'S.R.L.' },
                    { label: 'Amministratore', value: company.ceo || 'Varoli Mauro' },
                    { label: 'Capitale Sociale', value: Utils.formatCurrency(company.shareCapital || 10000) },
                    { label: 'Revisore', value: company.auditor || 'Non presente' }
                ]
            }
        ];

        container.innerHTML = profiles.map(profile => `
            <div class="profile-section-restored">
                <div class="profile-section-title">
                    <i class="fas ${profile.icon}"></i>
                    ${profile.title}
                </div>
                ${profile.items.map(item => `
                    <div class="profile-item">
                        <div class="profile-label">${item.label}</div>
                        <div class="profile-value">${item.value}</div>
                    </div>
                `).join('')}
            </div>
        `).join('');
    },

    /**
     * Render SWOT cards (1.4)
     */
    renderSWOTCards() {
        const container = document.getElementById('swotGrid');
        if (!container) return;

        const swotData = this.data.content?.parte1_sintesi?.swot || {};

        const swotCards = [
            {
                type: 'strengths',
                title: 'Punti di Forza',
                icon: 'fa-thumbs-up',
                items: swotData.strengths || [
                    'Redditività elevata (ROE 40,9%)',
                    'Forte crescita dell\'utile netto (+131%)',
                    'Patrimonio netto in consolidamento (+69%)',
                    'Solidità patrimoniale eccellente',
                    'Esperienza consolidata nel settore (dal 1958)'
                ]
            },
            {
                type: 'weaknesses',
                title: 'Punti di Debolezza',
                icon: 'fa-thumbs-down',
                items: swotData.weaknesses || [
                    'Dipendenza da credito bancario a breve termine',
                    'Ciclo del circolante lungo (204 giorni)',
                    'DSO elevato (173 giorni di incasso)',
                    'Dimensione aziendale contenuta',
                    'Governance semplificata'
                ]
            },
            {
                type: 'opportunities',
                title: 'Opportunità',
                icon: 'fa-lightbulb',
                items: swotData.opportunities || [
                    'Ottimizzazione gestione crediti commerciali',
                    'Diversificazione fonti di finanziamento',
                    'Espansione mercato di riferimento',
                    'Digitalizzazione processi aziendali',
                    'Accesso a nuove linee di credito agevolato'
                ]
            },
            {
                type: 'threats',
                title: 'Minacce',
                icon: 'fa-exclamation-triangle',
                items: swotData.threats || [
                    'Volatilità mercato di riferimento',
                    'Aumento costi materie prime',
                    'Pressione competitiva crescente',
                    'Rischio concentrazione clientela',
                    'Possibili tensioni di liquidità'
                ]
            }
        ];

        container.innerHTML = swotCards.map(card => `
            <div class="swot-card-restored">
                <div class="swot-card-header ${card.type}">
                    <i class="fas ${card.icon}"></i>
                    <span>${card.title}</span>
                </div>
                <div class="swot-card-body">
                    <ul>
                        ${card.items.map(item => `<li>${item}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');
    },

    /**
     * Render priority actions table (1.5)
     */
    renderPriorityActionsTable() {
        const container = document.getElementById('priorityActionsTable');
        if (!container) return;

        const actions = this.data.tables?.parte1_sintesi?.priorityActions || [
            {
                priority: 'Alta',
                area: 'Gestione Crediti',
                action: 'Ridurre DSO da 173 a 120 giorni',
                impact: 'Liberare €150K di liquidità',
                timeframe: '6 mesi'
            },
            {
                priority: 'Alta',
                area: 'Finanziamento',
                action: 'Negoziare linea M/L termine',
                impact: 'Stabilizzare struttura finanziaria',
                timeframe: '3 mesi'
            },
            {
                priority: 'Media',
                area: 'Efficienza Operativa',
                action: 'Ottimizzare ciclo produttivo',
                impact: 'Migliorare marginalità +2%',
                timeframe: '9 mesi'
            },
            {
                priority: 'Media',
                area: 'Governance',
                action: 'Implementare reporting mensile',
                impact: 'Migliore controllo di gestione',
                timeframe: '3 mesi'
            },
            {
                priority: 'Bassa',
                area: 'Diversificazione',
                action: 'Valutare nuovi mercati geografici',
                impact: 'Ridurre dipendenza mercato locale',
                timeframe: '12 mesi'
            }
        ];

        const getPriorityBadge = (priority) => {
            const badges = {
                'Alta': 'danger',
                'Media': 'warning',
                'Bassa': 'info'
            };
            return badges[priority] || 'info';
        };

        container.innerHTML = `
            <thead>
                <tr>
                    <th>Priorità</th>
                    <th>Area</th>
                    <th>Azione</th>
                    <th>Impatto Atteso</th>
                    <th class="text-center">Timeframe</th>
                </tr>
            </thead>
            <tbody>
                ${actions.map(action => `
                    <tr>
                        <td>
                            <span class="badge ${getPriorityBadge(action.priority)}">${action.priority}</span>
                        </td>
                        <td class="fw-semibold">${action.area}</td>
                        <td>${action.action}</td>
                        <td>${action.impact}</td>
                        <td class="text-center">${action.timeframe}</td>
                    </tr>
                `).join('')}
            </tbody>
        `;
    }
};

// Initialize when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    Parte1Sintesi.init();
});
