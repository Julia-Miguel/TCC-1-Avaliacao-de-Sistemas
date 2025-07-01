import { app } from './server.js';

const PORT = 4444;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[SERVER] Server is running on http://localhost:${PORT}`);
});
