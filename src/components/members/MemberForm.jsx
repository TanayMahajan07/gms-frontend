export default function MemberForm({ form, saving, onChange, onSubmit, onClear }) {
  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>{form.id ? 'Edit member' : 'Add member'}</h2>
        {form.id && (
          <button type="button" className="text-button" onClick={onClear}>
            Clear
          </button>
        )}
      </div>

      <form onSubmit={onSubmit} className="member-form">
        <div className="field-grid">
          <label>
            <span>First name</span>
            <input
              required
              value={form.firstName}
              onChange={(e) => onChange('firstName', e.target.value)}
            />
          </label>
          <label>
            <span>Last name</span>
            <input
              required
              value={form.lastName}
              onChange={(e) => onChange('lastName', e.target.value)}
            />
          </label>
          <label>
            <span>Gender</span>
            <select value={form.gender} onChange={(e) => onChange('gender', e.target.value)}>
              <option value="">Select</option>
              <option value="MALE">Male</option>
              <option value="FEMALE">Female</option>
              <option value="OTHER">Other</option>
            </select>
          </label>
          <label>
            <span>Date of birth</span>
            <input
              type="date"
              value={form.dateOfBirth}
              onChange={(e) => onChange('dateOfBirth', e.target.value)}
            />
          </label>
          <label>
            <span>Mobile</span>
            <input value={form.mobile} onChange={(e) => onChange('mobile', e.target.value)} />
          </label>
          <label>
            <span>Email</span>
            <input
              type="email"
              value={form.email}
              onChange={(e) => onChange('email', e.target.value)}
            />
          </label>
          <label>
            <span>City</span>
            <input value={form.city} onChange={(e) => onChange('city', e.target.value)} />
          </label>
          <label>
            <span>Joining date</span>
            <input
              required
              type="date"
              value={form.joiningDate}
              onChange={(e) => onChange('joiningDate', e.target.value)}
            />
          </label>
        </div>

        <label>
          <span>Address</span>
          <textarea
            value={form.address}
            onChange={(e) => onChange('address', e.target.value)}
            rows="2"
          />
        </label>

        <div className="field-grid">
          <label>
            <span>Emergency contact</span>
            <input
              value={form.emergencyContactName}
              onChange={(e) => onChange('emergencyContactName', e.target.value)}
            />
          </label>
          <label>
            <span>Emergency number</span>
            <input
              value={form.emergencyContactNumber}
              onChange={(e) => onChange('emergencyContactNumber', e.target.value)}
            />
          </label>
        </div>

        <label>
          <span>Remarks</span>
          <textarea
            value={form.remarks}
            onChange={(e) => onChange('remarks', e.target.value)}
            rows="2"
          />
        </label>

        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={form.active}
            onChange={(e) => onChange('active', e.target.checked)}
          />
          <span>Active member</span>
        </label>

        <button type="submit" className="primary-button" disabled={saving}>
          {saving ? 'Saving...' : form.id ? 'Update member' : 'Create member'}
        </button>
      </form>
    </section>
  )
}
