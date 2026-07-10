import { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import V2StoryScene from '../components/v2/V2StoryScene';
import { V2_ASSESSMENT } from '../data/v2Assessment';
import { useV2TestStore } from '../store/v2TestStore';
import {
  createV2AssessmentResult,
  getPresentedOptions,
} from '../utils/v2Scoring';
import type { V2AssessmentOption, V2StoryEnding } from '../types';

const ITEM_ENTRIES = V2_ASSESSMENT.chapters.flatMap((chapter) =>
  chapter.items.map((item) => ({ chapter, item })),
);

function makeResultId() {
  const uuid = globalThis.crypto?.randomUUID?.();
  return `result_${uuid ?? `${Date.now()}_${Math.random().toString(36).slice(2)}`}`;
}

function useAmbientRain(enabled: boolean) {
  const audioRef = useRef<{
    context: AudioContext;
    source: AudioBufferSourceNode;
  } | null>(null);

  useEffect(() => {
    if (!enabled) {
      try { audioRef.current?.source.stop(); } catch { /* already stopped */ }
      void audioRef.current?.context.close();
      audioRef.current = null;
      return;
    }

    const AudioContextClass = window.AudioContext
      ?? (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioContextClass) return;

    const context = new AudioContextClass();
    const seconds = 3;
    const buffer = context.createBuffer(1, context.sampleRate * seconds, context.sampleRate);
    const data = buffer.getChannelData(0);
    let last = 0;
    for (let index = 0; index < data.length; index += 1) {
      const white = Math.random() * 2 - 1;
      last = (last + 0.02 * white) / 1.02;
      data[index] = last * 2.6;
    }

    const source = context.createBufferSource();
    const highPass = context.createBiquadFilter();
    const lowPass = context.createBiquadFilter();
    const gain = context.createGain();
    source.buffer = buffer;
    source.loop = true;
    highPass.type = 'highpass';
    highPass.frequency.value = 350;
    lowPass.type = 'lowpass';
    lowPass.frequency.value = 4200;
    gain.gain.value = 0.045;
    source.connect(highPass).connect(lowPass).connect(gain).connect(context.destination);
    source.start();
    audioRef.current = { context, source };

    return () => {
      try { source.stop(); } catch { /* already stopped */ }
      void context.close();
      audioRef.current = null;
    };
  }, [enabled]);
}

export default function V2TestPage() {
  const navigate = useNavigate();
  const {
    hydrated,
    draft,
    soundEnabled,
    hydrate,
    setCurrentIndex,
    recordResponse,
    chooseEnding,
    setSoundEnabled,
    complete,
  } = useV2TestStore();
  const [introChapterId, setIntroChapterId] = useState<string | null>(null);
  const [showFinale, setShowFinale] = useState(false);
  const [error, setError] = useState('');
  const didBootstrap = useRef(false);

  useAmbientRain(soundEnabled);

  useEffect(() => {
    if (!hydrated) hydrate();
  }, [hydrate, hydrated]);

  useEffect(() => {
    if (!hydrated || didBootstrap.current) return;
    didBootstrap.current = true;
    // Draft is created on the home page (or restart). Never mint an empty
    // session here — that used to leave a blank draft after completion + back.
    if (!draft) {
      navigate('/', { replace: true });
      return;
    }
    // Full draft answered but not finalized → resume at narrative ending.
    if (draft.responses.length >= ITEM_ENTRIES.length && !draft.storyState.ending) {
      setShowFinale(true);
      return;
    }
    const entry = ITEM_ENTRIES[draft.currentIndex];
    const isChapterStart = entry && entry.chapter.items[0]?.id === entry.item.id;
    if (isChapterStart && !draft.responses.some((response) => response.itemId === entry.item.id)) {
      setIntroChapterId(entry.chapter.id);
    }
  }, [draft, hydrated, navigate]);

  const safeIndex = Math.min(
    Math.max(draft?.currentIndex ?? 0, 0),
    ITEM_ENTRIES.length - 1,
  );
  const entry = ITEM_ENTRIES[safeIndex];
  const selectedResponse = draft?.responses.find((response) => response.itemId === entry?.item.id);
  const presentedOptions = draft && entry
    ? getPresentedOptions(entry.item, draft.seed)
    : [];
  const showChapterIntro = introChapterId === entry?.chapter.id;

  if (!hydrated || !draft || !entry) {
    return (
      <main className="v2-loading" aria-live="polite">
        <span />
        <p>正在打开夜班记录……</p>
      </main>
    );
  }

  const handleSelect = (
    itemId: string,
    optionId: string,
    presentedPosition: number,
  ) => {
    const option = presentedOptions.find((candidate) => candidate.optionId === optionId);
    const started = Date.parse(draft.itemStartedAt);
    recordResponse({
      itemId,
      optionId,
      presentedOptionIds: presentedOptions.map((candidate) => candidate.optionId),
      presentedPosition,
      responseTimeMs: Number.isFinite(started) ? Math.max(0, Date.now() - started) : 0,
      chapterId: entry.chapter.id,
      answeredAt: new Date().toISOString(),
    }, option?.feedback);
    setError('');
  };

  const goNext = () => {
    if (showChapterIntro) {
      setIntroChapterId(null);
      return;
    }
    if (!selectedResponse) return;
    if (safeIndex >= ITEM_ENTRIES.length - 1) {
      setShowFinale(true);
      return;
    }
    const nextIndex = safeIndex + 1;
    const nextEntry = ITEM_ENTRIES[nextIndex];
    setCurrentIndex(nextIndex);
    if (nextEntry.chapter.id !== entry.chapter.id) {
      setIntroChapterId(nextEntry.chapter.id);
    }
  };

  const goBack = () => {
    setError('');
    if (showFinale) {
      setShowFinale(false);
      return;
    }
    if (showChapterIntro) {
      if (safeIndex === 0) return;
      setIntroChapterId(null);
      setCurrentIndex(safeIndex - 1);
      return;
    }
    if (safeIndex === 0) {
      setIntroChapterId(entry.chapter.id);
      return;
    }
    setCurrentIndex(safeIndex - 1);
  };

  const finish = (ending: V2StoryEnding) => {
    try {
      chooseEnding(ending);
      const completedAt = new Date().toISOString();
      const result = createV2AssessmentResult(
        V2_ASSESSMENT,
        draft.responses,
        {
          resultId: makeResultId(),
          sessionId: draft.sessionId,
          completedAt,
          durationSeconds: Math.max(0, Math.round((Date.now() - Date.parse(draft.startedAt)) / 1000)),
          ending,
        },
        { seed: draft.seed },
      );
      complete(result);
      navigate(`/result/${result.resultId}`);
    } catch (reason) {
      setError(reason instanceof Error ? reason.message : '结果生成失败，请返回检查未完成的选择。');
      setShowFinale(false);
    }
  };

  if (showFinale) {
    return (
      <main className="mbti-v2 v2-finale">
        <div className="v2-finale__image" aria-hidden="true" />
        <div className="v2-finale__veil" aria-hidden="true" />
        <section className="v2-finale__content" aria-labelledby="v2-finale-title">
          <p>19:20 · 南门玻璃雨棚</p>
          <h1 id="v2-finale-title">{V2_ASSESSMENT.finale.prompt}</h1>
          <span>{V2_ASSESSMENT.finale.scene}</span>
          <div className="v2-finale__choices">
            {V2_ASSESSMENT.finale.choices.map((choice) => (
              <button key={choice.id} type="button" onClick={() => finish(choice.id)}>
                <small>结局选择 · 不参与人格计分</small>
                <strong>{choice.title}</strong>
                <span>{choice.text}</span>
              </button>
            ))}
          </div>
          <button type="button" className="v2-text-button" onClick={goBack}>← 返回最后一个选择</button>
        </section>
      </main>
    );
  }

  return (
    <>
      <V2StoryScene
        definition={V2_ASSESSMENT}
        chapter={entry.chapter}
        item={entry.item}
        itemIndex={safeIndex}
        totalItems={ITEM_ENTRIES.length}
        presentedOptions={presentedOptions as V2AssessmentOption[]}
        selectedOptionId={selectedResponse?.optionId}
        canBack={safeIndex > 0 || !showChapterIntro}
        canContinue={Boolean(selectedResponse)}
        soundEnabled={soundEnabled}
        showChapterIntro={showChapterIntro}
        sceneImage="/hospital-night-v2.png"
        onSelect={handleSelect}
        onContinue={goNext}
        onBack={goBack}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
      />
      {error && <div className="v2-error" role="alert">{error}</div>}
    </>
  );
}
