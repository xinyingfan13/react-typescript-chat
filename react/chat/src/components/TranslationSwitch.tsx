import { FormControlLabel, Switch } from '@mui/material';
import { ChangeEvent, FC } from 'react';

import { setFn } from '@/types';

interface ITranslationSwitch {
  shouldTranslate: boolean;
  setShouldTranslate: setFn<boolean>;
}

export const TranslationSwitch: FC<ITranslationSwitch> = ({
  shouldTranslate,
  setShouldTranslate,
}) => {
  const handleOnChange = (e: ChangeEvent<HTMLInputElement>) => {
    setShouldTranslate(e.target.checked);
  };

  return (
    <FormControlLabel
      control={
        <Switch
          checked={shouldTranslate}
          color="default"
          inputProps={{ 'aria-label': 'controlled' }}
          onChange={handleOnChange}
        />
      }
      label={shouldTranslate ? 'Translated' : 'Original'}
    />
  );
};
