// Enhanced NBA Explorer - Professional Analytics Dashboard
// This replaces the basic explorer with a comprehensive data exploration tool

class NBAAdvancedExplorer {
    constructor() {
        this.data = {};
        this.currentAnalysis = 'player_evolution';
        this.selectedPlayers = ['Stephen Curry'];
        this.selectedTeams = [];
        this.timeRange = { start: 2004, end: 2024 };
        this.chartDimensions = { width: 900, height: 500 };
        this.animationDuration = 750;
        
        // Advanced color scheme
        this.colors = {
            primary: ['#ea580c', '#dc2626', '#7c3aed', '#059669', '#0284c7'],
            accent: '#f59e0b',
            background: '#f8fafc',
            grid: '#e2e8f0',
            text: '#0f172a'
        };
        
        this.chartTypes = {
            player_evolution: 'Player Performance Evolution',
            player_comparison: 'Multi-Player Comparison',
            team_evolution: 'Team Strategy Evolution', 
            league_analysis: 'League-Wide Analysis',
            shot_distribution: 'Shot Distribution Analysis',
            efficiency_matrix: 'Efficiency Matrix',
            trend_correlation: 'Trend Correlation Analysis',
            performance_radar: 'Performance Radar Chart'
        };
    }
    
    async initialize() {
        console.log('🚀 Initializing Enhanced NBA Explorer...');
        
        try {
            // Load comprehensive datasets
            await this.loadData();
            
            // Setup advanced UI components
            this.setupAdvancedInterface();
            
            // Initialize default visualization
            this.renderVisualization();
            
            console.log('✅ Enhanced Explorer initialized successfully');
            
        } catch (error) {
            console.error('❌ Error initializing Enhanced Explorer:', error);
            this.showError(error.message);
        }
    }
    
    async loadData() {
        console.log('📊 Loading comprehensive datasets...');
        
        const datasets = await Promise.all([
            d3.json('data/comprehensive_player_data.json'),
            d3.json('data/comprehensive_team_data.json'),
            d3.json('data/scene4_data.json'),
            d3.json('data/comprehensive_league_data.json')
        ]);
        
        this.data = {
            players: datasets[0],
            teams: datasets[1], 
            explorer: datasets[2],
            league: datasets[3]
        };
        
        // Process data for advanced analytics
        this.processAdvancedMetrics();
        
        console.log(`✅ Loaded data for ${this.data.players.length} players and ${this.data.teams.length} teams`);
    }
    
    processAdvancedMetrics() {
        console.log('🔬 Processing advanced analytics...');
        
        // Calculate advanced player metrics
        this.data.players.forEach(player => {
            player.seasons.forEach((season, index) => {
                // Career progression metrics
                if (index > 0) {
                    const previous = player.seasons[index - 1];
                    season.three_pt_growth = season.three_pt_rate - previous.three_pt_rate;
                    season.efficiency_growth = season.three_pt_percentage - previous.three_pt_percentage;
                    season.volume_growth = season.three_pt_shots - previous.three_pt_shots;
                }
                
                // Advanced efficiency metrics
                season.true_shooting = this.calculateTrueShootingPercentage(season);
                season.effective_fg = this.calculateEffectiveFG(season);
                season.impact_score = this.calculateImpactScore(season);
                season.consistency_rating = this.calculateConsistency(player.seasons, index);
            });
            
            // Career summary metrics
            player.career_summary = this.calculateCareerSummary(player.seasons);
        });
        
        // Calculate league benchmarks
        this.data.benchmarks = this.calculateLeagueBenchmarks();
        
        // Create correlation matrices
        this.data.correlations = this.calculateCorrelations();
    }
    
    calculateTrueShootingPercentage(season) {
        // Simplified TS% calculation (would need free throw data for exact)
        const fgm = season.total_shots * (season.fg_percentage || 45) / 100;
        const threepm = season.made_threes || season.three_pt_shots * (season.three_pt_percentage || 35) / 100;
        const twopm = fgm - threepm;
        const points = (twopm * 2) + (threepm * 3);
        return (points / (2 * season.total_shots)) * 100;
    }
    
    calculateEffectiveFG(season) {
        const fgm = season.total_shots * (season.fg_percentage || 45) / 100;
        const threepm = season.made_threes || season.three_pt_shots * (season.three_pt_percentage || 35) / 100;
        return ((fgm + 0.5 * threepm) / season.total_shots) * 100;
    }
    
