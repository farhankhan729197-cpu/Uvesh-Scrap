import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, doc, getDocFromServer } from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';

const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApps()[0];

export const auth = getAuth(app);
export const db = getFirestore(app, (firebaseConfig as any).firestoreDatabaseId);

// Validate Connection to Firestore
async function testConnection() {
  try {
    // Attempting to get a non-existent doc just to test connectivity
    await getDocFromServer(doc(db, 'system', 'connection_test'));
  } catch (error: any) {
    if (error?.message?.includes('the client is offline')) {
      console.error("Please check your Firebase configuration. The client is offline.");
    }
    // We don't throw here as we just want to log connectivity issues
  }
}

if (typeof window !== 'undefined') {
  testConnection();
}
