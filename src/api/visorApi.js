const mode = import.meta.env.VITE_MODE;

const viewerServer = {
  dev: {
    IP: import.meta.env.VITE_DEV_IP_VISOR,
    API_PORT: import.meta.env.VITE_DEV_VISOR_SERVER_PORT,
  },
  uat: {
    IP: import.meta.env.VITE_UAT_IP_VISOR,
    API_PORT: import.meta.env.VITE_UAT_VISOR_SERVER_PORT,
  },
  prod: {
    IP: import.meta.env.VITE_PROD_IP_VISOR,
    API_PORT: import.meta.env.VITE_PROD_VISOR_SERVER_PORT,
  },
};

const currentViewer = viewerServer[mode] || viewerServer['dev'];

export default currentViewer;
