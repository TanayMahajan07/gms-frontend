export default function RecordPaymentForm({
  memberships,
  form,
  summary,
  summaryLoading,
  saving,
  message,
  error,
  onChange,
  onSubmit,
}) {
  const balance = summary ? Number(summary.balance) : null
  const canPay = balance != null && balance >= 0.01

  return (
    <section className="panel form-panel">
      <div className="panel-heading">
        <h2>Record payment</h2>
      </div>

      <form
        className="member-form"
        onSubmit={(event) => {
          event.preventDefault()
          onSubmit({
            membershipId: Number(form.membershipId),
            amount: Number(form.amount),
            paymentDate: form.paymentDate,
            paymentMethod: form.paymentMethod,
            transactionReference: form.transactionReference.trim() || null,
            remarks: form.remarks.trim() || null,
          })
        }}
      >
        <div className="field-grid">
          <label>
            <span>Membership</span>
            <select
              required
              value={form.membershipId}
              onChange={(e) => onChange('membershipId', e.target.value)}
            >
              <option value="">Select membership</option>
              {memberships.map((item) => (
                <option key={item.id} value={item.id}>
                  {item.membershipCode} — {item.memberName} ({item.planName})
                </option>
              ))}
            </select>
          </label>

          <label>
            <span>Member</span>
            <input
              value={
                summary
                  ? `${summary.memberCode || ''} — ${summary.memberName || ''}`.trim()
                  : ''
              }
              readOnly
              disabled
              placeholder={summaryLoading ? 'Loading...' : 'Select membership'}
            />
          </label>

          <label>
            <span>Plan</span>
            <input
              value={summary?.planName || ''}
              readOnly
              disabled
              placeholder={summaryLoading ? 'Loading...' : '—'}
            />
          </label>

          <label>
            <span>Amount due</span>
            <input
              value={summary ? Number(summary.amountDue).toFixed(2) : ''}
              readOnly
              disabled
            />
          </label>

          <label>
            <span>Amount paid</span>
            <input
              value={summary ? Number(summary.amountPaid).toFixed(2) : ''}
              readOnly
              disabled
            />
          </label>

          <label>
            <span>Balance</span>
            <input
              value={summary ? Number(summary.balance).toFixed(2) : ''}
              readOnly
              disabled
            />
          </label>

          <label>
            <span>Payment amount</span>
            <input
              required
              type="number"
              min="0.01"
              step="0.01"
              max={canPay ? balance : undefined}
              value={form.amount}
              onChange={(e) => onChange('amount', e.target.value)}
              disabled={!canPay}
            />
          </label>

          <label>
            <span>Payment date</span>
            <input
              required
              type="date"
              value={form.paymentDate}
              onChange={(e) => onChange('paymentDate', e.target.value)}
            />
          </label>

          <label>
            <span>Payment method</span>
            <select
              required
              value={form.paymentMethod}
              onChange={(e) => onChange('paymentMethod', e.target.value)}
            >
              <option value="CASH">Cash</option>
              <option value="UPI">UPI</option>
              <option value="CARD">Card</option>
              <option value="BANK_TRANSFER">Bank transfer</option>
              <option value="OTHER">Other</option>
            </select>
          </label>

          <label>
            <span>Transaction reference (optional)</span>
            <input
              value={form.transactionReference}
              onChange={(e) => onChange('transactionReference', e.target.value)}
              maxLength={100}
            />
          </label>

          <label>
            <span>Remarks (optional)</span>
            <input
              value={form.remarks}
              onChange={(e) => onChange('remarks', e.target.value)}
              maxLength={500}
            />
          </label>
        </div>

        {summary && !canPay && (
          <p className="login-help">This membership is already fully paid.</p>
        )}

        {message && <div className="notice success">{message}</div>}
        {error && <div className="notice error">{error}</div>}

        <button type="submit" className="primary-button" disabled={saving || !canPay}>
          {saving ? 'Saving...' : 'Record payment'}
        </button>
      </form>
    </section>
  )
}
