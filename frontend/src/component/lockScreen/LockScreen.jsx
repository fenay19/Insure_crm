import React, { useEffect, useState, forwardRef } from 'react';
import PatternLock from 'react-pattern-lock';
import './lockscreen.css';

const LockScreen = forwardRef(({ onClose }, ref) => {
  const [path, setPath] = useState([]);
  const [disabled, setDisabled] = useState(false);
  const [savedPattern, setSavedPattern] = useState(null);
  const [error, setError] = useState(null);

  const reset = () => {
    setDisabled(false);
    setPath([]);
    setError(null);
  };

  const handleFinish = () => {
    const inputPattern = path.join(',');

    // ✅ Case 1: No saved pattern → allow setting new password
    if (!savedPattern) {
      if (path.length < 4) {
        setError('Pattern should contain at least 4 dots!');
        return;
      }
      const newPattern = inputPattern;
      setSavedPattern(newPattern);

      const lockData = {
        savedPattern: newPattern,
        status: true
      };
      localStorage.setItem('lockData', JSON.stringify(lockData));

      setDisabled(true);
      setError('✅ Pattern saved successfully! Use this to unlock next time.');
      reset();
    }
    // ✅ Case 2: Pattern already exists → only login allowed
    else {
      if (inputPattern === savedPattern) {
        setError('✅ Pattern matched! Unlocking...');
        setTimeout(() => {
          onClose();
          const unlockData = {
            savedPattern,
            status: false
          };
          localStorage.setItem('lockData', JSON.stringify(unlockData));
        }, 1000);
      } else {
        setError('❌ Incorrect pattern. Please try again.');
      }
    }
  };

  useEffect(() => {
    const lockData = localStorage.getItem('lockData');
    if (lockData) {
      const parsedData = JSON.parse(lockData);
      if (parsedData.savedPattern) {
        setSavedPattern(parsedData.savedPattern);
        console.log('🔒 Existing pattern loaded from storage');
      }
    }
  }, []);

  return (
    <div className="container">
      <div className="content">
        {/* ✅ Heading shows mode */}
        <h2>{savedPattern ? '🔐 Enter Pattern to Unlock' : '📝 Set a New Pattern'}</h2>

        <PatternLock
          path={path}
          width={300}
          size={3}
          disabled={disabled}
          onChange={(path) => setPath(path)}
          onFinish={handleFinish}
          style={{ margin: '0 auto' }}
        />

        {error && <p className="error-message">{error}</p>}
        {/* <p>Pattern output: {path.join(', ')}</p> */}

        {/* ✅ Styled Reset Button */}
        <button
          onClick={reset}
          style={{
            marginTop: '15px',
            padding: '10px 20px',
            backgroundColor: '#1976d2',
            color: 'white',
            border: 'none',
            borderRadius: '6px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold',
            transition: '0.3s'
          }}
          onMouseOver={(e) => (e.target.style.backgroundColor = '#125a9c')}
          onMouseOut={(e) => (e.target.style.backgroundColor = '#1976d2')}
        >
          Reset
        </button>
      </div>
    </div>
  );
});

export default LockScreen;
