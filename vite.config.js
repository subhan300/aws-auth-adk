
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ command, mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    return {
        define: {
            'process.env.CLIENT_ID': JSON.stringify(env.CLIENT_ID),
            'process.env.REGION': JSON.stringify(env.REGION),
            'process.env.USER_POOL_ID': JSON.stringify(env.USER_POOL_ID),
        },
    };
});