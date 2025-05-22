import React, { useState, useMemo } from 'react';
import './HomePage.css';
import treeImage from '../assets/tree.png';
import frame1_3 from '../assets/Frame1-3.png';
import frame1_6 from '../assets/Frame1-6.png';
import frame1_5 from '../assets/Frame1-5.png';
import frame1_2 from '../assets/Frame1-2.png';
import дерево from '../assets/дерево.png';
import { useNavigate } from 'react-router-dom';

function HomePage() {
  const [showCalc, setShowCalc] = useState(false);
  const [income, setIncome] = useState('');
  const [expense, setExpense] = useState('');
  const [savings, setSavings] = useState('');
  const [goal, setGoal] = useState('');
  const [result, setResult] = useState(null);
  const [goalStatus, setGoalStatus] = useState('');
  const [contactData, setContactData] = useState({ name: '', email: '', message: '' });
  const [contactSent, setContactSent] = useState(false);
  const navigate = useNavigate();

  const handleContactChange = (e) => {
    const { name, value } = e.target;
    setContactData((prev) => ({ ...prev, [name]: value }));
  };

  const handleContactSubmit = (e) => {
    e.preventDefault();
    console.log("Обратная связь отправлена:", contactData);
    setContactSent(true);
    setContactData({ name: '', email: '', message: '' });
    setTimeout(() => setContactSent(false), 4000);
  };

  const handleStartCalc = () => {
    setShowCalc(true);
    setResult(null);
    setIncome('');
    setExpense('');
    setSavings('');
    setGoal('');
    setGoalStatus('');
  };

  // Функция для форматирования числа с разделителем тысяч
  const formatNumber = (value) => {
    if (!value) return '';
    // Удаляем все нецифры
    const digits = value.replace(/\D/g, '');
    // Форматируем с разделителем тысяч
    return digits.replace(/\B(?=(\d{3})+(?!\d))/g, '.');
  };

  // Обработчики для каждого поля, чтобы отображать форматированное значение
  const handleIncomeChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setIncome(raw);
  };
  const handleExpenseChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setExpense(raw);
  };
  const handleSavingsChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setSavings(raw);
  };
  const handleGoalChange = (e) => {
    const raw = e.target.value.replace(/\D/g, '');
    setGoal(raw);
  };

  const handleCalc = (e) => {
    e.preventDefault();
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expense) || 0;
    const sav = parseFloat(savings) || 0;
    const goalValue = parseFloat(goal) || 0;

    const balance = inc - exp; // это ежемесячный остаток
    setResult(balance);

    if (goalValue > 0) {
      if (sav >= goalValue) {
        setGoalStatus('Поздравляем! Вы достигли своей цели!');
      } else {
        const remaining = goalValue - sav;
        setGoalStatus(`Осталось накопить: ${remaining.toLocaleString()} ₸`);
      }
    } else {
      setGoalStatus('');
    }
  };

  // Аналитика и отчёты: вычисление процентов расходов, накоплений и цели
  const analytics = useMemo(() => {
    const inc = parseFloat(income) || 0;
    const exp = parseFloat(expense) || 0;
    const sav = parseFloat(savings) || 0;
    const goalValue = parseFloat(goal) || 0;
    const total = inc + sav;
    return {
      expensePercent: inc > 0 ? Math.round((exp / inc) * 100) : 0,
      savingsPercent: inc > 0 ? Math.round((sav / inc) * 100) : 0,
      goalPercent: goalValue > 0 ? Math.min(100, Math.round((sav / goalValue) * 100)) : 0,
      total,
    };
  }, [income, expense, savings, goal]);

  return (
    <div className="homepage">
      <section className="hero-section">
        <div className="hero-text-content">
      <header style={{ color: 'white', padding: '1rem', textAlign: 'center' }}>
        <h1>Финансовый сад</h1>
         <h1>Выращивайте своё финансовое<br />благополучие</h1>
          <p>Анализируйте доходы и расходы<br />на своём плане — это твой путь к финансовой свободе.</p>
      </header>
          <div className="button-wrapper">
            <button className="start-button" onClick={handleStartCalc}>Начать учёт</button>
          </div>
          {showCalc && (
            <div className="finance-calc-modal">
              <form className="finance-form" onSubmit={handleCalc} style={{ marginTop: 24 }}>
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ваш доход (₸)"
                  value={formatNumber(income)}
                  onChange={handleIncomeChange}
                  style={{ marginRight: 10, padding: 8, borderRadius: 6, border: '1px solid #cbe7b6' }}
                  required
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Ваш расход (₸)"
                  value={formatNumber(expense)}
                  onChange={handleExpenseChange}
                  style={{ marginRight: 10, padding: 8, borderRadius: 6, border: '1px solid #cbe7b6' }}
                  required
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Сбережения (₸)"
                  value={formatNumber(savings)}
                  onChange={handleSavingsChange}
                  style={{ marginRight: 10, padding: 8, borderRadius: 6, border: '1px solid #cbe7b6' }}
                />
                <input
                  type="text"
                  inputMode="numeric"
                  placeholder="Финансовая цель (₸)"
                  value={formatNumber(goal)}
                  onChange={handleGoalChange}
                  style={{ marginRight: 10, padding: 8, borderRadius: 6, border: '1px solid #cbe7b6' }}
                />
                <button type="submit" className="start-button" style={{ padding: '8px 18px', fontSize: '1rem', marginTop: 12 }}>Посчитать</button>
                {result !== null && (
                  <div style={{ marginTop: 16, fontWeight: 600 }}>
                    Ваш баланс: {result.toLocaleString()} ₸<br />
                    {goalStatus && <span>{goalStatus}</span>}
                  </div>
                )}
              </form>
              <button
                className="start-button"
                style={{ background: '#fffceb', color: '#e87d56', border: '1.5px solid #e87d56', marginTop: 16 }}
                onClick={() => setShowCalc(false)}
                type="button"
              >
                Закрыть калькулятор
              </button>
            </div>
          )}
        </div>
      </section>

        <section>
          <div className="about-section">
<h1>🌿 Добро пожаловать в «Финансовый сад»</h1>
        <p>
          «Финансовый сад» — это ваш персональный помощник в мире финансов. Сервис помогает отслеживать доходы и расходы, формировать финансовые цели и получать наглядную аналитику — просто, удобно и красиво.
        </p>
      <h1>Почему важно вести учет?</h1>
      <p>Как бы это не звучало, ты теряешь деньги каждый день, возможно каждую минуту, а празднечные дни так вообще больня тема для вашего кошелька, и это все уходит а ты даже порой этого не замечаешь.</p>
      <ul>
        <li>Неучтённые мелкие расходы съедают до 20% бюджета.</li>
        <li>Без финансовой подушки в экстренной ситуации придётся занимать.</li>
        <li>Не планируя покупки, ты легко попадаешь в кредитную зависимость.</li>
      </ul>
      <p><strong>💡 Факт:</strong> 68% людей не знают, сколько тратят ежемесячно.</p>        
          </div>

    </section>
      <section className="about-section">
    <section>
      <h2>Функции сервиса</h2>
      <div className="grid">
        <div className="card">
          <strong>Учет доходов и расходов</strong>
          <p>Ведите учет всех поступлений и трат по категориям, чтобы видеть полную картину своих финансов.</p>
        
        </div>
        <div className="card">
          <strong>Аналитика и отчёты</strong>
          <p>Получайте наглядные графики, отчёты по месяцам и анализируйте свои расходы и доходы.</p>
          <button
            className="start-button"
            style={{ marginTop: 14, fontSize: '1rem', padding: '10px 22px' }}
            onClick={() => navigate('/analytics')}
          >
            Перейти к аналитике
          </button>
        </div>
        <div className="card">
          <strong>Финансовые цели</strong>
          <p>Создавайте цели (отпуск, техника, подушка безопасности) и отслеживайте прогресс накоплений.</p>
          <button
            className="start-button"
            style={{ marginTop: 14, fontSize: '1rem', padding: '10px 22px' }}
            onClick={() => navigate('/goals')}
          >
            Составить финансовую цель
          </button>
        </div>
        <div className="card">
          <strong>Отчёты о задолженностях</strong>
          <p>Ведите учёт кредитов и долгов, получайте напоминания о платежах и контролируйте выплаты.</p> 
          <button
            className="start-button"
            style={{ marginTop: 14, fontSize: '1rem', padding: '10px 22px' }}
            onClick={() => navigate('/debts')}
          >
            Вести отчёт о задолженностях
          </button>
        </div>
        <div className="card">
          <strong>Планирование бюджета</strong>
          <p>Прогнозируйте доходы и расходы на месяц, чтобы избежать неожиданных трат.</p>
          <button
            className="start-button"
            style={{ marginTop: 14, fontSize: '1rem', padding: '10px 22px' }}
            onClick={() => navigate('/plan')}
          >
            Планировать
          </button>
        </div>
        <div className="card">
          <strong>Ведение совместного бюджета</strong>
          <p>Управляйте семейным или парным бюджетом, распределяйте расходы и цели вместе.</p>
          <button
            className="start-button"
            style={{ marginTop: 14, fontSize: '1rem', padding: '10px 22px', marginRight: 10 }}
            onClick={() => navigate('/family-budget')}
          >
            Семейный бюджет
          </button>
        </div>
        <div className="card">
          <strong>Чек-листы и цели</strong>
          <p>Следуйте чек-листам для финансового старта, накоплений и инвестиций, отмечайте выполненные шаги.</p>
          <button
            className="start-button"
            style={{ marginTop: 14, fontSize: '1rem', padding: '10px 22px' }}
            onClick={() => navigate('/checklist')}
          >
            Чек лист
          </button>
        </div>
      </div>
    </section>
    <section id="course">
<section>
  <h2>Курс «Финансовая грамотность с нуля»</h2>
  <div>Как вести учет расходов</div>
  <div>Как избавиться от финансовых дыр</div>
  <div>Как планировать покупки без долгов</div>
  <div>Как начать инвестировать с минимальных сумм</div>
  <p>5 видеоуроков по 20 минут. Доступ навсегда.</p>
  <p><strong>🔥 Бонус:</strong> Чек-лист «Финансовая подушка за 3 месяца вам обеспечена после прохождения курса»</p>
</section>

<section class="statistics-section">
  <h2>Финансовая статистика</h2>
  <div>68% россиян не ведут учет расходов</div>
  <div>57% не имеют накоплений</div>
  <div>32% попадали в долговую яму</div>
  <div>Пользователи сервиса экономят до 18% в месяц</div>
</section>

<section>
  <h2>Советы от «Финансового сада»</h2>
  <div>Не бери кредит без подушки на 3–6 месяцев</div>
  <div>Заводи привычку вести учет ежедневно</div>
  <div>Планируй крупные траты</div>
  <div>Не трать больше, чем зарабатываешь</div>
  <div>Ставь цели и следи за прогрессом</div>
</section>
      </section>
      </section>

      <div className="centered-section" style={{ width: '100%' }}>
        <section className="reviews-section" style={{ width: '100%', maxWidth: '1240px', margin: '48px auto 40px auto' }}>
          <h2>🌟 Отзывы пользователей</h2>
          <div className="review">
            <p>
              «Очень простой и удобный сервис! Точные расчёты, хорошие советы, помощь куратора. Финансовый сад — моя большая находка! Пользуюсь до сих пор, и всегда актуально в моей жизни!»
            </p>
            <span>— Алексей, 34 года</span>
          </div>
          <div className="review">
            <p>
              «Точный расчёт финансов! Отличный калькулятор, благодаря ему я смогла накопить на свой долгожданный отпуск, да ещё и советы. А метафора "финансовый сад" в буквальном смысле передаёт сайт — это приятно мотивирует!»
            </p>
            <span>— Марина, 28 лет</span>
          </div>
          <div className="review">
            <p>
              «Раньше деньги утекали незаметно, даже не замечал, как после получения зарплаты её уже не было на следующий день. Наткнулся на этот сайт — и ни о чём не жалею. Теперь всё под контролем.»
            </p>
            <span>— Игорь, 40 лет</span>
          </div>
        </section>

        <section className="reviews-sectionss" style={{ width: '100%', maxWidth: '1200px', margin: '48px auto 40px auto' }}>
         <h2>Часто задаваемые вопросы</h2>
          <div className="revies">
            <strong>Можно ли пользоваться бесплатно?</strong>
            <p>Да! Базовый функционал доступен всем.</p>
          </div>
          <div className="revies">
            <strong>Можно ли пользоваться бесплатно?</strong>
            <p>Да! Базовый функционал доступен всем.</p>
          </div>
          <div className="revies">
            <strong>Будет ли видно траты на кафе?</strong>
            <p>Конечно. Все расходы разбиты по категориям.</p>
          </div>
          <div className="revies">
            <strong>Что будет на курсе?</strong>
            <p>Научишься управлять деньгами и строить накопления.</p>
          </div>
        </section>
      </div>   
      <footer>

      <section className="contact-section">
        <h2>📬 Обратная связь</h2>
        {contactSent ? (
          <p className="success-message">Спасибо! Ваше сообщение отправлено.</p>
        ) : (
          <form onSubmit={handleContactSubmit} className="contact-form">
            <input
              type="text"
              name="name"
              placeholder="Ваше имя"
              value={contactData.name}
              onChange={handleContactChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Ваш Email"
              value={contactData.email}
              onChange={handleContactChange}
              required
            />
            <textarea
              name="message"
              placeholder="Ваше сообщение"
              value={contactData.message}
              onChange={handleContactChange}
              required
            />
            <button type="submit">Отправить</button>
          </form>
        )}
      </section>
        <p>&copy; 2025 Финансовый сад</p>
        <p>
          <a href="https://m.vk.com/duwds">ВКонтакте</a>{' '}
          <a href="https://t.me/D_WDS">Telegram</a>{' '}
          <a href="https://wa.me/+77080335062">WhatsApp</a>
        </p>
      </footer>
    </div>
  );
}

export default HomePage;