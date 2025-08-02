// NBA Three-Point Revolution - Main JavaScript File
// Narrative Visualization using D3.js with Martini Glass Structure

// Global state and configuration
let state = {
    currentScene: 0,
    totalScenes: 5,
    data: {},
    selectedPlayer: 'Stephen Curry'
};

// Scene configurations
const scenes = [
    {
        title: "Then vs Now",
        description: "In 2004, NBA teams took roughly 1 in 5 shots from three-point range. By 2024, that number nearly doubled to 2 in 5 shots. Mid-range shots, once a staple of the game, have dramatically declined."
    },
    {
        title: "The Rising Arc",
        description: "The league-wide shift toward three-pointers didn't happen overnight. This chart shows how the three-point attempt rate steadily climbed over two decades, fundamentally changing how basketball is played."
    },
    {
        title: "Revolutionary Players",
        description: "While the entire league embraced the three-pointer, certain players led this revolution. Stephen Curry's record-breaking 2015-16 season (402 made threes) exemplified this new era of basketball."
    },
    {
        title: "The Efficiency Payoff",
        description: "Why did teams make this shift? The answer lies in scoring efficiency. As teams replaced mid-range shots with three-pointers, the league's overall effective field goal percentage reached historic highs."
    },
    {
        title: "Explore the Revolution",
        description: "Now it's your turn to explore the data. Select different players to see how their shot profiles evolved throughout this three-point revolution."
    }
];

// D3 margins and dimensions
const margin = { top: 60, right: 80, bottom: 80, left: 80 };
const width = 800 - margin.left - margin.right;
const height = 500 - margin.top - margin.bottom;

// Color scheme
const colors = {
    threePt: '#e76f51',
    midRange: '#457b9d',
    efficiency: '#2a9d8f',
    background: '#f8f9fa',
    text: '#1d3557'
};

// Initialize the visualization when the page loads
document.addEventListener('DOMContentLoaded', async function() {
    try {
        // Load all data files
        state.data = await loadAllData();
        
        // Initialize the first scene
        updateScene();
        
        // Set up event listeners
        setupEventListeners();
        
        console.log('NBA Three-Point Revolution visualization loaded successfully!');
    } catch (error) {
        console.error('Error loading visualization:', error);
        showError('Failed to load data. Please check your connection and try again.');
    }
});

// Load all data files
async function loadAllData() {
    const [scene1, scene2, scene3, scene4] = await Promise.all([
        d3.json('data/scene1_data.json'),
        d3.json('data/scene2_data.json'),
        d3.json('data/scene3_data.json'),
        d3.json('data/scene4_data.json')
    ]);
    
    return {
        scene1,
        scene2,
        scene3,
        scene4
    };
}

// Set up event listeners for navigation
function setupEventListeners() {
    document.getElementById('prev-btn').addEventListener('click', () => changeScene(-1));
    document.getElementById('next-btn').addEventListener('click', () => changeScene(1));
    document.getElementById('player-select').addEventListener('change', (e) => {
        state.selectedPlayer = e.target.value;
        if (state.currentScene === 4) {
            drawScene4(); // Redraw interactive scene with new player
        }
    });
}

// Change scene function
function changeScene(direction) {
    const newScene = state.currentScene + direction;
    
    if (newScene >= 0 && newScene < state.totalScenes) {
        state.currentScene = newScene;
        updateScene();
    }
}

// Update scene content and visualization
function updateScene() {
    // Update scene text
    document.getElementById('scene-title').textContent = scenes[state.currentScene].title;
    document.getElementById('scene-description').textContent = scenes[state.currentScene].description;
    document.getElementById('current-scene').textContent = state.currentScene + 1;
    
    // Update navigation buttons
    document.getElementById('prev-btn').disabled = state.currentScene === 0;
    document.getElementById('next-btn').disabled = state.currentScene === state.totalScenes - 1;
    
    // Show/hide interactive controls
    const interactiveControls = document.getElementById('interactive-controls');
    interactiveControls.style.display = state.currentScene === 4 ? 'block' : 'none';
    
    // Clear previous visualization
    d3.select('#main-svg').selectAll('*').remove();
    
    // Draw current scene
    switch (state.currentScene) {
        case 0:
            drawScene0();
            break;
        case 1:
            drawScene1();
            break;
        case 2:
            drawScene2();
            break;
        case 3:
            drawScene3();
            break;
        case 4:
            drawScene4();
            break;
    }
}

