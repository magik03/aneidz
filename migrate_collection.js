/**
 * Migration Script: Copy data from old 'مؤطرين' collection to new 'supervisors' collection
 * 
 * HOW TO USE:
 * 1. Open your Firebase project's Console: https://console.firebase.google.com/project/inti5ab/firestore
 * 2. Go to the Firestore Database section
 * 3. Run this script in the Firebase Console's terminal or as a Node.js script
 * 
 * Option A: Run in Firebase Console (recommended)
 * - Paste this code into the Console and run it
 * 
 * Option B: Run locally with Node.js
 * - npm install firebase-admin
 * - Set GOOGLE_APPLICATION_CREDENTIALS env var
 * - node migrate_collection.js
 */

const OLD_COLLECTION = 'مؤطرين';
const NEW_COLLECTION = 'supervisors';

async function migrateData() {
  const admin = require('firebase-admin');
  
  // Initialize Firebase Admin (if running locally)
  // Make sure to set GOOGLE_APPLICATION_CREDENTIALS environment variable
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.applicationDefault(),
      projectId: 'inti5ab'
    });
  }

  const db = admin.firestore();
  
  console.log(`🚀 Starting migration from "${OLD_COLLECTION}" → "${NEW_COLLECTION}"...`);
  
  // Check if new collection already has data
  const newSnapshot = await db.collection(NEW_COLLECTION).limit(1).get();
  if (!newSnapshot.empty) {
    console.log(`⚠️  Collection "${NEW_COLLECTION}" already has data. Skipping migration to avoid duplicates.`);
    console.log(`   If you want to re-run migration, delete the "${NEW_COLLECTION}" collection first.`);
    return;
  }
  
  // Read old collection
  const oldSnapshot = await db.collection(OLD_COLLECTION).get();
  
  if (oldSnapshot.empty) {
    console.log(`✅ No documents found in "${OLD_COLLECTION}". Nothing to migrate.`);
    return;
  }
  
  console.log(`📦 Found ${oldSnapshot.size} documents to migrate...`);
  
  // Batch write to new collection
  let batch = db.batch();
  let count = 0;
  let batchCount = 0;
  
  for (const doc of oldSnapshot.docs) {
    const data = doc.data();
    const docRef = db.collection(NEW_COLLECTION).doc(doc.id);
    batch.set(docRef, data);
    count++;
    
    // Firestore batch limit is 500 operations
    if (count % 500 === 0) {
      await batch.commit();
      batchCount += 500;
      console.log(`  ✅ ${batchCount} documents migrated...`);
      batch = db.batch();
    }
  }
  
  // Commit remaining documents
  if (count % 500 !== 0) {
    await batch.commit();
  }
  
  console.log(`🎉 Migration complete! ${count} documents copied from "${OLD_COLLECTION}" to "${NEW_COLLECTION}".`);
  console.log('');
  console.log('📋 Next steps:');
  console.log('  1. Verify the data in the "supervisors" collection via Firebase Console');
  console.log('  2. After verification, you can optionally delete the old "مؤطرين" collection');
  console.log('  3. Deploy the new firestore.rules to Firebase');
  console.log('  4. The app will now use the "supervisors" collection automatically');
}

// Run migration
migrateData().catch(err => {
  console.error('❌ Migration failed:', err);
  process.exit(1);
});

