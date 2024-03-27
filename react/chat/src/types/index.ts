import { Dispatch, SetStateAction } from 'react';

export enum MSG_TYPES {
  JOINED = 'joined',
  MESSAGE = 'message',
  LEAVE = 'leave',
}

export type setFn<T> = Dispatch<SetStateAction<T>>;

export type Language = {
  code: 'string';
  name: 'string';
  targets: ['string'];
};

export type User = {
  username: string;
  roomName: string;
  lang: string;
};

export interface IMessage {
  message: string;
  timestamp: string;
  username: string;
  lang: string;
}

export interface IRoomEvent {
  msg_type: MSG_TYPES;
  message?: string;
  timestamp: string;
  userID?: number;
  username: string;
  lang?: string;
}

export interface IAvatar {
  [key: string]: string;
}

export interface IFormInputs {
  [name: string]: {
    value: string;
    invalid: boolean;
    invalidMsg: string | null;
  };
}

export interface IFormContext {
  inputs: IFormInputs;
  setInputInitialState: (inputName: string, initialValue?: string) => void;
  onChange: (event: { target: { value: string; name: string } }) => void;
  isValid: number;
}
