import React, { useEffect, useState } from 'react';
import MealForm from './MealForm';
import MealList from './MealList';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost/php-react/miniproject/meals.php';
export default function MealManager() {
    const [meals, setMeals] = useState([]);
    const [editing, setEditing] = useState(null);
    const [filterDate, setFilterDate] = useState('');



const fetchMeals = async (date = '') => {
    try {
        let url = API_URL;
        if (date) url += `?date=${date}`;
        const res = await fetch(url);
        if (!res.ok) throw new Error('Network response was not ok');
        const data = await res.json();
        setMeals(data);
    } catch (err) {
        console.error(err);
        alert('ไม่สามารถโหลดข้อมูลได้');
    }
};

    useEffect(() => {
        fetchMeals();
    }, []);

    const handleCreate = async (payload) => {
        try {
            const res = await fetch('http://localhost/php-react/miniproject/meals.php', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Create failed');
            const data = await res.json();
            setMeals(prev => [data, ...prev]);
        } catch (err) {
            console.error(err);
            alert('ไม่สามารถเพิ่มเมนูได้');
        }
    };

    const handleUpdate = async (id, payload) => {
        try {
            const res = await fetch(`http://localhost/php-react/miniproject/meals.php?id=${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            if (!res.ok) throw new Error('Update failed');
            const updatedMeal = await res.json();
            setMeals(prev => prev.map(m => (m.id === id ? updatedMeal : m)));
        } catch (err) {
            console.error(err);
            alert('ไม่สามารถแก้ไขได้');
        }
    };


    const handleDelete = async (id) => {
        if (!window.confirm('ต้องการลบเมนูนี้หรือไม่?')) return;
        try {
            const res = await fetch(`http://localhost/php-react/miniproject/meals.php?id=${id}`, {
                method: 'DELETE'
            });
            const data = await res.json();
            if (data.success) {
                setMeals(prev => prev.filter(m => m.id !== id));
            }
        } catch (err) {
            console.error(err);
            alert('ไม่สามารถลบได้');
        }
    };


    const handleFilter = () => {
        fetchMeals(filterDate);
    };

    const clearFilter = () => {
        setFilterDate('');
        fetchMeals();
    };

    // summary calories for current shown list
    const totalCalories = meals.reduce((s, m) => s + Number(m.calories || 0), 0);

    return (
        <div>
            <MealForm onCreate={handleCreate} onUpdate={handleUpdate} editing={editing} onCancel={() => setEditing(null)} />
            <div style={{ marginTop: 20, marginBottom: 10, display: 'flex', gap: 8, alignItems: 'center' }}>
                <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} />
                <button onClick={handleFilter}>ค้นหาโดยวันที่</button>
                <button onClick={clearFilter}>ดูทั้งหมด</button>
                <div style={{ marginLeft: 'auto', fontWeight: 700 }}>รวมแคลอรี่: {totalCalories} kcal</div>
            </div>
            <MealList meals={meals} onEdit={(m) => setEditing(m)} onDelete={handleDelete} />
        </div>
    );
}
