import React, { useState } from 'react';
import { AudioVisualizer } from 'react-audio-visualize';


const VoiceVisualizer = () => {
  const [blob, setBlob] = useState<Blob>(require('../media/a.mp3'));
  const visualizerRef = useRef<HTMLCanvasElement>(null)

  // set blob somewhere in code

  return (
    <div>
      {blob && (
        <AudioVisualizer
          ref={visualizerRef}
          blob={blob}
          width={500}
          height={75}
          barWidth={1}
          gap={0}
          barColor={'#f76565'}
        />
      )}
    </div>
  )
} 
export default VoiceVisualizer