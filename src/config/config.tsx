import env from 'config/env';

class Config {
    static env = env;

    static client = typeof window !== 'undefined';
}

export default Config;