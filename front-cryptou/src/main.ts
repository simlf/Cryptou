import { createApp } from "vue";
import App from "./App.vue";
import "./assets/main.css";
import "./assets/base.css";
import router from "./router";

// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import { aliases, mdi } from "vuetify/iconsets/mdi";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

const app = createApp(App);

const vuetify = createVuetify({
  theme: {
      defaultTheme: 'myCustomTheme',
      themes: {
          myCustomTheme: {
              colors: {
                  green: '#48A9A6',
                  background: '#ccc',
                  surface: '#48A9A6',
                  primary: '#00ff00',
                  'primary-darken-1': '#3700B3',
                  secondary: '#03DAC5',
                  'secondary-darken-1': '#03DAC5',
                  error: '#CF6679',
                  info: '#2196F3',
                  success: '#4CAF50',
                  warning: '#FB8C00'
              }
          }
      }
  },
  components,
  directives,
  display: {
      mobileBreakpoint: "md",
      thresholds: {
          xs: 0,
          sm: 640,
          md: 768,
          lg: 1024,
          xl: 1280,
      },
  },
  icons: {
      defaultSet: "mdi",
      aliases,
      sets: {
          mdi,
      },
  },
});

app.use(router);
app.use(vuetify);

app.mount("#app");