    calculateImpactScore(season) {
        // Custom impact metric combining volume and efficiency
        const volumeScore = Math.min(season.three_pt_shots / 300, 1) * 50; // Normalize to 50 max
        const efficiencyScore = Math.min(season.three_pt_percentage / 45, 1) * 50; // Normalize to 50 max
        return volumeScore + efficiencyScore;
    }
    
    calculateConsistency(seasons, currentIndex) {
        if (currentIndex < 2) return 50; // Default for early career
        
        const recentSeasons = seasons.slice(Math.max(0, currentIndex - 2), currentIndex + 1);
        const rates = recentSeasons.map(s => s.three_pt_rate);
        const mean = rates.reduce((a, b) => a + b) / rates.length;
        const variance = rates.reduce((a, b) => a + Math.pow(b - mean, 2), 0) / rates.length;
        const stdDev = Math.sqrt(variance);
        
        // Convert to 0-100 scale (lower std dev = higher consistency)
        return Math.max(0, 100 - stdDev * 10);
    }
    
    calculateCareerSummary(seasons) {
        return {
            total_seasons: seasons.length,
            peak_three_pt_rate: Math.max(...seasons.map(s => s.three_pt_rate)),
            peak_efficiency: Math.max(...seasons.map(s => s.three_pt_percentage)),
            total_threes: seasons.reduce((sum, s) => sum + (s.made_threes || 0), 0),
            career_progression: seasons.length > 1 ? 
                seasons[seasons.length - 1].three_pt_rate - seasons[0].three_pt_rate : 0,
            prime_years: seasons.filter(s => s.three_pt_rate > 35 && s.three_pt_percentage > 35).length
        };
    }
    
    calculateLeagueBenchmarks() {
        // Calculate percentile benchmarks across all players and seasons
        const allSeasons = this.data.players.flatMap(p => p.seasons);
        
        const metrics = ['three_pt_rate', 'three_pt_percentage', 'total_shots'];
        const benchmarks = {};
        
        metrics.forEach(metric => {
            const values = allSeasons.map(s => s[metric]).filter(v => v != null).sort((a, b) => a - b);
            benchmarks[metric] = {
                p10: this.percentile(values, 10),
                p25: this.percentile(values, 25),
                p50: this.percentile(values, 50),
                p75: this.percentile(values, 75),
                p90: this.percentile(values, 90),
                p95: this.percentile(values, 95)
            };
        });
        
        return benchmarks;
    }
    
    percentile(arr, p) {
        const index = (p / 100) * (arr.length - 1);
        if (Math.floor(index) === index) {
            return arr[index];
        } else {
            const lower = arr[Math.floor(index)];
            const upper = arr[Math.ceil(index)];
            return lower + (upper - lower) * (index - Math.floor(index));
        }
    }
    
    calculateCorrelations() {
        // Calculate correlations between different metrics
        const allSeasons = this.data.players.flatMap(p => p.seasons);
        
        const correlations = {};
        const metrics = ['three_pt_rate', 'three_pt_percentage', 'total_shots', 'impact_score'];
        
        for (let i = 0; i < metrics.length; i++) {
            for (let j = i + 1; j < metrics.length; j++) {
                const metric1 = metrics[i];
                const metric2 = metrics[j];
                
                const pairs = allSeasons
                    .filter(s => s[metric1] != null && s[metric2] != null)
                    .map(s => [s[metric1], s[metric2]]);
                
                if (pairs.length > 10) {
                    correlations[`${metric1}_vs_${metric2}`] = this.pearsonCorrelation(pairs);
                }
            }
        }
        
        return correlations;
    }
    
    pearsonCorrelation(pairs) {
        const n = pairs.length;
        const sumX = pairs.reduce((sum, [x, y]) => sum + x, 0);
        const sumY = pairs.reduce((sum, [x, y]) => sum + y, 0);
        const sumXY = pairs.reduce((sum, [x, y]) => sum + x * y, 0);
        const sumX2 = pairs.reduce((sum, [x, y]) => sum + x * x, 0);
        const sumY2 = pairs.reduce((sum, [x, y]) => sum + y * y, 0);
        
        const numerator = n * sumXY - sumX * sumY;
        const denominator = Math.sqrt((n * sumX2 - sumX * sumX) * (n * sumY2 - sumY * sumY));
        
        return denominator === 0 ? 0 : numerator / denominator;
    }
    
