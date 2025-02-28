import React, { useEffect, useState } from "react";
import axios from "axios";
import './CrudComponent.css';  

const API_URL = "http://localhost:3001";

const CrudComponent = ({ table }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);  

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const response = await axios.get(`${API_URL}/${table}`);
    setData(response.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`${API_URL}/${table}/${editingId}`, form);
    } else {
      await axios.post(`${API_URL}/${table}`, form);
    }
    fetchData();
    setForm({});
    setEditingId(null);
  };

  const handleUpdate = (id) => {
    const item = data.find((item) => item.id === id);
    setForm(item);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`${API_URL}/${table}/${id}`);
    fetchData();
  };

  return (
    <div className="crud-container">
      <h2 className="crud-title">{table.toUpperCase()}</h2>

      <form className="crud-form" onSubmit={handleSubmit}>
        {Object.keys(data[0] || {}).map((key) => (
          <input
            key={key}
            name={key}
            placeholder={key}
            value={form[key] || ''}
            onChange={handleChange}
            className="crud-input"
          />
        ))}
        <button type="submit" className="crud-submit">
          {editingId ? "Actualizar" : "Agregar"}
        </button>
      </form>

      <ul className="crud-list">
        {data.map((item) => (
          <li key={item.id} className="crud-list-item">
            <span>{JSON.stringify(item)}</span>
            <div className="crud-buttons">
              <button className="crud-btn edit" onClick={() => handleUpdate(item.id)}>
                Editar
              </button>
              <button className="crud-btn delete" onClick={() => handleDelete(item.id)}>
                Eliminar
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudComponent;
