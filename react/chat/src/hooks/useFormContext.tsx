import { useContext } from 'react';

import { FormContext } from '../contexts';

export const useFormContext = () => {
  const context = useContext(FormContext);

  if (!context) {
    throw new Error('useFormContext should be used within FormProvider');
  }

  return context;
};
