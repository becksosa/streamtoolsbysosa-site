import os
import re

def extract_team_name(filename):
    # Remove extension
    name = os.path.splitext(filename)[0]
    
    # Remove common suffixes like -300x300, -2-300x300, -logo, -team-logo, -2, etc.
    name = re.sub(r'[-_](?:team[-_])?(?:logo[-_])?(?:\d[-_])?(?:\d+x\d+).*$', '', name, flags=re.IGNORECASE)
    name = re.sub(r'[-_]logo.*$', '', name, flags=re.IGNORECASE)
    name = re.sub(r'[-_]team.*$', '', name, flags=re.IGNORECASE)
    
    # Remove nfl- prefix
    name = re.sub(r'^nfl[-_]', '', name, flags=re.IGNORECASE)
    
    # Remove year patterns like -2020
    name = re.sub(r'[-_]\d{4}', '', name)
    
    # Extract just the team name (last word/hyphenated segment)
    parts = name.replace('_', '-').split('-')
    team = parts[-1].lower()
    
    return team

script_dir = os.path.dirname(os.path.abspath(__file__))

for filename in os.listdir(script_dir):
    if not filename.lower().endswith('.png'):
        continue
    
    new_name = extract_team_name(filename) + '.png'
    
    if new_name == filename:
        continue
    
    src = os.path.join(script_dir, filename)
    dst = os.path.join(script_dir, new_name)
    
    if os.path.exists(dst):
        print(f"SKIP (exists): {filename} -> {new_name}")
        continue
    
    os.rename(src, dst)
    print(f"{filename} -> {new_name}")

print("Done.")