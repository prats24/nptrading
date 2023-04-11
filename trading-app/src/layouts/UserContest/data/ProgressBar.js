import React, { useState } from 'react';
import '../ProgressBar.css';

function ProgressBar({progress}) {
//   const [progress, setProgress] = useState(props.progress);

  const fillWidth = {
    width: `${progress}%`
  };

  return (
    <div className="progress-bar-container">
      <div className="progress-bar-fill" style={fillWidth}>
      </div>
    </div>
  );
}

export default ProgressBar;
