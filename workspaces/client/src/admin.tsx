import ReactDOM from 'react-dom/client';

import { AdminApp } from '@wsh-2024/admin/src/index';

// import { preloadImages } from './utils/preloadImages';
import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  // NOTE: don't wait for the service worker to register
  registerServiceWorker();
  // await preloadImages();

  const root = window.document.getElementById('root')!;
  ReactDOM.createRoot(root).render(<AdminApp />);
};

main().catch(console.error);
