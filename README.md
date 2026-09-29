# VLC Web Tests

## Run all tests
npx playwright test

## Run individual tests
npx playwright test tests/vlc-login.spec.ts
npx playwright test tests/sign-in.spec.ts
npx playwright test tests/change-password.spec.ts

## Required environment variables
export VLC_USERNAME="your-username"
export VLC_PASSWORD="your-password"

## What this tests
- VLC login page loads
- User can sign in
- Change password page loads