import { createContext } from 'react';

import { IFormContext } from '../types';

export const FormContext = createContext<IFormContext | null>(null);

export const FormProvider = FormContext.Provider;
