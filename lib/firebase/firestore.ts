import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  type DocumentData,
} from "firebase/firestore"
import { db } from "./firebase"

/**
 * Get a document from Firestore by ID
 */
export async function getDocument(collectionName: string, documentId: string) {
  try {
    const docRef = doc(db, collectionName, documentId)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() }
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Create a document with a specific ID in Firestore
 */
export async function createDocumentWithId(collectionName: string, documentId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, documentId)
    await setDoc(docRef, {
      ...data,
      createdAt: Timestamp.now(),
    })
    return { id: documentId, ...data }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Create a document with auto-generated ID in Firestore
 */
export async function createDocument(collectionName: string, data: any) {
  try {
    const collectionRef = collection(db, collectionName)
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
    })
    return { id: docRef.id, ...data }
  } catch (error) {
    console.error(`Error creating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Update a document in Firestore
 */
export async function updateDocument(collectionName: string, documentId: string, data: any) {
  try {
    const docRef = doc(db, collectionName, documentId)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
    return { id: documentId, ...data }
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

/**
 * Delete a document from Firestore
 */
export async function deleteDocument(collectionName: string, documentId: string) {
  try {
    const docRef = doc(db, collectionName, documentId)
    await deleteDoc(docRef)
    return { success: true }
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

/**
 * Get all documents from a collection
 */
export async function getCollection(collectionName: string) {
  try {
    const collectionRef = collection(db, collectionName)
    const querySnapshot = await getDocs(collectionRef)

    const documents: DocumentData[] = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })

    return documents
  } catch (error) {
    console.error(`Error getting collection ${collectionName}:`, error)
    throw error
  }
}

/**
 * Query documents from a collection
 */
export async function queryDocuments(
  collectionName: string,
  conditions: { field: string; operator: string; value: any }[],
  orderByField?: string,
  orderDirection?: "asc" | "desc",
  limitCount?: number,
) {
  try {
    let q = collection(db, collectionName)

    // Build the query with conditions
    if (conditions && conditions.length > 0) {
      conditions.forEach((condition) => {
        q = query(q, where(condition.field, condition.operator as any, condition.value))
      })
    }

    // Add ordering if specified
    if (orderByField) {
      q = query(q, orderBy(orderByField, orderDirection || "asc"))
    }

    // Add limit if specified
    if (limitCount) {
      q = query(q, limit(limitCount))
    }

    const querySnapshot = await getDocs(q)

    const documents: DocumentData[] = []
    querySnapshot.forEach((doc) => {
      documents.push({ id: doc.id, ...doc.data() })
    })

    return documents
  } catch (error) {
    console.error(`Error querying documents from ${collectionName}:`, error)
    throw error
  }
}

