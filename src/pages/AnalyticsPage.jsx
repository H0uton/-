import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';

function AnalyticsPage() {
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [savings, setSavings] = useState('');
  const [goal, setGoal] = useState('');
  const navigate = useNavigate();

  // Аналитика и отчёты: вычисление процентов расходов, накоплений и цели
  const analytics = (() => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expense) || 0;
    const sav = parseFloat(savings) || 0;
    const goalValue = parseFloat(goal) || 0;
    return {
      expensePercent: inc > 0 ? Math.round((exp / inc) * 100) : 0,
      savingsPercent: inc > 0 ? Math.round((sav / inc) * 100) : 0,
      goalPercent: goalValue > 0 ? Math.min(100, Math.round((sav / goalValue) * 100)) : 0,
    };
  })();

  // Функция для форматирования числа с разделителем тысяч
  const formatNumber = (value) => {
    if (!value) return '';
    const digits = value.replace(/\D/g, '');
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 700, marginTop: 40 }}>
        <h1>Аналитика и отчёты</h1>
        <p>Введите ваши данные для анализа:</p>
        <form className="finance-form" style={{ marginBottom: 32 }}>
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ваш доход (₸)"
            value={formatNumber(income)}
            onChange={e => setIncome(e.target.value.replace(/\D/g, ''))}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Ваш расход (₸)"
            value={formatNumber(expense)}
            onChange={e => setExpense(e.target.value.replace(/\D/g, ''))}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Сбережения (₸)"
            value={formatNumber(savings)}
            onChange={e => setSavings(e.target.value.replace(/\D/g, ''))}
          />
          <input
            type="text"
            inputMode="numeric"
            placeholder="Финансовая цель (₸)"
            value={formatNumber(goal)}
            onChange={e => setGoal(e.target.value.replace(/\D/g, ''))}
          />
        </form>
        <div className="analytics-report">
          <div>
            <strong>Расходы:</strong> {analytics.expensePercent}% от дохода
            <div className="analytics-bar">
              <div className="analytics-bar-expense" style={{width: `${analytics.expensePercent}%`}} />
            </div>
          </div>
          <div>
            <strong>Сбережения:</strong> {analytics.savingsPercent}% от дохода
            <div className="analytics-bar">
              <div className="analytics-bar-savings" style={{width: `${analytics.savingsPercent}%`}} />
            </div>
          </div>
          <div>
            <strong>Выполнение цели:</strong> {analytics.goalPercent}%
            <div className="analytics-bar">
              <div className="analytics-bar-goal" style={{width: `${analytics.goalPercent}%`}} />
            </div>
          </div>
        </div>
        <button
          className="start-button"
          style={{ marginTop: 40, fontSize: '1rem', padding: '12px 32px' }}
          onClick={() => navigate('/')}
        >
          Назад
        </button>
      </section>
    </div>
  );
}

export default AnalyticsPage;

// Причина, почему не работает:
// Для работы переходов между страницами через useNavigate и роутинг, приложение должно быть обёрнуто в <BrowserRouter> (или HashRouter) и маршрут /analytics должен быть прописан в вашем файле маршрутизации (обычно App.jsx или App.js).
