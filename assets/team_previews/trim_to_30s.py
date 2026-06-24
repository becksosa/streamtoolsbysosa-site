import os
import subprocess
import json

def get_duration(path):
    result = subprocess.run(
        ["ffprobe", "-v", "error", "-show_entries", "format=duration",
         "-of", "json", path],
        capture_output=True, text=True
    )
    return float(json.loads(result.stdout)["format"]["duration"])

folder = os.path.dirname(os.path.abspath(__file__))
limit = 30.0

for f in os.listdir(folder):
    if f.lower().endswith(".mp4"):
        path = os.path.join(folder, f)
        dur = get_duration(path)
        if dur <= limit:
            print(f"Skipping {f} ({dur:.1f}s)")
            continue

        temp_out = os.path.join(folder, "trimmed_" + f)
        subprocess.run([
            "ffmpeg", "-y", "-i", path, "-t", str(limit),
            "-c", "copy", temp_out
        ])
        os.replace(temp_out, path)
        print(f"Trimmed {f} to {limit}s")