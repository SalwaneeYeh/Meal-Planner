import React, { useEffect, useState } from 'react';

const initial = {
    date: new Date().toISOString().slice(0, 10),
    meal_type: 'เช้า',
    menu: '',
    calories: '',
    note: ''
};

export default function MealForm({ onCreate, editing, onUpdate, onCancel }) {
    const [form, setForm] = useState(initial);

    useEffect(() => {
        if (editing) {
            setForm({
                date: editing.date ? editing.date.slice(0, 10) : new Date().toISOString().slice(0, 10),
                meal_type: editing.meal_type || 'เช้า',
                menu: editing.menu || '',
                calories: editing.calories || '',
                note: editing.note || '',
            });
        } else {
            setForm(initial);
        }
    }, [editing]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!form.menu || form.calories === '') {
            alert('กรุณากรอกเมนูและแคลอรี่');
            return;
        }
        const payload = {
            date: form.date,
            meal_type: form.meal_type,
            menu: form.menu,
            calories: Number(form.calories),
            note: form.note
        };
        if (editing && onUpdate) {
            onUpdate(editing.id, payload);
        } else {
            onCreate && onCreate(payload);
            setForm(initial);
        }
    };

    return (
        <form onSubmit={handleSubmit} style={{ border: '1px solid #ddd', padding: 12, borderRadius: 6 }}>
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <label>
                    วันที่<br />
                    <input type="date" name="date" value={form.date} onChange={handleChange} />
                </label>
                <label>
                    มื้อ<br />
                    <select name="meal_type" value={form.meal_type} onChange={handleChange}>
                        <option value="เช้า">เช้า</option>
                        <option value="กลางวัน">กลางวัน</option>
                        <option value="เย็น">เย็น</option>
                        <option value="ของว่าง">ของว่าง</option>
                    </select>
                </label>
                <label style={{ flex: 1 }}>
                    เมนู<br />
                    <input type="text" name="menu" value={form.menu} onChange={handleChange} style={{ width: '100%' }} />
                </label>
                <label>
                    แคลอรี่ (kcal)<br />
                    <input type="number" name="calories" value={form.calories} onChange={handleChange} style={{ width: 120 }} />
                </label>
            </div>
            <div style={{ marginTop: 8 }}>
                <label>
                    หมายเหตุ<br />
                    <input type="text" name="note" value={form.note} onChange={handleChange} style={{ width: '100%' }} />
                </label>
            </div>
            <div style={{ marginTop: 10, display: 'flex', gap: 8 }}>
                <button type="submit">{editing ? 'อัปเดตเมนู' : 'เพิ่มเมนู'}</button>
                {editing && <button type="button" onClick={onCancel}>ยกเลิก</button>}
            </div>
        </form>
    );
}
