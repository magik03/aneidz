@echo off
echo ============================================
echo  ANIE Platform - Firestore Rules Deployer
echo ============================================
echo.
echo This script deploys firestore.rules to the "inti5ab" project.
echo.
echo Prerequisites:
echo   1. Node.js installed (https://nodejs.org)
echo   2. Firebase CLI installed globally:
echo      npm install -g firebase-tools
echo.
echo ============================================

REM Check if firebase CLI is available
where firebase >nul 2>nul
if %errorlevel% neq 0 (
    echo [ERROR] Firebase CLI not found!
    echo.
    echo Please install it by running:
    echo   npm install -g firebase-tools
    echo.
    echo Then run this script again.
    pause
    exit /b 1
)

echo [1/3] Checking Firebase login status...
firebase projects:list >nul 2>nul
if %errorlevel% neq 0 (
    echo [INFO] You need to log in first.
    firebase login
    if %errorlevel% neq 0 (
        echo [ERROR] Login failed.
        pause
        exit /b 1
    )
)

echo [2/3] Initializing Firestore rules...
echo.
REM Create firebase.json if it doesn't exist
if not exist firebase.json (
    echo { "firestore": { "rules": "firestore.rules" } } > firebase.json
    echo [INFO] Created firebase.json config file.
)

echo [3/3] Deploying rules to project "inti5ab"...
firebase deploy --project inti5ab --only firestore:rules

if %errorlevel% equ 0 (
    echo.
    echo ============================================
    echo  ✅ SUCCESS! Rules deployed successfully!
    echo ============================================
    echo.
    echo Next steps:
    echo   1. Refresh your browser (dashboard.html)
    echo   2. Try adding a center or supervisor
    echo   3. The error "Missing or insufficient permissions" should be gone
) else (
    echo.
    echo ============================================
    echo  ❌ DEPLOYMENT FAILED
    echo ============================================
    echo.
    echo Alternative: Deploy manually via Firebase Console:
    echo   1. Go to: https://console.firebase.google.com/project/inti5ab/firestore/rules
    echo   2. Copy content from firestore.rules
    echo   3. Paste and click "Publish"
)

pause

