const Parte6Rischi = {
    data: null,
    async init() {
        try {
            await App.init();
            this.data = App.getData();
            this.renderRiskMatrix();
            this.renderRecommendations();
            this.renderActionPlan();
        } catch (error) {
            console.error('Error initializing Parte 6:', error);
        }
    },
    renderRiskMatrix() {
        const container = document.getElementById('riskMatrixTable');
        if (!container) return;
        const riskData = this.data.tables?.parte6_rischi?.riskMatrix;
        if (riskData) {
            TableRenderer.renderTable(container, riskData);
        } else {
            container.innerHTML = '<thead><tr><th>Rischio</th><th class="text-center">Probabilità</th><th class="text-center">Impatto</th><th class="text-center">Priorità</th><th class="text-center">Stato</th></tr></thead><tbody><tr><td>EBITDA negativo - Perdita operativa</td><td class="text-center">Alta</td><td class="text-center">Critico</td><td class="text-center"><span class="badge danger">Critico</span></td><td class="text-center"><span class="badge warning">In gestione</span></td></tr><tr><td>Elevato indebitamento finanziario</td><td class="text-center">Alta</td><td class="text-center">Alto</td><td class="text-center"><span class="badge danger">Alto</span></td><td class="text-center"><span class="badge info">Monitorato</span></td></tr><tr><td>Ciclo circolante inefficiente (194gg magazzino)</td><td class="text-center">Media</td><td class="text-center">Alto</td><td class="text-center"><span class="badge warning">Medio</span></td><td class="text-center"><span class="badge info">Monitorato</span></td></tr><tr><td>Dipendenza settore edilizio</td><td class="text-center">Media</td><td class="text-center">Medio</td><td class="text-center"><span class="badge warning">Medio</span></td><td class="text-center"><span class="badge success">Accettato</span></td></tr></tbody>';
        }
    },
    renderRecommendations() {
        const container = document.getElementById('recommendationsContainer');
        if (!container) return;
        const recommendations = [
            {
                title: 'Urgente: Ripristino Redditività Operativa',
                priority: 'danger',
                description: this.data.content?.parte6_rischi?.recommendations?.[0]?.description || 'Implementare azioni immediate per riportare EBITDA in positivo attraverso revisione pricing e ottimizzazione costi.',
                actions: this.data.content?.parte6_rischi?.recommendations?.[0]?.actions || [
                    'Analisi dettagliata struttura costi per individuare inefficienze',
                    'Revisione politica pricing con focus su marginalità',
                    'Negoziazione condizioni con fornitori principali',
                    'Riduzione costi fissi non strategici'
                ]
            },
            {
                title: 'Ottimizzazione Gestione Magazzino',
                priority: 'warning',
                description: this.data.content?.parte6_rischi?.recommendations?.[1]?.description || 'Ridurre giorni di giacenza magazzino (DIO) da 194 a 90 giorni per liberare capitale circolante.',
                actions: this.data.content?.parte6_rischi?.recommendations?.[1]?.actions || [
                    'Implementazione sistema gestione scorte (modello EOQ)',
                    'Analisi ABC su categorie merceologiche',
                    'Eliminazione stock obsoleto',
                    'Accordi con fornitori per consegne just-in-time'
                ]
            },
            {
                title: 'Ristrutturazione Debito Finanziario',
                priority: 'warning',
                description: this.data.content?.parte6_rischi?.recommendations?.[2]?.description || 'Ridurre dipendenza da debito bancario a breve termine e ristrutturare PFN.',
                actions: this.data.content?.parte6_rischi?.recommendations?.[2]?.actions || [
                    'Negoziazione consolidamento debiti a breve in M/L termine',
                    'Valutazione dismissione asset non strategici',
                    'Ricerca fonti finanziamento alternative',
                    'Implementazione piano rimborso strutturato'
                ]
            }
        ];
        container.innerHTML = recommendations.map(rec => '<div class="alert-box ' + rec.priority + '"><div class="alert-title">' + rec.title + '</div><div class="alert-content"><p>' + rec.description + '</p><strong style="display: block; margin-top: 12px; margin-bottom: 8px;">Azioni specifiche:</strong><ul style="margin: 0; padding-left: 20px;">' + rec.actions.map(action => '<li>' + action + '</li>').join('') + '</ul></div></div>').join('');
    },
    renderActionPlan() {
        const container = document.getElementById('actionPlanTable');
        if (!container) return;
        const actionsData = this.data.tables?.parte1_sintesi?.priorityActions?.rows || [];
        if (actionsData.length > 0) {
            const rows = actionsData.map(action => ({
                cells: [
                    { value: action.action },
                    { value: action.area },
                    { value: 'Q1-Q2 2025', align: 'text-center' },
                    { value: '15000', type: 'currency' },
                    { value: { type: 'badge', text: 'In corso' }, align: 'text-center' }
                ]
            }));
            TableRenderer.renderTable(container, {
                columns: [
                    { label: 'Azione', width: '35%' },
                    { label: 'Area', width: '20%' },
                    { label: 'Scadenza', align: 'text-center', width: '15%' },
                    { label: 'Budget', align: 'text-right', width: '15%' },
                    { label: 'Stato', align: 'text-center', width: '15%' }
                ],
                rows: rows
            });
        } else {
            container.innerHTML = '<thead><tr><th>Azione</th><th>Responsabile</th><th class="text-center">Scadenza</th><th class="text-right">Budget</th><th class="text-center">Stato</th></tr></thead><tbody><tr><td>Ripristino redditività operativa</td><td>CFO / Direzione</td><td class="text-center">Q2 2025</td><td class="text-right">€50.000</td><td class="text-center"><span class="badge danger">Critico</span></td></tr><tr><td>Ottimizzazione magazzino</td><td>Operations</td><td class="text-center">Q1 2025</td><td class="text-right">€15.000</td><td class="text-center"><span class="badge warning">In corso</span></td></tr><tr><td>Ristrutturazione debito</td><td>CFO</td><td class="text-center">Q1 2025</td><td class="text-right">€10.000</td><td class="text-center"><span class="badge warning">Pianificato</span></td></tr></tbody>';
        }
    }
};
document.addEventListener('DOMContentLoaded', () => { Parte6Rischi.init(); });
