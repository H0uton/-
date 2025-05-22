import React, { useState, useEffect } from 'react';
import './HomePage.css';

function GoalsPage() {
  const [goalName, setGoalName] = useState('');
  const [goalAmount, setGoalAmount] = useState('');
  const [saved, setSaved] = useState('');
  const [goals, setGoals] = useState([]);

  // Загрузка целей из localStorage при монтировании
  useEffect(() => {
    const stored = localStorage.getItem('my_finance_goals');
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, []);

  // Сохранять цели в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('my_finance_goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = (e) => {
    e.preventDefault();
    if (!goalName || !goalAmount) return;
    setGoals([
      ...goals,
      {
        name: goalName,
        amount: parseFloat(goalAmount),
        saved: parseFloat(saved) || 0,
      },
    ]);
    setGoalName('');
    setGoalAmount('');
    setSaved('');
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 700, marginTop: 40 }}>
        <h1>Финансовые цели</h1>
        <form className="finance-form" onSubmit={handleAddGoal} style={{ marginBottom: 32 }}>
          <input
            type="text"
            placeholder="Название цели (например, отпуск)"
            value={goalName}
            onChange={e => setGoalName(e.target.value)}
            required
          />
          <input
            type="number"
            placeholder="Сумма для достижения цели (₸)"
            value={goalAmount}
            onChange={e => setGoalAmount(e.target.value.replace(/\D/g, ''))}
            required
          />
          <input
            type="number"
            placeholder="Уже накоплено (₸)"
            value={saved}
            onChange={e => setSaved(e.target.value.replace(/\D/g, ''))}
          />
          <button className="start-button" type="submit" style={{ fontSize: '1rem', padding: '10px 22px' }}>
            Добавить цель
          </button>
        </form>
        <div>
          {goals.length === 0 && <p>Пока нет целей. Добавьте первую!</p>}
          {goals.map((g, i) => (
            <div key={i} className="card" style={{ marginBottom: 18 }}>
              <strong>{g.name}</strong>
              <div>Цель: {g.amount.toLocaleString()} ₸</div>
              <div>Накоплено: {g.saved.toLocaleString()} ₸</div>
              <div>
                Прогресс:
                <div className="analytics-bar" style={{ marginTop: 6 }}>
                  <div
                    className="analytics-bar-goal"
                    style={{
                      width: `${Math.min(100, Math.round((g.saved / g.amount) * 100))}%`,
                      minWidth: 10,
                    }}
                  />
                </div>
                <span style={{ fontWeight: 600, marginLeft: 8 }}>
                  {Math.min(100, Math.round((g.saved / g.amount) * 100))}%
                </span>
              </div>
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

export default GoalsPage;