    setupAdvancedInterface() {
        console.log('🎨 Setting up advanced interface...');
        
        // Create main explorer container
        const explorerContainer = d3.select('#explorer-dashboard');
        
        // Clear existing content
        explorerContainer.selectAll('*').remove();
        
        // Create advanced layout
        const layout = explorerContainer.append('div')
            .attr('class', 'advanced-explorer-layout');
        
        // Control Panel
        this.createAdvancedControlPanel(layout);
        
        // Main visualization area
        this.createAdvancedVisualizationArea(layout);
        
        // Statistics panel
        this.createAdvancedStatsPanel(layout);
        
        // Initialize with default state
        this.updateInterface();
    }
    
    createAdvancedControlPanel(container) {
        const controlPanel = container.append('div')
            .attr('class', 'advanced-control-panel');
        
        // Analysis type selector
        const analysisSection = controlPanel.append('div')
            .attr('class', 'control-section');
        
        analysisSection.append('h3')
            .text('🔬 Analysis Type');
        
        const analysisGrid = analysisSection.append('div')
            .attr('class', 'analysis-type-grid');
        
        Object.entries(this.chartTypes).forEach(([key, label]) => {
            const button = analysisGrid.append('button')
                .attr('class', `analysis-type-btn ${key === this.currentAnalysis ? 'active' : ''}`)
                .attr('data-analysis', key)
                .text(label);
            
            button.on('click', () => {
                this.currentAnalysis = key;
                this.updateInterface();
                this.renderVisualization();
            });
        });
        
        // Advanced player selection
        this.createAdvancedPlayerSelection(controlPanel);
        
        // Advanced time controls
        this.createAdvancedTimeControls(controlPanel);
        
        // Metric controls
        this.createMetricControls(controlPanel);
    }
    
    createAdvancedPlayerSelection(container) {
        const playerSection = container.append('div')
            .attr('class', 'control-section');
        
        playerSection.append('h3')
            .text('🏀 Player Selection');
        
        // Smart search with autocomplete
        const searchContainer = playerSection.append('div')
            .attr('class', 'smart-search-container');
        
        const searchInput = searchContainer.append('input')
            .attr('type', 'text')
            .attr('placeholder', 'Search players by name, position, or team...')
            .attr('class', 'smart-search-input');
        
        const suggestionsContainer = searchContainer.append('div')
            .attr('class', 'search-suggestions');
        
        // Player categories
        const categoriesContainer = playerSection.append('div')
            .attr('class', 'player-categories');
        
        const categories = [
            { key: 'elite_shooters', label: '🎯 Elite Shooters', filter: p => p.career_summary.peak_efficiency > 40 },
            { key: 'volume_shooters', label: '🔥 Volume Shooters', filter: p => p.career_summary.peak_three_pt_rate > 40 },
            { key: 'mvp_candidates', label: '👑 MVP Candidates', filter: p => p.seasons.some(s => s.impact_score > 80) },
            { key: 'rookies', label: '🌟 Rising Stars', filter: p => p.seasons.length <= 3 }
        ];
        
        categories.forEach(category => {
            const btn = categoriesContainer.append('button')
                .attr('class', 'category-btn')
                .text(category.label);
            
            btn.on('click', () => {
                const players = this.data.players.filter(category.filter);
                this.selectedPlayers = players.slice(0, 5).map(p => p.player);
                this.updateInterface();
                this.renderVisualization();
            });
        });
        
        // Selected players display
        this.createSelectedPlayersDisplay(playerSection);
    }
    
    createSelectedPlayersDisplay(container) {
        const selectedContainer = container.append('div')
            .attr('class', 'selected-players-container');
        
        selectedContainer.append('h4')
            .text('Selected Players:');
        
        const playersGrid = selectedContainer.append('div')
            .attr('class', 'selected-players-grid')
            .attr('id', 'selected-players-grid');
    }
    
