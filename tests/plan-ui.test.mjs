import test, { before, after } from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import React from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { MemoryRouter } from 'react-router-dom';
import { createServer } from 'vite';

let vite;
let AuthContext;
let Packages;
let AdminPlan;
let Home;
let GroupChoices;
let PaymentPage;
let CurrentPlan;
let AdminDirectory;
before(async () => {
  vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null } });
  AuthContext = (await vite.ssrLoadModule('/src/auth/AuthContext.js')).AuthContext;
  Packages = (await vite.ssrLoadModule('/src/Components/AvailablePackages/index.jsx')).default;
  AdminPlan = (await vite.ssrLoadModule('/src/Components/AdminPlan/index.jsx')).default;
  Home = (await vite.ssrLoadModule('/src/Components/Home/index.jsx')).default;
  GroupChoices = (await vite.ssrLoadModule('/src/Components/AdminPlan/GroupChoices.jsx')).default;
  PaymentPage = (await vite.ssrLoadModule('/src/Components/PaymentPage/index.jsx')).default;
  CurrentPlan = (await vite.ssrLoadModule('/src/Components/CurrentPlan/index.jsx')).default;
  AdminDirectory = (await vite.ssrLoadModule('/src/Components/InstitutionPlatform/AdminDirectory.jsx')).default;
});
after(async () => { await vite?.close(); });

function render(Component, user, entries) {
  return renderToStaticMarkup(React.createElement(MemoryRouter, { initialEntries: entries },
    React.createElement(AuthContext.Provider, { value: { user, authLoading: false } }, React.createElement(Component))));
}
const user = {
  idUser: 'admin', typeUser: 'admin', canPurchase: true,
  managedSpaces: [{ id: 'space', name: 'Mi clase', institutionId: 'institution', institutionName: 'Institución' }],
  purchase: { plan: 'Small Plan', spaceIds: ['space'], amount: 200 },
};

test('planes contratados muestran Plan Actual y ofrecen cancelar desde administración', () => {
  assert.equal((render(Packages, user).match(/Plan Actual/g) || []).length, 1);
  assert.doesNotMatch(render(Packages, { ...user, purchase: null }), /Plan Actual/);
  assert.match(render(AdminPlan, user), /Cancelar plan/);
  assert.doesNotMatch(render(AdminPlan, { ...user, purchase: null }), /Cancelar plan/);
  assert.match(render(Home, user), /Plan Actual/);
});

test('paquetes informan los cupos reales y la configuración coincide con el servidor', () => {
  const frontend = JSON.parse(readFileSync(new URL('../package.json', import.meta.url), 'utf8'));
  const backend = JSON.parse(readFileSync(new URL('../../proyectoIntegrador-servidor/config/planLimits.json', import.meta.url), 'utf8'));
  assert.deepEqual(frontend.planLimits, backend);
  const html = render(Packages, user);
  for (const limit of [10, 20, 30]) assert.match(html, new RegExp(`Hasta ${limit} espacios`));
  assert.equal((html.match(/25 usuarios por espacio/g) || []).length, 3);
  for (const total of [250, 500, 750]) assert.doesNotMatch(html, new RegExp(`\\(${total} en total\\)`));
  for (const price of [200, 350, 450]) assert.match(html, new RegExp(`${price} USD`));
  const totals = JSON.parse(readFileSync(new URL('../../proyectoIntegrador-servidor/config/plans.json', import.meta.url), 'utf8'));
  assert.deepEqual(frontend.planTotalUsers, totals);
});

test('cada plan muestra su capacidad calculada por espacio en administración, detalles y pago', () => {
  for (const [plan, price, spaces, members, total] of [['Small Plan', 200, 10, 25, 250], ['Medium Plan', 350, 20, 25, 500], ['Large Plan', 450, 30, 25, 750]]) {
    const admin = { ...user, purchase: { plan, amount: price }, managedInstitutions: [{ id: 'institution', name: 'Institución', plan, amount: price, maxSpaces: spaces, spaceCount: 1 }] };
    assert.match(render(AdminPlan, admin), new RegExp(`${members} usuarios por espacio \\(${total} en total\\)`));
    assert.match(render(CurrentPlan, admin), new RegExp(`<strong>${members}</strong><span>usuarios comunes por espacio`));
    const payment = render(PaymentPage, admin, [{ pathname: '/payment-page', state: { plan, institutionId: 'institution' } }]);
    assert.match(payment, new RegExp(`${members} usuarios por espacio \\(${total} en total\\)`));
    assert.match(payment, new RegExp(`${price} USD`));
  }
});

