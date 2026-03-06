import { NavigatorScreenParams } from '@react-navigation/native';

export type RootStackParamList = {
  Home: undefined;
  Onboarding: { mode?: 'party' | 'couples' };
  PartyStack: NavigatorScreenParams<PartyStackParamList>;
  CouplesStack: NavigatorScreenParams<CouplesStackParamList>;
  Paywall: { returnTo?: string };
  ExitConfirm: undefined;
  Settings: undefined;
};

export type PartyStackParamList = {
  PartySetup: undefined;
  PartyGame: undefined;
  PartyEnd: undefined;
};

export type CouplesStackParamList = {
  CouplesSetup: undefined;
  CouplesGame: undefined;
  CouplesEnd: undefined;
};