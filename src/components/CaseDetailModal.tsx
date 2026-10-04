import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, SyntheticEvent } from 'react';
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from 'motion/react';
import { ArrowLeft, ArrowRight, X } from 'lucide-react';
import type { CaseItem } from '../data/cases';
import { casePresentations, type CaseGalleryImage } from '../data/case-galleries';
import { caseStories } from '../data/case-stories';
import './case-detail.css';

interface CaseDetailModalProps { caseItem: CaseItem | null; onClose: () => void; }

// Keep the native modal open through its exit so focus and scroll restore only afterwards.
function useAnimatedDialog(onClose: () => void, lockScroll = false) {
  const dialogRef = useRef<HTMLDialogElement>(null);
  const closingRef = useRef(false);
  const [closing, setClosing] = useState(false);
  const controls = useAnimationControls();
  const reducedMotion = useReducedMotion();
  useEffect(() => {
    const dialog = dialogRef.current;
    const bodyOverflow = document.body.style.overflow;
    const htmlOverflow = document.documentElement.style.overflow;
    const htmlScrollbarGutter = document.documentElement.style.scrollbarGutter;
    if (lockScroll) {
      document.documentElement.style.scrollbarGutter = 'stable';
      document.body.style.overflow = 'hidden';
      document.documentElement.style.overflow = 'hidden';
    }
    dialog?.showModal();
    void controls.start({ opacity: 1, y: 0, scale: 1, transition: { duration: reducedMotion ? 0 : 0.24, ease: [0.2, 0.7, 0.2, 1] } });
    return () => {
      controls.stop();
      dialog?.close();
      if (lockScroll) {
        document.body.style.overflow = bodyOverflow;
        document.documentElement.style.overflow = htmlOverflow;
        document.documentElement.style.scrollbarGutter = htmlScrollbarGutter;
      }
    };
  }, [controls, lockScroll, reducedMotion]);
  const requestClose = async () => {
    if (closingRef.current) return;
    closingRef.current = true;
    setClosing(true);
    await controls.start({ opacity: 0, y: reducedMotion ? 0 : 8, scale: reducedMotion ? 1 : 0.99,
      transition: { duration: reducedMotion ? 0 : 0.16, ease: 'easeIn' } });
    dialogRef.current?.close();
  };
  const handleCancel = (event: SyntheticEvent<HTMLDialogElement>) => {
    event.preventDefault(); event.stopPropagation(); void requestClose();
  };
  const handleClose = () => {
    // StrictMode may queue a cleanup close event after showModal has reopened the dialog.
    if (!dialogRef.current?.open) onClose();
  };
  return { dialogRef, controls, closing, reducedMotion, requestClose, handleCancel, handleClose };
}

const CloseButton = ({ label, onClose }: { label: string; onClose: () => void }) => (
  <button className="case-close" type="button" onClick={onClose} aria-label={label} title={`${label} (Esc)`}>
    <X size={22} strokeWidth={1.5} aria-hidden="true" />
  </button>
);

const ViewerImage = ({ image }: { image: CaseGalleryImage }) => {
  const [loaded, setLoaded] = useState(false);
  return <>
    <img className="case-viewer-preview" src={`${import.meta.env.BASE_URL}${image.src.slice(1).replace('.png', '-preview.webp')}`} alt="" aria-hidden="true" style={image.crop} />
    <img className="case-viewer-original" src={`${import.meta.env.BASE_URL}${image.src.slice(1).replace('.png', '-full.webp')}`} alt={image.alt} style={image.crop} decoding="async" data-loaded={loaded} onLoad={() => setLoaded(true)} />
  </>;
};

