import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'app.lovable.eb75defa8018476f85103872f75a0aad',
  appName: 'Smart Expense Tracker',
  webDir: 'dist',
  server: {
    url: 'https://eb75defa-8018-476f-8510-3872f75a0aad.lovableproject.com?forceHideBadge=true',
    cleartext: true
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#f8fafc',
      showSpinner: false
    }
  }
};

export default config;