// Scene 0: 2004 vs 2024 Comparison
function drawScene0() {
    const svg = d3.select('#main-svg');
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const data = state.data.scene1;
    
    // Create comparison data
    const comparisonData = [
        { year: '2004', threePt: data['2004'].three_pt_percentage, midRange: data['2004'].mid_range_percentage },
        { year: '2024', threePt: data['2024'].three_pt_percentage, midRange: data['2024'].mid_range_percentage }
    ];
    
    // Scales
    const xScale = d3.scaleBand()
        .domain(['2004', '2024'])
        .range([0, width])
        .padding(0.3);
    
    const yScale = d3.scaleLinear()
        .domain([0, 50])
        .range([height, 0]);
    
    // Add title
    g.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -20)
        .text('Shot Selection: Then vs Now');
    
    // Create bar groups
    const barGroups = g.selectAll('.bar-group')
        .data(comparisonData)
        .enter()
        .append('g')
        .attr('class', 'bar-group')
        .attr('transform', d => `translate(${xScale(d.year)}, 0)`);
    
    const barWidth = xScale.bandwidth() / 2.5;
    
    // Three-point bars
    barGroups.append('rect')
        .attr('class', 'bar-three-pt')
        .attr('x', 0)
        .attr('y', d => yScale(d.threePt))
        .attr('width', barWidth)
        .attr('height', d => height - yScale(d.threePt))
        .append('title')
        .text(d => `3-Point: ${d.threePt}%`);
    
    // Mid-range bars
    barGroups.append('rect')
        .attr('class', 'bar-mid-range')
        .attr('x', barWidth + 5)
        .attr('y', d => yScale(d.midRange))
        .attr('width', barWidth)
        .attr('height', d => height - yScale(d.midRange))
        .append('title')
        .text(d => `Mid-Range: ${d.midRange}%`);
    
    // Add value labels on bars
    barGroups.selectAll('.bar-label')
        .data(d => [
            { value: d.threePt, x: barWidth/2, type: '3PT' },
            { value: d.midRange, x: barWidth + 5 + barWidth/2, type: 'Mid' }
        ])
        .enter()
        .append('text')
        .attr('class', 'bar-label')
        .attr('x', d => d.x)
        .attr('y', d => yScale(d.value) - 5)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('font-weight', 'bold')
        .style('fill', colors.text)
        .text(d => `${d.value}%`);
    
    // Add year labels
    barGroups.append('text')
        .attr('x', barWidth + 2.5)
        .attr('y', height + 20)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('font-weight', 'bold')
        .style('fill', colors.text)
        .text(d => d.year);
    
    // Add y-axis
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d + '%'));
    
    // Add y-axis label
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('Percentage of Total Shots');
    
    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 150}, 30)`);
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 0)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors.threePt);
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text('3-Point Shots');
    
    legend.append('rect')
        .attr('x', 0)
        .attr('y', 25)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors.midRange);
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 37)
        .style('font-size', '12px')
        .text('Mid-Range Shots');
}

// Scene 1: League-wide trend over time
function drawScene1() {
    const svg = d3.select('#main-svg');
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const data = state.data.scene2;
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.season))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 45])
        .range([height, 0]);
    
    // Line generators
    const threePtLine = d3.line()
        .x(d => xScale(d.season))
        .y(d => yScale(d.three_pt_rate))
        .curve(d3.curveMonotoneX);
    
    const midRangeLine = d3.line()
        .x(d => xScale(d.season))
        .y(d => yScale(d.mid_range_rate))
        .curve(d3.curveMonotoneX);
    
    // Add title
    g.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -20)
        .text('League Shot Selection Trends (2004-2024)');
    
    // Add grid lines
    g.append('g')
        .attr('class', 'grid')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale)
            .tickSize(-height)
            .tickFormat('')
        );
    
    g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat('')
        );
    
    // Draw lines
    g.append('path')
        .datum(data)
        .attr('class', 'three-pt-line')
        .attr('d', threePtLine);
    
    g.append('path')
        .datum(data)
        .attr('class', 'mid-range-line')
        .attr('d', midRangeLine);
    
    // Add points
    g.selectAll('.three-pt-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'line-point three-pt-point')
        .attr('cx', d => xScale(d.season))
        .attr('cy', d => yScale(d.three_pt_rate))
        .append('title')
        .text(d => `${d.season}: ${d.three_pt_rate}% 3-point shots`);
    
    g.selectAll('.mid-range-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'line-point mid-range-point')
        .attr('cx', d => xScale(d.season))
        .attr('cy', d => yScale(d.mid_range_rate))
        .append('title')
        .text(d => `${d.season}: ${d.mid_range_rate}% mid-range shots`);
    
    // Add axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
    
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d + '%'));
    
    // Add axis labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .text('Season');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('Percentage of Total Shots');
    
    // Add annotations
    const annotations = [
        {
            note: {
                title: "2004: The Old Era",
                label: "3-pointers: 18.7%\nMid-range: 35.7%"
            },
            x: xScale(2004),
            y: yScale(18.7),
            dy: -60,
            dx: 50
        },
        {
            note: {
                title: "2024: Three-Point Era",
                label: "3-pointers: 39.5%\nMid-range: 11.2%"
            },
            x: xScale(2024),
            y: yScale(39.5),
            dy: -60,
            dx: -100
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
    g.append('g')
        .attr('class', 'annotation-group')
        .call(makeAnnotations);
    
    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 150}, 30)`);
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 10)
        .attr('y2', 10)
        .attr('stroke', colors.threePt)
        .attr('stroke-width', 3);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 14)
        .style('font-size', '12px')
        .text('3-Point Rate');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 35)
        .attr('y2', 35)
        .attr('stroke', colors.midRange)
        .attr('stroke-width', 3);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 39)
        .style('font-size', '12px')
        .text('Mid-Range Rate');
}

