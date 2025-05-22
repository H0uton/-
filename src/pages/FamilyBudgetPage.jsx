import React, { useState, useEffect } from 'react';
import './HomePage.css';

function FamilyBudgetPage() {
  const [members, setMembers] = useState([{ name: '', income: '' }]);
  const [expenses, setExpenses] = useState([{ name: '', amount: '' }]);
  const [summary, setSummary] = useState(null);
  const [saved, setSaved] = useState(false);

  // Загрузка из localStorage
  useEffect(() => {
    const stored = localStorage.getItem('my_family_budget');
    if (stored) {
      const { members, expenses } = JSON.parse(stored);
      setMembers(members || [{ name: '', income: '' }]);
      setExpenses(expenses || [{ name: '', amount: '' }]);
    }
  }, []);

  // Сохранять в localStorage при каждом изменении
  useEffect(() => {
    if (saved) {
      localStorage.setItem('my_family_budget', JSON.stringify({ members, expenses }));
      setSaved(false);
    }
  }, [members, expenses, saved]);

  const handleMemberChange = (idx, field, value) => {
    setMembers(members =>
      members.map((m, i) =>
        i === idx ? { ...m, [field]: field === 'income' ? value.replace(/\D/g, '') : value } : m
      )
    );
    setSaved(false);
  };

  const handleAddMember = () => {
    setMembers([...members, { name: '', income: '' }]);
    setSaved(false);
  };

  const handleRemoveMember = (idx) => {
    setMembers(members => members.filter((_, i) => i !== idx));
    setSaved(false);
  };

  const handleExpenseChange = (idx, field, value) => {
    setExpenses(expenses =>
      expenses.map((exp, i) =>
        i === idx ? { ...exp, [field]: field === 'amount' ? value.replace(/\D/g, '') : value } : exp
      )
    );
    setSaved(false);
  };

  const handleAddExpense = () => {
    setExpenses([...expenses, { name: '', amount: '' }]);
    setSaved(false);
  };

  const handleRemoveExpense = (idx) => {
    setExpenses(expenses => expenses.filter((_, i) => i !== idx));
    setSaved(false);
  };

  const handleCalculate = (e) => {
    e.preventDefault();
    const totalIncome = members.reduce((sum, m) => sum + (parseFloat(m.income) || 0), 0);
    const totalExpenses = expenses.reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0);
    setSummary({ totalIncome, totalExpenses, balance: totalIncome - totalExpenses });
  };

  const handleSaveFamilyBudget = (e) => {
    e.preventDefault();
    localStorage.setItem('my_family_budget', JSON.stringify({ members, expenses }));
    setSaved(true);
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 800, marginTop: 40 }}>
        <h1 style={{ color: '#1a5c3e', textAlign: 'center', marginBottom: 18 }}>Семейный бюджет</h1>
        <p style={{ textAlign: 'center', color: '#256837', marginBottom: 24 }}>
          Введите доходы всех членов семьи и общие расходы, чтобы видеть баланс совместного бюджета.
        </p>
        <form className="finance-form" onSubmit={handleCalculate} style={{ marginBottom: 32 }}>
          <div style={{ marginBottom: 18 }}>
            <strong style={{ color: '#256837' }}>Доходы членов семьи:</strong>
            {members.map((m, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Имя"
                  value={m.name}
                  onChange={e => handleMemberChange(idx, 'name', e.target.value)}
                  style={{ flex: 2, padding: 8, borderRadius: 8, border: '1px solid #b7c28b' }}
                  required
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Доход (₸)"
                  value={m.income}
                  onChange={e => handleMemberChange(idx, 'income', e.target.value)}
                  style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #b7c28b' }}
                  required
                />
                {members.length > 1 && (
                  <button
                    type="button"
                    className="start-button"
                    style={{ background: '#e87d56', color: '#fff', padding: '4px 10px', fontSize: '1rem', borderRadius: 8 }}
                    onClick={() => handleRemoveMember(idx)}
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
              onClick={handleAddMember}
            >
              + Добавить члена семьи
            </button>
          </div>
          <div style={{ marginBottom: 18 }}>
            <strong style={{ color: '#256837' }}>Общие расходы:</strong>
            {expenses.map((exp, idx) => (
              <div key={idx} style={{ display: 'flex', gap: 8, marginTop: 8 }}>
                <input
                  type="text"
                  placeholder="Категория (например, продукты)"
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
            Рассчитать бюджет
          </button>
        </form>
        <form onSubmit={handleSaveFamilyBudget}>
          <button
            type="submit"
            className="start-button"
            style={{ fontSize: '1.1rem', padding: '10px 32px', marginTop: 12, background: '#256837', color: '#fff' }}
          >
            Сохранить семейный бюджет
          </button>
          {saved && (
            <div style={{ color: '#1a5c3e', marginTop: 10, fontWeight: 600 }}>
              Изменения сохранены!
            </div>
          )}
        </form>
        {summary && (
          <div className="analytics-report" style={{ marginTop: 24 }}>
            <div>
              <strong>Общий доход семьи:</strong> {summary.totalIncome.toLocaleString()} ₸
            </div>
            <div>
              <strong>Общие расходы:</strong> {summary.totalExpenses.toLocaleString()} ₸
            </div>
            <div>
              <strong>Баланс:</strong>{' '}
              <span style={{ color: summary.balance >= 0 ? '#1a5c3e' : '#e87d56', fontWeight: 700 }}>
                {summary.balance.toLocaleString()} ₸
              </span>
            </div>
            {summary.balance < 0 && (
              <div style={{ color: '#e87d56', marginTop: 10 }}>
                Внимание: расходы превышают общий доход!
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

export default FamilyBudgetPage;
