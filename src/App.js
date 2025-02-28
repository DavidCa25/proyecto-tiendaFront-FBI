import React from "react";
import CrudComponent from "./CrudComponent";

function App() {
  return (
    <div>
      <h1>Gestión de Tienda</h1>
      <CrudComponent table="clientes" />
      <CrudComponent table="proveedores" />
      <CrudComponent table="ventas" />
      <CrudComponent table="empleados" />
      <CrudComponent table="compras" />
      <CrudComponent table="inventarios" />
    </div>
  );
}

export default App;
