import React, { useState } from 'react';
import './HomePage.css';

function PlanPage() {
  const [income, setIncome] = useState('');
  const [expenses, setExpenses] = useState([{ name: '', amount: '' }]);
  const [plan, setPlan] = useState(null);

  const handleIncomeChange = (e) => {
    setIncome(e.target.value.replace(/\D/g, ''));
  };

  const handleExpenseChange = (idx, field, value) => {
    setExpenses(expenses =>
      expenses.map((exp, i) =>
        i === idx ? { ...exp, [field]: field === 'amount' ? value.replace(/\D/g, '') : value } : exp
      )
    );
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { name: '', amount: '' }]);
  };

  const handleRemoveExpense = (idx) => {
    setExpenses(expenses => expenses.filter((_, i) => i !== idx));
  };

  const handlePlan = (e) => {
    e.preventDefault();
    const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    const balance = (parseFloat(income) || 0) - totalExpenses;
    setPlan({ totalExpenses, balance });
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 700, marginTop: 40 }}>
        <h1 style={{ color: '#1a5c3e', textAlign: 'center', marginBottom: 18 }}>Планирование бюджета</h1>
        <p style={{ textAlign: 'center', color: '#256837', marginBottom: 24 }}>
          Введите доход и запланируйте расходы на месяц, чтобы избежать неожиданных трат.
        </p>
        <form className="finance-form" onSubmit={handlePlan} style={{ marginBottom: 32 }}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Месячный доход (₸)"
            value={income}
            onChange={handleIncomeChange}
            style={{ marginBottom: 12 }}
            required
          />
          <div style={{ marginBottom: 12 }}>
            <strong style={{ color: '#256837' }}>Запланированные расходы:</strong>
            {expenses.map((exp, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Категория (например, еда)"
                  value={exp.name}
                  onChange={e => handleExpenseChange(idx, 'name', e.target.value)}
                  style={{ flex: 2, padding: 8, borderRadius: 8, border: '1px solid #b7c28b' }}
                  required
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Сумма (₸)"
                  value={exp.amount}
                  onChange={e => handleExpenseChange(idx, 'amount', e.target.value)}
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #b7c28b' }}
                  required
                />
                {expenses.length > 1 && (
                  <button
                    type="button"
                    className="start-button"
                    style={{ background: '#e87d56', color: '#fff', padding: '4px 10px', fontSize: '1rem', borderRadius: 8 }}
                    onClick={() => handleRemoveExpense(idx)}
                  >
                    ×
                  </button>
                )}
              </div>
            ))}
            <button
              type="button"
              className="start-button"
              style={{ marginTop: 10, background: '#4fd1c5', color: '#fff', fontSize: '1rem', borderRadius: 8 }}
              onClick={handleAddExpense}
            >
              + Добавить расход
            </button>
          </div>
          <button
            type="submit"
            className="start-button"
            style={{ fontSize: '1.1rem', padding: '10px 32px', marginTop: 12 }}
          >
            Рассчитать план
          </button>
        </form>
        {plan && (
          <div className="analytics-report" style={{ marginTop: 24 }}>
            <div>
              <strong>Суммарные расходы:</strong> {plan.totalExpenses.toLocaleString()} ₸
            </div>
            <div>
              <strong>Остаток после расходов:</strong>{' '}
              <span style={{ color: plan.balance >= 0 ? '#1a5c3e' : '#e87d56', fontWeight: 700 }}>
                {plan.balance.toLocaleString()} ₸
              </span>
            </div>
            {plan.balance < 0 && (
              <div style={{ color: '#e87d56', marginTop: 10 }}>
                Внимание: ваши расходы превышают доход!
              </div>
            )}
          </div>
        )}
        <button
          className="start-button"
          style={{ marginTop: 40, fontSize: '1rem', padding: '12px 32px' }}
          onClick={() => window.history.back()}
        >
          Назад
        </button>
      </section>
    </div>
  );
}

export default PlanPage;
