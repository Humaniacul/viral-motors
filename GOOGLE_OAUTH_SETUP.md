# 🔐 Google OAuth Setup Guide for Viral Motors

## 📋 **Overview**
This guide will help you set up Google OAuth authentication so users can sign in with their Google accounts.

---

## 🚀 **Step 1: Create Google OAuth Credentials**

### **1.1 Go to Google Cloud Console**
1. Visit: [Google Cloud Console](https://console.cloud.google.com/)
2. Sign in with your Google account
3. **Create a new project** or select existing project

### **1.2 Create a New Project (if needed)**
1. Click **"Select a project"** dropdown at the top
2. Click **"NEW PROJECT"**
3. **Project name:** `Viral Motors` (or any name you prefer)
4. Click **"CREATE"**
5. **Wait for project creation** (takes ~30 seconds)

### **1.3 Enable Required APIs**
1. In the left sidebar, go to **"APIs & Services"** → **"Library"**
2. Search for and enable these APIs:
   - **"Google People API"** (for user profile information)
   - **"Google Identity"** (if available, but may not be needed)
   
   **Note:** Google+ API is deprecated. The **Google People API** is the current replacement for accessing user profile data.

### **1.4 Configure OAuth Consent Screen**
1. Go to **"APIs & Services"** → **"OAuth consent screen"**
2. Choose **"External"** user type
3. Click **"CREATE"**

**Fill out the form:**
```
App name: Viral Motors
User support email: [your-email@gmail.com]
App domain: (leave blank for now)
Developer contact information: [your-email@gmail.com]
```

4. Click **"SAVE AND CONTINUE"**
5. **Skip "Scopes"** - Click **"SAVE AND CONTINUE"**
6. **Skip "Test users"** - Click **"SAVE AND CONTINUE"**
7. Click **"BACK TO DASHBOARD"**

### **1.5 Create OAuth Credentials**
1. Go to **"APIs & Services"** → **"Credentials"**
2. Click **"+ CREATE CREDENTIALS"** → **"OAuth 2.0 Client IDs"**
3. **Application type:** Web application
4. **Name:** `Viral Motors Web Client`

**Configure URIs:**
```
Authorized JavaScript origins:
- http://localhost:3000
- https://viralmotors.com (for production later)

Authorized redirect URIs:
- https://hmktuthqkuarmvdywjqu.supabase.co/auth/v1/callback
```

5. Click **"CREATE"**

### **1.6 Copy Your Credentials**
You'll see a popup with:
- **Client ID:** (long string starting with numbers)
- **Client Secret:** (shorter string with letters and numbers)

**⚠️ IMPORTANT:** Copy both values - you'll need them in the next step!

---

## 🔧 **Step 2: Configure Supabase**

### **2.1 Open Supabase Dashboard**
1. Go to [supabase.com](https://supabase.com)
2. Sign in and open your project: `hmktuthqkuarmvdywjqu`

### **2.2 Configure Google OAuth**
1. Go to **"Authentication"** → **"Providers"**
2. Find **"Google"** in the list
3. **Enable Google provider**
4. **Paste your credentials:**
   - **Client ID:** [paste from Google Cloud Console]
   - **Client Secret:** [paste from Google Cloud Console]

### **2.3 Configure Redirect URLs**
In the same Google settings:
```
Site URL: http://localhost:3000
Redirect URLs: 
- http://localhost:3000
- https://viralmotors.com (for production)
```

5. Click **"Save"**

---

## 🧪 **Step 3: Test Google OAuth**

### **3.1 Test the Integration**
1. Go to your website: `http://localhost:3000`
2. Click **"Sign Up"** or **"Sign In"**
3. You should see **"Continue with Google"** button
4. Click it and test the Google login flow

### **3.2 Expected Flow**
1. Click Google button → Redirects to Google
2. Select Google account → Google asks for permissions
3. Accept permissions → Redirects back to your site
4. User logged in → Profile created automatically

---

## 🔍 **Troubleshooting Common Issues**

### **Issue: "Error 400: redirect_uri_mismatch"**
**Solution:** Make sure these URLs match exactly:
- Google Console redirect URI: `https://hmktuthqkuarmvdywjqu.supabase.co/auth/v1/callback`
- Supabase callback URL: Should be auto-configured

### **Issue: "Google People API not found"**
**Solution:** You might see these options instead:
- **"Google Identity Toolkit API"** - Enable this one
- **"Google Identity Services"** - This is the new unified service
- **"Google+ API"** - This is deprecated, don't use it

**If you can't find any of these APIs, you can skip this step entirely!** OAuth 2.0 credentials work without enabling specific APIs in many cases.

### **Issue: "This app isn't verified"**
**Solution:** This is normal for development. Click **"Advanced"** → **"Go to Viral Motors (unsafe)"**

### **Issue: "Access blocked"**
**Solution:** 
1. Go back to Google Cloud Console
2. OAuth consent screen → **"PUBLISH APP"**
3. Or add your test email to "Test users"

### **Issue: Profile not created after Google login**
**Solution:** Check if the database trigger is working:
```sql
-- Run this in Supabase SQL Editor
SELECT * FROM profiles WHERE id IN (SELECT id FROM auth.users);
```

---

## 🎯 **Step 4: Production Setup (Later)**

When you're ready to deploy:

### **4.1 Update Google Console**
Add production URLs:
```
Authorized JavaScript origins:
- https://viralmotors.com

Authorized redirect URIs:
- https://viralmotors.com/auth/callback
```

### **4.2 Update Supabase**
Update Site URL to: `https://viralmotors.com`

---

## 📱 **Step 5: Optional - Add More Providers**

You can also set up:

### **GitHub OAuth**
1. Go to GitHub → Settings → Developer settings → OAuth Apps
2. Create new OAuth app with:
   - Homepage URL: `http://localhost:3000`
   - Callback URL: `https://hmktuthqkuarmvdywjqu.supabase.co/auth/v1/callback`

### **Twitter OAuth**
1. Go to Twitter Developer Portal
2. Create app and get API keys
3. Configure in Supabase the same way

---

## ✅ **Checklist**

- [ ] Created Google Cloud Project
- [ ] Enabled required APIs
- [ ] Configured OAuth consent screen
- [ ] Created OAuth 2.0 credentials
- [ ] Copied Client ID and Secret
- [ ] Configured Supabase Google provider
- [ ] Set correct redirect URLs
- [ ] Tested Google login flow
- [ ] Verified profile creation

---

## 🎉 **Success!**

Once completed, your users can:
- ✅ Sign in with Google (one click!)
- ✅ Sign in with email/password
- ✅ Have profiles created automatically
- ✅ Access all authenticated features

---

## 🔐 **Security Notes**

- ✅ Client credentials are secure in Supabase
- ✅ OAuth flow handled by Supabase (secure)
- ✅ No sensitive data stored on your site
- ✅ Google handles user verification

---

**Need help with any step? Let me know and I'll guide you through it! 🚀**
