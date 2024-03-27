import Box from '@mui/material/Box';
import { FC } from 'react';

import Logo from '@/assets/logo.png';
import { FormSubmit, InputForm, LanguageSelect, TextInput } from '@/components';
import { validateInputs } from '@/helpers';
import { useAuth } from '@/hooks';
import { IFormInputs, setFn } from '@/types';

interface IJoinRoom {
  setUsername: setFn<string>;
  setLang: setFn<string>;
}

const JoinRoom: FC<IJoinRoom> = ({ setUsername, setLang }) => {
  const { login } = useAuth();

  const setValues = (inputs: IFormInputs) => {
    setUsername(inputs['Username'].value);
    setLang(inputs['Lang'].value);
    login(inputs['Room Name'].value);
  };

  return (
    <Box
      sx={{
        paddingTop: 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      <img
        alt="logo"
        height={125}
        src={Logo}
        style={{ marginBottom: '1rem' }}
      />
      <InputForm validateInputs={validateInputs} onSubmit={setValues}>
        <TextInput
          autoFocus
          id="room-name"
          label="Room Name"
          name="Room Name"
          placeholder="My_Custom_Room"
          type="text"
          variant="outlined"
        />
        <TextInput
          id="username"
          label="Username"
          name="Username"
          placeholder="Bob"
          type="text"
          variant="outlined"
        />
        <LanguageSelect />
        <FormSubmit fullWidth color="success" variant="contained">
          Join Room
        </FormSubmit>
      </InputForm>
    </Box>
  );
};

export default JoinRoom;
