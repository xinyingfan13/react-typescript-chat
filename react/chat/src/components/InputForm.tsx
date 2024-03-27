import { Box, BoxProps } from '@mui/material';
import { FC, FormEvent, useState } from 'react';

import { FormProvider } from '@/contexts';
import { IFormInputs } from '@/types';

interface IInputForm extends Omit<BoxProps, 'onSubmit'> {
  onSubmit: (inputs: IFormInputs) => void;
  validateInputs: (inputName: string, input: string) => string | null;
  resetOnSubmit?: boolean;
}

export const InputForm: FC<IInputForm> = ({
  children,
  onSubmit,
  validateInputs,
  resetOnSubmit,
  ...props
}) => {
  const [inputs, setInputs] = useState<IFormInputs>({});
  const [isValid, setIsValid] = useState(0);

  const setInputInitialState = (inputName: string, initialValue = '') => {
    const INITIAL_INPUT_STATE = {
      invalid: false,
      invalidMsg: null,
      value: initialValue,
    };

    setInputs((prevState) => {
      if (inputName in prevState) {
        return prevState;
      }
      return {
        ...prevState,
        [inputName]: INITIAL_INPUT_STATE,
      };
    });
  };

  const onChange = (event: { target: { name: string; value: string } }) => {
    const newValue = event.target.value;
    const inputName = event.target.name;
    let is_valid = 0;
    setInputs((prevState) => {
      const errMsg = validateInputs(inputName, newValue);
      if (errMsg) {
        if (!prevState[inputName].invalid) {
          is_valid = -1;
        }
      } else {
        if (prevState[inputName].invalid) {
          is_valid = 1;
        }
      }
      return {
        ...prevState,
        [inputName]: {
          ...prevState[inputName],
          invalidMsg: errMsg,
          invalid: errMsg ? true : false,
          value: newValue,
        },
      };
    });
    setIsValid((prev) => prev + is_valid);
  };

  const resetInputs = (defaultValue = '') => {
    setInputs((prevState) => {
      Object.keys(prevState).forEach((key) => {
        prevState[key] = {
          ...prevState[key],
          value: defaultValue,
        };
      });
      return prevState;
    });
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const is_valid = handleIsValid();
    if (is_valid === 0) {
      onSubmit(inputs);
      if (resetOnSubmit) {
        resetInputs('');
      }
    }
    setIsValid(is_valid);
  };

  const handleIsValid = () => {
    let is_valid = 0;
    setInputs((prevState) => {
      Object.keys(prevState).forEach((key) => {
        const errMsg = validateInputs(key, prevState[key].value);
        if (errMsg) {
          --is_valid;
          prevState[key] = {
            ...prevState[key],
            invalid: errMsg ? true : false,
            invalidMsg: errMsg,
          };
        }
      });
      return prevState;
    });
    return is_valid;
  };

  return (
    <FormProvider
      value={{
        onChange,
        inputs,
        isValid,
        setInputInitialState,
      }}
    >
      <Box noValidate component="form" onSubmit={handleSubmit} {...props}>
        {children}
      </Box>
    </FormProvider>
  );
};
