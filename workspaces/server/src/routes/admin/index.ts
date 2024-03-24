import fs from 'node:fs';

import { Hono } from 'hono';

import { ADMIN_HTML_PATH } from '../../constants/paths';

const app = new Hono();

const html = fs.readFileSync(ADMIN_HTML_PATH, 'utf-8');

app.get('/admin', async (c) => {
  return c.html(html);
});

app.get('/admin/*', async (c) => {
  return c.html(html);
});

export { app as adminApp };
