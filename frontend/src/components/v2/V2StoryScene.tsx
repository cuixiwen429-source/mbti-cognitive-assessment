import type { KeyboardEvent } from 'react';
import type {
  V2AssessmentDefinition,
  V2AssessmentItem,
  V2AssessmentOption,
  V2StoryChapter,
} from '../../types';
import './v2.css';

export interface V2StorySceneProps {
  definition: V2AssessmentDefinition;
  chapter: V2StoryChapter;
  item: V2AssessmentItem;
  /** Zero-based position in the full assessment. */
  itemIndex: number;
  totalItems: number;
  /** Options in their persisted, session-specific presentation order. */
  presentedOptions: V2AssessmentOption[];
  selectedOptionId?: string;
  canBack: boolean;
  canContinue: boolean;
  soundEnabled: boolean;
  showChapterIntro?: boolean;
  sceneImage?: string;
  sceneImageAlt?: string;
  onSelect: (
    itemId: string,
    optionId: string,
    presentedPosition: number,
  ) => void;
  onContinue: () => void;
  onBack: () => void;
  onToggleSound: () => void;
}

const OPTION_MARKS = ['A', 'B', 'C', 'D'];

function splitStoryLabel(value: string) {
  const [label, ...detailParts] = value.split('｜');
  return {
    label: label?.trim() || value,
    detail: detailParts.join('｜').trim(),
  };
}

function SpeakerIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5v5h4l5 4v-13l-5 4H4Z" />
      <path d="M16.2 9.1c.8.7 1.2 1.7 1.2 2.9s-.4 2.2-1.2 2.9" />
      <path d="M18.8 6.8c1.4 1.3 2.2 3.1 2.2 5.2s-.8 3.9-2.2 5.2" />
    </svg>
  );
}

function MutedIcon() {
  return (
    <svg viewBox="0 0 24 24" aria-hidden="true">
      <path d="M4 9.5v5h4l5 4v-13l-5 4H4Z" />
      <path d="m17 9 4 4m0-4-4 4" />
    </svg>
  );
}

