import {
  collection,
  doc,
  getDocs,
  getDoc,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  serverTimestamp,
  Timestamp,
  type QueryConstraint,
} from "firebase/firestore";
import { db } from "./config";
import type { Post, PostPayload, PostStatus } from "@/types";

const COLLECTION = "posts";


function toISOString(value: unknown): string {
  if (value instanceof Timestamp) return value.toDate().toISOString();
  if (typeof value === "string") return value;
  return new Date().toISOString();
}

function toPost(id: string, data: Record<string, unknown>): Post {
  return {
    id,
    title: (data.title as string) ?? "",
    slug: (data.slug as string) ?? "",
    content: (data.content as string) ?? "",
    excerpt: (data.excerpt as string) ?? "",
    coverImage: (data.coverImage as string | null) ?? null,
    tags: (data.tags as string[]) ?? [],
    status: (data.status as PostStatus) ?? "draft",
    createdAt: toISOString(data.createdAt),
    updatedAt: toISOString(data.updatedAt),
  };
}


export async function getAllPosts(): Promise<Post[]> {
  const q = query(collection(db, COLLECTION), orderBy("createdAt", "desc"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPublishedPosts(): Promise<Post[]> {
  const constraints: QueryConstraint[] = [
    where("status", "==", "published"),
    orderBy("createdAt", "desc"),
  ];
  const q = query(collection(db, COLLECTION), ...constraints);
  const snapshot = await getDocs(q);
  return snapshot.docs.map((d) => toPost(d.id, d.data()));
}

export async function getPostById(id: string): Promise<Post | null> {
  const ref = doc(db, COLLECTION, id);
  const snapshot = await getDoc(ref);
  if (!snapshot.exists()) return null;
  return toPost(snapshot.id, snapshot.data());
}

export async function getPostBySlug(slug: string): Promise<Post | null> {
  const q = query(
    collection(db, COLLECTION),
    where("slug", "==", slug),
    where("status", "==", "published"),
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return toPost(d.id, d.data());
}

export async function createPost(payload: PostPayload): Promise<string> {
  const ref = await addDoc(collection(db, COLLECTION), {
    ...payload,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  });
  return ref.id;
}

export async function updatePost(
  id: string,
  payload: Partial<PostPayload>,
): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await updateDoc(ref, {
    ...payload,
    updatedAt: serverTimestamp(),
  });
}

export async function deletePost(id: string): Promise<void> {
  const ref = doc(db, COLLECTION, id);
  await deleteDoc(ref);
}
