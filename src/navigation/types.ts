import type { Visit } from '../types/models';

export type AuthStackParamList = {
  Welcome: undefined;
  SignUp: undefined;
  Login: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Discover: undefined;
  Profile: undefined;
};

export type AppStackParamList = {
  MainTabs: undefined;
  AddPark: undefined;
  ParkDetail: { visit: Visit };
};
