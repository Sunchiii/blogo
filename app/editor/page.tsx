import { DraftList } from "@/components/Editor/DraftList";

export default function EditorHomePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold mb-1">My Drafts</h1>
        <p className="text-sm text-muted-foreground">
          Posts are saved locally in your browser.
        </p>
      </div>
      <DraftList />
    </div>
  );
}
