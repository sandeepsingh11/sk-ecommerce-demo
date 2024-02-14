import { PUBLIC_COMMERCEJS_PUBLIC_KEY } from '$env/static/public';
import Commerce from '@chec/commerce.js';

export const commercejs = new Commerce(PUBLIC_COMMERCEJS_PUBLIC_KEY);