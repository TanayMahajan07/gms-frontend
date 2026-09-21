export default function PlanForm({ form, saving, onChange, onSubmit, onClear }) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>{form.id ? 'Edit plan' : 'Add plan'}</h2>
        {form.id && (
          <button type="button" className="text-button" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="member-form">
        <div className="field-grid">
          <label>
            <span>Plan name</span>
            <input
              required
              value={form.planName}
              onChange={(e) => onChange('planName', e.target.value)}
              placeholder="Monthly"
            />
          </label>
          <label>
            <span>Price</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              value={form.price}
              onChange={(e) => onChange('price', e.target.value)}
            />
          </label>
          <label>
            <span>Duration</span>
            <input
              required
              type="number"
              min="1"
              step="1"
              value={form.duration}
              onChange={(e) => onChange('duration', e.target.value)}
            />
          </label>
          <label>
            <span>Duration unit</span>
            <select
              required
              value={form.durationUnit}
              onChange={(e) => onChange('durationUnit', e.target.value)}
            >
              <option value="DAY">Day</option>
              <option value="MONTH">Month</option>
              <option value="YEAR">Year</option>
            </select>
          </label>
        </div>

        <label>
          <span>Description</span>
          <textarea
            value={form.description}
            onChange={(e) => onChange('description', e.target.value)}
            rows="2"
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => onChange('active', e.target.checked)}
          />
          <span>Active plan</span>
        </label>

        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? 'Saving...' : form.id ? 'Update plan' : 'Create plan'}
        </button>
      </form>
    </section>
  )
}
