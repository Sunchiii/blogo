// CLIENT ONLY — do not import from server components
import Dexie, { type Table } from "dexie";

export interface Draft {
  id?: number;
  slug: string;
  title: string;
  description: string;
  tags: string[];
  editorData: object; // Raw Editor.js OutputData
  status: "draft" | "published";
  createdAt: Date;
  updatedAt: Date;
}

class BlogDB extends Dexie {
  drafts!: Table<Draft>;

  constructor() {
    super("BlogDB");
    this.version(1).stores({
      drafts: "++id, slug, status, updatedAt",
    });
  }
}

export const db = new BlogDB();

export async function getDraft(id: number): Promise<Draft | undefined> {
  return db.drafts.get(id);
}

export async function getDraftBySlug(slug: string): Promise<Draft | undefined> {
  return db.drafts.where("slug").equals(slug).first();
}

export async function saveDraft(draft: Omit<Draft, "id"> & { id?: number }): Promise<number> {
  return db.drafts.put(draft);
}

export async function deleteDraft(id: number): Promise<void> {
  return db.drafts.delete(id);
}

export async function getAllDrafts(): Promise<Draft[]> {
  return db.drafts.orderBy("updatedAt").reverse().toArray();
}
