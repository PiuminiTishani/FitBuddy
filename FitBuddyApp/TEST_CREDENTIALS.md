# Test Credentials for FitBuddy App

## DummyJSON API Test Users

Your app now uses real dummy APIs from DummyJSON.com for authentication!

### How to Login

You can use any of these test accounts:

| Email/Username | Password | User Name |
|----------------|----------|-----------|
| emilys@demo.com or emilys | emilyspass | Emily Johnson |
| michaelw@demo.com or michaelw | michaelwpass | Michael Williams |
| sophiab@demo.com or sophiab | sophiabpass | Sophia Brown |
| jamesd@demo.com or jamesd | jamesdpass | James Davis |
| emmaj@demo.com or emmaj | emmajpass | Emma Martinez |

### Quick Test Login

**Email**: `emilys@demo.com`  
**Password**: `emilyspass`

OR

**Email**: `michaelw@demo.com`  
**Password**: `michaelwpass`

### How It Works

1. The app extracts the username from your email (part before @)
2. Sends it to DummyJSON API: `https://dummyjson.com/auth/login`
3. If authentication succeeds, you get real user data
4. If it fails, the app falls back to demo mode (accepts any email/password)

### Fallback Demo Mode

If you use an email that's not in the DummyJSON database, the app will:
- Create a temporary demo user
- Use your email to generate a display name
- Still give you full access to all features

**Example**: Login with `john@example.com` + any password = Works in demo mode!

### For Registration

The app uses DummyJSON's user creation endpoint:
- Endpoint: `https://dummyjson.com/users/add`
- Note: DummyJSON simulates creation but doesn't persist data
- Any registration will work and create a temporary session

### API Documentation

- **Auth API**: https://dummyjson.com/docs/auth
- **Users API**: https://dummyjson.com/docs/users
- **All Test Users**: https://dummyjson.com/users

## Exercise API

The app uses API-Ninjas for exercise data:
- **Endpoint**: https://api.api-ninjas.com/v1/exercises
- **Fallback**: If API fails, mock exercise data is used
- **API Key**: Already configured in `exerciseService.ts`

## Features with Dummy APIs

✅ **Real Authentication** - DummyJSON provides actual auth tokens  
✅ **User Profiles** - Real user data with names, emails  
✅ **Fallback Mode** - Works offline or with any credentials  
✅ **Exercise Data** - Real fitness exercises from API-Ninjas  
✅ **Local Storage** - Favorites and workouts saved on device
