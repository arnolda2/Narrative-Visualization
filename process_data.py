import pandas as pd
import numpy as np
import json
import glob
from collections import defaultdict

def load_all_seasons():
    """Load and combine all NBA shot data from 2004-2024."""
    all_data = []
    
    print("Loading NBA shot data...")
    for file_path in sorted(glob.glob("Data/NBA_*_Shots.csv")):
        print(f"Loading {file_path}...")
        df = pd.read_csv(file_path)
        all_data.append(df)
    
    combined_df = pd.concat(all_data, ignore_index=True)
    print(f"Total shots loaded: {len(combined_df):,}")
    return combined_df

def calculate_league_trends(df):
    """Calculate league-wide shot trends by season."""
    trends = []
    
    for season in sorted(df['SEASON_1'].unique()):
        season_data = df[df['SEASON_1'] == season]
        
        total_shots = len(season_data)
        three_pt_shots = len(season_data[season_data['SHOT_TYPE'] == '3PT Field Goal'])
        mid_range_shots = len(season_data[season_data['BASIC_ZONE'] == 'Mid-Range'])
        made_shots = len(season_data[season_data['SHOT_MADE'] == True])
        made_threes = len(season_data[(season_data['SHOT_TYPE'] == '3PT Field Goal') & (season_data['SHOT_MADE'] == True)])
        
        # Calculate percentages and efficiency
        three_pt_rate = (three_pt_shots / total_shots) * 100
        mid_range_rate = (mid_range_shots / total_shots) * 100
        fg_percentage = (made_shots / total_shots) * 100
        efg_percentage = ((made_shots + 0.5 * made_threes) / total_shots) * 100
        
        trends.append({
            'season': int(season),
            'total_shots': int(total_shots),
            'three_pt_rate': round(float(three_pt_rate), 2),
            'mid_range_rate': round(float(mid_range_rate), 2),
            'fg_percentage': round(float(fg_percentage), 2),
            'efg_percentage': round(float(efg_percentage), 2),
            'three_pt_shots': int(three_pt_shots),
            'mid_range_shots': int(mid_range_shots)
        })
    
    return trends

def find_key_players(df):
    """Identify key players who led the 3-point revolution."""
    player_stats = []
    
    # Focus on players with significant impact
    key_players = ['Stephen Curry', 'James Harden', 'Klay Thompson', 'Ray Allen', 'Damian Lillard']
    
    for player in key_players:
        player_data = df[df['PLAYER_NAME'] == player]
        if len(player_data) == 0:
            continue
            
        player_seasons = []
        for season in sorted(player_data['SEASON_1'].unique()):
            season_data = player_data[player_data['SEASON_1'] == season]
            
            total_shots = len(season_data)
            three_pt_shots = len(season_data[season_data['SHOT_TYPE'] == '3PT Field Goal'])
            made_threes = len(season_data[(season_data['SHOT_TYPE'] == '3PT Field Goal') & (season_data['SHOT_MADE'] == True)])
            
            if total_shots > 0:
                three_pt_rate = (three_pt_shots / total_shots) * 100
                three_pt_percentage = (made_threes / three_pt_shots * 100) if three_pt_shots > 0 else 0
                
                player_seasons.append({
                    'season': int(season),
                    'total_shots': int(total_shots),
                    'three_pt_shots': int(three_pt_shots),
                    'made_threes': int(made_threes),
                    'three_pt_rate': round(float(three_pt_rate), 2),
                    'three_pt_percentage': round(float(three_pt_percentage), 2)
                })
        
        if player_seasons:
            player_stats.append({
                'player': player,
                'seasons': player_seasons
            })
    
    return player_stats

def calculate_efficiency_comparison():
    """Calculate scoring efficiency for different shot zones."""
    # This will be used to show why teams shifted to 3-pointers
    return {
        'mid_range_efficiency': 0.8,  # Approximate points per attempt
        'three_point_efficiency': 1.1,  # Approximate points per attempt
        'restricted_area_efficiency': 1.2  # Approximate points per attempt
    }

def create_scene_data(df):
    """Create processed data for each scene of the narrative."""
    print("Processing data for visualization scenes...")
    
    # Scene 1: 2004 vs 2024 comparison
    scene1_data = {
        '2004': {},
        '2024': {}
    }
    
    for year in [2004, 2024]:
        year_data = df[df['SEASON_1'] == year]
        total_shots = len(year_data)
        three_pt_shots = len(year_data[year_data['SHOT_TYPE'] == '3PT Field Goal'])
        mid_range_shots = len(year_data[year_data['BASIC_ZONE'] == 'Mid-Range'])
        
        scene1_data[str(year)] = {
            'three_pt_percentage': round(float((three_pt_shots / total_shots) * 100), 1),
            'mid_range_percentage': round(float((mid_range_shots / total_shots) * 100), 1),
            'total_shots': int(total_shots)
        }
    
    # Scene 2: League trends over time
    scene2_data = calculate_league_trends(df)
    
    # Scene 3: Key players
    scene3_data = find_key_players(df)
    
    # Scene 4: Efficiency data
    scene4_data = {
        'league_trends': scene2_data,  # Reuse league trends for efficiency visualization
        'efficiency_comparison': calculate_efficiency_comparison()
    }
    
    return {
        'scene1': scene1_data,
        'scene2': scene2_data,
        'scene3': scene3_data,
        'scene4': scene4_data
    }

def main():
    """Main processing function."""
    # Load all data
    df = load_all_seasons()
    
    # Create visualization data
    viz_data = create_scene_data(df)
    
    # Save processed data as JSON files
    print("Saving processed data...")
    
    with open('data/scene1_data.json', 'w') as f:
        json.dump(viz_data['scene1'], f, indent=2)
    
    with open('data/scene2_data.json', 'w') as f:
        json.dump(viz_data['scene2'], f, indent=2)
    
    with open('data/scene3_data.json', 'w') as f:
        json.dump(viz_data['scene3'], f, indent=2)
    
    with open('data/scene4_data.json', 'w') as f:
        json.dump(viz_data['scene4'], f, indent=2)
    
    # Create a summary for quick reference
    summary = {
        'total_shots_analyzed': int(len(df)),
        'seasons_covered': [int(x) for x in sorted(df['SEASON_1'].unique())],
        'three_pt_evolution': {
            '2004_rate': float(viz_data['scene1']['2004']['three_pt_percentage']),
            '2024_rate': float(viz_data['scene1']['2024']['three_pt_percentage']),
            'increase_factor': round(float(viz_data['scene1']['2024']['three_pt_percentage'] / viz_data['scene1']['2004']['three_pt_percentage']), 2)
        }
    }
    
    with open('data/summary.json', 'w') as f:
        json.dump(summary, f, indent=2)
    
    print(f"Data processing complete!")
    print(f"3-point rate increased from {summary['three_pt_evolution']['2004_rate']}% in 2004 to {summary['three_pt_evolution']['2024_rate']}% in 2024")
    print(f"That's a {summary['three_pt_evolution']['increase_factor']}x increase!")

if __name__ == "__main__":
    main()