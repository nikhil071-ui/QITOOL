"use client";

import { useEffect, useRef, useState } from "react";
import { countCharacters, countParagraphs, countText, calculateTypingMetrics } from "@/lib/calculations";
import { typingPassageIndexForStart, typingPassages } from "@/lib/typing-test";
import { CopyButton, ResultStat } from "@/components/tools/form-elements";

function TextToolReset({ onReset }: { onReset: () => void }) {
  return <button type="button" className="tool-reset" onClick={onReset}>Clear text</button>;
}

export function WordCounter() {
  const [text, setText] = useState("");
  const result = countText(text);
  const paragraphs = countParagraphs(text);
  const copyText = `Words: ${result.words}; characters: ${result.characters}; characters without whitespace: ${result.charactersWithoutWhitespace}; sentences: ${result.sentences}; paragraphs: ${paragraphs}; estimated reading time: ${result.readingMinutes} ${result.readingMinutes === 1 ? "minute" : "minutes"}.`;
  return <div className="live-text-tool">
    <label className="tool-field" htmlFor="word-counter-text"><span>Text to count</span><textarea id="word-counter-text" className="tool-textarea" value={text} onChange={(event) => setText(event.target.value)} placeholder="Type or paste your text here…" /></label>
    <div className="live-tool-actions"><TextToolReset onReset={() => setText("")} /><CopyButton text={copyText} label="Copy count summary" /></div>
    <section className="live-count-grid" aria-label="Live text counts" aria-live="polite">
      <ResultStat label="Words" value={String(result.words)} prominent />
      <ResultStat label="Characters" value={String(result.characters)} />
      <ResultStat label="Without whitespace" value={String(result.charactersWithoutWhitespace)} />
      <ResultStat label="Sentences" value={String(result.sentences)} />
      <ResultStat label="Paragraphs" value={String(paragraphs)} />
      <ResultStat label="Reading time" value={`${result.readingMinutes} min`} />
    </section>
  </div>;
}

export function CharacterCounter() {
  const [text, setText] = useState("");
  const result = countCharacters(text);
  const copyText = `Characters: ${result.characters}; characters without whitespace: ${result.charactersWithoutWhitespace}; whitespace: ${result.whitespace}; words: ${result.words}; lines: ${result.lines}.`;
  return <div className="live-text-tool">
    <label className="tool-field" htmlFor="character-counter-text"><span>Text to count</span><textarea id="character-counter-text" className="tool-textarea" value={text} onChange={(event) => setText(event.target.value)} placeholder="Type or paste your text here…" /></label>
    <div className="live-tool-actions"><TextToolReset onReset={() => setText("")} /><CopyButton text={copyText} label="Copy count summary" /></div>
    <section className="live-count-grid" aria-label="Live character counts" aria-live="polite">
      <ResultStat label="Characters" value={String(result.characters)} prominent />
      <ResultStat label="Without whitespace" value={String(result.charactersWithoutWhitespace)} />
      <ResultStat label="Whitespace" value={String(result.whitespace)} />
      <ResultStat label="Words / lines" value={`${result.words} / ${result.lines}`} />
    </section>
  </div>;
}

const TEST_SECONDS = 60;

export function TypingSpeedTest() {
  const [passageIndex, setPassageIndex] = useState(0);
  const [typed, setTyped] = useState("");
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [remaining, setRemaining] = useState(TEST_SECONDS);
  const [elapsed, setElapsed] = useState(0);
  const startRef = useRef<number | null>(null);
  const typedRef = useRef("");
  const hasStartedRef = useRef(false);
  const passage = typingPassages[passageIndex];

  useEffect(() => {
    if (!running || startRef.current === null) return;
    const timer = window.setInterval(() => {
      const duration = Math.min(TEST_SECONDS, (performance.now() - (startRef.current ?? performance.now())) / 1000);
      setElapsed(duration);
      setRemaining(Math.max(0, Math.ceil(TEST_SECONDS - duration)));
      if (duration >= TEST_SECONDS) {
        setRunning(false);
        setFinished(true);
      }
    }, 200);
    return () => window.clearInterval(timer);
  }, [running]);

  const start = () => {
    const hasPreviousStart = hasStartedRef.current;
    setPassageIndex((current) => typingPassageIndexForStart(current, hasPreviousStart));
    setTyped("");
    typedRef.current = "";
    setRemaining(TEST_SECONDS);
    setElapsed(0);
    setFinished(false);
    startRef.current = performance.now();
    hasStartedRef.current = true;
    setRunning(true);
  };

  const reset = () => {
    setTyped("");
    typedRef.current = "";
    setRunning(false);
    setFinished(false);
    setRemaining(TEST_SECONDS);
    setElapsed(0);
    startRef.current = null;
  };

  const finishEarly = (value: string) => {
    if (value.length < passage.length || startRef.current === null) return;
    const duration = Math.max(0.01, (performance.now() - startRef.current) / 1000);
    setElapsed(duration);
    setRemaining(Math.max(0, Math.ceil(TEST_SECONDS - duration)));
    setRunning(false);
    setFinished(true);
  };

  const onChange = (value: string) => {
    setTyped(value);
    typedRef.current = value;
    finishEarly(value);
  };
  const metrics = calculateTypingMetrics(passage, typed, Math.max(elapsed, typed ? 0.01 : 0));
  const resultText = `Correct speed: ${metrics.correctWpm.toFixed(1)} WPM; raw speed: ${metrics.rawWpm.toFixed(1)} WPM; accuracy: ${metrics.accuracyPercent.toFixed(1)}%.`;

  return <div className="typing-test">
    <div className="typing-test-toolbar"><div className="typing-clock"><span>Time</span><strong aria-live="off">{Math.floor(remaining / 60).toString().padStart(2, "0")}:{(remaining % 60).toString().padStart(2, "0")}</strong></div><span className="typing-test-length">60-second test</span></div>
    <p className="typing-passage">{passage}</p>
    <label className="tool-field" htmlFor="typing-input"><span>Your typing</span><textarea id="typing-input" className="tool-textarea typing-input" value={typed} onChange={(event) => onChange(event.target.value)} disabled={!running} placeholder={running ? "Start typing the passage above…" : "Select Start test to begin."} /></label>
    <div className="typing-actions"><button type="button" className="tool-submit" onClick={start}>{finished ? "Start a new test" : running ? "Restart test" : "Start test"}</button><button type="button" className="tool-reset" onClick={reset}>Reset</button></div>
    {running && <section className="live-count-grid typing-live-stats" aria-label="Live typing metrics" aria-live="polite"><ResultStat label="Correct WPM" value={metrics.correctWpm.toFixed(1)} prominent /><ResultStat label="Accuracy" value={`${metrics.accuracyPercent.toFixed(1)}%`} /></section>}
    {finished && <section className="tool-result" aria-live="polite"><div className="tool-result-header"><h3>Test results</h3><CopyButton text={resultText} /></div><div className="result-stat-grid"><ResultStat label="Correct WPM" value={metrics.correctWpm.toFixed(1)} prominent /><ResultStat label="Raw WPM" value={metrics.rawWpm.toFixed(1)} /><ResultStat label="Accuracy" value={`${metrics.accuracyPercent.toFixed(1)}%`} /><ResultStat label="Correct characters" value={`${metrics.correctCharacters} / ${metrics.typedCharacters}`} /></div></section>}
  </div>;
}
