import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let Header;
let AuthContext;
before(async () => {
  vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null } });
  Header = (await vite.ssrLoadModule('/src/Components/Header/index.jsx')).default;
  AuthContext = (await vite.ssrLoadModule('/src/auth/AuthContext.js')).AuthContext;
});
after(async () => { await vite?.close(); });

function render(auth) {
  return renderToStaticMarkup(React.createElement(MemoryRouter, null,
    React.createElement(AuthContext.Provider, { value: { user: null, authLoading: false, logout: async () => {}, ...auth } },
      React.createElement(Header, { home: true }))));
}

test('header sin sesión muestra registro y login', () => {
  const html = render({});
  assert.match(html, /href="\/register"/);
  assert.match(html, /href="\/login"/);
  assert.doesNotMatch(html, /Cerrar sesión/);
});

test('header con sesión sustituye registro/login por logout y el componente Profile', () => {
  const html = render({ user: { name: 'Ana', typeUser: 'admin' } });
  assert.match(html, /Cerrar sesión/);
  assert.match(html, /class="profile"/);
  assert.match(html, /class="profile__content-title">Ana/);
  assert.match(html, /class="profile__content-text">admin/);
  assert.doesNotMatch(html, /href="\/register"|href="\/login"/);
});

test('restauración de sesión muestra carga sin anunciar usuario desconectado', () => {
  const html = render({ authLoading: true });
  assert.match(html, /Cargando sesión/);
  assert.doesNotMatch(html, /href="\/register"|href="\/login"/);
});

test('nombre del perfil se escapa como texto', () => {
  const html = render({ user: { name: '<script>alert(1)</script>', typeUser: 'user' } });
  assert.match(html, /&lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
});
