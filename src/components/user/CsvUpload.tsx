import { useRef, useState } from "react";

import { Upload } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import type { PendingUser } from "./UserEntryForm";
import { uploadUserCsv } from "@/services/user.service";

interface Props {
  onUpload: (users: PendingUser[]) => void;
}

export default function CsvUpload({ onUpload }: Props) {
  const inputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);

  // Select file only
  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setFile(e.target.files?.[0] ?? null);
  };

  // Upload selected file
  const handleUpload = async () => {
    if (!file) {
      alert("Please select a CSV file first.");
      return;
    }

    try {
      setLoading(true);

      const formData = new FormData();
      formData.append("file", file);

      const response = await uploadUserCsv(formData);

      if (response.success) {
        console.log(response.data);

        onUpload(response.data);

        // Clear selected file
        setFile(null);

        if (inputRef.current) {
          inputRef.current.value = "";
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center gap-4">
      <Input
        ref={inputRef}
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        disabled={loading}
      />

      <Button
        onClick={handleUpload}
        disabled={loading || !file}
      >
        {loading ? (
          "Uploading..."
        ) : (
          <>
            <Upload className="mr-2 h-4 w-4" />
            Upload CSV
          </>
        )}
      </Button>
    </div>
  );
}