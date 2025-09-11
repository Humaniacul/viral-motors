# 🚀 **DEPLOY DATABASE - STEP BY STEP**

## 🎯 **CRITICAL: Your Articles Aren't Saving Because Database Isn't Set Up**

### **📋 What You Need to Do RIGHT NOW:**

---

## **Step 1: Open Supabase Dashboard**
1. Go to [supabase.com](https://supabase.com)
2. Sign in to your account
3. Open your project: `hmktuthqkuarmvdywjqu`

---

## **Step 2: Deploy the Database Schema**
1. Click **"SQL Editor"** in the left sidebar
2. Click **"New Query"** 
3. **Copy the ENTIRE contents** of `database/schema-final.sql`
4. **Paste it into the SQL Editor**
5. Click **"RUN"** (the play button)

---

## **Step 3: Verify Success**
After running the SQL, you should see:
- ✅ **Success message:** "Database schema setup completed successfully! 🎉"
- ✅ **8 tables created**

---

## **Step 4: Check Your Tables**
1. Click **"Table Editor"** in the left sidebar
2. You should see these tables:
   - ✅ `profiles`
   - ✅ `articles` ← **THIS IS WHERE YOUR ARTICLES WILL SAVE**
   - ✅ `comments`
   - ✅ `bookmarks`
   - ✅ `likes`
   - ✅ `newsletter`
   - ✅ `reading_history`
   - ✅ `analytics_events`

---

## **Step 5: Test Article Creation**
1. Go to your website: `http://localhost:3000/admin`
2. Click **"New Article"**
3. Create a test article
4. Click **"Publish Now"**
5. **Expected Result:** Article should save successfully and redirect to admin dashboard

---

## **🔍 Troubleshooting**

### **If you get errors:**
1. **Check the Console:** Look for specific error messages
2. **Verify Tables:** Make sure all 8 tables were created
3. **Check Permissions:** Ensure RLS policies are set correctly

### **If articles still don't save:**
1. Open browser **Developer Tools** (F12)
2. Go to **Console** tab
3. Try creating an article again
4. **Share any error messages** you see

---

## **🎉 Once Database is Deployed:**
- ✅ Articles will save to Supabase
- ✅ You can view them in the admin dashboard
- ✅ They'll appear on the homepage
- ✅ Auto-save will work
- ✅ Scheduling will work
- ✅ All features will be functional

---

## **⚡ DO THIS NOW:**
**Copy `database/schema-final.sql` → Paste in Supabase SQL Editor → Click RUN**

**This will fix your article saving issue immediately! 🚀**
