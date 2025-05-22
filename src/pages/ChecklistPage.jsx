import React, { useState, useEffect } from 'react';
import './HomePage.css';

function ChecklistPage() {
  const [items, setItems] = useState([]);
  const [input, setInput] = useState('');
  const [editIdx, setEditIdx] = useState(null);
  const [editValue, setEditValue] = useState('');

  // Загрузка из localStorage
  useEffect(() => {
    const stored = localStorage.getItem('my_checklist');
    if (stored) {
      setItems(JSON.parse(stored));
    }
  }, []);

  // Сохранять в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('my_checklist', JSON.stringify(items));
  }, [items]);

  const handleAdd = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setItems([...items, { text: input.trim(), done: false }]);
    setInput('');
  };

  const handleToggle = (idx) => {
    setItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, done: !item.done } : item
      )
    );
  };

  const handleDelete = (idx) => {
    setItems(items => items.filter((_, i) => i !== idx));
  };

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditValue(items[idx].text);
  };

  const handleSaveEdit = (idx) => {
    setItems(items =>
      items.map((item, i) =>
        i === idx ? { ...item, text: editValue } : item
      )
    );
    setEditIdx(null);
    setEditValue('');
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 600, marginTop: 40 }}>
        <h1 style={{ color: '#1a5c3e', textAlign: 'center', marginBottom: 18 }}>Чек-лист</h1>
        <form className="finance-form" onSubmit={handleAdd} style={{ marginBottom: 24, flexDirection: 'row', gap: 10 }}>
          <input
            type="text"
            placeholder="Добавить пункт чек-листа"
            value={input}
            onChange={e => setInput(e.target.value)}
            style={{ flex: 1, padding: 10, borderRadius: 8, border: '1.5px solid #4fd1c5', fontSize: '1.1rem' }}
          />
          <button
            className="start-button"
            style={{ fontSize: '1rem', padding: '10px 22px' }}
            type="submit"
          >
            Добавить
          </button>
        </form>
        <ul style={{ listStyle: 'none', padding: 0 }}>
          {items.length === 0 && <li style={{ color: '#888', textAlign: 'center' }}>Нет пунктов. Добавьте первый!</li>}
          {items.map((item, idx) => (
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
              }}
            >
              <input
                type="checkbox"
                checked={item.done}
                onChange={() => handleToggle(idx)}
                style={{ marginRight: 14, width: 22, height: 22 }}
              />
              {editIdx === idx ? (
                <>
                  <input
                    type="text"
                    value={editValue}
                    onChange={e => setEditValue(e.target.value)}
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #b7c28b', fontSize: '1rem', marginRight: 10 }}
                  />
                  <button
                    className="start-button"
                    style={{ fontSize: '0.95rem', padding: '6px 14px', marginRight: 8, background: '#4fd1c5', color: '#fff' }}
                    onClick={() => handleSaveEdit(idx)}
                    type="button"
                  >
                    Сохранить
                  </button>
                  <button
                    className="start-button"
                    style={{ fontSize: '0.95rem', padding: '6px 14px', background: '#e87d56', color: '#fff' }}
                    onClick={() => setEditIdx(null)}
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
                    }}
                  >
                    {item.text}
                  </span>
                  <button
                    className="start-button"
                    style={{ fontSize: '0.95rem', padding: '6px 14px', marginRight: 8, background: '#4fd1c5', color: '#fff' }}
                    onClick={() => handleEdit(idx)}
                    type="button"
                  >
                    Изменить
                  </button>
                  <button
                    className="start-button"
                    style={{ fontSize: '0.95rem', padding: '6px 14px', background: '#e87d56', color: '#fff' }}
                    onClick={() => handleDelete(idx)}
                    type="button"
                  >
                    Удалить
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
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

export default ChecklistPage;