const ImageViewer = ({ images, index, onIndexChange, onClose }: {
  images: CaseGalleryImage[]; index: number; onIndexChange: (index: number) => void; onClose: () => void;
}) => {
  const { dialogRef, controls, closing, reducedMotion, requestClose, handleCancel, handleClose } = useAnimatedDialog(onClose);
  const [direction, setDirection] = useState(1);
  const image = images[index];
  const step = (by: number) => {
    if (closing) return;
    setDirection(by);
    onIndexChange((index + by + images.length) % images.length);
  };
  const ratioStyle = { '--case-image-ratio': image.aspectRatio } as CSSProperties;
  return (
    <dialog ref={dialogRef} className="case-image-viewer" data-closing={closing} aria-label="Просмотр изображения" onClose={handleClose} onCancel={handleCancel}
      onKeyDown={(event) => {
        if (event.key === 'ArrowLeft' || event.key === 'ArrowRight') {
          event.preventDefault(); event.stopPropagation(); step(event.key === 'ArrowLeft' ? -1 : 1);
        }
      }}
      onClick={(event) => { if (event.target === event.currentTarget) void requestClose(); }}>
      <motion.div className="case-viewer-panel" style={ratioStyle} initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.985 }} animate={controls}>
        <header className="case-viewer-toolbar">
          <span aria-live="polite">{index + 1} / {images.length}</span>
          <CloseButton label="Закрыть изображение" onClose={() => void requestClose()} />
        </header>
        <div className="case-viewer-stage" onClick={(event) => { if (event.target === event.currentTarget) void requestClose(); }}>
          <div className="case-viewer-work">
            <button className="case-viewer-arrow case-viewer-arrow--prev" type="button" onClick={() => step(-1)} aria-label="Предыдущее изображение" disabled={closing}><ArrowLeft size={22} strokeWidth={1.5} aria-hidden="true" /></button>
            <div className="case-viewer-image">
              <AnimatePresence initial={false} mode="wait" custom={direction}>
                <motion.div key={image.src} className="case-viewer-image-layer" custom={direction}
                  variants={{ enter: (by: number) => ({ opacity: 0, x: reducedMotion ? 0 : by * 8 }), visible: { opacity: 1, x: 0 }, exit: (by: number) => ({ opacity: 0, x: reducedMotion ? 0 : -by * 6 }) }}
                  initial="enter" animate="visible" exit="exit" transition={{ duration: reducedMotion ? 0 : 0.14, ease: 'easeOut' }}>
                  <ViewerImage image={image} />
                </motion.div>
              </AnimatePresence>
            </div>
            <button className="case-viewer-arrow case-viewer-arrow--next" type="button" onClick={() => step(1)} aria-label="Следующее изображение" disabled={closing}><ArrowRight size={22} strokeWidth={1.5} aria-hidden="true" /></button>
          </div>
        </div>
        <p className="case-viewer-caption">{image.alt}</p>
      </motion.div>
    </dialog>
  );
};

const CaseDialog = ({ caseItem, onClose }: { caseItem: CaseItem; onClose: () => void }) => {
  const { dialogRef, controls, closing, reducedMotion, requestClose, handleCancel, handleClose } = useAnimatedDialog(onClose, true);
  const [imageIndex, setImageIndex] = useState<number | null>(null);
  const presentation = casePresentations[caseItem.id];
  const story = caseStories[caseItem.id];
  const renderImage = (image: CaseGalleryImage, index: number) => (
    <motion.button key={image.src} type="button" className="case-image-tile"
      initial={{ opacity: reducedMotion ? 1 : 0, y: reducedMotion ? 0 : 6 }} animate={{ opacity: 1, y: 0 }}
      transition={{ duration: reducedMotion ? 0 : 0.18, ease: 'easeOut' }}
      style={{ aspectRatio: image.aspectRatio }} onClick={() => { if (!closing) setImageIndex(index); }}
      aria-label={`Увеличить: ${image.alt}`} data-figma-node={image.nodeId}>
      <img src={`${import.meta.env.BASE_URL}${image.src.slice(1).replace('.png', '-preview.webp')}`} alt={image.alt} style={image.crop}
        loading={index < 2 ? 'eager' : 'lazy'} decoding="async" />
    </motion.button>
  );
  return (
    <dialog ref={dialogRef} className="case-dialog" data-closing={closing} aria-labelledby={`case-title-${caseItem.id}`} onClose={handleClose} onCancel={handleCancel} data-case-id={caseItem.id}
      onClick={(event) => { if (event.target === event.currentTarget) void requestClose(); }}>
      <motion.div className="case-modal-panel" initial={{ opacity: 0, y: reducedMotion ? 0 : 12, scale: reducedMotion ? 1 : 0.985 }} animate={controls}>
        <CloseButton label="Закрыть кейс" onClose={() => void requestClose()} />
        <div className="case-scroll">
          <article className={`case-page case-page--${presentation.layout}`}>
            <header className="case-toolbar">
              <p>{presentation.meta}{presentation.layout === 'magazine' ? ` · ${caseItem.id.endsWith('1') ? '1' : '2'} выпуск` : ''}</p>
            </header>
            <div className="case-heading-row">
              <h2 id={`case-title-${caseItem.id}`}>{presentation.title}</h2>
            </div>
            <section className="case-feature" aria-label="О проекте">
              <p className="case-description">{story.context}</p>
              <dl className="case-project-facts">
                <div><dt>Моя роль</dt><dd>{story.role}</dd></div>
                <div><dt>Материалы</dt><dd>{story.materials}</dd></div>
              </dl>
            </section>
            <section className="case-reading-section" aria-labelledby={`case-decisions-${caseItem.id}`}>
              <h3 className="case-section-label" id={`case-decisions-${caseItem.id}`}>Дизайнерские решения</h3>
              <div className="case-gallery" aria-label={`Изображения кейса ${caseItem.title}`}>
                {presentation.images.map(renderImage)}
              </div>
            </section>
          </article>
        </div>
      </motion.div>
      {imageIndex !== null && <ImageViewer images={presentation.images} index={imageIndex} onIndexChange={setImageIndex} onClose={() => setImageIndex(null)} />}
    </dialog>
  );
};

export const CaseDetailModal = ({ caseItem, onClose }: CaseDetailModalProps) => (
  caseItem ? <CaseDialog key={caseItem.id} caseItem={caseItem} onClose={onClose} /> : null
);
