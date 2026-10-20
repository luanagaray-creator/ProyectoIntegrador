import { GROUPS } from '../../auth/groups';
const defaultOptions = GROUPS.map(value => ({ id: value, label: value }));
export default function GroupChoices({ value, onChange, disabled, options = defaultOptions, title = 'Espacios incluidos en el plan', max = options.length }) {
  return <fieldset className="plan-group-choices" disabled={disabled}>
    <legend>{title}</legend>
    <div className="plan-group-choices__options">{options.map(option => <label key={option.id}>
      <input type="checkbox" checked={value.includes(option.id)} disabled={!value.includes(option.id) && value.length >= max} onChange={event => onChange(event.target.checked ? [...value, option.id] : value.filter(item => item !== option.id))} />{option.label}
    </label>)}</div>
    <span>{value.length} de {max} espacios seleccionados</span>
    <button type="button" onClick={() => onChange(value.length ? [] : options.slice(0, max).map(option => option.id))}>{value.length ? 'Quitar selección' : 'Seleccionar disponibles'}</button>
  </fieldset>;
}
