import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/queryClient';
import Hub from '../Hub.tsx';

function App() {
    return (
        <QueryClientProvider client={queryClient}>
            <div className="app">
                <Hub />
            </div>
        </QueryClientProvider>
    );
}

export default App;
