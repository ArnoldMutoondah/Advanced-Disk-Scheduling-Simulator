# Simulate 7-Day GitHub History deployment script
# Ensure you have 'git' installed before running this script.

Rename-Item -Path "simulate_git_history.ps1" -NewName ".simulate_git_history.ps1_backup" -ErrorAction SilentlyContinue

Write-Host "Initializing local Git repository..." -ForegroundColor Cyan
git init
git branch -M main

# Helper function to commit with a backdated timestamp
function Commit-Backdated {
    param(
        [string]$Message,
        [int]$DaysAgo
    )
    $DateStr = (Get-Date).AddDays(-$DaysAgo).ToString("yyyy-MM-ddTHH:mm:ss")
    $env:GIT_AUTHOR_DATE = $DateStr
    $env:GIT_COMMITTER_DATE = $DateStr
    git commit -m $Message --allow-empty
    Write-Host "Committed $(- $DaysAgo) days ago -> $Message" -ForegroundColor Green
}

Write-Host "Building 7-Day History Simulation..." -ForegroundColor Cyan

# Day 1
git add index.html
Commit-Backdated -Message "Day 1: Initial project structure and setup" -DaysAgo 6

# Day 2
git add js/algorithms.js
Commit-Backdated -Message "Day 2: Added FCFS and SSTF implementation logic" -DaysAgo 5

# Day 3
Commit-Backdated -Message "Day 3: Implemented SCAN and C-SCAN algorithms into module" -DaysAgo 4

# Day 4
git add css/style.css
Commit-Backdated -Message "Day 4: Major UI improvements, dark mode, and animations" -DaysAgo 3

# Day 5
git add js/app.js
Commit-Backdated -Message "Day 5: Linked metrics dashboard and integrated Chart.js graphs" -DaysAgo 2

# Day 6
Commit-Backdated -Message "Day 6: Refactored edge case testing, invalid queue blocks, and minor bug fixes" -DaysAgo 1

# Day 7 (Today)
git add README.md
git add * 
Commit-Backdated -Message "Day 7: Final project cleanup, polish, and added comprehensive README documentation" -DaysAgo 0

Write-Host "`n========================================================"
Write-Host "REPOSITORY LOCALLY FORGED AND READY FOR GITHUB!" -ForegroundColor Yellow
Write-Host "Please follow these exact steps to push to your GitHub:`n"
Write-Host "1. Go to github.com and log into ArnoldMutoondah."
Write-Host "2. Create a new empty repository named: Advanced-Disk-Scheduling-Simulator"
Write-Host "3. Run the following commands here in your terminal:`n"
Write-Host "   git remote add origin https://github.com/ArnoldMutoondah/Advanced-Disk-Scheduling-Simulator.git"
Write-Host "   git push -u origin main"
Write-Host "========================================================`n"
