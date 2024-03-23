import ReactDOM from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { SWRConfig } from 'swr';

import { AdminApp } from '@wsh-2024/admin/src/index';
import { ClientApp } from '@wsh-2024/app/src/index';

import { preloadImages } from './utils/preloadImages';
import { registerServiceWorker } from './utils/registerServiceWorker';

const main = async () => {
  // NOTE: don't wait for the service worker to register
  registerServiceWorker();
  // await preloadImages();

  if (window.location.pathname.startsWith('/admin')) {
    const root = window.document.getElementById('root')!;
    ReactDOM.createRoot(root).render(<AdminApp />);
  } else {
    const root = window.document.getElementById('root')!;
    ReactDOM.hydrateRoot(
      root,
      <SWRConfig value={{ revalidateIfStale: true, revalidateOnFocus: false, revalidateOnReconnect: false }}>
        <BrowserRouter>
          <ClientApp />
        </BrowserRouter>
      </SWRConfig>,
    );
  }
};

main().catch(console.error);
