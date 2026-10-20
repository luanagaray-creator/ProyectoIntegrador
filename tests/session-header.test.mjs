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

test('Ingresar depende del acceso habilitado y no de pagos individuales anteriores', () => {
  for (const auth of [{}, { user: { idUser: 'a', hasAccess: false, purchase: { plan: 'Small Plan' } } }, { authLoading: true, user: { hasAccess: true } }, { sessionError: 'Sin conexión', user: { hasAccess: true } }]) {
    assert.doesNotMatch(render(auth, Home), />\s*Ingresar\s*</);
  }
  assert.match(render({ user: { typeUser: 'user', groupCode: '3ro TIC', hasAccess: true, purchase: null } }, Home), />\s*Ingresar\s*</);
});

test('cada paquete permite pagar a administradores sin elegir espacios predefinidos', () => {
  for (const plan of ['Small Plan', 'Medium Plan', 'Large Plan']) {
    const entries = [{ pathname: '/payment-page', state: { plan } }];
    assert.match(render({}, PaymentPage, entries), /cuenta administradora/);
    const html = render({ user: { idUser: 'a', typeUser: 'admin', canPurchase: true, managedSpaces: [{id:'space1',name:'3ro TIC',institutionName:'�nima'}] } }, PaymentPage, entries);
    assert.match(html, /Simular pago/);
    assert.match(html, new RegExp(plan));
    assert.match(html, new RegExp(`<strong>${{ 'Small Plan': 250, 'Medium Plan': 500, 'Large Plan': 750 }[plan]}</strong>`));
    assert.doesNotMatch(html, /Código de seguridad/);
    assert.match(html, /Podrás crear hasta/);
    assert.doesNotMatch(html, /Espacios incluidos en el plan|type="checkbox"/);
    assert.doesNotMatch(render({ user: { idUser: 'b', typeUser: 'user' } }, PaymentPage, entries), />Simular pago</);
  }
  assert.match(render({ user: { typeUser: 'admin', canPurchase: true, managedSpaces: [] } }, PaymentPage), /Elegir un paquete/);
});

test('header sin sesión muestra registro y login', () => {
  const html = render({});
  assert.match(html, /href="\/register"/);
  assert.match(html, /href="\/login"/);
  assert.doesNotMatch(html, /Cerrar sesión/);
});

test('el menú móvil identifica su panel y comienza cerrado sin ocultar enlaces del escritorio', () => {
  const html = render({});
  assert.match(html, /aria-label="Navegación principal"/);
  assert.match(html, /class="header__menu-toggle" aria-expanded="false" aria-controls="header-menu" aria-label="Abrir menú"/);
  assert.match(html, /id="header-menu" class="header__sections"/);
  assert.doesNotMatch(html, /header__sections--open/);
  assert.match(html, /href="\/home#footer"/);
});

test('header con sesión sustituye registro/login por logout y el componente Profile', () => {
  const html = render({ user: { name: 'Ana', typeUser: 'admin' } });
  assert.match(html, /Cerrar sesión/);
  assert.match(html, /class="profile"/);
  assert.match(html, /class="profile__content-title">Ana/);
  assert.match(html, /class="profile__content-text">Administrador/);
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

 test('solo superadmin administra instituciones', () => {
   assert.match(render({user:{name:'Thotem',typeUser:'superadmin'}}), /href="\/platform"/);
   assert.doesNotMatch(render({user:{name:'Alumno',typeUser:'user'}}), /href="\/platform"|href="\/admin-plan"/);
 });
