import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let Header;
let AuthContext;
let Home;
let PaymentPage;
before(async () => {
  vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null } });
  Header = (await vite.ssrLoadModule('/src/Components/Header/index.jsx')).default;
  AuthContext = (await vite.ssrLoadModule('/src/auth/AuthContext.js')).AuthContext;
  Home = (await vite.ssrLoadModule('/src/Components/Home/index.jsx')).default;
  PaymentPage = (await vite.ssrLoadModule('/src/Components/PaymentPage/index.jsx')).default;
});
after(async () => { await vite?.close(); });

function render(auth, Component = Header, entries) {
  return renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: entries },
    React.createElement(AuthContext.Provider, { value: { user: null, authLoading: false, logout: async () => {}, ...auth } },
      React.createElement(Component, { home: true }))));
}

test('Ingresar solo aparece con sesión restaurada y pago simulado', () => {
  for (const auth of [{}, { user: { idUser: 'a' } }, { authLoading: true, user: { purchase: {} } }, { sessionError: 'Sin conexión', user: { purchase: {} } }]) {
    assert.doesNotMatch(render(auth, Home), />\s*Ingresar\s*</);
  }
  assert.match(render({ user: { purchase: { plan: 'Small Plan' } } }, Home), />\s*Ingresar\s*</);
});

test('cada paquete admite pago simulado y pide sesión a visitantes', () => {
  for (const plan of ['Small Plan', 'Medium Plan', 'Large Plan']) {
    const entries = [{ pathname: '/payment-page', state: { plan } }];
    assert.match(render({}, PaymentPage, entries), /Para completar el pago simulado/);
    const html = render({ user: { idUser: 'a' } }, PaymentPage, entries);
    assert.match(html, /Simular pago/);
    assert.match(html, new RegExp(plan));
    assert.match(html, new RegExp(`<strong>${{ 'Small Plan': 250, 'Medium Plan': 500, 'Large Plan': 750 }[plan]}</strong>`));
    assert.doesNotMatch(html, /Código de seguridad/);
  }
  assert.match(render({ user: {} }, PaymentPage), /Elegir un paquete/);
});

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