export default function V2StoryScene({
  definition,
  chapter,
  item,
  itemIndex,
  totalItems,
  presentedOptions,
  selectedOptionId,
  canBack,
  canContinue,
  soundEnabled,
  showChapterIntro = false,
  sceneImage,
  sceneImageAlt,
  onSelect,
  onContinue,
  onBack,
  onToggleSound,
}: V2StorySceneProps) {
  const activeSceneImage = sceneImage ?? chapter.sceneImage;
  const storyObject = splitStoryLabel(chapter.object);
  const storySpeaker = splitStoryLabel(chapter.speaker ?? '夜班记录');
  const chapterItemIndex = Math.max(
    0,
    chapter.items.findIndex((chapterItem) => chapterItem.id === item.id),
  );
  const safeTotal = Math.max(1, totalItems);
  const currentProgress = Math.min(
    safeTotal,
    Math.max(0, itemIndex + (showChapterIntro ? 0 : 1)),
  );
  const selectedOption = presentedOptions.find(
    (option) => option.optionId === selectedOptionId,
  );
  const continueDisabled = !showChapterIntro && !canContinue;

  const handleOptionKeyDown = (
    event: KeyboardEvent<HTMLButtonElement>,
    currentIndex: number,
  ) => {
    if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(event.key)) {
      return;
    }

    event.preventDefault();
    const group = event.currentTarget.closest('[role="radiogroup"]');
    const buttons = Array.from(
      group?.querySelectorAll<HTMLButtonElement>('[role="radio"]') ?? [],
    );
    if (buttons.length === 0) return;

    let nextIndex = currentIndex;
    if (event.key === 'Home') nextIndex = 0;
    if (event.key === 'End') nextIndex = buttons.length - 1;
    if (event.key === 'ArrowDown' || event.key === 'ArrowRight') {
      nextIndex = (currentIndex + 1) % buttons.length;
    }
    if (event.key === 'ArrowUp' || event.key === 'ArrowLeft') {
      nextIndex = (currentIndex - 1 + buttons.length) % buttons.length;
    }

    buttons[nextIndex]?.focus();
    buttons[nextIndex]?.click();
  };

  return (
    <main className="mbti-v2 v2-story">
      <div className="v2-story__backdrop" aria-hidden="true">
        {activeSceneImage ? (
          <img
            className="v2-story__scene-image"
            src={activeSceneImage}
            alt={sceneImageAlt ?? ''}
          />
        ) : (
          <div className="v2-story__hospital-set">
            <span className="v2-story__ceiling-light" />
            <span className="v2-story__door" />
            <span className="v2-story__wayfinding">19:20</span>
          </div>
        )}
        <div className="v2-story__rain" />
        <div className="v2-story__exposure" />
      </div>

      <header className="v2-story__topbar">
        <div className="v2-story__identity">
          <span className="v2-story__identity-kicker">市立医院 · 患者服务处</span>
          <span className="v2-story__identity-title">{definition.title}</span>
        </div>

        <button
          type="button"
          className="v2-story__sound"
          aria-pressed={soundEnabled}
          aria-label={soundEnabled ? '关闭环境音' : '开启环境音'}
          onClick={onToggleSound}
        >
          {soundEnabled ? <SpeakerIcon /> : <MutedIcon />}
          <span>{soundEnabled ? '环境音已开' : '开启环境音'}</span>
        </button>
      </header>

      <section className="v2-story__stage" aria-labelledby="v2-scene-title">
        <div className="v2-story__chapter-index" aria-hidden="true">
          <span>{String(chapter.number).padStart(2, '0')}</span>
          <i />
          <small>{chapter.time}</small>
        </div>

        <div className="v2-story__panel">
          <div className="v2-story__location-line">
            <span>第 {chapter.number} 章</span>
            <span>{chapter.location}</span>
            <span>
              {chapterItemIndex + 1} / {chapter.items.length}
            </span>
          </div>

          {showChapterIntro ? (
            <div className="v2-story__intro">
              <p className="v2-story__object-label">失物 {String(chapter.number).padStart(2, '0')}</p>
              <h1 id="v2-scene-title">{storyObject.label}</h1>
              <p className="v2-story__object-detail">
                {storyObject.detail || chapter.subtitle}
              </p>
              <div className="v2-story__rule" />
              <h2>{chapter.title}</h2>
              <p className="v2-story__scene-copy">{chapter.scene}</p>
            </div>
          ) : (
            <div className="v2-story__decision">
              <div className="v2-story__object-header">
                <span>线索 · {storyObject.label}</span>
                <span>{chapter.subtitle}</span>
              </div>

              <div className="v2-story__dialogue">
                <div className="v2-story__speaker">
                  <span className="v2-story__speaker-line" />
                  <span className="v2-story__speaker-name">
                    {storySpeaker.label}
                  </span>
                  {storySpeaker.detail && (
                    <span className="v2-story__speaker-role">{storySpeaker.detail}</span>
                  )}
                </div>
                <p>{item.context}</p>
              </div>

              <h1 id="v2-scene-title" className="v2-story__prompt">
                {item.prompt}
              </h1>

              <div
                className="v2-story__options"
                role="radiogroup"
                aria-label={item.prompt}
              >
                {presentedOptions.map((option, optionIndex) => {
                  const isSelected = selectedOptionId === option.optionId;
                  return (
                    <button
                      key={option.optionId}
                      type="button"
                      role="radio"
                      aria-checked={isSelected}
                      className={`v2-story__option${isSelected ? ' is-selected' : ''}`}
                      onClick={() => onSelect(item.id, option.optionId, optionIndex)}
                      onKeyDown={(event) => handleOptionKeyDown(event, optionIndex)}
                    >
                      <span className="v2-story__option-mark" aria-hidden="true">
                        {OPTION_MARKS[optionIndex] ?? String(optionIndex + 1)}
                      </span>
                      <span className="v2-story__option-copy">{option.text}</span>
                      <span className="v2-story__option-state" aria-hidden="true" />
                    </button>
                  );
                })}
              </div>

              {selectedOption?.feedback && (
                <div className="v2-story__feedback" role="status" aria-live="polite">
                  <span>现场回应</span>
                  <p>{selectedOption.feedback}</p>
                </div>
              )}
            </div>
          )}

          <footer className="v2-story__controls">
            <button
              type="button"
              className="v2-button v2-button--quiet"
              onClick={onBack}
              disabled={!canBack}
            >
              <span aria-hidden="true">←</span>
              返回
            </button>

            <div className="v2-story__progress">
              <div>
                <span>夜班进度</span>
                <span>
                  {currentProgress} / {safeTotal}
                </span>
              </div>
              <progress
                value={currentProgress}
                max={safeTotal}
                aria-label={`测评进度：${currentProgress} / ${safeTotal}`}
              />
            </div>

            <button
              type="button"
              className="v2-button v2-button--primary"
              onClick={onContinue}
              disabled={continueDisabled}
            >
              {showChapterIntro
                ? '走进这一幕'
                : currentProgress >= safeTotal
                  ? '抵达结局'
                  : '继续'}
              <span aria-hidden="true">→</span>
            </button>
          </footer>
        </div>
      </section>

      <p className="v2-story__sound-note" aria-live="polite">
        {soundEnabled ? '雨声与走廊环境音已开启' : '声音默认关闭，不影响测评'}
      </p>
    </main>
  );
}
