import React from 'react';

export default function MealList({ meals = [], onEdit, onDelete }) {
    if (!meals || meals.length === 0) return <div>ไม่มีรายการ</div>;

    return (
        <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: 10 }}>
            <thead>
                <tr>
                    <th style={thStyle}>วันที่</th>
                    <th style={thStyle}>มื้อ</th>
                    <th style={thStyle}>เมนู</th>
                    <th style={thStyle}>แคลอรี่</th>
                    <th style={thStyle}>หมายเหตุ</th>
                    <th style={thStyle}>จัดการ</th>
                </tr>
            </thead>
            <tbody>
                {meals.map(m => (
                    <tr key={m.id} style={{ borderTop: '1px solid #eee' }}>
                        <td style={tdStyle}>{m.date ? m.date.slice(0, 10) : ''}</td>
                        <td style={tdStyle}>{m.meal_type}</td>
                        <td style={tdStyle}>{m.menu}</td>
                        <td style={tdStyle}>{m.calories}</td>
                        <td style={tdStyle}>{m.note}</td>
                        <td style={tdStyle}>
                            <button onClick={() => onEdit && onEdit(m)}>แก้ไข</button>
                            <button onClick={() => onDelete && onDelete(m.id)} style={{ marginLeft: 8 }}>ลบ</button>
                        </td>
                    </tr>
                ))}
            </tbody>
        </table>
    );
}

const thStyle = { textAlign: 'left', padding: 8, borderBottom: '2px solid #ddd' };
const tdStyle = { padding: 8, verticalAlign: 'top' };
