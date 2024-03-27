import {
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
} from '@mui/material';
import { FC, useEffect, useState } from 'react';

import { useFormContext } from '@/hooks';
import { Language } from '@/types';

export const LanguageSelect: FC = () => {
  const formContext = useFormContext();

  const [languagesList, setLanguagesList] = useState<Language[]>([]);

  useEffect(() => {
    formContext.setInputInitialState('Lang');
  }, [formContext]);

  useEffect(() => {
    fetch(`${import.meta.env.VITE_LIBRE_BASE_URL}/languages`)
      .then((res) => res.json())
      .then((data) => setLanguagesList(data));
  }, []);

  return (
    <FormControl
      error={formContext.inputs['Lang'] && formContext.inputs['Lang'].invalid}
      sx={{ m: 1, minWidth: 120 }}
      variant="outlined"
    >
      <InputLabel id="language-label">Language</InputLabel>
      <Select
        id="language-select"
        label="Language"
        labelId="language-label"
        name="Lang"
        value={
          'Lang' in formContext.inputs ? formContext.inputs['Lang'].value : ''
        }
        onChange={formContext.onChange}
      >
        {languagesList.map((language) => {
          return (
            <MenuItem key={language.code} value={language.code}>
              {language.name}
            </MenuItem>
          );
        })}
      </Select>
      <FormHelperText>
        {' '}
        {'Lang' in formContext.inputs && formContext.inputs['Lang'].invalid
          ? formContext.inputs['Lang'].invalidMsg
          : ' '}
      </FormHelperText>
    </FormControl>
  );
};
