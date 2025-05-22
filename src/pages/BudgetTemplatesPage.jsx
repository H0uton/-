import React, { useState, useEffect } from 'react';
import './HomePage.css';

const DEFAULT_TEMPLATES = [
  {
    name: 'Отпуск',
    items: [
      { category: 'Перелёт', amount: '' },
      { category: 'Проживание', amount: '' },
      { category: 'Питание', amount: '' },
      { category: 'Экскурсии', amount: '' },
      { category: 'Сувениры', amount: '' },
    ],
  },
  {
    name: 'Ремонт',
    items: [
      { category: 'Материалы', amount: '' },
      { category: 'Работа', amount: '' },
      { category: 'Мебель', amount: '' },
      { category: 'Техника', amount: '' },
    ],
  },
  {
    name: 'Праздник',
    items: [
      { category: 'Подарки', amount: '' },
      { category: 'Украшения', amount: '' },
      { category: 'Еда и напитки', amount: '' },
      { category: 'Развлечения', amount: '' },
    ],
  },
];

function BudgetTemplatesPage() {
  const [templates, setTemplates] = useState([]);
  const [editIdx, setEditIdx] = useState(null);
  const [editTemplate, setEditTemplate] = useState(null);

  // Загрузка из localStorage
  useEffect(() => {
    const stored = localStorage.getItem('my_budget_templates');
    if (stored) {
      setTemplates(JSON.parse(stored));
    } else {
      setTemplates(DEFAULT_TEMPLATES);
    }
  }, []);

  // Сохранять в localStorage при каждом изменении
  useEffect(() => {
    localStorage.setItem('my_budget_templates', JSON.stringify(templates));
  }, [templates]);

  const handleEdit = (idx) => {
    setEditIdx(idx);
    setEditTemplate(JSON.parse(JSON.stringify(templates[idx])));
  };

  const handleSave = (idx) => {
    setTemplates(templates =>
      templates.map((tpl, i) => (i === idx ? editTemplate : tpl))
    );
    setEditIdx(null);
    setEditTemplate(null);
  };

  const handleCancel = () => {
    setEditIdx(null);
    setEditTemplate(null);
  };

  const handleTemplateNameChange = (value) => {
    setEditTemplate({ ...editTemplate, name: value });
  };

  const handleItemChange = (itemIdx, field, value) => {
    setEditTemplate({
      ...editTemplate,
      items: editTemplate.items.map((item, i) =>
        i === itemIdx ? { ...item, [field]: value } : item
      ),
    });
  };

  const handleAddItem = () => {
    setEditTemplate({
      ...editTemplate,
      items: [...editTemplate.items, { category: '', amount: '' }],
    });
  };

  const handleRemoveItem = (itemIdx) => {
    setEditTemplate({
      ...editTemplate,
      items: editTemplate.items.filter((_, i) => i !== itemIdx),
    });
  };

  return (
    <div className="homepage">
      <section className="about-section" style={{ maxWidth: 800, marginTop: 40 }}>
        <h1 style={{ color: '#1a5c3e', textAlign: 'center', marginBottom: 18 }}>Шаблоны бюджета</h1>
        <p style={{ textAlign: 'center', color: '#256837', marginBottom: 24 }}>
          Используйте и редактируйте шаблоны для разных случаев жизни: отпуск, ремонт, праздники и др.
        </p>
        {templates.map((tpl, idx) =>
          editIdx === idx ? (
            <div key={idx} className="card" style={{ marginBottom: 18, background: '#f7fafc' }}>
              <input
                type="text"
                value={editTemplate.name}
                onChange={e => handleTemplateNameChange(e.target.value)}
                style={{ marginBottom: 10, width: '100%', padding: 8, borderRadius: 8, border: '1px solid #b7c28b', fontWeight: 700 }}
              />
              {editTemplate.items.map((item, itemIdx) => (
                <div key={itemIdx} style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                  <input
                    type="text"
                    value={item.category}
                    onChange={e => handleItemChange(itemIdx, 'category', e.target.value)}
                    placeholder="Категория"
                    style={{ flex: 2, padding: 8, borderRadius: 8, border: '1px solid #b7c28b' }}
                  />
                  <input
                    type="text"
                    inputMode="numeric"
                    value={item.amount}
                    onChange={e => handleItemChange(itemIdx, 'amount', e.target.value.replace(/\D/g, ''))}
                    placeholder="Сумма (₸)"
                    style={{ flex: 1, padding: 8, borderRadius: 8, border: '1px solid #b7c28b' }}
                  />
                  <button
                    type="button"
                    className="start-button"
                    style={{ background: '#e87d56', color: '#fff', padding: '4px 10px', fontSize: '1rem', borderRadius: 8 }}
                    onClick={() => handleRemoveItem(itemIdx)}
                  >
                    ×
                  </button>
                </div>
              ))}
              <button
                type="button"
                className="start-button"
                style={{ marginTop: 10, background: '#4fd1c5', color: '#fff', fontSize: '1rem', borderRadius: 8 }}
                onClick={handleAddItem}
              >
                + Добавить категорию
              </button>
              <div style={{ marginTop: 12 }}>
                <button
                  className="start-button"
                  style={{ fontSize: '1rem', padding: '8px 22px', background: '#4fd1c5', color: '#fff', marginRight: 10 }}
                  onClick={() => handleSave(idx)}
                  type="button"
                >
                  Сохранить
                </button>
                <button
                  className="start-button"
                  style={{ fontSize: '1rem', padding: '8px 22px', background: '#e87d56', color: '#fff' }}
                  onClick={handleCancel}
                  type="button"
                >
                  Отмена
                </button>
              </div>
            </div>
          ) : (
            <div key={idx} className="card" style={{ marginBottom: 18, background: '#f7fafc' }}>
              <strong style={{ color: '#1a5c3e', fontSize: '1.15rem' }}>{tpl.name}</strong>
              <ul style={{ margin: '10px 0 0 0', padding: 0, listStyle: 'none' }}>
                {tpl.items.map((item, itemIdx) => (
                  <li key={itemIdx} style={{ marginBottom: 4, color: '#256837', fontWeight: 500 }}>
                    {item.category}: <span style={{ color: '#2d3748', fontWeight: 600 }}>{item.amount ? Number(item.amount).toLocaleString() : '—'} ₸</span>
                  </li>
                ))}
              </ul>
              <button
                className="start-button"
                style={{ marginTop: 10, fontSize: '1rem', padding: '8px 22px', background: '#4fd1c5', color: '#fff' }}
                onClick={() => handleEdit(idx)}
                type="button"
              >
                Изменить
              </button>
            </div>
          )
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

export default BudgetTemplatesPage;