    createAdvancedTimeControls(container) {
        const timeSection = container.append('div')
            .attr('class', 'control-section');
        
        timeSection.append('h3')
            .text('📅 Time Period Analysis');
        
        // Era selector
        const erasContainer = timeSection.append('div')
            .attr('class', 'eras-container');
        
        const eras = [
            { label: 'Pre-Analytics (2004-2010)', start: 2004, end: 2010 },
            { label: 'Early Analytics (2011-2015)', start: 2011, end: 2015 },
            { label: 'Curry Era (2016-2020)', start: 2016, end: 2020 },
            { label: 'Modern NBA (2021-2024)', start: 2021, end: 2024 },
            { label: 'Full Timeline', start: 2004, end: 2024 }
        ];
        
        eras.forEach(era => {
            const btn = erasContainer.append('button')
                .attr('class', 'era-btn')
                .text(era.label);
            
            btn.on('click', () => {
                this.timeRange = { start: era.start, end: era.end };
                this.updateInterface();
                this.renderVisualization();
            });
        });
        
        // Custom range sliders
        const rangeContainer = timeSection.append('div')
            .attr('class', 'range-sliders-container');
        
        // Start year slider
        rangeContainer.append('label').text('Start Year:');
        const startSlider = rangeContainer.append('input')
            .attr('type', 'range')
            .attr('min', 2004)
            .attr('max', 2024)
            .attr('value', this.timeRange.start)
            .attr('class', 'year-range-slider');
        
        const startLabel = rangeContainer.append('span')
            .attr('class', 'year-label')
            .text(this.timeRange.start);
        
        startSlider.on('input', () => {
            this.timeRange.start = parseInt(startSlider.property('value'));
            startLabel.text(this.timeRange.start);
            this.renderVisualization();
        });
        
        // End year slider
        rangeContainer.append('label').text('End Year:');
        const endSlider = rangeContainer.append('input')
            .attr('type', 'range')
            .attr('min', 2004)
            .attr('max', 2024)
            .attr('value', this.timeRange.end)
            .attr('class', 'year-range-slider');
        
        const endLabel = rangeContainer.append('span')
            .attr('class', 'year-label')
            .text(this.timeRange.end);
        
        endSlider.on('input', () => {
            this.timeRange.end = parseInt(endSlider.property('value'));
            endLabel.text(this.timeRange.end);
            this.renderVisualization();
        });
    }
    
    createMetricControls(container) {
        const metricSection = container.append('div')
            .attr('class', 'control-section');
        
        metricSection.append('h3')
            .text('📊 Analysis Metrics');
        
        const metricsGrid = metricSection.append('div')
            .attr('class', 'metrics-grid');
        
        const metrics = [
            { key: 'volume', label: '📈 Volume', desc: 'Shot attempts and frequency' },
            { key: 'efficiency', label: '🎯 Efficiency', desc: 'Shooting percentages and accuracy' },
            { key: 'impact', label: '💪 Impact', desc: 'Overall contribution to team success' },
            { key: 'consistency', label: '⚖️ Consistency', desc: 'Performance stability over time' }
        ];
        
        metrics.forEach(metric => {
            const card = metricsGrid.append('div')
                .attr('class', 'metric-card')
                .attr('data-metric', metric.key);
            
            card.append('div')
                .attr('class', 'metric-icon')
                .text(metric.label);
            
            card.append('div')
                .attr('class', 'metric-desc')
                .text(metric.desc);
            
            card.on('click', () => {
                // Toggle metric selection logic
                this.renderVisualization();
            });
        });
    }
    
    createAdvancedVisualizationArea(container) {
        const vizArea = container.append('div')
            .attr('class', 'advanced-visualization-area');
        
        // Chart header with controls
        const chartHeader = vizArea.append('div')
            .attr('class', 'chart-header');
        
        const chartTitle = chartHeader.append('h2')
            .attr('id', 'advanced-chart-title')
            .text('Player Performance Evolution');
        
        const chartControls = chartHeader.append('div')
            .attr('class', 'chart-controls');
        
        // Chart options
        const optionsContainer = chartControls.append('div')
            .attr('class', 'chart-options');
        
        ['line', 'area', 'scatter', 'heatmap'].forEach(type => {
            optionsContainer.append('button')
                .attr('class', 'chart-option-btn')
                .attr('data-chart-type', type)
                .text(type.charAt(0).toUpperCase() + type.slice(1));
        });
        
        // Export controls
        const exportContainer = chartControls.append('div')
            .attr('class', 'export-controls');
        
        exportContainer.append('button')
            .attr('class', 'export-btn')
            .text('📊 Export PNG')
            .on('click', () => this.exportChart('png'));
        
        exportContainer.append('button')
            .attr('class', 'export-btn')
            .text('📈 Export SVG')
            .on('click', () => this.exportChart('svg'));
        
        // Main chart container
        const chartContainer = vizArea.append('div')
            .attr('class', 'main-chart-container');
        
        chartContainer.append('svg')
            .attr('id', 'advanced-main-chart')
            .attr('width', this.chartDimensions.width)
            .attr('height', this.chartDimensions.height);
        
        // Chart insights panel
        chartContainer.append('div')
            .attr('class', 'chart-insights')
            .attr('id', 'chart-insights');
    }
    
