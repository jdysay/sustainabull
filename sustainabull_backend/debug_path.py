# inspect_settings.py
import os
import sys

# Get the directory of this script
current_dir = os.path.dirname(os.path.abspath(__file__))
print(f"Current directory: {current_dir}")

# Add this directory to the Python path
sys.path.insert(0, current_dir)

# Try to locate settings.py
settings_path = os.path.join(current_dir, 'sustainabull_backend', 'settings.py')
print(f"Settings path: {settings_path}")
print(f"Settings file exists: {os.path.exists(settings_path)}")

# Try to read the settings without importing
if os.path.exists(settings_path):
    with open(settings_path, 'r') as f:
        content = f.read()
    
    print("\nINSTALLED_APPS content:")
    start = content.find("INSTALLED_APPS")
    if start != -1:
        end = content.find("]", start)
        if end != -1:
            installed_apps = content[start:end+1]
            print(installed_apps)
            if "features" in installed_apps:
                print("'features' is referenced in INSTALLED_APPS")
            if "accounts" in installed_apps:
                print("'accounts' is referenced in INSTALLED_APPS")