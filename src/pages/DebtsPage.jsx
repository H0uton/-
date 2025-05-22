import React, { useState, useEffect } from 'react';
import './HomePage.css';

function DebtsPage() {
  const [debts, setDebts] = useState([]);
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [note, setNote] = useState('');

  // Загрузка долгов из localStorage при монтировании
  useEffect(() => {
    const stored = localStorage.getItem('my_finance_debts');
    if (stored) {
      setDebts(JSON.parse(stored));
    }
  }, []);

  // Сохранять долги в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('my_finance_debts', JSON.stringify(debts));
  }, [debts]);

  const handleAddDebt = (e) => {
    e.preventDefault();
    if (!name || !amount) return;
    setDebts([
      ...debts,
      {
        name,
        amount: parseFloat(amount),
        note,
      },
    ]);
    setName('');
    setAmount('');
    setNote('');
  };

  const handleDeleteDebt = (idx) => {
    setDebts(debts => debts.filter((_, i) => i !== idx));
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 700, marginTop: 40 }}>
        <h1>Отчёты о задолженностях</h1>
        <form className="finance-form" onSubmit={handleAddDebt} style={{ marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Кому/от кого (имя или организация)"
            value={name}
            onChange={e => setName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Сумма (₸)"
            value={amount}
            onChange={e => setAmount(e.target.value.replace(/\D/g, ''))}
            required
          />
          <input
            type="text"
            placeholder="Комментарий (необязательно)"
            value={note}
            onChange={e => setNote(e.target.value)}
          />
          <button className="start-button" type="submit" style={{ fontSize: '1rem', padding: '10px 22px' }}>
            Добавить задолженность
          </button>
        </form>
        <div>
          {debts.length === 0 && <p>Пока нет задолженностей.</p>}
          {debts.map((d, i) => (
            <div key={i} className="card" style={{ marginBottom: 18 }}>
              <strong>{d.name}</strong>
              <div>Сумма: {d.amount.toLocaleString()} ₸</div>
              {d.note && <div>Комментарий: {d.note}</div>}
              <button
                className="start-button"
                style={{
                  fontSize: '0.95rem',
                  padding: '6px 14px',
                  background: '#e87d56',
                  color: '#fff',
                  marginTop: 10,
                }}
                onClick={() => handleDeleteDebt(i)}
                type="button"
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
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

export default DebtsPage;
