// backend/src/index.js
import { app } from './server.js';

const PORT = 4444;

app.listen(PORT, () => {
    console.log(`[SERVER] Server is running on port ${PORT}`);
});