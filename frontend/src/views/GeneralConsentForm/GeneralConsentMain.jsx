import React from 'react';
import GeneralConsentFormEnglish from './forms/English';
import GeneralConsentFormHindi from './forms/Hindi';

const GeneralConsentMain = () => {
  return (
    <div>
      <GeneralConsentFormEnglish />
      <GeneralConsentFormHindi />
    </div>
  );
};

export default GeneralConsentMain;
