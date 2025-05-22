import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getCurrentUser, logoutUser } from '../utils/auth';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [originalEmail, setOriginalEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [avatar, setAvatar] = useState('');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [isEditingAvatar, setIsEditingAvatar] = useState(false);
  // Состояния разделов теперь только boolean
  const [showGoals, setShowGoals] = useState(false);
  const [showDebts, setShowDebts] = useState(false);
  const [showFamilyBudget, setShowFamilyBudget] = useState(false);
  const [showBudgetTemplates, setShowBudgetTemplates] = useState(false);
  const [showChecklist, setShowChecklist] = useState(false);
  const [goals, setGoals] = useState([]);
  const [debts, setDebts] = useState([]);
  const [familyBudget, setFamilyBudget] = useState({ members: [], expenses: [] });
  const [budgetTemplates, setBudgetTemplates] = useState([]);
  const [checklist, setChecklist] = useState([]);

  // Добавить редактирование накопленных денег, удаление и редактирование цели
  const [editGoalIdx, setEditGoalIdx] = useState(null);
  const [editGoalName, setEditGoalName] = useState('');
  const [editGoalAmount, setEditGoalAmount] = useState('');
  const [editGoalSaved, setEditGoalSaved] = useState('');

  // Для редактирования задолженностей
  const [editDebtIdx, setEditDebtIdx] = useState(null);
  const [editDebtName, setEditDebtName] = useState('');
  const [editDebtAmount, setEditDebtAmount] = useState('');
  const [editDebtNote, setEditDebtNote] = useState('');

  const [editChecklistIdx, setEditChecklistIdx] = useState(null);
  const [editChecklistValue, setEditChecklistValue] = useState('');

  // Для ограничения смены ника
  const [lastNicknameChange, setLastNicknameChange] = useState(null);
  const [nicknameError, setNicknameError] = useState('');

  useEffect(() => {
    const user = getCurrentUser();
    if (!user) {
      navigate('/login', { replace: true });
      return;
    }

    setEmail(user.email);
    setOriginalEmail(user.email);
    setNickname(user.nickname || '');
    setAvatar(user.avatar || '');
    setLastNicknameChange(user.lastNicknameChange || null); // загрузка даты последней смены ника
  }, [navigate]);

  // Загрузка целей из localStorage при монтировании
  useEffect(() => {
    const stored = localStorage.getItem('my_finance_goals');
    if (stored) {
      setGoals(JSON.parse(stored));
    }
  }, []);

  // Загрузка долгов из localStorage при монтировании
  useEffect(() => {
    const stored = localStorage.getItem('my_finance_debts');
    if (stored) {
      setDebts(JSON.parse(stored));
    }
  }, []);

  // Загрузка семейного бюджета из localStorage при монтировании
  useEffect(() => {
    const stored = localStorage.getItem('my_family_budget');
    if (stored) {
      setFamilyBudget(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('my_budget_templates');
    if (stored) {
      setBudgetTemplates(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem('my_checklist');
    if (stored) {
      setChecklist(JSON.parse(stored));
    }
  }, []);

  // --- Сохраняем данные в localStorage при изменении ---
  useEffect(() => {
    localStorage.setItem('my_finance_goals', JSON.stringify(goals));
  }, [goals]);

  useEffect(() => {
    localStorage.setItem('my_finance_debts', JSON.stringify(debts));
  }, [debts]);

  useEffect(() => {
    localStorage.setItem('my_family_budget', JSON.stringify(familyBudget));
  }, [familyBudget]);

  useEffect(() => {
    localStorage.setItem('my_budget_templates', JSON.stringify(budgetTemplates));
  }, [budgetTemplates]);

  useEffect(() => {
    localStorage.setItem('my_checklist', JSON.stringify(checklist));
  }, [checklist]);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onloadend = () => {
      setAvatarPreview(reader.result); // показываем превью
      setIsEditingAvatar(true);
    };
    reader.readAsDataURL(file);
  };

  // При открытии профиля avatarPreview должен совпадать с avatar
  useEffect(() => {
    setAvatarPreview(avatar || '');
  }, [avatar]);

  const handleSaveAvatar = () => {
    setAvatar(avatarPreview); // сохраняем выбранное изображение в avatar
    setIsEditingAvatar(false);
  };

  const handleUpdateSaved = (idx, newSaved) => {
    setGoals(goals =>
      goals.map((g, i) =>
        i === idx ? { ...g, saved: Number(newSaved) } : g
      )
    );
  };

  const handleDeleteGoal = (idx) => {
    setGoals(goals => {
      const updatedGoals = goals.filter((_, i) => i !== idx);
      localStorage.setItem('my_finance_goals', JSON.stringify(updatedGoals));
      return updatedGoals;
    });
  };

  const handleDeleteDebt = (idx) => {
    setDebts(debts => {
      const updatedDebts = debts.filter((_, i) => i !== idx);
      localStorage.setItem('my_finance_debts', JSON.stringify(updatedDebts));
      return updatedDebts;
    });
  };

  const handleEditGoal = (idx) => {
    setEditGoalIdx(idx);
    setEditGoalName(goals[idx].name);
    setEditGoalAmount(goals[idx].amount.toString());
    setEditGoalSaved(goals[idx].saved.toString());
  };

  const handleSaveEditGoal = (idx) => {
    setGoals(goals =>
      goals.map((g, i) =>
        i === idx
          ? {
              ...g,
              name: editGoalName,
              amount: Number(editGoalAmount),
              saved: Number(editGoalSaved),
            }
          : g
      )
    );
    setEditGoalIdx(null);
    setEditGoalName('');
    setEditGoalAmount('');
    setEditGoalSaved('');
  };

  const handleEditDebt = (idx) => {
    setEditDebtIdx(idx);
    setEditDebtName(debts[idx].name);
    setEditDebtAmount(debts[idx].amount.toString());
    setEditDebtNote(debts[idx].note || '');
  };

  const handleSaveEditDebt = (idx) => {
    setDebts(debts =>
      debts.map((d, i) =>
        i === idx
          ? {
              ...d,
              name: editDebtName,
              amount: Number(editDebtAmount),
              note: editDebtNote,
            }
          : d
      )
    );
    setEditDebtIdx(null);
    setEditDebtName('');
    setEditDebtAmount('');
    setEditDebtNote('');
  };

  const handleSave = async () => {
    // Проверка ограничения смены ника
    if (nickname !== getCurrentUser().nickname) {
      const now = Date.now();
      if (lastNicknameChange && now - lastNicknameChange < 30 * 24 * 60 * 60 * 1000) {
        setNicknameError('Никнейм можно менять только раз в месяц.');
        return;
      }
    }
    setNicknameError('');
    try {
      // Получаем всех пользователей
      const users = JSON.parse(localStorage.getItem('users')) || [];
      // Находим индекс текущего пользователя по email
      const idx = users.findIndex(u => u.email === originalEmail);
      // Обновляем lastNicknameChange если ник изменился
      const updatedUser = {
        email,
        password,
        nickname,
        avatar,
        lastNicknameChange:
          nickname !== getCurrentUser().nickname
            ? Date.now()
            : lastNicknameChange || null,
      };

      if (idx !== -1) {
        users[idx] = updatedUser;
        localStorage.setItem('users', JSON.stringify(users));
        localStorage.setItem('currentUser', JSON.stringify(updatedUser));
        setLastNicknameChange(updatedUser.lastNicknameChange); // обновить локально
        alert('Профиль обновлён!');
      } else {
        alert('Пользователь не найден');
      }
    } catch (error) {
      console.error('Ошибка:', error);
      alert('Ошибка при сохранении профиля');
    }
  };

  // Чек-лист: сохранение изменений без setTimeout
  const handleSaveEditChecklist = (idx) => {
    setChecklist(list =>
      list.map((it, i) =>
        i === idx ? { ...it, text: editChecklistValue } : it
      )
    );
    setEditChecklistIdx(null);
    setEditChecklistValue('');
  };

  return (
    <div className="profile-container">
      <h2>Профиль</h2>
      <form className="profile-form" onSubmit={e => e.preventDefault()}>
        <label>
          Никнейм:<br />
          <input
            type="text"
            value={nickname}
            onChange={(e) => setNickname(e.target.value)}
            placeholder="Ваш ник"
            maxLength={32}
            disabled={
              lastNicknameChange &&
              Date.now() - lastNicknameChange < 30 * 24 * 60 * 60 * 1000 &&
              nickname !== getCurrentUser().nickname
            }
          />
          {nicknameError && (
            <div style={{ color: '#e87d56', marginTop: 6, fontSize: '0.98rem' }}>
              {nicknameError}
            </div>
          )}
          {lastNicknameChange &&
            Date.now() - lastNicknameChange < 30 * 24 * 60 * 60 * 1000 &&
            nickname === getCurrentUser().nickname && (
              <div style={{ color: '#888', marginTop: 6, fontSize: '0.98rem' }}>
                Никнейм можно изменить снова через{' '}
                {Math.ceil(
                  (30 * 24 * 60 * 60 * 1000 - (Date.now() - lastNicknameChange)) /
                    (24 * 60 * 60 * 1000)
                )}{' '}
                дней
              </div>
            )}
        </label>
        <label>
          Аватар:<br />
          {!avatarPreview || isEditingAvatar ? (
            <>
              <input
                type="file"
                accept="image/*"
                onChange={handleAvatarChange}
                style={{ display: 'block' }}
              />
              {avatarPreview && isEditingAvatar && (
                <div style={{ marginTop: 8 }}>
                  <button
                    type="button"
                    style={{ marginRight: 8 }}
                    onClick={() => {
                      setIsEditingAvatar(false);
                      setAvatarPreview(avatar); // откатить preview к текущему аватару
                    }}
                  >
                    Отмена
                  </button>
                  <button
                    type="button"
                    onClick={handleSaveAvatar}
                  >
                    Сохранить
                  </button>
                </div>
              )}
            </>
          ) : null}
        </label>
        {avatarPreview && !isEditingAvatar && (
          <div className="profile-avatar-preview">
            <img
              src={avatarPreview}
              alt="Аватар"
              style={{
                width: 80,
                height: 80,
                borderRadius: '50%',
                objectFit: 'cover',
                marginTop: 8,
              }}
            />
            <div style={{ marginTop: 8 }}>
              <button
                type="button"
                onClick={() => setIsEditingAvatar(true)}
                style={{ marginRight: 8 }}
              >
                Редактировать
              </button>
              <button
                type="button"
                onClick={() => {
                  setAvatar('');
                  setAvatarPreview('');
                  setIsEditingAvatar(false);
                }}
              >
                Удалить
              </button>
            </div>
          </div>
        )}
        <label>
          Email:<br />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>
        <label>
          Пароль:<br />
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>
        <div className="profile-btns">
          <button type="button" onClick={handleSave}>Сохранить</button>
          <button type="button" onClick={handleLogout} className="logout-btn">Выйти</button>
        </div>
      </form>
      {/* Контейнер для всех кнопок профиля */}
      <div
        style={{
          margin: '32px 0 24px 0',
          padding: '18px 14px',
          background: '#f7fafc',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(79,209,197,0.08)',
          display: 'flex',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'center',
          justifyContent: 'center', // заменено с flex-start на center
          minHeight: 120,
        }}
      >
        {!showGoals && !showDebts && !showFamilyBudget && !showBudgetTemplates && !showChecklist ? (
          <>
            <button
              type="button"
              className="start-button"
              style={{
                fontSize: '1rem',
                padding: '10px 22px',
                background: '#4fd1c5',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
                width: '100%',
              }}
              onClick={() => {
                setShowGoals(true);
                setShowDebts(true);
                setShowFamilyBudget(true);
                setShowBudgetTemplates(true);
                setShowChecklist(true);
              }}
            >
              Открыть разделы
            </button>
          </>
        ) : (
          <>
            <button
              type="button"
              className="start-button"
              style={{
                fontSize: '1rem',
                padding: '10px 22px',
                background: '#e87d56',
                color: '#fff',
                border: 'none',
                borderRadius: 10,
                cursor: 'pointer',
              }}
              onClick={() => {
                setShowGoals(false);
                setShowDebts(false);
                setShowFamilyBudget(false);
                setShowBudgetTemplates(false);
                setShowChecklist(false);
              }}
            >
              Закрыть все разделы
            </button>
          </>
        )}
      </div>
      {/* Кнопки разделов */}
      <div
        style={{
          minHeight: 300,
          margin: '32px 0 24px 0',
          padding: '18px 14px',
          background: '#f7fafc',
          borderRadius: 14,
          boxShadow: '0 2px 12px rgba(79,209,197,0.08)',
          display: (showGoals || showDebts || showFamilyBudget || showBudgetTemplates || showChecklist) ? 'flex' : 'none',
          flexWrap: 'wrap',
          gap: 12,
          alignItems: 'flex-start',
          justifyContent: 'flex-start',
        }}>
        <div style={{ width: '100%' }}>
          <button
            type="button"
            className="start-button"
            style={{
              fontSize: '1rem',
              padding: '10px 22px',
              background: showGoals ? '#4fd1c5' : '#1a5c3e',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              marginTop: 10,
              marginBottom: 0,
            }}
            onClick={() => setShowGoals(prev => !prev)}
          >
            {showGoals ? 'Скрыть цели' : 'Показать сохранённые цели'}
          </button>
          {showGoals && (
            <div className="profile-goals-list" style={{ margin: '18px 0 32px 0' }}>
              <h3 style={{ color: '#1a5c3e', marginBottom: 12 }}>Мои финансовые цели</h3>
              {goals.length === 0 && <p>У вас пока нет сохранённых целей.</p>}
              {goals.map((g, i) => (
                <div key={i} className="card" style={{ marginBottom: 18, boxShadow: '0 4px 18px rgba(79,209,197,0.08)', border: '1.5px solid #e6fffa', background: '#f7fafc' }}>
                  {editGoalIdx === i ? (
                    <div style={{ padding: 10 }}>
                      <label style={{ fontWeight: 600, color: '#256837', display: 'block', marginBottom: 6 }}>Название цели</label>
                      <input
                        type="text"
                        value={editGoalName}
                        onChange={e => setEditGoalName(e.target.value)}
                        style={{ marginBottom: 10, width: '100%', padding: 8, borderRadius: 8, border: '1px solid #b7c28b', fontSize: '1rem' }}
                      />
                      <label style={{ fontWeight: 600, color: '#256837', display: 'block', marginBottom: 6 }}>Сумма цели (₸)</label>
                      <input
                        type="number"
                        value={editGoalAmount}
                        onChange={e => setEditGoalAmount(e.target.value)}
                        style={{ marginBottom: 10, width: '100%', padding: 8, borderRadius: 8, border: '1px solid #b7c28b', fontSize: '1rem' }}
                      />
                      <label style={{ fontWeight: 600, color: '#256837', display: 'block', marginBottom: 6 }}>Накоплено (₸)</label>
                      <input
                        type="number"
                        value={editGoalSaved}
                        onChange={e => setEditGoalSaved(e.target.value)}
                        style={{ marginBottom: 14, width: '100%', padding: 8, borderRadius: 8, border: '1px solid #b7c28b', fontSize: '1rem' }}
                      />
                      <div style={{ display: 'flex', gap: 10, marginTop: 8 }}>
                        <button
                          className="start-button"
                          style={{ fontSize: '1rem', padding: '8px 22px', background: '#4fd1c5', color: '#fff', flex: 1 }}
                          onClick={() => handleSaveEditGoal(i)}
                          type="button"
                        >
                          Сохранить
                        </button>
                        <button
                          className="start-button"
                          style={{ fontSize: '1rem', padding: '8px 22px', background: '#e87d56', color: '#fff', flex: 1 }}
                          onClick={() => setEditGoalIdx(null)}
                          type="button"
                        >
                          Отмена
                        </button>
                        <button
                          className="start-button"
                          style={{ fontSize: '1rem', padding: '8px 22px', background: '#e87d56', color: '#fff', flex: 1 }}
                          onClick={() => handleDeleteGoal(i)}
                          type="button"
                        >
                          Удалить цель
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div style={{ padding: 10 }}>
                      <strong style={{ color: '#1a5c3e', fontSize: '1.15rem', letterSpacing: 0.5 }}>{g.name}</strong>
                      <div style={{ margin: '8px 0', color: '#256837', fontWeight: 600 }}>
                        Цель: <span style={{ color: '#2d3748', fontWeight: 500 }}>{g.amount.toLocaleString()} ₸</span>
                      </div>
                      <div style={{ margin: '8px 0', color: '#256837', fontWeight: 600 }}>
                        Накоплено:&nbsp;
                        <span style={{
                          display: 'inline-block',
                          minWidth: 80,
                          fontWeight: 700,
                          color: '#256837',
                          marginRight: 8,
                          background: '#e6fffa',
                          borderRadius: 6,
                          padding: '4px 10px'
                        }}>
                          {g.saved.toLocaleString()} ₸
                        </span>
                      </div>
                      <div style={{ margin: '10px 0 8px 0' }}>
                        <button
                          className="start-button"
                          style={{
                            fontSize: '1rem',
                            padding: '8px 22px',
                            background: '#4fd1c5',
                            color: '#fff',
                            marginRight: 10,
                            borderRadius: 8,
                            fontWeight: 700,
                            boxShadow: '0 2px 8px rgba(79,209,197,0.08)'
                          }}
                          onClick={() => handleEditGoal(i)}
                          type="button"
                        >
                          Изменить
                        </button>
                        <button
                          className="start-button"
                          style={{
                            fontSize: '1rem',
                            padding: '8px 22px',
                            background: '#e87d56',
                            color: '#fff',
                            borderRadius: 8,
                            fontWeight: 700,
                            boxShadow: '0 2px 8px rgba(232,125,86,0.08)'
                          }}
                          onClick={() => handleDeleteGoal(i)}
                          type="button"
                        >
                          Удалить цель
                        </button>
                      </div>
                      <div style={{ marginTop: 8 }}>
                        <span style={{ color: '#256837', fontWeight: 600 }}>Прогресс:</span>
                        <div className="analytics-bar" style={{ marginTop: 6, background: '#e6fffa' }}>
                          <div
                            className="analytics-bar-goal"
                            style={{
                              width: `${Math.min(100, Math.round((g.saved / g.amount) * 100))}%`,
                              minWidth: 10,
                              background: 'linear-gradient(90deg, #4fd1c5 0%, #1a5c3e 100%)'
                            }}
                          />
                        </div>
                        <span style={{ fontWeight: 700, marginLeft: 8, color: '#1a5c3e' }}>
                          {Math.min(100, Math.round((g.saved / g.amount) * 100))}%
                        </span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <button
            type="button"
            className="start-button"
            style={{
              fontSize: '1rem',
              padding: '10px 22px',
              background: showDebts ? '#e87d56' : '#1a5c3e',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              marginTop: 10,
              marginBottom: 0,
            }}
            onClick={() => setShowDebts(prev => !prev)}
          >
            {showDebts ? 'Скрыть задолженности' : 'Показать задолженности'}
          </button>
          {showDebts && (
            <div className="profile-goals-list" style={{ margin: '18px 0 32px 0' }}>
              <h3 style={{ color: '#e87d56', marginBottom: 12 }}>Мои задолженности</h3>
              {debts.length === 0 && <p>У вас пока нет задолженностей.</p>}
              {debts.map((d, i) => (
                <div key={i} className="card" style={{ marginBottom: 14 }}>
                  {editDebtIdx === i ? (
                    <>
                      <input
                        type="text"
                        value={editDebtName}
                        onChange={e => setEditDebtName(e.target.value)}
                        style={{ marginBottom: 8, width: '100%' }}
                      />
                      <input
                        type="number"
                        value={editDebtAmount}
                        onChange={e => setEditDebtAmount(e.target.value)}
                        style={{ marginBottom: 8, width: '100%' }}
                      />
                      <input
                        type="text"
                        value={editDebtNote}
                        maxLength={600}
                        onChange={e => setEditDebtNote(e.target.value)}
                        style={{ marginBottom: 8, width: '100%' }}
                      />
                      <button
                        className="start-button"
                        style={{ fontSize: '0.95rem', padding: '6px 14px', marginRight: 8 }}
                        onClick={() => handleSaveEditDebt(i)}
                        type="button"
                      >
                        Сохранить
                      </button>
                      <button
                        className="start-button"
                        style={{
                          fontSize: '0.95rem',
                          padding: '6px 14px',
                          background: '#e87d56',
                          color: '#fff',
                        }}
                        onClick={() => setEditDebtIdx(null)}
                        type="button"
                      >
                        Отмена
                      </button>
                      <button
                        className="start-button"
                        style={{
                          fontSize: '0.95rem',
                          padding: '6px 14px',
                          background: '#e87d56',
                          color: '#fff',
                          marginLeft: 8,
                        }}
                        onClick={() => setDebts(debts => debts.filter((_, j) => j !== i))}
                        type="button"
                      >
                        Удалить
                      </button>
                    </>
                  ) : (
                    <>
                      <strong>{d.name}</strong>
                      <div>Сумма: {d.amount.toLocaleString()} ₸</div>
                      {d.note && (
                        <div
                          style={{
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-line',
                            maxWidth: '100%',
                            overflowWrap: 'break-word',
                            marginTop: 6,
                            color: '#444',
                            fontSize: '0.98rem',
                            background: '#f7fafc',
                            borderRadius: 8,
                            padding: '6px 10px',
                            maxHeight: 120,
                            overflowY: 'auto',
                          }}
                        >
                          {d.note}
                        </div>
                      )}
                      <button
                        className="start-button"
                        style={{
                          fontSize: '0.95rem',
                          padding: '6px 14px',
                          background: '#4fd1c5',
                          color: '#fff',
                          marginTop: 8,
                        }}
                        onClick={() => handleEditDebt(i)}
                        type="button"
                      >
                        Изменить
                      </button>
                      <button
                        className="start-button"
                        style={{
                          fontSize: '0.95rem',
                          padding: '6px 14px',
                          background: '#e87d56',
                          color: '#fff',
                          marginLeft: 8,
                          marginTop: 8,
                        }}
                        onClick={() => setDebts(debts => debts.filter((_, j) => j !== i))}
                        type="button"
                      >
                        Удалить
                      </button>
                    </>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <button
            type="button"
            className="start-button"
            style={{
              fontSize: '1rem',
              padding: '10px 22px',
              background: showFamilyBudget ? '#4fd1c5' : '#1a5c3e',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              marginTop: 10,
              marginBottom: 0,
            }}
            onClick={() => setShowFamilyBudget(prev => !prev)}
          >
            {showFamilyBudget ? 'Скрыть семейный бюджет' : 'Просмотреть/изменить семейный бюджет'}
          </button>
          {showFamilyBudget && (
            <div className="profile-goals-list" style={{ margin: '18px 0 32px 0' }}>
              <h3 style={{ color: '#4fd1c5', marginBottom: 12 }}>Семейный бюджет</h3>
              {(
                !familyBudget.members ||
                familyBudget.members.length === 0 ||
                familyBudget.members.every(m => !m.name.trim() || !m.income.trim()) ||
                !familyBudget.expenses ||
                familyBudget.expenses.length === 0 ||
                familyBudget.expenses.every(e => !e.name.trim() || !e.amount.trim())
              ) && <p>Нет данных по семейному бюджету.</p>}
              {familyBudget.members &&
                familyBudget.members.length > 0 &&
                familyBudget.expenses &&
                familyBudget.expenses.length > 0 &&
                familyBudget.members.some(m => m.name.trim() && m.income.trim()) &&
                familyBudget.expenses.some(e => e.name.trim() && e.amount.trim()) && (
                <div className="card" style={{ marginBottom: 14 }}>
                  <div style={{ marginBottom: 10 }}>
                    <strong>Доходы:</strong>
                    <ul>
                      {familyBudget.members
                        .filter(m => m.name.trim() && m.income.trim())
                        .map((m, idx) => (
                          <li key={idx}>{m.name}: {Number(m.income).toLocaleString()} ₸</li>
                        ))}
                    </ul>
                  </div>
                  <div style={{ marginBottom: 10 }}>
                    <strong>Расходы:</strong>
                    <ul>
                      {familyBudget.expenses
                        .filter(exp => exp.name.trim() && exp.amount.trim())
                        .map((exp, idx) => (
                          <li key={idx}>{exp.name}: {Number(exp.amount).toLocaleString()} ₸</li>
                        ))}
                    </ul>
                  </div>
                  <div>
                    <strong>Баланс:</strong>{' '}
                    <span style={{
                      color:
                        (familyBudget.members
                          .filter(m => m.name.trim() && m.income.trim())
                          .reduce((sum, m) => sum + (parseFloat(m.income) || 0), 0) -
                          familyBudget.expenses
                            .filter(exp => exp.name.trim() && exp.amount.trim())
                            .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)) >= 0
                          ? '#1a5c3e'
                          : '#e87d56',
                      fontWeight: 700
                    }}>
                      {(
                        familyBudget.members
                          .filter(m => m.name.trim() && m.income.trim())
                          .reduce((sum, m) => sum + (parseFloat(m.income) || 0), 0) -
                        familyBudget.expenses
                          .filter(exp => exp.name.trim() && exp.amount.trim())
                          .reduce((sum, exp) => sum + (parseFloat(exp.amount) || 0), 0)
                      ).toLocaleString()} ₸
                    </span>
                  </div>
                  <div style={{ marginTop: 18, display: 'flex', gap: 12 }}>
                    <button
                      className="start-button"
                      style={{
                        fontSize: '1rem',
                        padding: '10px 22px',
                        background: '#4fd1c5',
                        color: '#fff',
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                      onClick={() => navigate('/family-budget?edit=1')}
                    >
                      Изменить семейный бюджет
                    </button>
                    <button
                      className="start-button"
                      style={{
                        fontSize: '1rem',
                        padding: '10px 22px',
                        background: '#e87d56',
                        color: '#fff',
                        borderRadius: 10,
                        fontWeight: 700,
                      }}
                      onClick={() => {
                        localStorage.removeItem('my_family_budget');
                        setFamilyBudget({ members: [], expenses: [] });
                      }}
                      type="button"
                    >
                      Сбросить семейный бюджет
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <button
            type="button"
            className="start-button"
            style={{
              fontSize: '1rem',
              padding: '10px 22px',
              background: showBudgetTemplates ? '#4fd1c5' : '#1a5c3e',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              marginTop: 10,
              marginBottom: 0,
            }}
            onClick={() => setShowBudgetTemplates(prev => !prev)}
          >
            {showBudgetTemplates ? 'Скрыть шаблоны бюджета' : 'Показать шаблоны бюджета'}
          </button>
          {showBudgetTemplates && (
            <div className="profile-goals-list" style={{ margin: '18px 0 32px 0' }}>
              <h3 style={{ color: '#4fd1c5', marginBottom: 12 }}>Шаблоны бюджета</h3>
              {budgetTemplates.length === 0 && <p>Нет сохранённых шаблонов.</p>}
              {budgetTemplates.map((tpl, idx) => (
                <div key={idx} className="card" style={{ marginBottom: 14 }}>
                  <strong style={{ color: '#1a5c3e', fontSize: '1.15rem' }}>{tpl.name}</strong>
                  <ul style={{ margin: '10px 0 0 0', padding: 0, listStyle: 'none' }}>
                    {tpl.items.map((item, itemIdx) => (
                      <li key={itemIdx} style={{ marginBottom: 4, color: '#256837', fontWeight: 500 }}>
                        {item.category}: <span style={{ color: '#2d3748', fontWeight: 600 }}>{item.amount ? Number(item.amount).toLocaleString() : '—'} ₸</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          )}
        </div>
        <div style={{ width: '100%' }}>
          <button
            type="button"
            className="start-button"
            style={{
              fontSize: '1rem',
              padding: '10px 22px',
              background: showChecklist ? '#4fd1c5' : '#1a5c3e',
              color: '#fff',
              border: 'none',
              borderRadius: 10,
              cursor: 'pointer',
              marginTop: 10,
              marginBottom: 0,
            }}
            onClick={() => setShowChecklist(prev => !prev)}
          >
            {showChecklist ? 'Скрыть чек-лист' : 'Показать чек-лист'}
          </button>
          {showChecklist && (
            <div className="profile-goals-list" style={{ margin: '18px 0 32px 0' }}>
              <h3 style={{ color: '#4fd1c5', marginBottom: 12 }}>Чек-лист</h3>
              {checklist.length === 0 && <p>Нет пунктов чек-листа.</p>}
              <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
                {checklist.map((item, idx) => (
                  <li
                    key={idx}
                    className="card"
                    style={{
                      marginBottom: 12,
                      display: 'flex',
                      alignItems: 'center',
                      background: item.done ? '#e6fffa' : '#fff',
                      borderLeft: item.done ? '6px solid #4fd1c5' : '6px solid #e6fffa',
                      borderRight: item.done ? '6px solid #1a5c3e' : '6px solid #e6fffa',
                      opacity: item.done ? 0.7 : 1,
                      overflow: 'hidden',
                      wordBreak: 'break-word',
                      whiteSpace: 'pre-line',
                      maxWidth: '100%',
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={item.done}
                      onChange={() => {
                        setChecklist(list =>
                          list.map((it, i) =>
                            i === idx ? { ...it, done: !it.done } : it
                          )
                        );
                      }}
                      style={{ marginRight: 14, width: 22, height: 22, flexShrink: 0 }}
                    />
                    {editChecklistIdx === idx ? (
                      <>
                        <input
                          type="text"
                          value={editChecklistValue}
                          onChange={e => setEditChecklistValue(e.target.value)}
                          style={{
                            flex: 1,
                            padding: 8,
                            borderRadius: 8,
                            border: '1px solid #b7c28b',
                            fontSize: '1rem',
                            marginRight: 10,
                            minWidth: 0,
                            maxWidth: '100%',
                            overflow: 'hidden',
                            wordBreak: 'break-word'
                          }}
                        />
                        <button
                          className="start-button"
                          style={{ fontSize: '0.95rem', padding: '6px 14px', marginRight: 8, background: '#4fd1c5', color: '#fff', flexShrink: 0 }}
                          onClick={() => handleSaveEditChecklist(idx)}
                          type="button"
                        >
                          Сохранить
                        </button>
                        <button
                          className="start-button"
                          style={{ fontSize: '0.95rem', padding: '6px 14px', background: '#e87d56', color: '#fff', flexShrink: 0 }}
                          onClick={() => {
                            setEditChecklistIdx(null);
                            setEditChecklistValue('');
                          }}
                          type="button"
                        >
                          Отмена
                        </button>
                      </>
                    ) : (
                      <>
                        <span
                          style={{
                            flex: 1,
                            textDecoration: item.done ? 'line-through' : 'none',
                            color: item.done ? '#256837' : '#2d3748',
                            fontSize: '1.08rem',
                            fontWeight: 500,
                            wordBreak: 'break-word',
                            whiteSpace: 'pre-line',
                            minWidth: 0,
                            maxWidth: '100%',
                            overflow: 'hidden'
                          }}
                        >
                          {item.text}
                        </span>
                        <button
                          className="start-button"
                          style={{ fontSize: '0.95rem', padding: '6px 14px', marginRight: 8, background: '#4fd1c5', color: '#fff', flexShrink: 0 }}
                          onClick={() => {
                            setEditChecklistIdx(idx);
                            setEditChecklistValue(item.text);
                          }}
                          type="button"
                        >
                          Изменить
                        </button>
                        <button
                          className="start-button"
                          style={{ fontSize: '0.95rem', padding: '6px 14px', background: '#e87d56', color: '#fff', flexShrink: 0 }}
                          onClick={() => {
                            setChecklist(list => list.filter((_, i) => i !== idx));
                          }}
                          type="button"
                        >
                          Удалить
                        </button>
                      </>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;