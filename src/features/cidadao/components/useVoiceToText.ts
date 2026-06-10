import { useCallback, useEffect, useRef, useState } from "react";

type SpeechRecognitionType = {
  lang?: string;
  continuous?: boolean;
  interimResults?: boolean;
  maxAlternatives?: number;
  start: () => void;
  stop: () => void;
  onresult?: (ev: any) => void;
  onend?: () => void;
  onerror?: (ev: any) => void;
};


type UseVoiceToTextOptions = {
  lang?: string;
  onFinalText?: (text: string) => void;
  onInterimText?: (text: string) => void;
};

export function useVoiceToText({
  lang = "pt-BR",
  onFinalText,
  onInterimText,
}: UseVoiceToTextOptions) {
  const [isSupported, setIsSupported] = useState(false);
  const [isListening, setIsListening] = useState(false);

  const recognitionRef = useRef<SpeechRecognitionType | null>(null);

  useEffect(() => {
    const w = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionType;
      webkitSpeechRecognition?: new () => SpeechRecognitionType;
    };


    const SR = w.SpeechRecognition ?? w.webkitSpeechRecognition;
    setIsSupported(!!SR);

    if (SR) {
      recognitionRef.current = new SR();
    }

  }, []);

  const stop = useCallback(() => {
    try {
      recognitionRef.current?.stop();
    } catch {
      // ignore
    }
    setIsListening(false);
  }, []);

  const start = useCallback(() => {
    if (!recognitionRef.current) return;

    const rec = recognitionRef.current as unknown as {
      lang?: string;
      continuous?: boolean;
      interimResults?: boolean;
      maxAlternatives?: number;
      onresult?: (ev: any) => void;
      onend?: () => void;
      onerror?: (ev: any) => void;
      start: () => void;
      stop: () => void;
    };

    rec.lang = lang;
    rec.continuous = false;
    rec.interimResults = true;

    rec.onresult = (event: any) => {
      let interim = "";
      let finalText = "";

      for (let i = event.resultIndex; i < event.results.length; i++) {
        const res = event.results[i];
        const transcript = String(res?.[0]?.transcript ?? "");
        if (res.isFinal) finalText += transcript;
        else interim += transcript;
      }

      if (interim) onInterimText?.(interim);
      if (finalText) {
        onFinalText?.(finalText.trim());
      }
    };

    rec.onerror = () => {
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    setIsListening(true);
    try {
      rec.start();
    } catch {
      setIsListening(false);
    }
  }, [lang, onFinalText, onInterimText]);

  useEffect(() => {
    return () => stop();
  }, [stop]);

  return {
    isSupported,
    isListening,
    start,
    stop,
  };
}

