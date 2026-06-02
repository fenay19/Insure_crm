// vite.config.mjs
import { defineConfig, loadEnv } from "file:///D:/nabh/new-frontend/node_modules/vite/dist/node/index.js";
import react from "file:///D:/nabh/new-frontend/node_modules/@vitejs/plugin-react/dist/index.mjs";
import jsconfigPaths from "file:///D:/nabh/new-frontend/node_modules/vite-jsconfig-paths/dist/index.mjs";
var vite_config_default = defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), "");
  const API_URL = `${env.VITE_APP_BASE_NAME}`;
  const PORT = `${"3000"}`;
  return {
    server: {
      // this ensures that the browser opens upon server start
      open: true,
      port: PORT
    },
    define: {
      global: "window"
    },
    resolve: {
      //     alias: [
      //       {
      //         find: /^~(.+)/,
      //         replacement: path.join(process.cwd(), 'node_modules/$1')
      //       },
      //       {
      //         find: /^src(.+)/,
      //         replacement: path.join(process.cwd(), 'src/$1')
      //       }
      //     ]
    },
    preview: {
      // this ensures that the browser opens upon preview start
      open: true,
      port: PORT
    },
    // base: API_URL,
    plugins: [react(), jsconfigPaths()]
  };
});
export {
  vite_config_default as default
};
//# sourceMappingURL=data:application/json;base64,ewogICJ2ZXJzaW9uIjogMywKICAic291cmNlcyI6IFsidml0ZS5jb25maWcubWpzIl0sCiAgInNvdXJjZXNDb250ZW50IjogWyJjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZGlybmFtZSA9IFwiRDpcXFxcbmFiaFxcXFxuZXctZnJvbnRlbmRcIjtjb25zdCBfX3ZpdGVfaW5qZWN0ZWRfb3JpZ2luYWxfZmlsZW5hbWUgPSBcIkQ6XFxcXG5hYmhcXFxcbmV3LWZyb250ZW5kXFxcXHZpdGUuY29uZmlnLm1qc1wiO2NvbnN0IF9fdml0ZV9pbmplY3RlZF9vcmlnaW5hbF9pbXBvcnRfbWV0YV91cmwgPSBcImZpbGU6Ly8vRDovbmFiaC9uZXctZnJvbnRlbmQvdml0ZS5jb25maWcubWpzXCI7aW1wb3J0IHsgZGVmaW5lQ29uZmlnLCBsb2FkRW52IH0gZnJvbSAndml0ZSc7XHJcbmltcG9ydCByZWFjdCBmcm9tICdAdml0ZWpzL3BsdWdpbi1yZWFjdCc7XHJcbmltcG9ydCBqc2NvbmZpZ1BhdGhzIGZyb20gJ3ZpdGUtanNjb25maWctcGF0aHMnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGVmaW5lQ29uZmlnKCh7IG1vZGUgfSkgPT4ge1xyXG4gIGNvbnN0IGVudiA9IGxvYWRFbnYobW9kZSwgcHJvY2Vzcy5jd2QoKSwgJycpO1xyXG4gIGNvbnN0IEFQSV9VUkwgPSBgJHtlbnYuVklURV9BUFBfQkFTRV9OQU1FfWA7XHJcbiAgLy8gdGhpcyBzZXRzIGEgZGVmYXVsdCBwb3J0IHRvIDMwMDBcclxuICBjb25zdCBQT1JUID0gYCR7JzMwMDAnfWA7XHJcblxyXG4gIHJldHVybiB7XHJcbiAgICBzZXJ2ZXI6IHtcclxuICAgICAgLy8gdGhpcyBlbnN1cmVzIHRoYXQgdGhlIGJyb3dzZXIgb3BlbnMgdXBvbiBzZXJ2ZXIgc3RhcnRcclxuICAgICAgb3BlbjogdHJ1ZSxcclxuICAgICAgcG9ydDogUE9SVFxyXG4gICAgfSxcclxuICAgIGRlZmluZToge1xyXG4gICAgICBnbG9iYWw6ICd3aW5kb3cnXHJcbiAgICB9LFxyXG4gICAgcmVzb2x2ZToge1xyXG4gICAgICAvLyAgICAgYWxpYXM6IFtcclxuICAgICAgLy8gICAgICAge1xyXG4gICAgICAvLyAgICAgICAgIGZpbmQ6IC9efiguKykvLFxyXG4gICAgICAvLyAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ25vZGVfbW9kdWxlcy8kMScpXHJcbiAgICAgIC8vICAgICAgIH0sXHJcbiAgICAgIC8vICAgICAgIHtcclxuICAgICAgLy8gICAgICAgICBmaW5kOiAvXnNyYyguKykvLFxyXG4gICAgICAvLyAgICAgICAgIHJlcGxhY2VtZW50OiBwYXRoLmpvaW4ocHJvY2Vzcy5jd2QoKSwgJ3NyYy8kMScpXHJcbiAgICAgIC8vICAgICAgIH1cclxuICAgICAgLy8gICAgIF1cclxuICAgIH0sXHJcbiAgICBwcmV2aWV3OiB7XHJcbiAgICAgIC8vIHRoaXMgZW5zdXJlcyB0aGF0IHRoZSBicm93c2VyIG9wZW5zIHVwb24gcHJldmlldyBzdGFydFxyXG4gICAgICBvcGVuOiB0cnVlLFxyXG4gICAgICBwb3J0OiBQT1JUXHJcbiAgICB9LFxyXG4gICAgLy8gYmFzZTogQVBJX1VSTCxcclxuICAgIHBsdWdpbnM6IFtyZWFjdCgpLCBqc2NvbmZpZ1BhdGhzKCldXHJcbiAgfTtcclxufSk7XHJcbiJdLAogICJtYXBwaW5ncyI6ICI7QUFBc1AsU0FBUyxjQUFjLGVBQWU7QUFDNVIsT0FBTyxXQUFXO0FBQ2xCLE9BQU8sbUJBQW1CO0FBRTFCLElBQU8sc0JBQVEsYUFBYSxDQUFDLEVBQUUsS0FBSyxNQUFNO0FBQ3hDLFFBQU0sTUFBTSxRQUFRLE1BQU0sUUFBUSxJQUFJLEdBQUcsRUFBRTtBQUMzQyxRQUFNLFVBQVUsR0FBRyxJQUFJLGtCQUFrQjtBQUV6QyxRQUFNLE9BQU8sR0FBRyxNQUFNO0FBRXRCLFNBQU87QUFBQSxJQUNMLFFBQVE7QUFBQTtBQUFBLE1BRU4sTUFBTTtBQUFBLE1BQ04sTUFBTTtBQUFBLElBQ1I7QUFBQSxJQUNBLFFBQVE7QUFBQSxNQUNOLFFBQVE7QUFBQSxJQUNWO0FBQUEsSUFDQSxTQUFTO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQTtBQUFBO0FBQUE7QUFBQSxJQVdUO0FBQUEsSUFDQSxTQUFTO0FBQUE7QUFBQSxNQUVQLE1BQU07QUFBQSxNQUNOLE1BQU07QUFBQSxJQUNSO0FBQUE7QUFBQSxJQUVBLFNBQVMsQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDO0FBQUEsRUFDcEM7QUFDRixDQUFDOyIsCiAgIm5hbWVzIjogW10KfQo=