test('selector bloquea nuevas selecciones al llegar al cupo, conservando la opción de quitar', () => {
  const options = [1, 2, 3, 4].map(id => ({ id, label: `Clase ${id}` }));
  const html = renderToStaticMarkup(React.createElement(GroupChoices, { value: [1, 2, 3], options, max: 3, onChange() {} }));
  assert.equal((html.match(/disabled=""/g) || []).length, 1);
  assert.equal((html.match(/checked=""/g) || []).length, 3);
  assert.match(html, /3 de 3 espacios seleccionados/);
  assert.match(html, /Quitar selección/);
});

test('el administrador sin espacios puede pagar primero y ve el formulario para crearlos', () => {
  const emptyAdmin = { ...user, purchase: null, managedSpaces: [], managedInstitutions: [{ id: 'institution', name: 'Mi institución', spaceCount: 0, plan: null, maxSpaces: 0 }] };
  const payment = render(PaymentPage, emptyAdmin, [{ pathname: '/payment-page', state: { plan: 'Small Plan', institutionId: 'institution' } }]);
  assert.match(payment, /<button class="payment-page__content-boxBottom-button">Simular pago<\/button>/);
  assert.doesNotMatch(payment, /type="checkbox"/);
  const paidAdmin = { ...emptyAdmin, purchase: { plan: 'Small Plan', spaceIds: [] }, managedInstitutions: [{ ...emptyAdmin.managedInstitutions[0], plan: 'Small Plan', amount: 200, maxSpaces: 10 }] };
  const dashboard = render(AdminPlan, paidAdmin);
  assert.match(dashboard, /Nombre del nuevo espacio/);
  assert.match(dashboard, /0 de 10 espacios creados/);
  assert.doesNotMatch(dashboard, /1ro TIC|Guardar espacios|type="checkbox"/);
});

test('al completar el cupo de espacios la interfaz bloquea la creación', () => {
  const full = { ...user, managedInstitutions: [{ id: 'institution', name: 'Mi institución', plan: 'Small Plan', amount: 200, spaceCount: 10, maxSpaces: 10 }] };
  assert.match(render(AdminPlan, full), /<button class="admin-plan__primary" disabled="">Límite de espacios alcanzado<\/button>/);
});

test('listado de administradores muestra una sola fila por cuenta y todas sus instituciones', () => {
  const html = renderToStaticMarkup(React.createElement(AdminDirectory, {
    accounts: [{ idUser: 'admin', name: 'Alee', email: 'alee@example.com' }, { idUser: 'other', name: 'Javi', email: 'javi@example.com' }],
    institutions: [{ id: 'a', name: 'Institución A' }, { id: 'b', name: 'Institución B' }],
    assignments: [{ idUser: 'admin', institutionId: 'a' }, { idUser: 'admin', institutionId: 'b' }],
  }));
  assert.equal((html.match(/<strong>Alee<\/strong>/g) || []).length, 1);
  assert.match(html, /alee@example.com/);
  assert.match(html, /Institución A/);
  assert.match(html, /Institución B/);
  assert.match(html, /Sin institución asignada/);
  assert.match(html, /2 en total/);
});

test('listado distingue administradores activos e inactivos y ofrece la acción correspondiente', () => {
  const html = renderToStaticMarkup(React.createElement(AdminDirectory, {
    accounts: [{ idUser: 'active', name: 'Activa', email: 'activa@example.com', isActive: true }, { idUser: 'inactive', name: 'Inactiva', email: 'inactiva@example.com', isActive: false }],
    institutions: [], assignments: [], onAction() {},
  }));
  assert.match(html, />Activo<\/span>/);
  assert.match(html, />Inactivo<\/span>/);
  assert.match(html, /aria-label="Desactivar administrador Activa"/);
  assert.match(html, /aria-label="Reactivar administrador Inactiva"/);
  assert.match(html, /<option value="inactive">Inactivos<\/option>/);
});