    createAdvancedStatsPanel(container) {
        const statsPanel = container.append('div')
            .attr('class', 'advanced-stats-panel');
        
        statsPanel.append('h3')
            .text('📊 Advanced Analytics');
        
        // Real-time statistics
        const realtimeStats = statsPanel.append('div')
            .attr('class', 'realtime-stats')
            .attr('id', 'realtime-stats');
        
        // Comparison matrix
        const comparisonMatrix = statsPanel.append('div')
            .attr('class', 'comparison-matrix')
            .attr('id', 'comparison-matrix');
        
        // League context
        const leagueContext = statsPanel.append('div')
            .attr('class', 'league-context')
            .attr('id', 'league-context');
    }
    
    updateInterface() {
        // Update all interface elements based on current state
        this.updateSelectedPlayersDisplay();
        this.updateChartTitle();
        this.updateActiveButtons();
    }
    
    updateSelectedPlayersDisplay() {
        const container = d3.select('#selected-players-grid');
        
        // Clear existing
        container.selectAll('*').remove();
        
        // Add selected players
        const playerCards = container.selectAll('.player-card')
            .data(this.selectedPlayers)
            .enter()
            .append('div')
            .attr('class', 'player-card');
        
        playerCards.append('span')
            .attr('class', 'player-name')
            .text(d => d);
        
        playerCards.append('button')
            .attr('class', 'remove-player-btn')
            .text('×')
            .on('click', (event, d) => {
                this.selectedPlayers = this.selectedPlayers.filter(p => p !== d);
                this.updateInterface();
                this.renderVisualization();
            });
    }
    
    updateChartTitle() {
        d3.select('#advanced-chart-title')
            .text(this.chartTypes[this.currentAnalysis] || 'Advanced Analysis');
    }
    
    updateActiveButtons() {
        // Update analysis type buttons
        d3.selectAll('.analysis-type-btn')
            .classed('active', false);
        
        d3.select(`[data-analysis="${this.currentAnalysis}"]`)
            .classed('active', true);
    }
    
    renderVisualization() {
        console.log(`🎨 Rendering ${this.currentAnalysis} visualization...`);
        
        // Clear previous chart
        d3.select('#advanced-main-chart').selectAll('*').remove();
        
        // Route to appropriate visualization method
        switch (this.currentAnalysis) {
            case 'player_evolution':
                this.renderPlayerEvolution();
                break;
            case 'player_comparison':
                this.renderPlayerComparison();
                break;
            case 'team_evolution':
                this.renderTeamEvolution();
                break;
            case 'league_analysis':
                this.renderLeagueAnalysis();
                break;
            case 'shot_distribution':
                this.renderShotDistribution();
                break;
            case 'efficiency_matrix':
                this.renderEfficiencyMatrix();
                break;
            case 'trend_correlation':
                this.renderTrendCorrelation();
                break;
            case 'performance_radar':
                this.renderPerformanceRadar();
                break;
            default:
                this.renderPlayerEvolution();
        }
        
        // Update statistics panel
        this.updateStatisticsPanel();
        
        // Update insights
        this.updateInsights();
    }
    