// Scene 2: Key players (Stephen Curry focus)
function drawScene2() {
    const svg = d3.select('#main-svg');
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const data = state.data.scene3;
    
    // Find Stephen Curry's data
    const curryData = data.find(p => p.player === 'Stephen Curry')?.seasons || [];
    const leagueData = state.data.scene2;
    
    if (curryData.length === 0) {
        showError('Stephen Curry data not found');
        return;
    }
    
    // Calculate league average 3PA per game (approximate)
    const leagueAvg = leagueData.map(d => ({
        season: d.season,
        three_pt_rate: d.three_pt_rate
    }));
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain([2009, 2024]) // Curry's NBA career
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, 70])
        .range([height, 0]);
    
    // Line generators
    const curryLine = d3.line()
        .x(d => xScale(d.season))
        .y(d => yScale(d.three_pt_rate))
        .curve(d3.curveMonotoneX);
    
    const leagueLine = d3.line()
        .x(d => xScale(d.season))
        .y(d => yScale(d.three_pt_rate))
        .curve(d3.curveMonotoneX);
    
    // Add title
    g.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -20)
        .text('Stephen Curry vs League Average (3-Point Rate)');
    
    // Filter league data for Curry's era
    const leagueFiltered = leagueAvg.filter(d => d.season >= 2009 && d.season <= 2024);
    
    // Draw league average line
    g.append('path')
        .datum(leagueFiltered)
        .attr('class', 'mid-range-line')
        .attr('d', leagueLine)
        .style('stroke-dasharray', '5,5');
    
    // Draw Curry's line
    g.append('path')
        .datum(curryData)
        .attr('class', 'three-pt-line')
        .attr('d', curryLine)
        .style('stroke-width', 4);
    
    // Add points for Curry
    g.selectAll('.curry-point')
        .data(curryData)
        .enter()
        .append('circle')
        .attr('class', 'line-point three-pt-point')
        .attr('cx', d => xScale(d.season))
        .attr('cy', d => yScale(d.three_pt_rate))
        .attr('r', 5)
        .append('title')
        .text(d => `${d.season}: ${d.three_pt_rate}% (${d.three_pt_shots} attempts)`);
    
    // Add axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
    
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d + '%'));
    
    // Add axis labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .text('Season');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('3-Point Rate (% of shots)');
    
    // Find Curry's record season (2016)
    const recordSeason = curryData.find(d => d.season === 2016);
    if (recordSeason) {
        const annotations = [
            {
                note: {
                    title: "Record-Breaking 2015-16",
                    label: `${recordSeason.made_threes} made 3-pointers\n${recordSeason.three_pt_rate}% of shots from three`
                },
                x: xScale(recordSeason.season),
                y: yScale(recordSeason.three_pt_rate),
                dy: -80,
                dx: -50
            }
        ];
        
        const makeAnnotations = d3.annotation()
            .annotations(annotations);
        
        g.append('g')
            .attr('class', 'annotation-group')
            .call(makeAnnotations);
    }
    
    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 180}, 30)`);
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 10)
        .attr('y2', 10)
        .attr('stroke', colors.threePt)
        .attr('stroke-width', 4);
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 14)
        .style('font-size', '12px')
        .text('Stephen Curry');
    
    legend.append('line')
        .attr('x1', 0)
        .attr('x2', 20)
        .attr('y1', 35)
        .attr('y2', 35)
        .attr('stroke', colors.midRange)
        .attr('stroke-width', 3)
        .style('stroke-dasharray', '5,5');
    
    legend.append('text')
        .attr('x', 25)
        .attr('y', 39)
        .style('font-size', '12px')
        .text('League Average');
}

// Scene 3: Efficiency trends
function drawScene3() {
    const svg = d3.select('#main-svg');
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const data = state.data.scene2; // Use league trends data
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(data, d => d.season))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([46, 55])
        .range([height, 0]);
    
    // Line generator
    const efficiencyLine = d3.line()
        .x(d => xScale(d.season))
        .y(d => yScale(d.efg_percentage))
        .curve(d3.curveMonotoneX);
    
    // Add title
    g.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -20)
        .text('League Shooting Efficiency Over Time');
    
    // Add grid lines
    g.append('g')
        .attr('class', 'grid')
        .call(d3.axisLeft(yScale)
            .tickSize(-width)
            .tickFormat('')
        );
    
    // Draw efficiency line
    g.append('path')
        .datum(data)
        .attr('class', 'efficiency-line')
        .attr('d', efficiencyLine)
        .style('stroke-width', 4);
    
    // Add points
    g.selectAll('.efficiency-point')
        .data(data)
        .enter()
        .append('circle')
        .attr('class', 'line-point efficiency-point')
        .attr('cx', d => xScale(d.season))
        .attr('cy', d => yScale(d.efg_percentage))
        .append('title')
        .text(d => `${d.season}: ${d.efg_percentage}% eFG%`);
    
    // Add axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
    
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d + '%'));
    
    // Add axis labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .text('Season');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('Effective Field Goal Percentage');
    
    // Add annotations
    const firstYear = data[0];
    const lastYear = data[data.length - 1];
    
    const annotations = [
        {
            note: {
                title: "2004: Lower Efficiency",
                label: `${firstYear.efg_percentage}% eFG%`
            },
            x: xScale(firstYear.season),
            y: yScale(firstYear.efg_percentage),
            dy: 50,
            dx: 50
        },
        {
            note: {
                title: "2024: Record Efficiency",
                label: `${lastYear.efg_percentage}% eFG%\n+${(lastYear.efg_percentage - firstYear.efg_percentage).toFixed(1)} percentage points`
            },
            x: xScale(lastYear.season),
            y: yScale(lastYear.efg_percentage),
            dy: -60,
            dx: -100
        }
    ];
    
    const makeAnnotations = d3.annotation()
        .annotations(annotations);
    
    g.append('g')
        .attr('class', 'annotation-group')
        .call(makeAnnotations);
    
    // Add explanation text
    g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 70)
        .attr('text-anchor', 'middle')
        .style('font-size', '11px')
        .style('fill', '#666')
        .text('Effective FG% = (FGM + 0.5 × 3PM) / FGA (accounts for extra value of 3-pointers)');
}

// Scene 4: Interactive exploration
function drawScene4() {
    const svg = d3.select('#main-svg');
    const g = svg.append('g')
        .attr('transform', `translate(${margin.left}, ${margin.top})`);
    
    const data = state.data.scene3;
    const selectedPlayerData = data.find(p => p.player === state.selectedPlayer)?.seasons || [];
    
    if (selectedPlayerData.length === 0) {
        g.append('text')
            .attr('x', width / 2)
            .attr('y', height / 2)
            .attr('text-anchor', 'middle')
            .style('font-size', '16px')
            .text(`No data available for ${state.selectedPlayer}`);
        return;
    }
    
    // Scales
    const xScale = d3.scaleLinear()
        .domain(d3.extent(selectedPlayerData, d => d.season))
        .range([0, width]);
    
    const yScale = d3.scaleLinear()
        .domain([0, d3.max(selectedPlayerData, d => Math.max(d.three_pt_rate, 100 - d.three_pt_rate))])
        .range([height, 0]);
    
    // Create stacked data (3PT rate vs other shots rate)
    const stackedData = selectedPlayerData.map(d => ({
        season: d.season,
        three_pt_rate: d.three_pt_rate,
        other_rate: 100 - d.three_pt_rate,
        three_pt_shots: d.three_pt_shots,
        total_shots: d.total_shots
    }));
    
    // Area generators
    const area3Pt = d3.area()
        .x(d => xScale(d.season))
        .y0(d => yScale(d.other_rate))
        .y1(d => yScale(d.other_rate + d.three_pt_rate))
        .curve(d3.curveMonotoneX);
    
    const areaOther = d3.area()
        .x(d => xScale(d.season))
        .y0(height)
        .y1(d => yScale(d.other_rate))
        .curve(d3.curveMonotoneX);
    
    // Add title
    g.append('text')
        .attr('class', 'chart-title')
        .attr('x', width / 2)
        .attr('y', -20)
        .text(`${state.selectedPlayer}: Shot Profile Evolution`);
    
    // Draw areas
    g.append('path')
        .datum(stackedData)
        .attr('class', 'area-other')
        .attr('d', areaOther)
        .style('fill', colors.midRange)
        .style('opacity', 0.7);
    
    g.append('path')
        .datum(stackedData)
        .attr('class', 'area-three-pt')
        .attr('d', area3Pt)
        .style('fill', colors.threePt)
        .style('opacity', 0.7);
    
    // Add interactive points
    g.selectAll('.interactive-point')
        .data(stackedData)
        .enter()
        .append('circle')
        .attr('class', 'interactive-point interactive-element')
        .attr('cx', d => xScale(d.season))
        .attr('cy', d => yScale(d.other_rate + d.three_pt_rate / 2))
        .attr('r', 6)
        .style('fill', 'white')
        .style('stroke', colors.threePt)
        .style('stroke-width', 3)
        .on('mouseover', function(event, d) {
            showTooltip(event, `
                <strong>${d.season} Season</strong><br/>
                3-Point Rate: ${d.three_pt_rate.toFixed(1)}%<br/>
                3-Point Attempts: ${d.three_pt_shots}<br/>
                Total Shots: ${d.total_shots}
            `);
        })
        .on('mouseout', hideTooltip);
    
    // Add axes
    g.append('g')
        .attr('class', 'axis')
        .attr('transform', `translate(0, ${height})`)
        .call(d3.axisBottom(xScale).tickFormat(d3.format('d')));
    
    g.append('g')
        .attr('class', 'axis')
        .call(d3.axisLeft(yScale).tickFormat(d => d + '%'));
    
    // Add axis labels
    g.append('text')
        .attr('class', 'axis-label')
        .attr('x', width / 2)
        .attr('y', height + 50)
        .attr('text-anchor', 'middle')
        .text('Season');
    
    g.append('text')
        .attr('class', 'axis-label')
        .attr('transform', 'rotate(-90)')
        .attr('y', -50)
        .attr('x', -height / 2)
        .attr('text-anchor', 'middle')
        .text('Shot Distribution');
    
    // Add legend
    const legend = g.append('g')
        .attr('transform', `translate(${width - 150}, 30)`);
    
    legend.append('rect')
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors.threePt)
        .style('opacity', 0.7);
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 12)
        .style('font-size', '12px')
        .text('3-Point Shots');
    
    legend.append('rect')
        .attr('y', 25)
        .attr('width', 15)
        .attr('height', 15)
        .attr('fill', colors.midRange)
        .style('opacity', 0.7);
    
    legend.append('text')
        .attr('x', 20)
        .attr('y', 37)
        .style('font-size', '12px')
        .text('Other Shots');
    
    // Add instruction text
    g.append('text')
        .attr('x', width / 2)
        .attr('y', height + 70)
        .attr('text-anchor', 'middle')
        .style('font-size', '12px')
        .style('fill', '#666')
        .text('Hover over points for detailed statistics');
}

// Tooltip functions
function showTooltip(event, content) {
    const tooltip = d3.select('body').append('div')
        .attr('class', 'tooltip')
        .style('opacity', 0);
    
    tooltip.html(content)
        .style('left', (event.pageX + 10) + 'px')
        .style('top', (event.pageY - 10) + 'px')
        .transition()
        .duration(200)
        .style('opacity', 1);
}

function hideTooltip() {
    d3.selectAll('.tooltip').remove();
}

// Error handling
function showError(message) {
    const svg = d3.select('#main-svg');
    svg.selectAll('*').remove();
    
    svg.append('text')
        .attr('x', 400)
        .attr('y', 250)
        .attr('text-anchor', 'middle')
        .style('font-size', '16px')
        .style('fill', 'red')
        .text(message);
}

// Export for debugging
window.NBAVisualization = {
    state,
    updateScene,
    changeScene
};