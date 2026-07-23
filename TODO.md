# Fix Data Persistence Issues

## الوصف
إصلاح مشكلة عدم حفظ البيانات (المراكز، المؤطرين، التوزيع) في قاعدة البيانات Firebase.

## Steps

- [x] Step 1: Fix Firestore Security Rules (`firestore.rules`) - Allow authenticated users to create/update centers
- [x] Step 2: Fix `firebaseService.updateCenter()` (`js/firebase.js`) - Changed `.update()` to `.set()` with `{merge: true}` to work for new documents
- [x] Step 3: Fix `authManager.init()` call (`js/app.js`) - Added missing `authManager.init()` call
- [x] Step 4: Fix `authManager._setupUI()` + `_handleAuthChange()` (`js/auth.js`) - Dynamic user display update on auth state changes
- [x] Step 5: Fix `js/config.js` - Replaced `Object.freeze(CONFIG)` with comment explaining why it's not frozen
- [x] Step 6: Verified `centersModule._saveCenter()` - Now works because `updateCenter()` uses `set()` with `{merge: true}` for both new and existing centers
- [x] Step 7: **إصلاح سباق التوقيت (Race Condition)** - إضافة `waitForAuthReady()` في `js/auth.js` لضمان انتظار حل حالة المصادقة قبل عمليات Firestore
- [x] Step 8: **تحسين رسالة الخطأ** في `js/app.js` - إضافة رسالة واضحة مع رابط Firebase Console عند حدوث خطأ الصلاحيات
- [x] Step 9: **إضافة `detectCollection()` في `js/firebase.js`** - الكشف التلقائي عن المجموعة الصحيحة (`supervisors` أو `مؤطرين`)
- [x] Step 10: **توسيع `firestore.rules`** - إضافة قواعد للمجموعة القديمة `مؤطرين` مع المجموعة الجديدة `supervisors`
- [x] Step 11: **إضافة `firebase.json`** - الملف المطلوب لنشر القواعد عبر CLI
- [ ] ⚠️ **Step 12: نشر قواعد Firestore (مطلوب - لم يتم بعد)**

  **🔴 أنت تحتاج إلى نشر القواعد يدوياً (خطوة وحيدة):**
  
  1. اذهب إلى: https://console.firebase.google.com/project/inti5ab/firestore/rules
  2. احذف القواعد القديمة
  3. انسخ المحتوى الكامل من ملف `firestore.rules`
  4. الصقه وانقر **"Publish"**
  5. عاود تحميل `dashboard.html` (F5)
  
  ---
  
  ## ✅ بعد نشر القواعد
  - سيظهر المؤطرون الموجودون في قاعدة البيانات في قائمة المؤطرين تلقائياً (سواء كانوا في `supervisors` أو `مؤطرين`)
  - يمكنك إضافة مؤطرين جدد وتوزيعهم على المراكز
  - يمكنك إدارة المراكز والمكاتب