    renderPlayerEvolution() {
        const svg = d3.select('#advanced-main-chart');
        const margin = { top: 40, right: 120, bottom: 60, left: 80 };
        const width = this.chartDimensions.width - margin.left - margin.right;
        const height = this.chartDimensions.height - margin.top - margin.bottom;
        
        const g = svg.append('g')
            .attr('transform', `translate(${margin.left},${margin.top})`);
        
        // Filter data for selected players and time range
        const filteredData = this.selectedPlayers.map(playerName => {
            const player = this.data.players.find(p => p.player === playerName);
            if (!player) return null;
            
            const seasons = player.seasons.filter(s => 
                s.season >= this.timeRange.start && s.season <= this.timeRange.end
            );
            
            return { player: playerName, seasons };
        }).filter(d => d && d.seasons.length > 0);
        
        if (filteredData.length === 0) {
            g.append('text')
                .attr('x', width / 2)
                .attr('y', height / 2)
                .attr('text-anchor', 'middle')
                .style('font-size', '18px')
                .style('fill', '#64748b')
                .text('No data available for selected players and time range');
            return;
        }
        
        // Create scales
        const allSeasons = filteredData.flatMap(d => d.seasons);
        const xScale = d3.scaleLinear()
            .domain(d3.extent(allSeasons, d => d.season))
            .range([0, width]);
        
        const yScale = d3.scaleLinear()
            .domain([0, d3.max(allSeasons, d => d.three_pt_rate) * 1.1])
            .range([height, 0]);
        
        const colorScale = d3.scaleOrdinal()
            .domain(this.selectedPlayers)
            .range(this.colors.primary);
        
        // Add grid
        const xGrid = g.append('g')
            .attr('class', 'grid')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale)
                .tickSize(-height)
                .tickFormat('')
            );
        
        const yGrid = g.append('g')
            .attr('class', 'grid')
            .call(d3.axisLeft(yScale)
                .tickSize(-width)
                .tickFormat('')
            );
        
        xGrid.selectAll('line')
            .style('stroke', this.colors.grid)
            .style('stroke-width', 1);
        
        yGrid.selectAll('line')
            .style('stroke', this.colors.grid)
            .style('stroke-width', 1);
        
        // Create line generator
        const line = d3.line()
            .x(d => xScale(d.season))
            .y(d => yScale(d.three_pt_rate))
            .curve(d3.curveMonotoneX);
        
        // Add lines for each player
        filteredData.forEach((player, index) => {
            const playerGroup = g.append('g')
                .attr('class', `player-group player-${index}`);
            
            // Line path
            const path = playerGroup.append('path')
                .datum(player.seasons)
                .attr('class', 'evolution-line')
                .attr('d', line)
                .style('fill', 'none')
                .style('stroke', colorScale(player.player))
                .style('stroke-width', 3)
                .style('opacity', 0.8);
            
            // Animate line drawing
            const totalLength = path.node().getTotalLength();
            path.attr('stroke-dasharray', totalLength + ' ' + totalLength)
                .attr('stroke-dashoffset', totalLength)
                .transition()
                .duration(this.animationDuration)
                .delay(index * 200)
                .attr('stroke-dashoffset', 0);
            
            // Add points
            const points = playerGroup.selectAll('.evolution-point')
                .data(player.seasons)
                .enter()
                .append('circle')
                .attr('class', 'evolution-point')
                .attr('cx', d => xScale(d.season))
                .attr('cy', d => yScale(d.three_pt_rate))
                .attr('r', 0)
                .style('fill', colorScale(player.player))
                .style('stroke', 'white')
                .style('stroke-width', 2);
            
            // Animate points
            points.transition()
                .duration(300)
                .delay((d, i) => (index * 200) + i * 50 + this.animationDuration)
                .attr('r', 5);
            
            // Add hover interactions
            points.on('mouseover', (event, d) => {
                this.showAdvancedTooltip(event, d, player.player);
            })
            .on('mouseout', () => {
                this.hideAdvancedTooltip();
            });
        });
        
        // Add axes
        g.append('g')
            .attr('class', 'x-axis')
            .attr('transform', `translate(0,${height})`)
            .call(d3.axisBottom(xScale).tickFormat(d3.format('d')))
            .style('font-size', '12px');
        
        g.append('g')
            .attr('class', 'y-axis')
            .call(d3.axisLeft(yScale))
            .style('font-size', '12px');
        
        // Add axis labels
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height + 45)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .text('Season');
        
        g.append('text')
            .attr('transform', 'rotate(-90)')
            .attr('x', -height / 2)
            .attr('y', -50)
            .attr('text-anchor', 'middle')
            .style('font-size', '14px')
            .style('font-weight', '600')
            .text('Three-Point Rate (%)');
        
        // Add legend
        this.addAdvancedLegend(svg, colorScale, filteredData);
        
        // Add benchmark lines
        this.addBenchmarkLines(g, yScale, width);
    }
    
    addAdvancedLegend(svg, colorScale, data) {
        const legend = svg.append('g')
            .attr('class', 'advanced-legend')
            .attr('transform', `translate(${this.chartDimensions.width - 100}, 60)`);
        
        const legendItems = legend.selectAll('.legend-item')
            .data(data)
            .enter()
            .append('g')
            .attr('class', 'legend-item')
            .attr('transform', (d, i) => `translate(0, ${i * 25})`);
        
        legendItems.append('line')
            .attr('x1', 0)
            .attr('x2', 20)
            .attr('y1', 0)
            .attr('y2', 0)
            .style('stroke', d => colorScale(d.player))
            .style('stroke-width', 3);
        
        legendItems.append('text')
            .attr('x', 25)
            .attr('y', 5)
            .style('font-size', '12px')
            .style('font-weight', '500')
            .text(d => d.player);
    }
    
    addBenchmarkLines(g, yScale, width) {
        const benchmarks = [
            { value: 35, label: 'Elite Threshold', color: '#16a34a' },
            { value: 30, label: 'League Average', color: '#f59e0b' },
            { value: 25, label: 'Below Average', color: '#dc2626' }
        ];
        
        benchmarks.forEach(benchmark => {
            const line = g.append('line')
                .attr('x1', 0)
                .attr('x2', width)
                .attr('y1', yScale(benchmark.value))
                .attr('y2', yScale(benchmark.value))
                .style('stroke', benchmark.color)
                .style('stroke-dasharray', '5,5')
                .style('opacity', 0.6);
            
            g.append('text')
                .attr('x', width - 5)
                .attr('y', yScale(benchmark.value) - 5)
                .attr('text-anchor', 'end')
                .style('font-size', '10px')
                .style('fill', benchmark.color)
                .text(benchmark.label);
        });
    }
    
    // Additional visualization methods would go here...
    renderPlayerComparison() {
        // Multi-dimensional player comparison radar chart
        console.log('Rendering player comparison...');
    }
    
    renderTeamEvolution() {
        // Team strategy evolution over time
        console.log('Rendering team evolution...');
    }
    
    renderLeagueAnalysis() {
        // League-wide trend analysis
        console.log('Rendering league analysis...');
    }
    
    renderShotDistribution() {
        // Shot distribution heatmaps and density plots
        console.log('Rendering shot distribution...');
    }
    
    renderEfficiencyMatrix() {
        // Efficiency vs volume matrix scatter plot
        console.log('Rendering efficiency matrix...');
    }
    
    renderTrendCorrelation() {
        // Correlation analysis between different metrics
        console.log('Rendering trend correlation...');
    }
    
    renderPerformanceRadar() {
        // Multi-metric radar charts
        console.log('Rendering performance radar...');
    }
    
    showAdvancedTooltip(event, data, playerName) {
        const tooltip = d3.select('body').append('div')
            .attr('class', 'advanced-tooltip')
            .style('position', 'absolute')
            .style('background', 'rgba(15, 23, 42, 0.95)')
            .style('color', 'white')
            .style('padding', '12px')
            .style('border-radius', '8px')
            .style('font-size', '12px')
            .style('box-shadow', '0 4px 12px rgba(0,0,0,0.15)')
            .style('pointer-events', 'none')
            .style('opacity', 0);
        
        tooltip.html(`
            <div style="font-weight: 600; margin-bottom: 8px;">${playerName}</div>
            <div><strong>Season:</strong> ${data.season}</div>
            <div><strong>3PT Rate:</strong> ${data.three_pt_rate.toFixed(1)}%</div>
            <div><strong>3PT %:</strong> ${data.three_pt_percentage?.toFixed(1) || 'N/A'}%</div>
            <div><strong>Made 3s:</strong> ${data.made_threes || 'N/A'}</div>
            <div><strong>Impact Score:</strong> ${data.impact_score?.toFixed(1) || 'N/A'}</div>
        `);
        
        tooltip.style('left', (event.pageX + 10) + 'px')
            .style('top', (event.pageY - 10) + 'px')
            .transition()
            .duration(200)
            .style('opacity', 1);
    }
    
    hideAdvancedTooltip() {
        d3.selectAll('.advanced-tooltip').remove();
    }
    
    updateStatisticsPanel() {
        const statsContainer = d3.select('#realtime-stats');
        statsContainer.selectAll('*').remove();
        
        // Calculate real-time statistics for selected players
        const stats = this.calculateRealTimeStats();
        
        const statCards = statsContainer.selectAll('.stat-card')
            .data(stats)
            .enter()
            .append('div')
            .attr('class', 'stat-card');
        
        statCards.append('div')
            .attr('class', 'stat-value')
            .text(d => d.value);
        
        statCards.append('div')
            .attr('class', 'stat-label')
            .text(d => d.label);
    }
    
    calculateRealTimeStats() {
        // Calculate statistics based on current selection
        const selectedData = this.getSelectedPlayersData();
        
        if (selectedData.length === 0) {
            return [
                { label: 'Selected Players', value: '0' },
                { label: 'Avg 3PT Rate', value: 'N/A' },
                { label: 'Peak Season', value: 'N/A' },
                { label: 'Total 3s Made', value: 'N/A' }
            ];
        }
        
        const allSeasons = selectedData.flatMap(p => p.seasons);
        const avgRate = d3.mean(allSeasons, d => d.three_pt_rate);
        const totalMade = d3.sum(allSeasons, d => d.made_threes || 0);
        const peakSeason = d3.max(allSeasons, d => d.three_pt_rate);
        
        return [
            { label: 'Selected Players', value: selectedData.length },
            { label: 'Avg 3PT Rate', value: `${avgRate.toFixed(1)}%` },
            { label: 'Peak 3PT Rate', value: `${peakSeason.toFixed(1)}%` },
            { label: 'Total 3s Made', value: totalMade.toLocaleString() }
        ];
    }
    
    getSelectedPlayersData() {
        return this.selectedPlayers.map(playerName => {
            const player = this.data.players.find(p => p.player === playerName);
            if (!player) return null;
            
            const seasons = player.seasons.filter(s => 
                s.season >= this.timeRange.start && s.season <= this.timeRange.end
            );
            
            return { player: playerName, seasons };
        }).filter(d => d && d.seasons.length > 0);
    }
    
    updateInsights() {
        const insightsContainer = d3.select('#chart-insights');
        insightsContainer.selectAll('*').remove();
        
        const insights = this.generateInsights();
        
        insights.forEach(insight => {
            const insightCard = insightsContainer.append('div')
                .attr('class', 'insight-card');
            
            insightCard.append('div')
                .attr('class', 'insight-icon')
                .text(insight.icon);
            
            insightCard.append('div')
                .attr('class', 'insight-text')
                .text(insight.text);
        });
    }
    
    generateInsights() {
        const selectedData = this.getSelectedPlayersData();
        const insights = [];
        
        if (selectedData.length === 0) {
            return [{ icon: '💡', text: 'Select players to see insights about their performance and trends.' }];
        }
        
        // Generate dynamic insights based on data
        const allSeasons = selectedData.flatMap(p => p.seasons);
        const avgGrowth = d3.mean(allSeasons.slice(1), (d, i) => {
            const prev = allSeasons[i];
            return prev ? d.three_pt_rate - prev.three_pt_rate : 0;
        });
        
        if (avgGrowth > 2) {
            insights.push({
                icon: '📈',
                text: `Selected players show strong upward trend in 3-point shooting (+${avgGrowth.toFixed(1)}% avg growth).`
            });
        }
        
        const consistentPlayers = selectedData.filter(p => {
            const rates = p.seasons.map(s => s.three_pt_rate);
            const stdDev = d3.deviation(rates);
            return stdDev < 5;
        });
        
        if (consistentPlayers.length > 0) {
            insights.push({
                icon: '⚖️',
                text: `${consistentPlayers.length} player(s) show exceptional consistency in their shooting profile.`
            });
        }
        
        return insights.length > 0 ? insights : [
            { icon: '🔍', text: 'Analyzing selected players for patterns and insights...' }
        ];
    }
    
    exportChart(format) {
        console.log(`Exporting chart as ${format}...`);
        // Implementation for chart export
    }
    
    showError(message) {
        console.error('Enhanced Explorer Error:', message);
        
        const errorContainer = d3.select('#explorer-dashboard');
        errorContainer.selectAll('*').remove();
        
        errorContainer.append('div')
            .attr('class', 'error-message')
            .style('text-align', 'center')
            .style('padding', '40px')
            .style('color', '#dc2626')
            .html(`
                <h2>⚠️ Error Loading Enhanced Explorer</h2>
                <p>${message}</p>
                <button onclick="location.reload()">🔄 Refresh Page</button>
            `);
    }
}

// Global instance
window.nbaAdvancedExplorer = new NBAAdvancedExplorer();