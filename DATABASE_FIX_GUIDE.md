# 🔧 Database Setup Fix Guide

## 🚨 Issue Identified
**Error:** `23503: insert or update on table "profiles" violates foreign key constraint`

**Cause:** The foreign key relationship between profiles and auth.users wasn't properly established.

---

## ✅ **SOLUTION: Use the Fixed Schema**

### **Step 1: Access Your Supabase Dashboard**
1. Go to [supabase.com](https://supabase.com) and sign in
2. Open your project: `hmktuthqkuarmvdywjqu`
3. Navigate to **SQL Editor** in the left sidebar

### **Step 2: Run the Fixed Schema**
1. **Copy the ENTIRE contents** of `database/schema-fixed.sql`
2. **Paste it into the SQL Editor**
3. **Click "RUN"** to execute all commands

### **Step 3: Verify Setup**
After running the SQL, you should see:
- ✅ **Success message:** "Database schema setup completed successfully! 🎉"
- ✅ **8 tables created** in the Table Editor
- ✅ **RLS policies** enabled and configured

---

## 🔍 **Key Fixes Applied:**

### **1. Fixed Foreign Key Reference**
```sql
-- OLD (problematic):
id UUID REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY

-- NEW (fixed):
id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE
```

### **2. Added Automatic Profile Creation**
```sql
-- This trigger automatically creates a profile when user signs up
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### **3. Clean Database Reset**
The new schema first drops any existing problematic tables before recreating them properly.

---

## 🧪 **Test the Fix:**

### **1. Test User Registration**
1. Go to your website: `http://localhost:3000`
2. Click **"Sign Up"** in the navbar
3. Create a new account with email/password
4. **Expected Result:** User should be created AND profile should be automatically generated

### **2. Verify in Database**
1. Go to Supabase Dashboard → Table Editor
2. Check **profiles** table - should have your new user
3. Check **auth.users** table - should have the same user ID
4. **Expected Result:** Both tables have matching user IDs

### **3. Test Authentication Features**
- ✅ Sign in/out functionality
- ✅ Profile editing page
- ✅ Bookmark articles (requires auth)
- ✅ Like articles (requires auth)

---

## 🔧 **Alternative Manual Fix (if needed):**

If you prefer to fix the existing schema instead of recreating:

```sql
-- 1. Drop the problematic constraint
ALTER TABLE profiles DROP CONSTRAINT IF EXISTS profiles_id_fkey;

-- 2. Recreate it correctly
ALTER TABLE profiles 
ADD CONSTRAINT profiles_id_fkey 
FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- 3. Add the auto-profile creation trigger
CREATE OR REPLACE FUNCTION handle_new_user() 
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, username, full_name, avatar_url)
  VALUES (
    NEW.id, 
    COALESCE(NEW.raw_user_meta_data->>'username', split_part(NEW.email, '@', 1)),
    COALESCE(NEW.raw_user_meta_data->>'full_name', NEW.raw_user_meta_data->>'name'),
    NEW.raw_user_meta_data->>'avatar_url'
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

---

## 🎯 **Expected Outcomes After Fix:**

### **✅ Working Features:**
- User registration with email/password
- Social login (Google/GitHub) - after OAuth setup
- Automatic profile creation
- User profile editing
- Article bookmarking
- Article liking
- Protected routes working correctly

### **📊 Database Structure:**
- **auth.users** (Supabase managed) ←→ **profiles** (custom)
- **profiles** ←→ **articles** (author relationship)
- **profiles** ←→ **bookmarks** (user saved articles)
- **profiles** ←→ **likes** (user article/comment likes)
- **profiles** ←→ **comments** (user comments)

---

## 🚨 **Common Issues & Solutions:**

### **Issue:** "Function handle_new_user() already exists"
**Solution:** The schema includes `CREATE OR REPLACE FUNCTION` so this should not happen.

### **Issue:** "Cannot insert into auth.users"
**Solution:** Never insert directly into auth.users - always use Supabase Auth API.

### **Issue:** "Profile not created after signup"
**Solution:** Check if the trigger was created correctly:
```sql
SELECT * FROM information_schema.triggers 
WHERE trigger_name = 'on_auth_user_created';
```

### **Issue:** Still getting foreign key errors
**Solution:** 
1. Run `SELECT * FROM auth.users;` to verify users exist
2. Check if profile ID matches exactly: `SELECT * FROM profiles;`
3. If needed, manually fix: `UPDATE profiles SET id = (SELECT id FROM auth.users LIMIT 1) WHERE id = 'problem-id';`

---

## ✅ **Verification Checklist:**

After running the fix, verify these work:

- [ ] **User Registration:** New users can sign up
- [ ] **Profile Creation:** Profiles auto-created on signup  
- [ ] **Authentication:** Sign in/out works
- [ ] **Profile Editing:** Users can edit their profiles
- [ ] **Article Interactions:** Bookmarking and liking work
- [ ] **Database Integrity:** No foreign key constraint errors
- [ ] **RLS Security:** Users can only access their own data

---

## 🎉 **Success Indicators:**

You'll know it's working when:
1. ✅ **No more foreign key errors**
2. ✅ **Users can sign up successfully**  
3. ✅ **Profile pages load without errors**
4. ✅ **Article interactions work**
5. ✅ **User dropdown shows profile info**

---

**🚀 Ready to test? Run the fixed schema and let's get your database working perfectly!**
