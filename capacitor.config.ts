import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.move3k.app',
  appName: 'Move3K',
  webDir: 'public',
  server: {
    url: 'https://crypto-athletes-club.vercel.app/',
    cleartext: false,
  },
};

export default config;
