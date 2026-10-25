import { useMemo } from 'react';
import { WorldShell } from '@/ui/WorldShell';
import { ConversationPanel } from './ConversationPanel';
import { Phrasebook } from './Phrasebook';
import { PRESETS } from './presets';
import { Readout } from './Readout';
import { useLanguageUi } from './store';
import './language.css';

interface Props {
  lessonId: string;
  stageIndex: number;
}

export default function LanguageWorld({ lessonId, stageIndex }: Props) {
  const presetId = useLanguageUi((s) => s.presetId);
  const engine = useLanguageUi((s) => s.engine);
  const turnIndex = useLanguageUi((s) => s.snapshot.turnIndex);
  const applyPreset = useLanguageUi((s) => s.applyPreset);
  const group = PRESETS[presetId]?.vocabularyGroup ?? 'neighbour';

  const simulationContext = useMemo(
    () => ({ presetId, measurements: engine.measurements(), assumptions: engine.assumptions() }),
    // The instructor's view of the conversation refreshes when the scene, the turn or the stage changes.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [presetId, turnIndex, stageIndex],
  );

  const panels = (
    <div className="viewport-panels">
      <Phrasebook group={group} />
      <Readout />
    </div>
  );

  return (
    <WorldShell
      worldId="conversation"
      worldName="Conversation Street"
      lessonId={lessonId}
      stageIndex={stageIndex}
      applyPreset={applyPreset}
      simulationContext={simulationContext}
      renderViewport={() => (
        <>
          <div className="dialogue-wrap">
            <ConversationPanel />
          </div>
          {panels}
        </>
      )}
      renderTextMode={() => (
        <>
          <ConversationPanel />
          {panels}
        </>
      )}
    />
  );
}
