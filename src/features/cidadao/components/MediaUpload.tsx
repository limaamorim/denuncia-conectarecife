import { useMemo, useRef, useState } from "react";
import { Upload, X, Image as ImageIcon, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = {
  value: File[];
  onChange: (files: File[]) => void;
};

const ACCEPT = ["image/jpeg", "image/png", "image/webp"];

export function MediaUpload({ value, onChange }: Props) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const items = useMemo(() => {
    return value.map((f) => ({
      file: f,
      url: URL.createObjectURL(f),
    }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.length]);

  const removeAt = (idx: number) => {
    const next = value.filter((_, i) => i !== idx);
    onChange(next);
  };

  const addFiles = (filesLike: FileList | File[]) => {
    const arr = Array.from(filesLike);
    const onlyImages = arr.filter((f) => ACCEPT.includes(f.type));
    if (onlyImages.length === 0) return;
    onChange([...value, ...onlyImages].slice(0, 8));
  };

  return (
    <div className="space-y-3">
      <input
        ref={inputRef}
        type="file"
        className="hidden"
        accept="image/png,image/jpeg,image/webp"
        multiple
        onChange={(e) => {
          const fs = e.target.files;
          if (fs && fs.length) addFiles(fs);
          if (inputRef.current) inputRef.current.value = "";
        }}
      />

      <div
        className={`rounded-xl border-2 border-dashed p-5 transition relative overflow-hidden ${dragOver ? "border-accent bg-accent/5" : "border-border bg-muted/20"} cursor-pointer`}
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          if (e.dataTransfer?.files?.length) addFiles(e.dataTransfer.files);
        }}
        onClick={() => inputRef.current?.click()}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") inputRef.current?.click();
        }}
      >
        <div className="flex items-center gap-3">
          <Upload className="h-5 w-5 text-muted-foreground" />
          <div className="leading-tight">
            <div className="font-semibold">Arraste e solte imagens</div>
            <div className="text-xs text-muted-foreground">JPG, PNG ou WEBP (até 8)</div>
          </div>
        </div>
      </div>

      {value.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {items.map((it, idx) => (
            <div key={it.file.name + idx} className="rounded-xl border bg-background/40 p-2">
              <div className="relative rounded-lg overflow-hidden">
                {it.file.type.startsWith("image/") ? (
                  <img
                    src={it.url}
                    alt={it.file.name}
                    className="w-full h-24 object-cover rounded-lg"
                  />
                ) : (
                  <div className="w-full h-24 flex items-center justify-center text-muted-foreground">
                    <FileText className="h-5 w-5" />
                  </div>
                )}

                <button
                  type="button"
                  className="absolute -top-2 -right-2 h-8 w-8 rounded-full bg-background border shadow-soft flex items-center justify-center hover:bg-muted transition"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeAt(idx);
                  }}
                  aria-label="Remover imagem"
                >
                  <X className="h-4 w-4 text-destructive" />
                </button>
              </div>
              <div className="mt-2 text-[11px] text-foreground truncate font-medium">{it.file.name}</div>
              <div className="text-[10px] text-muted-foreground">
                {(it.file.size / 1024).toFixed(1)} KB
              </div>
            </div>
          ))}
        </div>
      )}

      {value.length === 0 && (
        <div className="text-xs text-muted-foreground flex items-center gap-2">
          <ImageIcon className="h-4 w-4" /> Nenhuma imagem selecionada.
        </div>
      )}
    </div>
  );
}
