import { RouterProvider } from 'react-router';
import { SiteContentProvider } from './components/SiteContentProvider';
import { router } from './routes';

export default function App() {
  return (
    <SiteContentProvider>
      <RouterProvider router={router} />
    </SiteContentProvider>
  );
}
