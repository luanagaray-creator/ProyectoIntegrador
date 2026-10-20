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
let AdminDirectory;
before(async () => {
  vite = await createServer({ server: { middlewareMode: true, hmr: false, watch: null } });
  AuthContext = (await vite.ssrLoadModule('/src/auth/AuthContext.js')).AuthContext;
  Packages = (await vite.ssrLoadModule('/src/Components/AvailablePackages/index.jsx')).default;
  AdminPlan = (await vite.ssrLoadModule('/src/Components/AdminPlan/index.jsx')).default;
  Home = (await vite.ssrLoadModule('/src/Components/Home/index.jsx')).default;
  GroupChoices = (await vite.ssrLoadModule('/src/Components/AdminPlan/GroupChoices.jsx')).default;
  PaymentPage = (await vite.ssrLoadModule('/src/Components/PaymentPage/index.jsx')).default;
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
  purchase: { plan: 'Small Plan', spaceIds: ['space'], amount: 250 },
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
  const backend = JSON.parse(readFileSync(new URL('../../../ServidorProyectoBackend/servidor-proyecto/config/planLimits.json', import.meta.url), 'utf8'));
  assert.deepEqual(frontend.planLimits, backend);
  const html = render(Packages, user);
  for (const limit of [3, 4, 6]) assert.match(html, new RegExp(`Hasta ${limit} espacios`));
  assert.equal((html.match(/30 usuarios por espacio/g) || []).length, 3);
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
  const paidAdmin = { ...emptyAdmin, purchase: { plan: 'Small Plan', spaceIds: [] }, managedInstitutions: [{ ...emptyAdmin.managedInstitutions[0], plan: 'Small Plan', amount: 250, maxSpaces: 3 }] };
  const dashboard = render(AdminPlan, paidAdmin);
  assert.match(dashboard, /Nombre del nuevo espacio/);
  assert.match(dashboard, /0 de 3 espacios creados/);
  assert.doesNotMatch(dashboard, /1ro TIC|Guardar espacios|type="checkbox"/);
});

test('al completar el cupo de espacios la interfaz bloquea la creación', () => {
  const full = { ...user, managedInstitutions: [{ id: 'institution', name: 'Mi institución', plan: 'Small Plan', amount: 250, spaceCount: 3, maxSpaces: 3 }] };
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
