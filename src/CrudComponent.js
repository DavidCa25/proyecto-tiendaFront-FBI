import React, { useEffect, useState } from "react";
import axios from "axios";
import './CrudComponent.css';

const API_URL = "http://localhost:3001";

const CrudComponent = ({ table }) => {
  const [data, setData] = useState([]);
  const [form, setForm] = useState({});
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_URL}/${table}`);
      setData(response.data);
    } catch (error) {
      console.error("Error al obtener los datos", error);
    }
    setLoading(false);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingId) {
        await axios.put(`${API_URL}/${table}/${editingId}`, form);
      } else {
        await axios.post(`${API_URL}/${table}`, form);
      }
      fetchData();
      setForm({});
      setEditingId(null);
    } catch (error) {
      console.error("Error al guardar los datos", error);
    }
  };

  const handleUpdate = (id) => {
    const item = data.find((item) => item.id === id);
    setForm(item);
    setEditingId(id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${API_URL}/${table}/${id}`);
      fetchData();
    } catch (error) {
      console.error("Error al eliminar el registro", error);
    }
  };

  return (
    <div className="crud-container">
      <h2 className="crud-title">{table.toUpperCase()}</h2>

      <div className="crud-card">
        <form className="crud-form" onSubmit={handleSubmit}>
          <h3>{editingId ? "Editar Registro" : "Agregar Registro"}</h3>
          {Object.keys(data[0] || { id: "" })
            .filter(key => key !== "id")
            .map((key) => (
              <div key={key} className="form-group">
                <label htmlFor={key}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </label>
                <input
                  id={key}
                  name={key}
                  placeholder={`Ingrese ${key}`}
                  value={form[key] || ''}
                  onChange={handleChange}
                  className="crud-input"
                />
              </div>
            ))}
          <button type="submit" className="crud-submit">
            {editingId ? "Actualizar" : "Agregar"}
          </button>
        </form>
      </div>

      <div className="crud-list-container">
        <h3>Lista de Registros</h3>
        {loading ? (
          <div className="loading">Cargando...</div>
        ) : (
          <table className="crud-table">
            <thead>
              <tr>
                {data[0] && Object.keys(data[0]).map((key) => (
                  <th key={key}>{key.toUpperCase()}</th>
                ))}
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {data.map((item) => (
                <tr key={item.id}>
                  {Object.keys(item).map((key) => (
                    <td key={key}>{item[key]}</td>
                  ))}
                  <td>
                    <button className="crud-btn edit" onClick={() => handleUpdate(item.id)}>Editar</button>
                    <button className="crud-btn delete" onClick={() => handleDelete(item.id)}>Eliminar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default CrudComponent;
