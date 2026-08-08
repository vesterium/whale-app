import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.whale.app',
  appName: 'Whale',
  webDir: 'dist',
  backgroundColor: '#050505',
  android: {
    backgroundColor: '#050505',
  },
  ios: {
    backgroundColor: '#050505',
    contentInset: 'always',
  },
};

export default config;
