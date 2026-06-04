import { useEffect, useRef, useState } from "react";
import { Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type SR = {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: ((e: { results: ArrayLike<ArrayLike<{ transcript: string }>>; resultIndex: number }) => void) | null;
  onerror: ((e: { error: string }) => void) | null;
  onend: (() => void) | null;
};

export function VoiceInput({ onTranscript }: { onTranscript: (text: string) => void }) {
  const [recording, setRecording] = useState(false);
  const [supported, setSupported] = useState(true);
  const recRef = useRef<SR | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SR;
      webkitSpeechRecognition?: new () => SR;
    };
    const Ctor = w.SpeechRecognition || w.webkitSpeechRecognition;
    if (!Ctor) {
      setSupported(false);
      return;
    }
    const rec = new Ctor();
    rec.lang = "pt-BR";
    rec.continuous = true;
    rec.interimResults = false;
    rec.onresult = (e) => {
      let finalText = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        finalText += e.results[i][0].transcript;
      }
      if (finalText.trim()) onTranscript(finalText.trim());
    };
    rec.onerror = (e) => {
      if (e.error !== "aborted") toast.error("Falha no reconhecimento: " + e.error);
      setRecording(false);
    };
    rec.onend = () => setRecording(false);
    recRef.current = rec;
    return () => {
      try {
        rec.stop();
      } catch {
        /* noop */
      }
    };
  }, [onTranscript]);

  const toggle = () => {
    if (!supported) {
      toast.error("Seu navegador não suporta reconhecimento de voz. Tente o Chrome no desktop.");
      return;
    }
    const rec = recRef.current;
    if (!rec) return;
    if (recording) {
      rec.stop();
      setRecording(false);
    } else {
      try {
        rec.start();
        setRecording(true);
      } catch {
        toast.error("Não foi possível iniciar o microfone.");
      }
    }
  };

  return (
    <Button
      type="button"
      variant={recording ? "destructive" : "outline"}
      size="icon"
      onClick={toggle}
      title={recording ? "Parar gravação" : "Ditar descrição por voz"}
      className={cn(
        "shrink-0 transition-all",
        recording && "animate-pulse ring-2 ring-destructive/40",
      )}
    >
      {recording ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
    </Button>
  );
}
